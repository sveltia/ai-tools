#!/usr/bin/env node

/**
 * Validate a Sveltia CMS configuration file against the official JSON schema, and check it for
 * mistakes the schema cannot express.
 *
 * The schema is generated from the Sveltia CMS source and published with every release, so
 * validating against the live copy always reflects the version the site loads from the CDN. That
 * makes this check more reliable than any advice frozen into a document.
 *
 * Usage:
 *   node validate-config.mjs [path/to/config.yml] [--version <cms-version>] [--offline]
 *
 * With no path, the script looks in the locations static site generators commonly use. Exits 0
 * when the configuration is valid, 1 when it is not, and 2 when the check could not run.
 */

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { homedir } from 'node:os';
import { dirname, extname, join } from 'node:path';

/** Packages the validator needs, installed once into a cache outside the user's project. */
const dependencies = ['ajv@8', 'ajv-formats@3', 'yaml@2', 'smol-toml@1'];
const cacheDir = join(homedir(), '.cache', 'sveltia-cms-skill');
const schemaCachePath = join(cacheDir, 'sveltia-cms.schema.json');
/** Re-download the schema when the cached copy is older than this. Sveltia CMS ships often. */
const schemaMaxAgeMs = 6 * 60 * 60 * 1000;

/** Locations to search when no path is given, covering the common static site generators. */
const commonConfigPaths = [
  'public/admin/config.yml',
  'static/admin/config.yml',
  'admin/config.yml',
  'src/admin/config.yml',
  'assets/admin/config.yml',
  'public/admin/config.yaml',
  'static/admin/config.yaml',
  'public/admin/config.toml',
  'static/admin/config.toml',
  'public/admin/config.json',
  'static/admin/config.json',
];

/**
 * Characters that cannot appear in a `name`. Dots and asterisks denote nested structures and
 * wildcards in field key paths, and spaces break references, so the CMS rejects all three at
 * runtime even though the schema accepts them.
 */
const invalidNamePattern = /[.*\s]/;

/**
 * Print a message to stderr so that stdout carries only the report.
 * @param {string} message Message to print.
 */
const warn = (message) => process.stderr.write(`${message}\n`);

/**
 * Install the validator's dependencies into a shared cache directory on first run and return a
 * `require` bound to it. Nothing is written to the user's project, and later runs reuse the cache.
 * @returns {NodeRequire} A require function that resolves the cached packages.
 */
const loadDependencies = () => {
  const marker = join(cacheDir, 'node_modules', 'ajv', 'package.json');

  if (!existsSync(marker)) {
    warn('Installing validator dependencies (one time, into ~/.cache/sveltia-cms-skill)...');
    mkdirSync(cacheDir, { recursive: true });
    writeFileSync(join(cacheDir, 'package.json'), '{ "private": true }\n');

    try {
      execFileSync(
        'npm',
        [
          'install',
          '--prefix',
          cacheDir,
          '--no-audit',
          '--no-fund',
          '--loglevel',
          'error',
          ...dependencies,
        ],
        { stdio: ['ignore', 'ignore', 'inherit'] },
      );
    } catch {
      warn('Could not install dependencies. Check that npm is available and the network works.');
      process.exit(2);
    }
  }

  return createRequire(join(cacheDir, 'index.js'));
};

/**
 * Fetch the configuration schema, falling back to a cached copy when the network is unavailable.
 * @param {string | undefined} version CMS version to pin the schema to, or undefined for latest.
 * @param {boolean} offline Whether to skip the network and use the cached copy only.
 * @returns {Promise<object>} The parsed JSON schema.
 */
const loadSchema = async (version, offline) => {
  const packageSpec = version ? `@sveltia/cms@${version}` : '@sveltia/cms';
  const url = `https://unpkg.com/${packageSpec}/schema/sveltia-cms.json`;
  const cacheIsFresh =
    existsSync(schemaCachePath) && Date.now() - statSync(schemaCachePath).mtimeMs < schemaMaxAgeMs;

  // A pinned version always needs a matching download, since the cache holds one schema only.
  if (!version && (offline || cacheIsFresh) && existsSync(schemaCachePath)) {
    return JSON.parse(readFileSync(schemaCachePath, 'utf8'));
  }

  if (offline) {
    warn('No cached schema available. Run once without --offline first.');
    process.exit(2);
  }

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const schema = await response.json();

    mkdirSync(cacheDir, { recursive: true });
    writeFileSync(schemaCachePath, JSON.stringify(schema));

    return schema;
  } catch (error) {
    if (existsSync(schemaCachePath)) {
      warn(`Could not fetch the schema (${error.message}); using the cached copy.`);

      return JSON.parse(readFileSync(schemaCachePath, 'utf8'));
    }

    warn(`Could not fetch the schema from ${url}: ${error.message}`);

    return process.exit(2);
  }
};

/**
 * Parse a configuration file according to its extension.
 * @param {string} path Path to the configuration file.
 * @param {NodeRequire} require Require bound to the dependency cache.
 * @returns {object} The parsed configuration object.
 */
const parseConfig = (path, require) => {
  const source = readFileSync(path, 'utf8');
  const extension = extname(path).toLowerCase();

  try {
    if (extension === '.json') {
      return JSON.parse(source);
    }

    if (extension === '.toml') {
      return require('smol-toml').parse(source);
    }

    return require('yaml').parse(source);
  } catch (error) {
    process.stdout.write(`${path}\n  Could not parse the file: ${error.message}\n`);

    return process.exit(1);
  }
};

/**
 * Read the value at a JSON pointer.
 * @param {any} data Root value.
 * @param {string} pointer JSON pointer such as `/collections/0/fields/2`.
 * @returns {any} The value, or undefined when the pointer does not resolve.
 */
const resolvePointer = (data, pointer) =>
  pointer
    .split('/')
    .slice(1)
    .reduce((value, segment) => value?.[segment.replace(/~1/g, '/').replace(/~0/g, '~')], data);

/**
 * Index the schema’s discriminated unions.
 *
 * A field object is identified by its `widget` value and a backend by its `name` value, and each
 * variant has its own definition. Knowing the mapping lets the report validate an object against
 * the one branch it was meant to match, instead of showing why it failed all the others.
 * @param {object} schema The configuration schema.
 * @returns {{ widgets: Record<string, string>, backends: Record<string, string> }} Lookup tables
 * from discriminator value to definition name.
 */
const indexDiscriminators = (schema) => {
  const names = Object.keys(schema.definitions);
  /** @type {Record<string, string>} Lowercased definition name to its original casing. */
  const byLowerName = Object.fromEntries(names.map((name) => [name.toLowerCase(), name]));
  /** @type {Record<string, string>} */
  const widgets = {};
  /** @type {Record<string, string>} */
  const backends = {};

  names.forEach((definitionName) => {
    const definition = schema.definitions[definitionName];
    const widget = definition?.properties?.widget?.const;
    const backendName = definition?.properties?.name?.const;

    // Every built-in field type pins `widget` to a constant, which is what makes the union
    // discriminable. `CustomField` deliberately has no constant, so it stays out of this index
    // and unknown widgets fall through to the "not built-in" message.
    if (typeof widget === 'string') {
      // Prefer the definition named after the widget. For `list` and `object` that is the union
      // of their variants rather than any single variant, which is the right entry point.
      widgets[widget] = byLowerName[`${widget}field`] ?? widgets[widget] ?? definitionName;
    }

    if (typeof backendName === 'string' && definitionName.toLowerCase().endsWith('backend')) {
      backends[backendName] = definitionName;
    }
  });

  return { widgets, backends };
};

/**
 * Pick the variant of a field type whose own union is discriminated by which sub-field option is
 * present rather than by a constant, so the report can name one concrete shape.
 * @param {string} widget The field type.
 * @param {any} data The field object.
 * @returns {string | undefined} A definition name, or undefined to use the widget's own union.
 */
const selectFieldVariant = (widget, data) => {
  if (widget === 'list') {
    if (data.types) {
      return 'ListFieldWithTypes';
    }

    if (data.fields) {
      return 'ListFieldWithSubFields';
    }

    return data.field ? 'ListFieldWithSubField' : 'SimpleListField';
  }

  if (widget === 'object') {
    return data.types ? 'ObjectFieldWithTypes' : 'ObjectFieldWithSubFields';
  }

  return undefined;
};

/**
 * Walk the configuration and report `name` values the CMS rejects at runtime. The schema accepts
 * them, but they break field key path references and surface as validation errors on the login
 * screen.
 * @param {any} config The parsed configuration.
 * @returns {string[]} Human-readable problem descriptions.
 */
const findInvalidNames = (config) => {
  /** @type {string[]} */
  const problems = [];

  /**
   * @param {any} value Current node.
   * @param {string} path Human-readable path to the node.
   */
  const walk = (value, path) => {
    if (Array.isArray(value)) {
      value.forEach((item, index) => walk(item, `${path}[${index}]`));

      return;
    }

    if (!value || typeof value !== 'object') {
      return;
    }

    if (typeof value.name === 'string' && invalidNamePattern.test(value.name)) {
      problems.push(
        `${path}.name: "${value.name}" contains a space, dot or asterisk, which the CMS rejects. ` +
          'Use nested objects instead of dotted names.',
      );
    }

    Object.entries(value).forEach(([key, child]) => {
      if (child && typeof child === 'object') {
        walk(child, `${path}.${key}`);
      }
    });
  };

  ['collections', 'singletons', 'asset_collections'].forEach((key) => {
    if (config?.[key]) {
      walk(config[key], key);
    }
  });

  return problems;
};

/**
 * Collect field types the schema accepts but does not recognize.
 *
 * A field type registered through `CMS.registerWidget()` is legal and cannot be distinguished
 * from a typo, so these are reported as notices rather than failures.
 * @param {any} config The parsed configuration.
 * @param {Record<string, string>} widgets Known field type lookup.
 * @returns {string[]} Human-readable notices.
 */
const findUnknownWidgets = (config, widgets) => {
  /** @type {Map<string, string[]>} Field type to the paths that use it. */
  const found = new Map();

  /**
   * @param {any} value Current node.
   * @param {string} path Human-readable path to the node.
   */
  const walk = (value, path) => {
    if (Array.isArray(value)) {
      value.forEach((item, index) => walk(item, `${path}[${index}]`));

      return;
    }

    if (!value || typeof value !== 'object') {
      return;
    }

    if (typeof value.widget === 'string' && !Object.hasOwn(widgets, value.widget)) {
      if (!found.has(value.widget)) {
        found.set(value.widget, []);
      }

      found.get(value.widget).push(path);
    }

    Object.entries(value).forEach(([key, child]) => {
      if (child && typeof child === 'object') {
        walk(child, `${path}.${key}`);
      }
    });
  };

  walk(config, '');

  return [...found.entries()].map(
    ([widget, paths]) =>
      `"${widget}" at ${paths.slice(0, 3).join(', ')}${paths.length > 3 ? ` and ${paths.length - 3} more` : ''}`,
  );
};

/**
 * Check the admin page that loads the CMS for the two mistakes AI coding tools most often make,
 * both of which are documented in the getting started guide.
 * @param {string} configPath Path to the configuration file.
 * @returns {string[]} Human-readable problem descriptions.
 */
const checkAdminPage = (configPath) => {
  const indexPath = join(dirname(configPath), 'index.html');

  if (!existsSync(indexPath)) {
    return [];
  }

  const html = readFileSync(indexPath, 'utf8');
  /** @type {string[]} */
  const problems = [];

  if (/sveltia-cms\.css/.test(html)) {
    problems.push(
      `${indexPath}: links a "sveltia-cms.css" stylesheet, which does not exist. All styles are ` +
        'bundled in the JavaScript file. Remove the <link> tag.',
    );
  }

  if (
    /<script[^>]*sveltia-cms\.js[^>]*type=["']module["']/.test(html) ||
    /<script[^>]*type=["']module["'][^>]*sveltia-cms\.js/.test(html)
  ) {
    problems.push(
      `${indexPath}: the CMS <script> tag has type="module". Sveltia CMS is not distributed as ` +
        'an ES module, and the attribute can break the JavaScript API. Remove it.',
    );
  }

  if (!/sveltia-cms\.js/.test(html)) {
    problems.push(
      `${indexPath}: no Sveltia CMS <script> tag found. The admin page must load ` +
        'https://unpkg.com/@sveltia/cms/dist/sveltia-cms.js',
    );
  }

  return problems;
};

const args = process.argv.slice(2);
const offline = args.includes('--offline');
const versionIndex = args.indexOf('--version');
const version = versionIndex === -1 ? undefined : args[versionIndex + 1];
const positional = args.filter(
  (arg, index) => !arg.startsWith('--') && (versionIndex === -1 || index !== versionIndex + 1),
);
const configPath = positional[0] ?? commonConfigPaths.find((candidate) => existsSync(candidate));

if (!configPath) {
  warn(
    'No configuration file found. Pass the path explicitly, for example:\n' +
      '  node validate-config.mjs public/admin/config.yml',
  );
  process.exit(2);
}

if (!existsSync(configPath)) {
  warn(`No such file: ${configPath}`);
  process.exit(2);
}

const require = loadDependencies();
const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const schema = await loadSchema(version, offline);
const config = parseConfig(configPath, require);
const { widgets, backends } = indexDiscriminators(schema);

// `strict: false` keeps Ajv from rejecting the schema's own annotation keywords, and `allErrors`
// reports every problem in one pass instead of stopping at the first.
const ajv = new Ajv({ strict: false, allErrors: true, allowUnionTypes: true });

addFormats(ajv);
ajv.addSchema(schema, 'cms');

const validate = ajv.compile(schema);
const schemaValid = validate(config);

/**
 * Re-validate one object against the single union branch its discriminator selects, so the report
 * shows what is actually wrong instead of why it failed every other branch.
 * @param {string} pointer JSON pointer to the object.
 * @returns {{ messages: { path: string, text: string }[], resolved: boolean }} Messages for this
 * location, each with its path relative to the object, and whether the branch was identified.
 */
const refine = (pointer) => {
  const data = resolvePointer(config, pointer);

  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return { messages: [], resolved: false };
  }

  /** @type {string | undefined} */
  let definitionName;

  if (typeof data.widget === 'string') {
    definitionName = widgets[data.widget];

    if (!definitionName) {
      // Unknown widgets are legal: they can be registered through the JavaScript API. Say so
      // rather than reporting a spurious error.
      return {
        messages: [
          {
            path: '',
            text:
              `widget "${data.widget}" is not a built-in field type. Built-in types are: ` +
              `${Object.keys(widgets).sort().join(', ')}. If this is intentional, register it ` +
              'with CMS.registerWidget(); otherwise check for a typo.',
          },
        ],
        resolved: true,
      };
    }

    const variant = selectFieldVariant(data.widget, data);

    if (variant && schema.definitions[variant]) {
      definitionName = variant;
    }
  } else if (pointer === '/backend' && typeof data.name === 'string') {
    definitionName = backends[data.name];

    if (!definitionName) {
      return {
        messages: [
          {
            path: '',
            text:
              `backend name "${data.name}" is not supported. Use one of: ` +
              `${Object.keys(backends).sort().join(', ')}.`,
          },
        ],
        resolved: true,
      };
    }
  } else if (/^\/collections\/\d+$/.test(pointer)) {
    definitionName = data.files ? 'FileCollection' : data.folder ? 'EntryCollection' : undefined;
  }

  const branch = definitionName && ajv.getSchema(`cms#/definitions/${definitionName}`);

  if (!branch) {
    return { messages: [], resolved: false };
  }

  if (branch(data)) {
    // The object is fine on its own; the parent's error came from an unrelated branch.
    return { messages: [], resolved: true };
  }

  /** @type {Map<string, { path: string, text: string }>} */
  const messages = new Map();

  (branch.errors ?? []).forEach((error) => {
    // `anyOf` only ever restates that some nested union failed; the branch errors around it say
    // which part actually broke.
    if (error.keyword === 'anyOf') {
      return;
    }

    const path = error.instancePath || '';
    const detail =
      error.keyword === 'additionalProperties'
        ? `unknown option "${error.params.additionalProperty}"`
        : error.keyword === 'const'
          ? `must be ${JSON.stringify(error.params.allowedValue)}`
          : error.keyword === 'enum'
            ? `must be one of: ${error.params.allowedValues.join(', ')}`
            : error.message;
    const text = `${path ? `${path}: ` : ''}${detail} (as ${definitionName})`;

    messages.set(text, { path, text });
  });

  return { messages: [...messages.values()], resolved: true };
};

/** @type {Map<string, string[]>} */
const report = new Map();

/**
 * Detect a discriminator property that is reported as failing only because the value picked one
 * union branch and the others were tried anyway. The value itself is valid, so there is nothing
 * to tell the user about it.
 * @param {string} pointer JSON pointer to the property.
 * @returns {boolean} Whether the location is branch-selection noise.
 */
const isDiscriminatorNoise = (pointer) => {
  const value = resolvePointer(config, pointer);

  if (typeof value !== 'string') {
    return false;
  }

  if (pointer.endsWith('/widget')) {
    return Object.hasOwn(widgets, value);
  }

  if (pointer === '/backend/name') {
    return Object.hasOwn(backends, value);
  }

  return false;
};

if (!schemaValid) {
  const paths = [
    ...new Set((validate.errors ?? []).map((error) => error.instancePath || '')),
  ].filter((pointer) => !isDiscriminatorNoise(pointer));
  /** @type {Map<string, { path: string, text: string }[]>} */
  const refined = new Map();
  /** @type {Set<string>} Locations whose branch was identified but that had no problem of note. */
  const clean = new Set();

  paths.forEach((pointer) => {
    const { messages, resolved } = refine(pointer);

    if (messages.length) {
      refined.set(pointer, messages);
    } else if (resolved) {
      clean.add(pointer);
    }
  });

  // Refining a container such as a collection re-reports whatever is wrong inside it, which the
  // nested location already explains more precisely. Keep only the messages that belong to this
  // location, then treat a location whose messages all belonged elsewhere as having none.
  refined.forEach((messages, pointer) => {
    const kept = messages.filter(
      (message) =>
        !message.path ||
        ![...refined.keys()].some(
          (other) => other !== pointer && `${pointer}${message.path}`.startsWith(other),
        ),
    );

    if (kept.length) {
      report.set(
        pointer,
        kept.map((message) => message.text),
      );
    }
  });

  // One wrong value makes every enclosing object fail its union and every discriminator property
  // fail the branches it was never meant to match, so a single mistake surfaces at its own
  // location, its ancestors and its children. Once a location has a real explanation, drop the
  // unexplained locations above and below it.
  const explained = new Set(report.keys());

  paths.forEach((pointer) => {
    if (explained.has(pointer) || clean.has(pointer)) {
      return;
    }

    const isRelatedToExplained = [...explained].some(
      (other) => pointer.startsWith(`${other}/`) || other.startsWith(`${pointer}/`),
    );

    if (!isRelatedToExplained) {
      report.set(pointer, []);
    }
  });

  // Whatever is left without a refined explanation falls back to the raw messages.
  [...report.entries()].forEach(([pointer, messages]) => {
    if (messages.length) {
      return;
    }

    const raw = (validate.errors ?? [])
      .filter((error) => (error.instancePath || '') === pointer && error.keyword !== 'anyOf')
      .map((error) =>
        error.keyword === 'additionalProperties'
          ? `unknown option "${error.params.additionalProperty}"`
          : error.keyword === 'const'
            ? `must be ${JSON.stringify(error.params.allowedValue)}`
            : error.message,
      );

    report.set(pointer, [...new Set(raw)].slice(0, 4));
  });
}

const nameProblems = findInvalidNames(config);
const adminProblems = checkAdminPage(configPath);
const unknownWidgets = findUnknownWidgets(config, widgets);
const failed = report.size > 0 || nameProblems.length > 0 || adminProblems.length > 0;

if (!failed) {
  process.stdout.write(`${configPath}: valid\n`);
} else {
  process.stdout.write(`${configPath}\n`);

  report.forEach((messages, pointer) => {
    process.stdout.write(`\n  ${pointer || '(root)'}\n`);
    messages.forEach((message) => process.stdout.write(`    ${message}\n`));
  });

  if (nameProblems.length) {
    process.stdout.write('\n  Invalid names\n');
    nameProblems.forEach((problem) => process.stdout.write(`    ${problem}\n`));
  }

  if (adminProblems.length) {
    process.stdout.write('\n  Admin page\n');
    adminProblems.forEach((problem) => process.stdout.write(`    ${problem}\n`));
  }
}

if (unknownWidgets.length) {
  process.stdout.write(
    '\n  Unrecognized field types (valid only if registered with CMS.registerWidget();\n' +
      '  otherwise a typo):\n',
  );
  unknownWidgets.forEach((notice) => process.stdout.write(`    ${notice}\n`));
}

if (!/\$schema|yaml-language-server|#:schema/.test(readFileSync(configPath, 'utf8'))) {
  process.stdout.write(
    '\n  Tip: this file has no schema reference, so editors offer no autocomplete or inline\n' +
      '  validation. Add the line for your format:\n' +
      '    YAML  # yaml-language-server: $schema=https://unpkg.com/@sveltia/cms/schema/sveltia-cms.json\n' +
      '    TOML  #:schema https://unpkg.com/@sveltia/cms/schema/sveltia-cms.json\n' +
      '    JSON  "$schema": "https://unpkg.com/@sveltia/cms/schema/sveltia-cms.json",\n',
  );
}

process.stdout.write(
  `\nChecked against the ${version ? `v${version}` : 'latest'} schema.` +
    ' A modularized config split across several files can only be checked as a whole.\n',
);

process.exit(failed ? 1 : 0);
