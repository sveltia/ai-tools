# JavaScript API

Manual initialization, events and custom file formats. For custom field types, see `api-field-types.md`; for editor components, see `api-editor-components.md`; for preview customization, see `api-previews.md`.

Generated from the Sveltia CMS documentation. Do not edit by hand.

## JavaScript API

Sveltia CMS provides a flexible, client-side JavaScript/TypeScript API that allows developers to customize and extend its functionality. This document provides an overview of the main API components and how to use them.

### Accessing the `CMS` Object

The main entry point for the Sveltia CMS JavaScript API is the global `CMS` object. This object exposes various methods for initializing the CMS, registering custom components, and interacting with the CMS programmatically.

There are two primary ways to access the `CMS` object: via a CDN build or by installing the NPM package.

#### Using the CDN

`CMS` is exposed as a global variable when using the UNPKG CDN build. You can access it directly in your scripts:

```html
<script src="https://unpkg.com/@sveltia/cms/dist/sveltia-cms.js"></script>
<script>
  CMS.init({ config });
  CMS.registerPreviewStyle(filePath);
  CMS.registerEditorComponent(definition);
</script>
```

Alternatively, you can use the ES module version, which can be imported using the `mjs` file extension:

```html
<script type="module">
  import CMS from 'https://unpkg.com/@sveltia/cms/dist/sveltia-cms.mjs';

  CMS.init({ config });
  CMS.registerPreviewStyle(filePath);
  CMS.registerEditorComponent(definition);
</script>
```

#### Using the NPM Package

The NPM package is a separate build of the app for use with a build tool like [Vite](https://vite.dev/) or [webpack](https://webpack.js.org/), which doesn’t load any files from CDNs. See [CDN or NPM Package](https://sveltiacms.app/en/docs/releases#cdn-or-npm-package) for how it differs from the CDN builds.

Install the `@sveltia/cms` package via your preferred package manager:

```bash [npm]
npm install @sveltia/cms
```

```bash [yarn]
yarn add @sveltia/cms
```

```bash [pnpm]
pnpm add @sveltia/cms
```

```bash [bun]
bun add @sveltia/cms
```

Then, import the `CMS` object in your script to access the initialization and other API methods:

```js
import CMS from '@sveltia/cms';

CMS.init({ config });
CMS.registerPreviewStyle(filePath);
CMS.registerEditorComponent(definition);
```

or import only the methods you need:

```js
import { init } from '@sveltia/cms';

init({ config });
```

TypeScript types are included in the package, so if you edit your project with a TypeScript-aware editor like VS Code, you should get type checking and autocompletion without any additional setup.

### Available Methods

Currently, the following methods are available on the `CMS` object:

- [Manual Initialization](https://sveltiacms.app/en/docs/api/initialization): `init`
- [Custom Preview Styles](https://sveltiacms.app/en/docs/api/preview-styles): `registerPreviewStyle`
- [Custom Preview Templates](https://sveltiacms.app/en/docs/api/preview-templates): `registerPreviewTemplate`
- [Custom Editor Components](https://sveltiacms.app/en/docs/api/editor-components): `registerEditorComponent`
- [Custom Field Types](https://sveltiacms.app/en/docs/api/field-types): `registerFieldType` (alias: `registerWidget`), `getFieldType` (alias: `getWidget`)
- [Custom File Formats](https://sveltiacms.app/en/docs/api/file-formats): `registerCustomFormat`
- [Event Hooks](https://sveltiacms.app/en/docs/api/events): `registerEventListener`
- [Rendering Markdown](https://sveltiacms.app/en/docs/api/rendering-markdown): `renderRichText`

**Breaking changes from Netlify/Decap CMS**

The methods other than those listed above are not supported in Sveltia CMS. This includes:

- `registerLocale`: Sveltia CMS automatically detects and uses the browser’s language settings for localization. No manual registration of locales is necessary.
- `registerRemarkPlugin`: Sveltia CMS uses the Lexical framework for Markdown processing instead of Remark. Therefore, Remark plugins are not compatible.
- All other undocumented methods, including custom backends and custom media storage providers. We may support these features in the future, but our implementation would likely be incompatible with Netlify/Decap CMS.

### Writing React Components

For [Custom Preview Templates](https://sveltiacms.app/en/docs/api/preview-templates), [Custom Editor Components](https://sveltiacms.app/en/docs/api/editor-components) and [Custom Field Types](https://sveltiacms.app/en/docs/api/field-types), you can use React components to create rich, interactive previews and editor interfaces. Sveltia CMS supports three ways to write the markup of these components, and the examples throughout the documentation show all of them:

- [HTM](#using-htm) — HTML-like markup in a tagged template literal. It works without a build step, so it’s the recommended way.
- [JSX](#using-jsx) — The familiar React syntax, which requires a build step.
- [`h()`](#using-h) — Plain function calls, compatible with Netlify/Decap CMS.

A component can be a class component, a function component, or a component wrapped with `memo` or `forwardRef`. Sveltia CMS bundles its own copy of React 19 to render them, so write your components for React 19. That copy of React is available as `CMS.React`, and as the `React` export of the NPM package, giving you the full React API, including [hooks](#using-hooks).

#### Using HTM

[HTM](https://github.com/developit/htm) lets you write JSX-like markup in a standard JavaScript [tagged template literal](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#tagged_templates), so your components run in the browser as is, with no transpiler involved. Sveltia CMS bundles HTM and exposes the `html` tag, bound to its copy of React, on the `window` object, so no imports are necessary to use it, even if you install the NPM package:

```js
const Greeting = ({ name }) => html`<p class="greeting">Hello, ${name}!</p>`;
```

The syntax is close to JSX, with a few differences:

- Embed a value with `${}` instead of `{}`, both in text and in attributes, e.g. `<input value=${value} />`. An attribute can also mix static text and values, e.g. `style="color: ${color}"`.
- Embed a component the same way, e.g. `<${Badge} label="New" />`. Close it with `<//>` or `</${Badge}>`.
- Spread props with `...${props}`, e.g. `<input ...${props} />`.
- A template can have multiple root elements, in which case it returns an array of them, so you don’t need a fragment.

The template creates React elements, so props are the same as in JSX: event handlers are named `onClick`, `onChange` and so on, and a component receives whatever you pass. For convenience, you can also use HTML attribute names and values that React doesn’t accept in JSX: `class` and `for` work in place of `className` and `htmlFor`, and the `style` attribute can be a CSS string, e.g. `style="margin: 0; color: red"`, in addition to an object.

See the [HTM documentation](https://github.com/developit/htm#syntax-like-jsx-but-also-lit) for the full syntax.

#### Using JSX

Sveltia CMS does not provide a built-in JSX transpiler. To use JSX syntax, you need a build step to transpile it to JavaScript, such as [Vite](https://vitejs.dev/).

#### Using `h()`

Netlify/Decap CMS documents components written with plain `createElement()` calls, without any markup. For compatibility, Sveltia CMS exposes a few shorthands globally: `h` (and its alias `createElement`) and `createClass`, plus `rf` for `React.Fragment`:

- `h` (or `createElement`) — An alias for `CMS.React.createElement()`, used to create React elements in the `h()` examples
- `rf` — An alias for `CMS.React.Fragment`, used to create React fragments in the `h()` examples
- `createClass` — Used to define React class components without the `class` syntax. It comes from the [`create-react-class`](https://www.npmjs.com/package/create-react-class) package, as React itself no longer provides it

These are available on the `window` object when Sveltia CMS is loaded, so no imports are necessary to use them. React itself isn’t a global, so it can’t clash with another copy of React your page may load; use `CMS.React` for anything else.

Define the methods you pass to `createClass`, such as `render`, as function expressions rather than arrow functions. `createClass` binds each method to the component instance, which an arrow function doesn’t allow, so `this.props` would be undefined within it. Any other function, including a callback within a method, can be an arrow function.

See [React Without JSX](https://legacy.reactjs.org/docs/react-without-jsx.html) for more information on how to use React without JSX.

#### Using Hooks

Function components can use React hooks such as `useState` and `useEffect`, as long as the hooks come from the copy of React bundled with Sveltia CMS — `CMS.React`, or the `React` export of the NPM package:

```js [CDN]
const { useState, useEffect } = CMS.React;
```

```js [NPM]
import CMS, { React } from '@sveltia/cms';

const { useState, useEffect } = React;
```

For example, the following control for a [custom field type](https://sveltiacms.app/en/docs/api/field-types) keeps whether its text area is expanded in state:

```js [HTM]
const { useState } = CMS.React;

const NotesControl = ({ forID, classNameWrapper, value, onChange }) => {
  const [expanded, setExpanded] = useState(false);

  return html`
    <textarea
      id=${forID}
      class=${classNameWrapper}
      rows=${expanded ? 12 : 3}
      value=${value ?? ''}
      onChange=${(event) => onChange(event.target.value)}
    />
    <button type="button" onClick=${() => setExpanded(!expanded)}>
      ${expanded ? 'Collapse' : 'Expand'}
    </button>
  `;
};

CMS.registerFieldType('notes', NotesControl);
```

```jsx [JSX]
const { useState } = CMS.React;

const NotesControl = ({ forID, classNameWrapper, value, onChange }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <textarea
        id={forID}
        className={classNameWrapper}
        rows={expanded ? 12 : 3}
        value={value ?? ''}
        onChange={(event) => onChange(event.target.value)}
      />
      <button type="button" onClick={() => setExpanded(!expanded)}>
        {expanded ? 'Collapse' : 'Expand'}
      </button>
    </>
  );
};

CMS.registerFieldType('notes', NotesControl);
```

```js [h()]
const { useState } = CMS.React;

const NotesControl = ({ forID, classNameWrapper, value, onChange }) => {
  const [expanded, setExpanded] = useState(false);

  return h(
    rf,
    null,
    h('textarea', {
      id: forID,
      className: classNameWrapper,
      rows: expanded ? 12 : 3,
      value: value ?? '',
      onChange: (event) => onChange(event.target.value),
    }),
    h(
      'button',
      { type: 'button', onClick: () => setExpanded(!expanded) },
      expanded ? 'Collapse' : 'Expand',
    ),
  );
};

CMS.registerFieldType('notes', NotesControl);
```

A hook imported from another copy of React, such as the `react` package in your project’s dependencies, throws an “Invalid hook call” error. If you install the NPM package, import `React` from `@sveltia/cms` and take the hooks from it. If you load Sveltia CMS from the CDN, take the hooks from `CMS.React` (`window.CMS.React`), even when you bundle your own components with a build tool — importing `@sveltia/cms` in that case would load a second copy of the CMS. Never take them from the `react` package. The JSX itself can still be compiled with your project’s `react` package, as long as it’s React 19 too, so that Sveltia CMS can render the elements it creates.

Source: https://sveltiacms.app/en/docs/api

---

## Manual Initialization

By default, Sveltia CMS automatically initializes itself when the script is loaded. However, in some cases, you may want to have more control over when and how the CMS is initialized. This is where the `init` function comes into play.

### Overview

To manually initialize the CMS, call the `init` function on the [`CMS` object](https://sveltiacms.app/en/docs/api#accessing-the-cms-object):

```js
CMS.init({ config });
```

#### Parameters

- `config` (optional): An object that can contain any of the configuration options available in the `config.yml` file. If provided, this configuration will be merged with the one loaded from `config.yml` (if the `load_config_file` option is `true` or omitted), with its options taking precedence over the file’s — except that arrays such as `collections` are concatenated rather than replaced, so an item can be added but not replaced — or used directly as a complete configuration (if `load_config_file` is `false`).

#### Return Value

The function returns a Promise that resolves once the app has been mounted. The app is mounted on the [`<div id="nc-root">`](https://sveltiacms.app/en/docs/customization#custom-mount-element) element if present, or the `<body>` element otherwise. If the page is still loading and there is no such element yet, the CMS waits for the page content to be loaded first.

If `config` is neither an object nor `undefined`, the Promise is rejected with a `TypeError`. Calls after the first one are ignored, so the CMS can only be initialized once.

**Config File Loading Behavior**

Unless you set the `load_config_file` option to `false`, the CMS will always attempt to load the `config.yml` file, even when you provide a configuration object, and raise an error if the file is not found or cannot be loaded. If you want to completely bypass loading the configuration file, make sure to set this option accordingly.

### Usage Notes

#### Preventing Automatic Initialization

If you use the UNPKG CDN, you have to set a global variable `CMS_MANUAL_INIT` to `true` before loading the script to prevent automatic initialization.

```html
<script>
  // Set this before loading the CMS script
  window.CMS_MANUAL_INIT = true;
</script>
<script src="https://unpkg.com/@sveltia/cms/dist/sveltia-cms.js"></script>
<script>
  // Now you can call init() manually
  CMS.init();
</script>
```

The `init` function is also exposed as the global `initCMS` variable, so code written for Netlify/Decap CMS, such as `const { CMS, initCMS: init } = window;`, works as is.

For NPM installations, you don’t need this step; manual initialization is the default behavior. In other words, you always have to call `init()` yourself.

#### Registering Customizations

The `register*` methods, such as `registerPreviewTemplate` and `registerFieldType`, can be called before or after `init()`. Registered items are looked up when they are needed, and the configuration is loaded asynchronously after `init()` is called, so anything registered in the same script is picked up either way.

However, field type [schemas](https://sveltiacms.app/en/docs/api/field-types#field-schema), [editor component](https://sveltiacms.app/en/docs/api/editor-components) fields and [custom file formats](https://sveltiacms.app/en/docs/api/file-formats) are processed when the configuration or the content is loaded. Register them synchronously rather than in a delayed callback, so they are available by then.

#### Typing the Configuration Object

The `CMS` object is typed, so if you are using TypeScript, you will get type checking and autocompletion when providing the configuration object to the `init` function.

You can also import the `CmsConfig` type from the `@sveltia/cms` package to type the configuration object if you construct it outside of the `init` call. Here’s an example:

```ts
import { init, type CmsConfig } from '@sveltia/cms';

const config: CmsConfig = {
  // your config here
};

init({ config });
```

**Experimental Types**

Types other than `CmsConfig` can also be imported for more specific parts of the configuration, such as `GitHubBackend`, `EntryCollection`, `DateTimeField`, etc. However, this is experimental and subject to change, so it’s recommended to use `CmsConfig` for now.

### Examples

#### Initializing the CMS Normally

This will load the configuration from `config.yml` and initialize the CMS as usual, just like the automatic initialization.

```js
CMS.init();
```

#### Providing a Full Configuration

When the `load_config_file` option is set to `false`, the configuration provided here will be used directly, and the `config.yml` file will not be loaded. Make sure to include all required options: `backend`, `media_folder` and `collections`.

```js {3}
CMS.init({
  config: {
    load_config_file: false,
    backend: {
      name: 'github',
      repo: 'user/repo',
    },
    media_folder: '/public/media',
    public_folder: '/media',
    collections: [
      // your collections here
    ],
  },
});
```

#### Providing a Partial Configuration

If the `load_config_file` option is set to `true` or omitted, the configuration provided here will be merged with the one loaded from `config.yml` using the [`deepmerge`](https://www.npmjs.com/package/deepmerge) library, so you can override or add specific settings. Use cases for this are more limited, but it can be useful in some scenarios.

For example, you could override the [backend branch](https://sveltiacms.app/en/docs/backends#branch-selection) like this:

```js
CMS.init({
  config: {
    backend: {
      branch: 'development',
    },
  },
});
```

Objects are merged recursively, but arrays are appended rather than replaced. For example, if `config.yml` defines a `posts` collection and the manual configuration defines a `pages` collection, the CMS will have both collections, in that order:

```js
CMS.init({
  config: {
    collections: [
      {
        name: 'pages',
        // other options
      },
    ],
  },
});
```

This means you can’t use a partial configuration to remove, reorder or modify items in an array such as `collections`. A collection with the same name as one in `config.yml` is added as a separate item rather than overriding it. If you need full control, set `load_config_file` to `false` and provide the complete configuration instead.

**Note for Netlify/Decap CMS users**

The Netlify/Decap CMS documentation says arrays are replaced during the merge. However, Netlify/Decap CMS actually appends them, just like Sveltia CMS, so your existing configuration will work the same way.

### Showcase

Real-world examples of manual initialization can be found in our [showcase](https://sveltiacms.app/en/showcase?feature=initialization).

Source: https://sveltiacms.app/en/docs/api/initialization

---

## Event Hooks

Event hooks allow developers to execute custom code in response to specific events within Sveltia CMS. This feature enables advanced customization and integration with other systems by providing a way to listen for and react to various actions taken within the CMS.

### Overview

To register an event listener, use the `registerEventListener` method on the [`CMS` object](https://sveltiacms.app/en/docs/api#accessing-the-cms-object):

```js
CMS.registerEventListener({ name, handler });
```

The `registerEventListener` method allows you to register a callback function (`handler`) that will be invoked when a specific event (`name`) occurs within the CMS. The handler function receives an object containing relevant data about the event, allowing you to perform custom logic based on the event context.

Multiple event listeners can be registered for the same event, and they will be executed in the order they were registered.

#### Parameters

- `name` (string): The name of the event to listen for. See the [Supported Events](#supported-events) section for a list of available events.
- `handler` (function): A callback function that will be executed when the event is triggered. See the [Event Handler](#event-handler) section for details on the parameters passed to the handler.

<!-- Decap CMS probably doesn’t support multiple listeners -->

### Supported Events

The following events are supported for event hooks:

- `preSave`: Triggered before an entry is saved. You can modify the entry data before it is persisted.
- `postSave`: Triggered after an entry has been saved.

Additionally, the following events are available when using [Editorial Workflow](https://sveltiacms.app/en/docs/workflows/editorial):

- `prePublish`: Triggered before an entry is published. Unlike `preSave`, the handler can’t modify the entry: the content is already committed to the pull/merge request by this point, so a returned value is ignored.
- `postPublish`: Triggered after an entry has been published.
- `preUnpublish`: Triggered before a published entry is removed from the configured branch, which happens when a deletion is published rather than when it’s requested.
- `postUnpublish`: Triggered after a published entry has been removed from the configured branch.

### Event Handler

The handler function receives an object with the following properties:

- `author`: The author object that contains the `login` (login name) and `name` (display name) of the user who triggered the event. Both are always strings: a value that isn’t available, such as with the [local development workflow](https://sveltiacms.app/en/docs/workflows/local), which doesn’t track user information, is an empty string.
- `entry`: The entry object serialized to an [Immutable Map](https://immutable-js.com/docs/v5/Map/). It contains the following properties:
  ```js
  {
    data: { ... }, // Default locale data
    i18n: {
      [locale]: {
        data: { ... } // Non-default locale data
      }
    },
    slug, // Entry slug
    path, // Entry path
    newRecord, // Boolean indicating if it's a new entry
    collection, // Collection name, or `_singletons` for a singleton
    mediaFiles, // Array of associated media files
  }
  ```

<!-- any other properties? -->

For the `preSave` event, the handler can return a modified entry object in Immutable Map format, or just the modified `data` Map like `entry.get('data').set('title', 'New Title')`, to change the data before it is saved. Only the changes to `data` and `i18n.*.data` are applied; changes to other properties, such as `slug`, are ignored. The handler can be asynchronous and return a Promise that resolves to the modified `entry` or entry `data`. If multiple handlers are registered, each one receives the changes made by the previous ones.

For other events, the return value is ignored.

### Examples

#### Modifying Entry Data Before Save

The following example demonstrates how to register a pre-save hook that adds a last modified timestamp to the entry data before it is saved.

```js
CMS.registerEventListener({
  name: 'preSave',
  handler: ({ entry }) => {
    return entry.get('data').set('last_modified', new Date().toISOString());
  },
});
```

#### Accessing I18n Data

If you have [internationalization](https://sveltiacms.app/en/docs/i18n) (i18n) support enabled, localized data can be accessed and modified within the event handlers, under the `i18n` property of the entry object. The following example shows how to read and update localized fields in a pre-save hook, assuming the entry has English (default), French and other locales configured.

```js
CMS.registerEventListener({
  name: 'preSave',
  handler: ({ entry }) => {
    console.info('English Title:', entry.getIn(['data', 'title']));

    entry.get('i18n').forEach((localeData, locale) => {
      console.info(`Locale (${locale}) Title:`, localeData.getIn(['data', 'title']));
    });

    return entry.setIn(['i18n', 'fr', 'data', 'title'], 'Titre en Français');
  },
});
```

The [`getIn`](<https://immutable-js.com/docs/v5/Map/#getIn()>) and [`setIn`](<https://immutable-js.com/docs/v5/Map/#setIn()>) methods from Immutable.js are used to work with nested data structures.

#### Accessing Media Files

The `mediaFiles` property of the entry object lists the assets referenced by the entry’s [Image](https://sveltiacms.app/en/docs/fields/image) and [File](https://sveltiacms.app/en/docs/fields/file) fields that are stored in a [collection-level or field-level media folder](https://sveltiacms.app/en/docs/media/internal). Assets in the global media folder aren’t included. Each item has the following properties:

- `id`: The Git object ID (SHA-1 hash) of the file.
- `name`: The file name.
- `path`: The file path, relative to the repository root.
- `size`: The file size in bytes.
- `url` and `displayURL`: A temporary [blob URL](https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL_static) for the file, or `undefined` if it hasn’t been loaded into the browser yet.
- `file`: The [`File`](https://developer.mozilla.org/en-US/docs/Web/API/File) object. It’s only set for newly uploaded files that haven’t been saved yet, so you can inspect what’s about to be committed.

The following example demonstrates how to register a pre-save hook that lists the media files associated with the entry and warns about large uploads.

```js
CMS.registerEventListener({
  name: 'preSave',
  handler: ({ entry }) => {
    entry.get('mediaFiles').forEach((media) => {
      const { name, path, size, file } = media.toJS();

      console.info(`${file ? 'Uploading' : 'Referencing'} ${name} (${size} bytes) at ${path}`);

      if (file && size > 1024 * 1024) {
        console.warn(`${name} is larger than 1 MB`);
      }
    });
  },
});
```

The handler doesn’t need to return anything here because the entry data isn’t modified.

#### Getting Notification of Saved Entries

The following example demonstrates how to register a post-save hook that logs information about the saved entry and the author who made the changes.

```js
CMS.registerEventListener({
  name: 'postSave',
  handler: ({ author, entry }) => {
    console.log(`Entry saved by ${author.login || 'Unknown'}:`, entry.toJS());
  },
});
```

The [`toJS`](<https://immutable-js.com/docs/v5/Map/#toJS()>) method from Immutable.js is used to convert the entry object back to a plain JavaScript object for easier logging.

### Showcase

Real-world examples of event hooks can be found in our [showcase](https://sveltiacms.app/en/showcase?feature=events).

Source: https://sveltiacms.app/en/docs/api/events

---

## Custom File Formats

Sveltia CMS comes with built-in support for common file formats like JSON, YAML, TOML and Markdown. However, you can also register your own custom parsers and formatters to handle different file types or formats.

### Overview

To register a custom file format, use the `registerCustomFormat` method on the [`CMS` object](https://sveltiacms.app/en/docs/api#accessing-the-cms-object):

```js
CMS.registerCustomFormat(name, extension, { fromFile, toFile });
```

#### Parameters

- `name` (string): A unique name for the custom format. This name will be used to reference the format in collection configurations. A custom format with the same name as a built-in one, such as `json`, takes precedence over the built-in format, and registering a format with the same name again replaces the previous one.
- `extension` (string): The file extension associated with this format, without a leading dot (e.g., `json5`, `yaml`, `toml`).
- `fromFile` (function): A parser function that takes a string (the content of the file, trimmed and with line breaks normalized to `\n`) and returns a JavaScript object.
- `toFile` (function): A formatter function that takes a JavaScript object and returns a string (the content to be saved to the file). The output is trimmed and a trailing line break is added.

You can omit either `fromFile` or `toFile` if you only need to customize one direction (parsing or formatting). If you omit `fromFile`, the CMS will use the built-in parser for the format name, if any, such as `yaml` or `json`. Similarly, if you omit `toFile`, the CMS will use the built-in formatter. If the format name isn’t a built-in one, provide both functions: without `fromFile`, files in the format can’t be loaded, and without `toFile`, saving an entry fails with an error, leaving the file untouched. The CMS logs a warning to the browser console when such a function is missing. You must provide at least one of the two functions; otherwise an error is thrown.

The functions `fromFile` and `toFile` can also be asynchronous, allowing you to perform async operations if needed.

### Using Custom Formats

Once registered, the custom format can be used in your collection configurations by specifying the `format` property. For example:

```yaml [YAML]
collections:
  - name: myCollection
    format: json5
    fields:
      - name: item1
        label: Item 1
```

```toml [TOML]
[[collections]]
name = "myCollection"
format = "json5"

[[collections.fields]]
name = "item1"
label = "Item 1"
```

```json [JSON]
{
  "collections": [
    {
      "name": "myCollection",
      "format": "json5",
      "fields": [
        {
          "name": "item1",
          "label": "Item 1"
        }
      ]
    }
  ]
}
```

```js [JavaScript]
{
  collections: [
    {
      name: "myCollection",
      format: "json5",
      fields: [
        {
          name: "item1",
          label: "Item 1",
        },
      ],
    },
  ],
}
```

You don’t need to specify the file `extension` in the collection configuration; the CMS will automatically use the extension of the registered format. If the collection has an `extension` option, it’s ignored in favor of the registered one.

### Examples

#### YAML with Alternative Library

By default, Sveltia CMS uses the `yaml` library to parse and format YAML files. If you want to use the `js-yaml` library instead, you can register a custom formatter as follows:

```js
import YAML from 'js-yaml';

CMS.registerCustomFormat('yaml', 'yml', {
  fromFile: (text) => YAML.load(text),
  toFile: (data) => YAML.dump(data),
});
```

The file `extension` in the second argument is set to `yml` to match the default extension for YAML files. You can change it to `yaml` if you prefer.

#### JSON5

The following example demonstrates how to register a custom formatter for the JSON5 format using the `json5` library:

```js
import JSON5 from 'json5';

CMS.registerCustomFormat('json5', 'json5', {
  fromFile: (text) => JSON5.parse(text),
  toFile: (data) => JSON5.stringify(data, null, 2),
});
```

#### JSON with Additional Metadata

You can customize the behavior of the formatter functions. For example, you might want to add a timestamp and version number to the JSON file whenever it is saved:

```js
CMS.registerCustomFormat('json', 'json', {
  toFile: (data) => {
    const completeData = {
      ...data,
      last_updated: new Date().toISOString(),
      version: (data.version ?? 0) + 1,
    };

    return JSON.stringify(completeData, null, 2);
  },
});
```

An [event hook](https://sveltiacms.app/en/docs/api/events) is a better way to add metadata like timestamps, but this example illustrates how you can customize the formatter functions.

`fromFile` is omitted in this example, so the CMS will use the default `JSON.parse` method to parse JSON files.

#### JavaScript Module

The following example demonstrates how to register a custom formatter for JavaScript modules that export data using `export default` syntax and parse it back into a JavaScript object:

```js
CMS.registerCustomFormat('mjs', 'js', {
  fromFile: (text) => JSON.parse(text.replace(/^export default (.+);$/s, '$1')),
  toFile: (data) => `export default ${JSON.stringify(data, null, 2)};`,
});
```

The file extension is set to `js` for demonstration purposes. You can use `mjs` if you prefer.

This example uses a simple regex to extract the JSON object from the `export default` statement. If you need a more robust solution for parsing JavaScript modules, consider using a library like `acorn` or `esbuild` to handle the parsing.

#### Asynchronous Formatter

The parser and formatter functions can also be asynchronous. For example, you might want to format JSON data using a library like Prettier, which returns a promise:

```js
import Prettier from 'prettier';

CMS.registerCustomFormat('json', 'json', {
  toFile: async (data) => Prettier.format(data),
});
```

If you omit `fromFile`, the CMS will fall back to the built-in parser for the format name. In this case, the standard `JSON.parse` method will be used to parse JSON files.

#### Custom Markdown Parser/Formatter

The following example demonstrates how to register a custom parser and formatter for Markdown files that follow a specific structure:

```js
CMS.registerCustomFormat('custom-markdown', 'md', {
  fromFile: (text) => {
    const regex =
      /^# (?<title>.+)\n\n!\[(?<alt>.*)\]\((?<src>.*)\)\n\n> (?<excerpt>.*)\n\n(?<body>[\s\S]*)$/;

    const {
      title = '',
      alt = '',
      src = '',
      excerpt = '',
      body = '',
    } = text.match(regex)?.groups ?? {};

    return {
      title,
      cover: { src, alt },
      excerpt,
      body,
    };
  },
  toFile: (data) => {
    const {
      title,
      cover: { src, alt },
      excerpt,
      body,
    } = data;

    return `# ${title}\n\n![${alt}](${src})\n\n> ${excerpt}\n\n${body}`;
  },
});
```

The above example uses a regular expression to parse the Markdown content into a structured object with `title`, `cover`, `excerpt`, and `body` fields. The formatter function then converts the structured object back into the Markdown format.

An example of a Markdown file that would be parsed by this custom format is as follows:

```markdown
# My First Post

![A beautiful sunrise](sunrise.jpg)

> This is a brief excerpt of my first post.

This is the body of my first post. It can contain multiple paragraphs, lists, and other Markdown elements.
```

The collection configuration for this custom format would look like this:

```yaml [YAML]
collections:
  - name: posts
    label: Posts
    thumbnail: cover.src
    folder: content/posts
    format: custom-markdown
    fields:
      - name: title
        label: Title
        widget: string
      - name: cover
        label: Cover Image
        widget: object
        fields:
          - name: src
            label: Source
            widget: image
          - name: alt
            label: Alt Text
            widget: string
      - name: excerpt
        label: Excerpt
        widget: text
      - name: body
        label: Body
        widget: richtext
```

```toml [TOML]
[[collections]]
name = "posts"
label = "Posts"
thumbnail = "cover.src"
folder = "content/posts"
format = "custom-markdown"
[[collections.fields]]
name = "title"
label = "Title"
widget = "string"
[[collections.fields]]
name = "cover"
label = "Cover Image"
widget = "object"
[[collections.fields.fields]]
name = "src"
label = "Source"
widget = "image"
[[collections.fields.fields]]
name = "alt"
label = "Alt Text"
widget = "string"
[[collections.fields]]
name = "excerpt"
label = "Excerpt"
widget = "text"
[[collections.fields]]
name = "body"
label = "Body"
widget = "richtext"
```

```json [JSON]
{
  "collections": [
    {
      "name": "posts",
      "label": "Posts",
      "thumbnail": "cover.src",
      "folder": "content/posts",
      "format": "custom-markdown",
      "fields": [
        {
          "name": "title",
          "label": "Title",
          "widget": "string"
        },
        {
          "name": "cover",
          "label": "Cover Image",
          "widget": "object",
          "fields": [
            {
              "name": "src",
              "label": "Source",
              "widget": "image"
            },
            {
              "name": "alt",
              "label": "Alt Text",
              "widget": "string"
            }
          ]
        },
        {
          "name": "excerpt",
          "label": "Excerpt",
          "widget": "text"
        },
        {
          "name": "body",
          "label": "Body",
          "widget": "richtext"
        }
      ]
    }
  ]
}
```

```js [JavaScript]
{
  collections: [
    {
      name: 'posts',
      label: 'Posts',
      thumbnail: 'cover.src',
      folder: 'content/posts',
      format: 'custom-markdown',
      fields: [
        {
          name: 'title',
          label: 'Title',
          widget: 'string',
        },
        {
          name: 'cover',
          label: 'Cover Image',
          widget: 'object',
          fields: [
            {
              name: 'src',
              label: 'Source',
              widget: 'image',
            },
            {
              name: 'alt',
              label: 'Alt Text',
              widget: 'string',
            },
          ],
        },
        {
          name: 'excerpt',
          label: 'Excerpt',
          widget: 'text',
        },
        {
          name: 'body',
          label: 'Body',
          widget: 'richtext',
        },
      ],
    },
  ],
}
```

### Showcase

Real-world examples of custom file formats can be found in our [showcase](https://sveltiacms.app/en/showcase?feature=file-formats).

Source: https://sveltiacms.app/en/docs/api/file-formats
