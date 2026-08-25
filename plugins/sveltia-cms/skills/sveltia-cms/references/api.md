# JavaScript API

Manual initialization, events, file formats and custom field types. For preview and editor customization, see `api-customization.md`.

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

Alternatively, you can use the ES module version, which can be imported using the `mjs` file extension. This script is the same as the NPM package version:

```html
<script type="module">
  import CMS from 'https://unpkg.com/@sveltia/cms/dist/sveltia-cms.mjs';

  CMS.init({ config });
  CMS.registerPreviewStyle(filePath);
  CMS.registerEditorComponent(definition);
</script>
```

#### Using the NPM Package

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

**Breaking changes from Netlify/Decap CMS**

The methods other than those listed above are not supported in Sveltia CMS. This includes:

- `registerLocale`: Sveltia CMS automatically detects and uses the browser’s language settings for localization. No manual registration of locales is necessary.
- `registerRemarkPlugin`: Sveltia CMS uses the Lexical framework for Markdown processing instead of Remark. Therefore, Remark plugins are not compatible.
- All other undocumented methods, including custom backends and custom media storage providers. We may support these features in the future, but our implementation would likely be incompatible with Netlify/Decap CMS.

### Writing React Components

For [Custom Preview Templates](https://sveltiacms.app/en/docs/api/preview-templates), [Custom Editor Components](https://sveltiacms.app/en/docs/api/editor-components) and [Custom Field Types](https://sveltiacms.app/en/docs/api/field-types), you can use React components to create rich, interactive previews and editor interfaces. Sveltia CMS supports both JSX and non-JSX syntax for defining these components.

#### Without JSX

Sveltia CMS exposes two constructs globally to allow you to create React components inline without requiring a build step:

- `h` — An alias for `React.createElement()`, used to create React elements in the non-JSX examples
- `rf` - An alias for `React.Fragment`, used to create React fragments in the non-JSX examples
- `createClass` — Used to define React class components when not using JSX syntax

These are available on the `window` object when Sveltia CMS is loaded. No additional imports are necessary to use them.

Define the methods you pass to `createClass`, such as `render`, as function expressions rather than arrow functions. `createClass` binds each method to the component instance, which an arrow function doesn’t allow, so `this.props` would be undefined within it. Any other function, including a callback within a method, can be an arrow function.

See [React Without JSX](https://legacy.reactjs.org/docs/react-without-jsx.html) for more information on how to use React without JSX.

**Future Plans**

We plan to add support for [Preact+HTM](https://preactjs.com/guide/v10/getting-started#alternatives-to-jsx) components in the future, which will allow you to write preview templates using a more lightweight syntax without JSX.

#### With JSX

Sveltia CMS does not provide a built-in JSX transpiler. To use JSX syntax, you need a build step to transpile it to JavaScript, such as [Vite](https://vitejs.dev/).

### Rendering Markdown

The value of a [RichText](https://sveltiacms.app/en/docs/fields/richtext) or [Markdown](https://sveltiacms.app/en/docs/fields/markdown) field is a Markdown string. When you render such a value yourself — in a [Custom Preview Template](https://sveltiacms.app/en/docs/api/preview-templates), the [preview output](https://sveltiacms.app/en/docs/api/editor-components#preview-output) of a [Custom Editor Component](https://sveltiacms.app/en/docs/api/editor-components), or a [Custom Field Type](https://sveltiacms.app/en/docs/api/field-types) — the string is used as is, so text like `**bold**` appears verbatim unless you convert it to HTML.

To make that possible without adding a dependency of your own, Sveltia CMS exposes the two libraries it uses internally:

- `marked` — The [Marked](https://marked.js.org/) parser, which converts a Markdown string to an HTML string
- `DOMPurify` — The [DOMPurify](https://github.com/cure53/DOMPurify) sanitizer, which strips scripts and other dangerous markup from an HTML string

These are available on the `window` object when Sveltia CMS is loaded, whether you use the CDN build or the npm package. No additional imports are necessary to use them.

```js
const html = DOMPurify.sanitize(marked.parse(markdown));
```

The CMS renders the preview pane with the `breaks` option enabled, meaning a single line break becomes a `<br>`. Pass the same option if you want your output to match:

```js
const html = DOMPurify.sanitize(marked.parse(markdown, { breaks: true }));
```

**Security Risk**

Always sanitize the HTML before inserting it into the DOM, as the examples above do. Markdown allows raw HTML, so skipping the sanitizer can expose your CMS to [cross-site scripting](https://developer.mozilla.org/en-US/docs/Web/Security/Attacks/XSS) (XSS) attacks if untrusted users have access to the CMS, especially when using [Open Authoring](https://sveltiacms.app/en/docs/workflows/open), because entries can be written by anybody.

**Shared parser instance**

`marked` is the very parser the CMS uses to render the preview pane, so any extension you add with [`marked.use()`](https://marked.js.org/using_pro) also changes how the CMS itself renders Markdown. Prefer passing [options](https://marked.js.org/using_advanced) to `marked.parse()` for one-off customization.

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

- `config` (optional): An object that can contain any of the configuration options available in the `config.yml` file. If provided, this configuration will be merged with the one loaded from `config.yml` (if the `load_config_file` option is `true` or omitted) or used directly (if `load_config_file` is `false`).

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

For NPM installations, you don’t need this step; manual initialization is the default behavior. In other words, you always have to call `init()` yourself.

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

- `author`: The author object that contains the `login` (login name) and `name` (display name) of the user who triggered the event. It’s not available for the [local development workflow](https://sveltiacms.app/en/docs/workflows/local) since it doesn’t track user information.
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
    collection, // Collection name
    mediaFiles, // Array of associated media files
  }
  ```

<!-- any other properties? -->

For the `preSave` event, the handler can return a modified entry object in Immutable Map format to change the data before it is saved. The handler can be asynchronous and return a Promise that resolves to the modified `entry` or entry `data`.

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

#### Getting Notification of Saved Entries

The following example demonstrates how to register a post-save hook that logs information about the saved entry and the author who made the changes.

```js
CMS.registerEventListener({
  name: 'postSave',
  handler: ({ author, entry }) => {
    console.log(`Entry saved by ${author?.login ?? 'Unknown'}:` entry.toJS());
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

- `name` (string): A unique name for the custom format. This name will be used to reference the format in collection configurations.
- `extension` (string): The file extension associated with this format (e.g., `json5`, `yaml`, `toml`).
- `fromFile` (function): A parser function that takes a string (the content of the file) and returns a JavaScript object.
- `toFile` (function): A formatter function that takes a JavaScript object and returns a string (the content to be saved to the file).

You can omit either `fromFile` or `toFile` if you only need to customize one direction (parsing or formatting). If you omit `fromFile`, the CMS will use the default parser for the specified file extension. Similarly, if you omit `toFile`, the CMS will use the default formatter. You must provide at least one of the two functions.

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

You don’t need to specify the file `extension` in the collection configuration; the CMS will automatically use the correct extension based on the registered format.

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

If you omit `fromFile`, the CMS will fall back to the default parser for that file extension. In this case, the standard `JSON.parse` method will be used to parse JSON files.

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

---

## Custom Field Types

A custom field type allows you to create reusable, complex input controls and previews available in the CMS interface. Registered field types can be used in your collection just like [built-in field types](https://sveltiacms.app/en/docs/fields#built-in-field-types).

**Compatibility Note**

Because there is little [Netlify/Decap CMS documentation](https://decapcms.org/docs/custom-widgets/#registerwidget) on this topic, Sveltia CMS may not be fully compatible with existing preview templates. Our implementation does not include undocumented component props, other than the [`entry` prop](#control-component-props) for control components, and the `schema` parameter is unimplemented. Additionally, we haven’t verified that all of the examples below work with Sveltia CMS. If you encounter any issues, please [report them to us](https://github.com/sveltia/sveltia-cms/issues).

**Naming Convention**

In Sveltia CMS, what was previously referred to as a **widget** in Netlify/Decap CMS is now called a **field type**. This change was made to better align with common content management terminology, as originally [proposed](https://github.com/decaporg/decap-cms/issues/3719) by Netlify CMS maintainers themselves.

The `registerWidget` method from Netlify/Decap CMS has been renamed to `registerFieldType` in Sveltia CMS to reflect this terminology change, but the old name remains available as an alias for backward compatibility. The signature and behavior are identical.

### Registering a Custom Field Type

To register a custom field type, use the `registerFieldType` method on the [`CMS` object](https://sveltiacms.app/en/docs/api#accessing-the-cms-object):

```js
CMS.registerFieldType(name, control, [preview], [schema]);
```

For backward compatibility with Netlify/Decap CMS, the `registerWidget` method is available as an alias with the same signature.

#### Parameters

- `name` (string, required): The name of the custom field type. This is the name you will use in your collection configuration to reference this type. It should be unique and not conflict with [built-in field types](https://sveltiacms.app/en/docs/fields#built-in-field-types) names.
- `control` (React component, required): A React **class component** that defines the control (input) part of the field.
- `preview` (React component, optional): A React **class component** that defines how the field’s value is previewed in the CMS preview pane. If not provided, no preview will be shown.
- `schema` (object, optional): A [JSON schema](https://json-schema.org/) object that defines the configuration options for the field type.

You can use either JSX or non-JSX syntax to define the component — see the [Writing React Components](https://sveltiacms.app/en/docs/api#writing-react-components) section for more details.

#### Control Component Props

The control component receives the following props:

- `value` (any): The current field value. Your component should display this value and call `onChange` when the user modifies it.
- `field` ([Immutable Map](https://immutable-js.com/docs/v5/Map/)): An Immutable Map of the current field configuration from the CMS config. Contains all field properties including `name`, `label`, `widget`, and any custom properties you define in your schema. Access properties using methods like `field.get('name')` or `field.getIn(['custom', 'property'])`.
- `forID` (string): The HTML `id` attribute that should be used for the main input element. This enables proper label association and accessibility.
- `classNameWrapper` (string): A CSS class name that can be applied to your input element for consistent styling with built-in field controls.
- `entry` ([Immutable Map](https://immutable-js.com/docs/v5/Map/)): The data of the entry being edited. Read the content with `entry.getIn(['data', 'fieldName'])`. This lets your control display values derived from other fields in the same entry, such as dynamically generated select options. The prop is updated whenever any field in the entry is modified, so your control always sees the latest content. See the [Dependent Select](#dependent-select) example below.
- `onChange` (function): A callback function that must be called with the new value whenever the user modifies the field. This updates the entry draft in the CMS.

##### Custom Validation

Control components may optionally implement an `isValid` instance method for custom validation. The method should return:

- `true` when the value is valid.
- `false` or `{ error: { message: "text" } }` when the value is invalid.
- A Promise that resolves to any of the above formats for async validation.

#### Preview Component Props

The preview component receives the following props:

- `value` (any): The current field value to display in the preview.
- `field` ([Immutable Map](https://immutable-js.com/docs/v5/Map/)): An Immutable Map of the current field configuration. Use `field.get('name')` to access properties.
- `metadata` (Immutable Map): Any available metadata for the current field. For relation fields, contains referenced entry data. Use Immutable Map methods to access nested data.

#### Field Schema

The `schema` parameter is a [JSON schema](https://json-schema.org/) object that defines the configuration options for your field type. When users include your custom field type in their collection config, they can set these configuration options. For example:

```js
const schema = {
  properties: {
    separator: { type: 'string' },
    maxItems: { type: 'integer' },
  },
};
```

Users would then configure the field like:

```yaml
fields:
  - name: tags
    label: Tags
    widget: array # custom field type name
    separator: ', ' # custom configuration option
    maxItems: 10 # custom configuration option
```

### Getting a Field Type

To get the definition of a registered field type, use the `getFieldType` method on the [`CMS` object](https://sveltiacms.app/en/docs/api#accessing-the-cms-object):

```js
CMS.getFieldType(name);
```

For backward compatibility with Netlify/Decap CMS, the `getWidget` method is available as an alias with the same signature.

The method returns an object with the following properties, or `undefined` if the field type is unavailable:

- `control` (React component): The control component of the field type.
- `preview` (React component): The preview component of the field type, if any.
- `schema` (object): The field schema, if any. Built-in field types don’t provide a schema.

This is mainly useful for building a custom field type on top of an existing one, so you don’t have to reimplement a control from scratch. For example, you can reuse the built-in [Select](https://sveltiacms.app/en/docs/fields/select) control while providing your own dynamically generated options. See the [Dependent Select](#dependent-select) example below.

#### Reusing a Built-In Field Type

Sveltia CMS is built with Svelte rather than React, so built-in field controls and previews are Svelte components. The components returned from `getFieldType` are React wrappers that render those Svelte components for you, which means you can compose them into your own React components as usual.

Only the built-in field types that work outside the entry editor can be reused this way:

`boolean`, `color`, `datetime`, `map`, `number`, `select`, `string`, `text`, `uuid`

For any other built-in field type, such as `list` or `object`, the method returns `undefined` and logs a warning to the browser console, because those editors read from and write to the entry draft directly and can’t be rendered on their own.

The returned components accept the same `value`, `field`, `forID` and `onChange` props as a custom control, with two differences:

- The `field` prop can be an [Immutable Map](https://immutable-js.com/docs/v5/Map/), a plain object, or any object exposing an Immutable Map-like `get` method. A plain object is the simplest way to pass an ad hoc field configuration, while the other shapes let you reuse a control wrapper ported from Netlify/Decap CMS as is.
- The `classNameWrapper` prop is ignored, given that built-in components come with their own styles.

You can also pass the optional `locale`, `keyPath`, `required`, `readonly` and `invalid` props. When they are omitted, they are inherited from the field being edited, so a reused control behaves consistently with the rest of the CMS: it’s marked required, read-only and invalid exactly when your custom field is. This inheritance takes precedence over the ad hoc field configuration, given that the configuration typically describes how to render the input rather than the field itself. For example, a `required: false` option there won’t make a required field optional, which would otherwise let the user select an empty value that the CMS then rejects.

**Compatibility Note**

In Netlify/Decap CMS, the undocumented `getWidget` method returns any built-in or custom widget. In Sveltia CMS, the method is limited to the field types listed above for the reason described. The returned object also omits the Netlify/Decap CMS-specific `globalStyles` and `allowMapValue` properties, which have no equivalent in Sveltia CMS.

### Examples

**With or without JSX**

The following JSX examples assume you have a build step to transpile JSX to JavaScript. If you are not using JSX, see the non-JSX examples below. See [Writing React Components](https://sveltiacms.app/en/docs/api#writing-react-components) for more details.

#### Simple Text Array

A custom field type that converts a comma-separated string to an array and back:

```js [Without JSX]
const ArrayControl = createClass({
  handleChange: function (e) {
    const separator = this.props.field.get('separator', ', ');
    this.props.onChange(e.target.value.split(separator).map((item) => item.trim()));
  },

  render: function () {
    const separator = this.props.field.get('separator', ', ');
    const value = this.props.value;
    return h('input', {
      id: this.props.forID,
      className: this.props.classNameWrapper,
      type: 'text',
      value: value ? value.join(separator) : '',
      onChange: this.handleChange,
    });
  },
});

const ArrayPreview = createClass({
  render: function () {
    const value = this.props.value;
    return h(
      'ul',
      { style: { margin: '0', paddingLeft: '20px' } },
      Array.isArray(value) && value.map((item, index) => h('li', { key: index }, item)),
    );
  },
});

const schema = {
  properties: {
    separator: { type: 'string' },
  },
};

CMS.registerFieldType('array', ArrayControl, ArrayPreview, schema);
```

```jsx [With JSX]
class ArrayControl extends React.Component {
  handleChange = (e) => {
    const separator = this.props.field.get('separator', ', ');
    this.props.onChange(e.target.value.split(separator).map((item) => item.trim()));
  };

  render() {
    const separator = this.props.field.get('separator', ', ');
    const value = this.props.value;

    return (
      <input
        id={this.props.forID}
        className={this.props.classNameWrapper}
        type="text"
        value={value ? value.join(separator) : ''}
        onChange={this.handleChange}
      />
    );
  }
}

class ArrayPreview extends React.Component {
  render() {
    const value = this.props.value;

    return (
      <ul style={{ margin: '0', paddingLeft: '20px' }}>
        {Array.isArray(value) && value.map((item, index) => <li key={index}>{item}</li>)}
      </ul>
    );
  }
}

const schema = {
  properties: {
    separator: { type: 'string' },
  },
};

CMS.registerFieldType('array', ArrayControl, ArrayPreview, schema);
```

#### Color Picker

A custom field type with a color input and preview:

```js [Without JSX]
const ColorControl = createClass({
  render: function () {
    return h('input', {
      id: this.props.forID,
      className: this.props.classNameWrapper,
      type: 'color',
      value: this.props.value || '#000000',
      onChange: (e) => this.props.onChange(e.target.value),
    });
  },
});

const ColorPreview = createClass({
  render: function () {
    return h('div', {
      style: {
        display: 'inline-block',
        width: '30px',
        height: '30px',
        backgroundColor: this.props.value || '#000000',
        border: '1px solid #ddd',
        borderRadius: '4px',
      },
    });
  },
});

CMS.registerFieldType('color', ColorControl, ColorPreview);
```

```jsx [With JSX]
class ColorControl extends React.Component {
  render() {
    return (
      <input
        id={this.props.forID}
        className={this.props.classNameWrapper}
        type="color"
        value={this.props.value || '#000000'}
        onChange={(e) => this.props.onChange(e.target.value)}
      />
    );
  }
}

class ColorPreview extends React.Component {
  render() {
    return (
      <div
        style={{
          display: 'inline-block',
          width: '30px',
          height: '30px',
          backgroundColor: this.props.value || '#000000',
          border: '1px solid #ddd',
          borderRadius: '4px',
        }}
      />
    );
  }
}

CMS.registerFieldType('color', ColorControl, ColorPreview);
```

#### Number with Validation

A field type for numbers with custom validation and constraints:

```js [Without JSX]
const NumberControl = createClass({
  isValid: function (value) {
    const min = this.props.field.get('min');
    const max = this.props.field.get('max');

    if (isNaN(value)) {
      return { error: { message: 'Must be a number' } };
    }

    if (min !== undefined && value < min) {
      return { error: { message: `Value must be at least ${min}` } };
    }

    if (max !== undefined && value > max) {
      return { error: { message: `Value must be no more than ${max}` } };
    }

    return true;
  },

  render: function () {
    const min = this.props.field.get('min');
    const max = this.props.field.get('max');

    return h('input', {
      id: this.props.forID,
      className: this.props.classNameWrapper,
      type: 'number',
      value: this.props.value || '',
      min: min,
      max: max,
      onChange: (e) => this.props.onChange(parseFloat(e.target.value) || null),
    });
  },
});

const NumberPreview = createClass({
  render: function () {
    return h('span', {}, String(this.props.value ?? ''));
  },
});

const schema = {
  properties: {
    min: { type: 'number' },
    max: { type: 'number' },
  },
};

CMS.registerFieldType('number', NumberControl, NumberPreview, schema);
```

```jsx [With JSX]
class NumberControl extends React.Component {
  isValid(value) {
    const min = this.props.field.get('min');
    const max = this.props.field.get('max');

    if (isNaN(value)) {
      return { error: { message: 'Must be a number' } };
    }

    if (min !== undefined && value < min) {
      return { error: { message: `Value must be at least ${min}` } };
    }

    if (max !== undefined && value > max) {
      return { error: { message: `Value must be no more than ${max}` } };
    }

    return true;
  }

  render() {
    const min = this.props.field.get('min');
    const max = this.props.field.get('max');

    return (
      <input
        id={this.props.forID}
        className={this.props.classNameWrapper}
        type="number"
        value={this.props.value || ''}
        min={min}
        max={max}
        onChange={(e) => this.props.onChange(parseFloat(e.target.value) || null)}
      />
    );
  }
}

class NumberPreview extends React.Component {
  render() {
    return <span>{String(this.props.value ?? '')}</span>;
  }
}

const schema = {
  properties: {
    min: { type: 'number' },
    max: { type: 'number' },
  },
};

CMS.registerFieldType('number', NumberControl, NumberPreview, schema);
```

#### JSON Editor

A field type for editing JSON data with validation:

```js [Without JSX]
const JsonControl = createClass({
  isValid: function (value) {
    if (typeof value !== 'string') {
      return true; // Allow null/undefined
    }

    try {
      JSON.parse(value);
      return true;
    } catch (e) {
      return { error: { message: `Invalid JSON: ${e.message}` } };
    }
  },

  render: function () {
    const value = this.props.value;
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value, null, 2);

    return h('textarea', {
      id: this.props.forID,
      className: this.props.classNameWrapper,
      value: stringValue || '',
      onChange: (e) => this.props.onChange(e.target.value),
      style: {
        fontFamily: 'monospace',
        fontSize: '12px',
        minHeight: '200px',
      },
    });
  },
});

const JsonPreview = createClass({
  render: function () {
    const value = this.props.value;

    let parsed;
    try {
      parsed = typeof value === 'string' ? JSON.parse(value) : value;
    } catch (e) {
      return h('div', { style: { color: 'red' } }, 'Invalid JSON');
    }

    return h(
      'pre',
      {
        style: {
          backgroundColor: '#f5f5f5',
          padding: '10px',
          borderRadius: '4px',
          overflow: 'auto',
          maxHeight: '300px',
        },
      },
      JSON.stringify(parsed, null, 2),
    );
  },
});

CMS.registerFieldType('json', JsonControl, JsonPreview);
```

```jsx [With JSX]
class JsonControl extends React.Component {
  isValid(value) {
    if (typeof value !== 'string') {
      return true; // Allow null/undefined
    }

    try {
      JSON.parse(value);
      return true;
    } catch (e) {
      return { error: { message: `Invalid JSON: ${e.message}` } };
    }
  }

  render() {
    const value = this.props.value;
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value, null, 2);

    return (
      <textarea
        id={this.props.forID}
        className={this.props.classNameWrapper}
        value={stringValue || ''}
        onChange={(e) => this.props.onChange(e.target.value)}
        style={{
          fontFamily: 'monospace',
          fontSize: '12px',
          minHeight: '200px',
        }}
      />
    );
  }
}

class JsonPreview extends React.Component {
  render() {
    const value = this.props.value;

    let parsed;
    try {
      parsed = typeof value === 'string' ? JSON.parse(value) : value;
    } catch (e) {
      return <div style={{ color: 'red' }}>Invalid JSON</div>;
    }

    return (
      <pre
        style={{
          backgroundColor: '#f5f5f5',
          padding: '10px',
          borderRadius: '4px',
          overflow: 'auto',
          maxHeight: '300px',
        }}
      >
        {JSON.stringify(parsed, null, 2)}
      </pre>
    );
  }
}

CMS.registerFieldType('json', JsonControl, JsonPreview);
```

#### Image with Metadata

A field type that stores both image path and alt text:

```js [Without JSX]
const ImageMetaControl = createClass({
  handleChange: function (field, value) {
    const current = this.props.value || {};
    this.props.onChange({
      ...current,
      [field]: value,
    });
  },

  render: function () {
    const value = this.props.value || {};

    return h(
      'div',
      { style: { display: 'flex', flexDirection: 'column', gap: '10px' } },
      h(
        'div',
        {},
        h('label', { htmlFor: `${this.props.forID}-image` }, 'Image path:'),
        h('input', {
          id: `${this.props.forID}-image`,
          type: 'text',
          value: value.image || '',
          onChange: (e) => this.handleChange('image', e.target.value),
          style: { width: '100%', padding: '8px' },
        }),
      ),
      h(
        'div',
        {},
        h('label', { htmlFor: `${this.props.forID}-alt` }, 'Alt text:'),
        h('textarea', {
          id: `${this.props.forID}-alt`,
          value: value.alt || '',
          onChange: (e) => this.handleChange('alt', e.target.value),
          style: { width: '100%', padding: '8px', minHeight: '60px' },
        }),
      ),
    );
  },
});

const ImageMetaPreview = createClass({
  render: function () {
    const value = this.props.value || {};

    return h(
      'div',
      {},
      value.image &&
        h('img', { src: value.image, alt: value.alt || '', style: { maxWidth: '200px' } }),
      value.alt && h('p', { style: { fontSize: '12px', color: '#666' } }, `Alt: ${value.alt}`),
    );
  },
});

CMS.registerFieldType('imageMeta', ImageMetaControl, ImageMetaPreview);
```

```jsx [With JSX]
class ImageMetaControl extends React.Component {
  handleChange = (field, value) => {
    const current = this.props.value || {};
    this.props.onChange({
      ...current,
      [field]: value,
    });
  };

  render() {
    const value = this.props.value || {};

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div>
          <label htmlFor={`${this.props.forID}-image`}>Image path:</label>
          <input
            id={`${this.props.forID}-image`}
            type="text"
            value={value.image || ''}
            onChange={(e) => this.handleChange('image', e.target.value)}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div>
          <label htmlFor={`${this.props.forID}-alt`}>Alt text:</label>
          <textarea
            id={`${this.props.forID}-alt`}
            value={value.alt || ''}
            onChange={(e) => this.handleChange('alt', e.target.value)}
            style={{ width: '100%', padding: '8px', minHeight: '60px' }}
          />
        </div>
      </div>
    );
  }
}

class ImageMetaPreview extends React.Component {
  render() {
    const value = this.props.value || {};

    return (
      <div>
        {value.image && (
          <img src={value.image} alt={value.alt || ''} style={{ maxWidth: '200px' }} />
        )}
        {value.alt && <p style={{ fontSize: '12px', color: '#666' }}>Alt: {value.alt}</p>}
      </div>
    );
  }
}

CMS.registerFieldType('imageMeta', ImageMetaControl, ImageMetaPreview);
```

#### Dependent Select

A field type that reuses the built-in [Select](https://sveltiacms.app/en/docs/fields/select) control, with options generated from another field in the same entry. This solves a common need that a static `options` list or a [Relation](https://sveltiacms.app/en/docs/fields/relation) field can’t cover: the choices are defined by the user in the entry they are editing.

Given a collection where a `groups` list field defines named items, and each item of a `content` list field has to reference one of those groups:

```yaml
fields:
  - name: groups
    label: Groups
    widget: list
    fields:
      - name: name
        label: Name
        widget: string
      - name: text
        label: Text
        widget: markdown
  - name: content
    label: Content
    widget: list
    fields:
      - name: group
        label: Referenced Group
        widget: group-select # custom field type name
```

The `group-select` control reads the group names from the `entry` prop and passes them to the built-in Select control as options. Because the `entry` prop is updated whenever any field in the entry is modified, the options reflect the group names as they are typed, with no need to save and reload:

```js [Without JSX]
const SelectControl = CMS.getFieldType('select').control;

const GroupSelectControl = createClass({
  render: function () {
    const groups = this.props.entry.getIn(['data', 'groups']);

    const options = (groups?.toJS() ?? [])
      .filter((group) => !!group.name)
      .map((group) => ({ label: group.name, value: group.name }));

    return h(SelectControl, {
      field: { name: this.props.field.get('name'), options },
      value: this.props.value,
      forID: this.props.forID,
      onChange: this.props.onChange,
    });
  },
});

CMS.registerFieldType('group-select', GroupSelectControl);
```

```jsx [With JSX]
const SelectControl = CMS.getFieldType('select').control;

class GroupSelectControl extends React.Component {
  render() {
    const groups = this.props.entry.getIn(['data', 'groups']);

    const options = (groups?.toJS() ?? [])
      .filter((group) => !!group.name)
      .map((group) => ({ label: group.name, value: group.name }));

    return (
      <SelectControl
        field={{ name: this.props.field.get('name'), options }}
        value={this.props.value}
        forID={this.props.forID}
        onChange={this.props.onChange}
      />
    );
  }
}

CMS.registerFieldType('group-select', GroupSelectControl);
```

**Tip**

The field configuration passed to a built-in control doesn’t have to come from your CMS config, as shown above. Any option supported by the field type can be set, such as [`multiple`](https://sveltiacms.app/en/docs/fields/select#multiple) or [`dropdown_threshold`](https://sveltiacms.app/en/docs/fields/select#dropdown-threshold) for the Select field type.

### Showcase

Real-world examples of custom field types can be found in our [showcase](https://sveltiacms.app/en/showcase?feature=field-types).

Source: https://sveltiacms.app/en/docs/api/field-types
