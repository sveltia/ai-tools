# Editor and Preview Customization

Custom editor components, preview templates and preview styles.

Generated from the Sveltia CMS documentation. Do not edit by hand.

## Custom Editor Components

A custom editor component allows you to create reusable, complex block-level component available in the [rich text editor](https://sveltiacms.app/en/docs/fields/richtext).

By default, registered components appear under the Insert button on the editor toolbar, though they can also be placed directly on the toolbar using the `trigger` option. When clicked, they insert a predefined template into the editor at the current cursor position.

### Overview

To register a custom editor component, use the `registerEditorComponent` method on the [`CMS` object](https://sveltiacms.app/en/docs/api#accessing-the-cms-object):

```js
CMS.registerEditorComponent(definition);
```

The component `definition` object includes the following properties:

#### Required Properties

- `id` (string): A unique identifier for the component. This is the name you will use to reference this component in the `editor_components` option for a [RichText](https://sveltiacms.app/en/docs/fields/richtext) or [Markdown](https://sveltiacms.app/en/docs/fields/markdown) field. It should be unique and not conflict with built-in component IDs (`code-block`, `image`).
- `fields` (array of field definitions): An array defining the [fields](https://sveltiacms.app/en/docs/fields) to be displayed in the component.
- `pattern` (RegExp): A regular expression used to identify existing instances of the component in the Markdown content.
  - It’s recommended to use [named capture groups](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Regular_expressions/Named_capturing_group) corresponding to the field names so that `fromBlock` can be omitted if no additional processing is needed.
  - Matching could be either block (multiline) or inline, depending on the component. To match block content, use the `s` (dotAll) or `m` (multiline) flag, or include `[\s\S]` in the pattern.
- `fromBlock` (function): A function that takes a regex match array and returns an object mapping field names to their values.
  - This property can be omitted if the `pattern` regular expression contains named capture groups corresponding to the field names, and no additional processing like type conversion is needed.
  - Otherwise, this property is required. You must provide a function to extract field values from the regex match.
- `toBlock` (function): A function that takes an object mapping field names to their values and returns a string representing the Markdown content to be inserted.

#### Optional Properties

- `label` (string): The text label displayed on the toolbar button. Defaults to the `id` value.
- `icon` (string): A [Material Symbols](https://fonts.google.com/icons?icon.set=Material+Symbols) icon name to display on the toolbar button.
- `trigger` (string): The trigger UI of the component, either `menuitem` (default) or `button`. A menu item is placed under the Insert menu, while a button is placed directly on the toolbar.
- `toPreview` (function): A function that takes an object mapping field names to their values and returns the preview of the component to be displayed in the editor. It can return a string, a DOM element or a React element. See [Preview Output](#preview-output) below. If omitted, no preview is shown.
- `mode` (string): Editing mode for the component. `block` (default) renders the component within the rich text editor as an expandable field list. `dialog` renders a compact placeholder that opens a dialog when clicked.
- `summary` (string): Template for the placeholder text when `mode` is `dialog`, e.g. `{{title}} - {{videoId}}`. Falls back to the first string field value, then to the component label.
- `collapsed` (boolean): If true, the component's fields panel is collapsed by default when inserted (`block` mode only).

**Breaking change from Netlify/Decap CMS**

Netlify/Decap CMS implements the `getAsset` and `fields` parameters for the `toPreview` function, which can be used to [replace image file paths with blob URLs](https://github.com/decaporg/decap-cms/blob/6effc912e13fe7d7f4c590b69ca8784a4fd5490f/packages/decap-cms-editor-component-image/src/index.js#L15-L19) in the preview. Sveltia CMS does not support these undocumented parameters because it automatically replaces image paths with blob URLs. See the [Image with Caption example](#image-with-caption) for details.

#### Preview Output

The optional `toPreview` function can return any of the following:

- **A string**: Parsed as Markdown and HTML, then sanitized with [DOMPurify](https://github.com/cure53/DOMPurify) unless the field’s [`sanitize_preview`](https://sveltiacms.app/en/docs/fields/richtext#sanitize-preview) option is disabled. Most of the [examples](#examples) below use this.
- **A DOM element**: Inserted as is, which allows you to mount a component built with Svelte, Vue or any other framework. See [Using a Framework Component for Preview](#using-a-framework-component-for-preview).
- **A React element**: Rendered with React as is. See [Using React for Preview](#using-react-for-preview).

“As is” means that neither Markdown parsing nor sanitization is applied, so the value of a nested RichText or Markdown field is displayed verbatim, such as `**bold**`, unless you convert it to HTML yourself. The CMS exposes its own Markdown parser and HTML sanitizer for exactly that purpose — see [Rendering Markdown](https://sveltiacms.app/en/docs/api#rendering-markdown).

The function may also be called with an empty object while the editor is being initialized, so make sure that it works without any field values, as the examples below do by using default values.

**Security Risk**

The `sanitize_preview` option applies to string previews only, so any HTML you write into a DOM element or React element, for example with `innerHTML` or `dangerouslySetInnerHTML`, is rendered as is. This can expose your CMS to [cross-site scripting](https://developer.mozilla.org/en-US/docs/Web/Security/Attacks/XSS) (XSS) attacks if untrusted users have access to the CMS, especially when using [Open Authoring](https://sveltiacms.app/en/docs/workflows/open), because entries can be written by anybody. Insert field values as text, or sanitize them yourself, unless you’re the sole user of your CMS.

### Using Components

Once registered, custom editor components can be used in any [RichText](https://sveltiacms.app/en/docs/fields/richtext) or [Markdown](https://sveltiacms.app/en/docs/fields/markdown) field. By default, all built-in and custom components are included. You can restrict which components are available by adding their `id` to the field’s `editor_components` array in the collection configuration.

For example, to allow only the built-in `image` component and custom `callout` and `youtube` components:

```yaml [YAML]
fields:
  - name: content
    label: Content
    widget: richtext
    editor_components: [image, callout, youtube]
```

```toml [TOML]
[[fields]]
name = "content"
label = "Content"
widget = "richtext"
editor_components = ["image", "callout", "youtube"]
```

```json [JSON]
{
  "fields": [
    {
      "name": "content",
      "label": "Content",
      "widget": "richtext",
      "editor_components": ["image", "callout", "youtube"]
    }
  ]
}
```

```js [JavaScript]
{
  fields: [
    {
      name: "content",
      label: "Content",
      widget: "richtext",
      editor_components: ["image", "callout", "youtube"],
    },
  ],
}
```

### Examples

#### Callout

The following example demonstrates how to register a custom editor component for a “Callout” block:

```js
CMS.registerEditorComponent({
  id: 'callout',
  label: 'Callout',
  icon: 'campaign',
  fields: [
    { name: 'type', label: 'Type', widget: 'select', options: ['info', 'warning', 'error'] },
    { name: 'message', label: 'Message' },
  ],
  pattern: /^:::callout (\w+)\n([\s\S]+?)\n:::/m,
  fromBlock: (match) => ({
    type: match[1],
    message: match[2].trim(),
  }),
  toBlock: (data) => `:::callout ${data.type}\n${data.message}\n:::`,
  toPreview: (data) => `:::callout ${data.type}\n${data.message}\n:::`,
});
```

In this example, the “Callout” component allows users to insert a callout block with a specified type (info, warning, or error) and a message. The `pattern` regular expression is used to identify existing callout blocks in the Markdown content, while the `fromBlock` and `toBlock` functions handle the conversion between the component's data and its Markdown representation.

#### File Link

This example demonstrates how to create a custom editor component for inserting a file link using the built-in [`file` field type](https://sveltiacms.app/en/docs/fields/file):

```js
CMS.registerEditorComponent({
  id: 'file-link',
  label: 'File Link',
  icon: 'attach_file',
  fields: [
    { name: 'file', label: 'File', widget: 'file' },
    { name: 'text', label: 'Text to Display', default: '{{file}}' },
  ],
  pattern: /<a href="([^"]+?)" data-file-link>([^\n]+?)<\/a>/,
  fromBlock: (match) => ({
    file: decodeURI(match[1]),
    text: match[2],
  }),
  toBlock: (data) => `<a href="${data.file}" data-file-link>${data.text}</a>`,
  toPreview: (data) => `<a href="${data.file}" data-file-link>${data.text}</a>`,
});
```

#### Collapsible Note

Here’s an example of a collapsible “Note” component:

```js
CMS.registerEditorComponent({
  id: 'note',
  label: 'Note',
  icon: 'note_alt',
  fields: [
    { name: 'summary', label: 'Summary' },
    { name: 'content', label: 'Content', widget: 'richtext' },
  ],
  pattern: /^<details>\s*<summary>(?<summary>.+?)<\/summary>\s*(?<content>[\s\S]+?)\s*<\/details>/m,
  toBlock: ({ summary, content }) =>
    `<details>\n<summary>${summary}</summary>\n${content}\n</details>`,
  toPreview: ({ summary, content }) =>
    `<details>\n<summary>${summary}</summary>\n<p>${content}</p>\n</details>`,
});
```

In this example, the “Note” component creates a collapsible section using HTML `<details>` and `<summary>` tags. The `fromBlock` function is omitted because the `pattern` regular expression uses named capture groups that correspond to the field names. The `toBlock` function generates the appropriate HTML structure for the note component based on the provided summary and content.

#### Image with Caption

Here’s an example of a custom editor component for inserting an image with a caption using a Hugo shortcode:

```js
CMS.registerEditorComponent({
  id: 'figure',
  label: 'Image with Caption',
  icon: 'photo',
  fields: [
    { name: 'src', label: 'Image', widget: 'image' },
    { name: 'caption', label: 'Caption' },
  ],
  pattern: /{{< image src="(?<src>.*?)" caption="(?<caption>.*?)" >}}/,
  toBlock: ({ src, caption }) => `{{< image src="${src}" caption="${caption}" >}}`,
  toPreview: ({ src, caption }) =>
    `<figure><img src="${src}" alt=""><figcaption>${caption}</figcaption></figure>`,
});
```

The `fromBlock` function is omitted again because the `pattern` regular expression uses named capture groups that correspond to the field names. The `toBlock` function generates a Hugo shortcode for the image with caption, while the `toPreview` function creates an HTML figure element to display the image and its caption in the editor preview.

Note that the `src` attribute will be automatically replaced with a blob URL in the editor preview when an image is selected, while the actual file path will be stored in the Markdown content.

#### Multiple Images with Caption

This example, a variation of the previous one, demonstrates how to create a custom editor component for inserting multiple images with a single caption:

```js
CMS.registerEditorComponent({
  id: 'gallery',
  label: 'Image Gallery',
  icon: 'photo_library',
  fields: [
    { name: 'images', label: 'Images', widget: 'image', multiple: true },
    { name: 'caption', label: 'Caption' },
  ],
  pattern:
    /<figure>(?<images>(?:<img src=".+?" alt="">)*)<figcaption>(?<caption>.*?)<\/figcaption><\/figure>/,
  fromBlock: ({ groups: { images, caption } }) => ({
    images:
      images?.match(/<img src="(.+?)" alt="">/g)?.map((img) => img.match(/src="(.+?)"/)[1]) ?? [],
    caption,
  }),
  toBlock: ({ images, caption }) =>
    `<figure>${
      images?.map((src) => `<img src="${src}" alt="">`).join('') ?? ''
    }<figcaption>${caption}</figcaption></figure>`,
  toPreview: ({ images, caption }) =>
    `<figure>${
      images?.map((src) => `<img src="${src}" alt="">`).join('') ?? ''
    }<figcaption>${caption}</figcaption></figure>`,
});
```

The `fromBlock` function extracts the image sources from the matched HTML and returns them as an array, along with the caption. The `toBlock` and `toPreview` functions, which are identical for demo purposes, generate the appropriate HTML structure for the gallery component based on the provided images and caption.

#### Styled Separator

This is an [Eleventy shortcode](https://www.11ty.dev/docs/shortcodes/) example for a styled separator component:

```js
CMS.registerEditorComponent({
  id: 'separator',
  label: 'Styled Separator',
  icon: 'horizontal_rule',
  fields: [
    {
      name: 'variant',
      label: 'Variant',
      widget: 'select',
      options: [
        { value: 1, label: 'Standard' },
        { value: 2, label: 'Alternate' },
      ],
      default: 1,
    },
  ],
  pattern: /\{\% separator (?<variant>\d+)?\s?\%\}/,
  fromBlock: ({ groups: { variant } }) => ({
    variant: Number(variant),
  }),
  toBlock: ({ variant }) => `\{\% separator ${variant || 1} \%\}`,
  toPreview: ({ variant }) => renderSeparatorSvg(variant),
});
```

We need `fromBlock` here because the `variant` field is a number, and we need to convert the string captured by the regex into a number. The `toPreview` function uses a helper function to render an SVG representation of the separator based on the selected variant.

#### YouTube Embed

```js
CMS.registerEditorComponent({
  id: 'youtube',
  label: 'YouTube',
  icon: 'youtube_activity',
  fields: [
    { name: 'id', label: 'ID' },
    { name: 'width', label: 'Width', widget: 'number', valueType: 'int', default: 560 },
    { name: 'height', label: 'Height', widget: 'number', valueType: 'int', default: 315 },
  ],
  pattern: /{{< youtube id="(?<id>.*?)"(?: width="(?<width>.*?)" height="(?<height>.*?)")? >}}/m,
  fromBlock: ({ groups: { id, width, height } = {} }) => ({
    id,
    width: width ? Number(width) : 560,
    height: height ? Number(height) : 315,
  }),
  toBlock: ({ id, width = 560, height = 315 }) =>
    `{{< youtube id="${id}" width="${width}" height="${height}" >}}`,
  toPreview: ({ id, width = 560, height = 315 }) =>
    id
      ? `<iframe src="https://www.youtube-nocookie.com/embed/${id}"
          width="${width}" height="${height}" allowfullscreen
          allow="autoplay; encrypted-media; picture-in-picture"></iframe>`
      : '',
});
```

In this example, the “YouTube” component allows users to embed YouTube videos using a Hugo shortcode. The `pattern` regular expression captures the video ID, width, and height from the shortcode. The `fromBlock` function processes the captured values, casting width and height to numbers. The `toBlock` function generates the shortcode string, while the `toPreview` function creates an iframe preview of the embedded video.

The `pattern` uses the `m` (multiline) flag to make the component block-level, though it’s not multiline in this case.

#### Inline Link (Dialog Mode)

The `dialog` mode is ideal for inline elements that would be too disruptive to display as a block within the editor. This example creates a custom link shortcode that appears as a compact inline placeholder and opens a dialog when clicked:

```js
CMS.registerEditorComponent({
  id: 'custom-link',
  label: 'Custom Link',
  icon: 'link',
  mode: 'dialog',
  summary: '{{text}} — {{url}}',
  fields: [
    { name: 'text', label: 'Link Text' },
    { name: 'url', label: 'URL' },
  ],
  pattern: /\[link text="(?<text>.*?)" url="(?<url>.*?)"\]/,
  toBlock: ({ text, url }) => `[link text="${text}" url="${url}"]`,
  toPreview: ({ text, url }) => `<a href="${url}">${text}</a>`,
});
```

In this example, the “Custom Link” component renders as a small inline chip in the editor showing the link text and URL. Clicking it opens a dialog where the user can fill in or update the fields. The `summary` template controls what text is shown in the placeholder — here it shows the link text and URL separated by an em dash. When neither the summary nor any string field value is available (e.g. for a freshly inserted component), the component `label` is shown as a fallback.

#### Using React for Preview

You can use React components to create rich, interactive previews for your custom editor components. The `toPreview` function can return a React element instead of a string, allowing you to leverage React's capabilities for rendering complex previews.

You can use either JSX or non-JSX syntax to define the component — see the [Writing React Components](https://sveltiacms.app/en/docs/api#writing-react-components) section for more details.

```js [Without JSX]
CMS.registerEditorComponent({
  id: 'callout',
  label: 'Callout',
  fields: [
    {
      name: 'type',
      label: 'Type',
      widget: 'select',
      options: ['info', 'warning', 'tip'],
      default: 'info',
    },
    { name: 'content', label: 'Content', widget: 'text' },
  ],
  pattern: /\[(?<type>info|warning|tip)\]\s*(?<content>.*)/gs,
  fromBlock: (match) => ({ type: match.groups?.type, content: match.groups?.content }),
  toBlock: ({ type = 'info', content = '' }) => `[${type}] ${content}`,
  toPreview: ({ type = 'info', content = '' }) => {
    const colors = { info: '#0ea5e9', warning: '#f59e0b', tip: '#22c55e' };
    const borderColor = colors[type] ?? colors.info;

    return h(
      'div',
      {
        style: {
          padding: '0.75em 1em',
          borderLeft: `4px solid ${borderColor}`,
          background: '#f8fafc',
          borderRadius: '0 4px 4px 0',
        },
      },
      h('strong', { style: { textTransform: 'capitalize' } }, type),
      h('p', { style: { margin: '0.25em 0 0' } }, content),
    );
  },
});
```

```jsx [With JSX]
CMS.registerEditorComponent({
  id: 'callout',
  label: 'Callout',
  fields: [
    {
      name: 'type',
      label: 'Type',
      widget: 'select',
      options: ['info', 'warning', 'tip'],
      default: 'info',
    },
    { name: 'content', label: 'Content', widget: 'text' },
  ],
  pattern: /\[(?<type>info|warning|tip)\]\s*(?<content>.*)/gs,
  fromBlock: (match) => ({ type: match.groups?.type, content: match.groups?.content }),
  toBlock: ({ type = 'info', content = '' }) => `[${type}] ${content}`,
  toPreview: ({ type = 'info', content = '' }) => {
    const colors = { info: '#0ea5e9', warning: '#f59e0b', tip: '#22c55e' };
    const borderColor = colors[type] ?? colors.info;

    return (
      <div
        style={{
          padding: '0.75em 1em',
          borderLeft: `4px solid ${borderColor}`,
          background: '#f8fafc',
          borderRadius: '0 4px 4px 0',
        }}
      >
        <strong style={{ textTransform: 'capitalize' }}>{type}</strong>
        <p style={{ margin: '0.25em 0 0' }}>{content}</p>
      </div>
    );
  },
});
```

#### Using a Framework Component for Preview

The `toPreview` function can also return a DOM element, which is inserted into the preview as is. This allows you to reuse a component written with Svelte, Vue or any other framework that can be mounted on an element, so the preview matches what your site actually renders.

Because the CMS cannot destroy a component that it didn’t create, it dispatches a custom `Unmount` event on the returned element once the preview is replaced or the entry is closed. Listen for that event to tear down your component and avoid memory leaks.

The following example renders a “Warning” component that wraps some body text. Because the body is a nested [RichText](https://sveltiacms.app/en/docs/fields/richtext) field, its value arrives as a Markdown string, and the element you return is inserted as is — so `**bold**` would show up with the asterisks intact unless you convert it. The example does that with the [globally available](https://sveltiacms.app/en/docs/api#rendering-markdown) `marked` parser and `DOMPurify` sanitizer, then lets the component insert the HTML with Svelte’s `{@html html}` tag or Vue’s `v-html` directive:

```js [Svelte]
import { registerEditorComponent } from '@sveltia/cms';
import { mount, unmount } from 'svelte';
import Warning from '$lib/components/Warning.svelte';

registerEditorComponent({
  id: 'warning',
  label: 'Warning',
  icon: 'warning',
  fields: [{ name: 'body', label: 'Body', widget: 'richtext' }],
  pattern: /<Warning>\s*(?<body>[\s\S]*?)\s*<\/Warning>/,
  toBlock: ({ body = '' }) => `<Warning>\n\n${body}\n\n</Warning>`,
  toPreview: ({ body = '' }) => {
    const element = document.createElement('div');
    const html = DOMPurify.sanitize(marked.parse(body, { breaks: true }));
    const component = mount(Warning, { target: element, props: { html } });

    element.addEventListener('Unmount', () => unmount(component), { once: true });

    return element;
  },
});
```

```js [Vue]
import { registerEditorComponent } from '@sveltia/cms';
import { createApp } from 'vue';
import Warning from './components/Warning.vue';

registerEditorComponent({
  id: 'warning',
  label: 'Warning',
  icon: 'warning',
  fields: [{ name: 'body', label: 'Body', widget: 'richtext' }],
  pattern: /<Warning>\s*(?<body>[\s\S]*?)\s*<\/Warning>/,
  toBlock: ({ body = '' }) => `<Warning>\n\n${body}\n\n</Warning>`,
  toPreview: ({ body = '' }) => {
    const element = document.createElement('div');
    const html = DOMPurify.sanitize(marked.parse(body, { breaks: true }));
    const app = createApp(Warning, { html });

    app.mount(element);
    element.addEventListener('Unmount', () => app.unmount(), { once: true });

    return element;
  },
});
```

```svelte [Svelte]
<script>
  let { html } = $props();
</script>

<div class="bg-red-100">
  {@html html}
</div>
```

```vue [Vue]
<script setup>
defineProps(['html']);
</script>

<template>
  <div class="bg-red-100" v-html="html"></div>
</template>
```

Note that this approach requires a build step, so the CMS has to be [installed as an npm package](https://sveltiacms.app/en/docs/api#using-the-npm-package) and imported into your admin page, rather than loaded from a CDN.

`marked` and `DOMPurify` are always on the `window` object, so there’s no need to install either library yourself. Sanitizing is not optional here: as noted in [Preview Output](#preview-output) above, the `sanitize_preview` option applies to string previews only, and Markdown allows raw HTML.

Any image in the nested value keeps working, too. The CMS replaces internal image paths with blob URLs anywhere in the preview, including inside an element you return.

### Showcase

Real-world examples of editor components can be found in our [showcase](https://sveltiacms.app/en/showcase?feature=editor-components).

Source: https://sveltiacms.app/en/docs/api/editor-components

---

## Custom Preview Templates

A custom preview template allows you to define how content entries are displayed in the CMS preview pane. By registering a custom preview template, you can create a more tailored and user-friendly editing experience for content editors.

**Compatibility Note**

Because there is little [Netlify/Decap CMS documentation](https://decapcms.org/docs/customization/#registerpreviewtemplate) on this topic, Sveltia CMS may not be fully compatible with existing preview templates. Our implementation does not include any undocumented component props. Additionally, we haven’t verified that all of the examples below work with Sveltia CMS. If you encounter any issues, please [report them to us](https://github.com/sveltia/sveltia-cms/issues).

### Overview

To register a custom preview template, use the `registerPreviewTemplate` method on the [`CMS` object](https://sveltiacms.app/en/docs/api#accessing-the-cms-object):

```js
CMS.registerPreviewTemplate(name, component);
```

#### Parameters

- `name` (string, required): The name of the [collection](https://sveltiacms.app/en/docs/collections) or [collection file](https://sveltiacms.app/en/docs/collections/files) for which the preview template is being registered.
- `component` (React component, required): A React **class component** that defines the preview template. This component receives the entry data as props and should render the preview accordingly. You can use either JSX or non-JSX syntax to define the component — see the [Writing React Components](https://sveltiacms.app/en/docs/api#writing-react-components) section for more details.

### Component Props

The component you register receives the following props during render:

- `entry` ([Immutable Map](https://immutable-js.com/docs/v5/Map/)): Contains the entry data with the following structure:
  ```js
  {
    data: { ... },      // Default locale data
    i18n: {             // Non-default locale data (if i18n is enabled)
      [locale]: {
        data: { ... }
      }
    },
    slug,               // Entry slug
    path,               // Entry file path
    newRecord,          // Boolean indicating if it's a new entry
    collection,         // Collection name
    mediaFiles,         // Array of media files associated with the entry
  }
  ```
- `widgetFor` (function): Returns a React element rendering a Svelte field preview for a given field key path. Useful for rendering individual field previews.
- `widgetsFor` (function): Returns widget data for a given field name. For list fields, returns an array of objects; for object fields, returns a single object; for primitive fields, returns the raw value. Each object has:
  ```js
  {
    data: { ... },              // Raw field values
    widgets: { ... }            // React preview elements keyed by field name
  }
  ```
- `getAsset` (function): Returns the asset item for a given path. Returns `undefined` if not found. Automatically resolves image paths to blob URLs for preview purposes.
- `getCollection` (function): Async function that returns entries from a specified collection. Takes parameters:
  - `collectionName` (string): Name of the collection to query
  - `slug` (string, optional): Entry slug to fetch a specific entry; if omitted, returns all entries
- `fieldsMetaData` (Immutable Map): Metadata for each field keyed by field name. Useful for accessing related entry data from relation fields.
- `document` (Document): The preview pane iframe's Document object. Use this instead of the global `document` to manipulate the preview DOM.
- `window` (Window): The preview pane iframe's Window object. Use this instead of the global `window` to access the preview window context.

### Working with Immutable Data

The `entry` and `fieldsMetaData` props are [Immutable Map](https://immutable-js.com/docs/v5/Map/) objects. Use their methods to safely access nested data:

- `entry.getIn(['data', 'fieldName'])` — Access field values
- `entry.get('i18n')` — Access internationalization data
- `.toJS()` — Convert to a plain JavaScript object

For more information on working with Immutable data structures, see the [Immutable.js documentation](https://immutable-js.com/docs/v5/Map/).

### Examples

**With or without JSX**

The following JSX examples assume you have a build step to transpile JSX to JavaScript. If you are not using JSX, see the non-JSX examples below. See [Writing React Components](https://sveltiacms.app/en/docs/api#writing-react-components) for more details.

#### Basic Entry Preview

Display a simple blog post preview with a title and featured image:

```js [Without JSX]
const PostPreview = createClass({
  render: function () {
    const { entry, widgetFor, getAsset } = this.props;
    const image = entry.getIn(['data', 'image']);
    const imageAsset = image ? getAsset(image) : null;

    return h(
      'div',
      { style: { padding: '20px', fontFamily: 'sans-serif' } },
      h('h1', {}, entry.getIn(['data', 'title'])),
      imageAsset &&
        h('img', {
          src: imageAsset.url,
          alt: 'Featured',
          style: { maxWidth: '100%', height: 'auto' },
        }),
      h('div', { style: { marginTop: '20px' } }, widgetFor('body')),
    );
  },
});

CMS.registerPreviewTemplate('posts', PostPreview);
```

```jsx [With JSX]
export default class PostPreview extends React.Component {
  render() {
    const { entry, widgetFor, getAsset } = this.props;
    const image = entry.getIn(['data', 'image']);
    const imageAsset = image ? getAsset(image) : null;

    return (
      <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
        <h1>{entry.getIn(['data', 'title'])}</h1>
        {imageAsset && (
          <img src={imageAsset.url} alt="Featured" style={{ maxWidth: '100%', height: 'auto' }} />
        )}
        <div style={{ marginTop: '20px' }}>{widgetFor('body')}</div>
      </div>
    );
  }
}

CMS.registerPreviewTemplate('posts', PostPreview);
```

#### List Fields

Preview a collection entry with a list of authors:

```js [Without JSX]
const AuthorsPreview = createClass({
  render: function () {
    const { widgetsFor } = this.props;
    const authors = widgetsFor('authors');

    return h(
      'div',
      { style: { padding: '20px' } },
      h('h2', {}, 'Authors'),
      Array.isArray(authors) &&
        authors.map(function (author, index) {
          return h(
            'div',
            { key: index, style: { marginBottom: '20px', borderBottom: '1px solid #eee' } },
            h('strong', {}, author.getIn(['data', 'name'])),
            h('p', {}, author.getIn(['data', 'description'])),
            author.getIn(['widgets', 'description']),
          );
        }),
    );
  },
});

CMS.registerPreviewTemplate('team', AuthorsPreview);
```

```jsx [With JSX]
export default class AuthorsPreview extends React.Component {
  render() {
    const { widgetsFor } = this.props;
    const authors = widgetsFor('authors');

    return (
      <div style={{ padding: '20px' }}>
        <h2>Authors</h2>
        {Array.isArray(authors) &&
          authors.map((author, index) => (
            <div key={index} style={{ marginBottom: '20px', borderBottom: '1px solid #eee' }}>
              <strong>{author.getIn(['data', 'name'])}</strong>
              <p>{author.getIn(['data', 'description'])}</p>
              {author.getIn(['widgets', 'description'])}
            </div>
          ))}
      </div>
    );
  }
}

CMS.registerPreviewTemplate('team', AuthorsPreview);
```

#### Object Fields

Preview settings stored as an object structure:

```js [Without JSX]
const SiteSettingsPreview = createClass({
  render: function () {
    const { entry, widgetsFor } = this.props;
    const settings = widgetsFor('site_config');

    return h(
      'div',
      { style: { padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '4px' } },
      h('h2', {}, entry.getIn(['data', 'title'])),
      h(
        'dl',
        {},
        h('dt', {}, 'Posts per page:'),
        h('dd', {}, settings.getIn(['data', 'posts_per_page'])),

        h('dt', {}, 'Site tagline:'),
        h('dd', {}, settings.getIn(['data', 'tagline'])),

        h('dt', {}, 'Enable comments:'),
        h('dd', {}, settings.getIn(['data', 'enable_comments']) ? 'Yes' : 'No'),
      ),
    );
  },
});

CMS.registerPreviewTemplate('settings', SiteSettingsPreview);
```

```jsx [With JSX]
export default class SiteSettingsPreview extends React.Component {
  render() {
    const { entry, widgetsFor } = this.props;
    const settings = widgetsFor('site_config');

    return (
      <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
        <h2>{entry.getIn(['data', 'title'])}</h2>
        <dl>
          <dt>Posts per page:</dt>
          <dd>{settings.getIn(['data', 'posts_per_page'])}</dd>

          <dt>Site tagline:</dt>
          <dd>{settings.getIn(['data', 'tagline'])}</dd>

          <dt>Enable comments:</dt>
          <dd>{settings.getIn(['data', 'enable_comments']) ? 'Yes' : 'No'}</dd>
        </dl>
      </div>
    );
  }
}

CMS.registerPreviewTemplate('settings', SiteSettingsPreview);
```

#### Accessing Metadata & Relations

Display entry data with related entries fetched via `fieldsMetaData`:

```js [Without JSX]
const ArticlePreview = createClass({
  render: function () {
    const { entry, fieldsMetaData, widgetFor } = this.props;
    const authorSlug = entry.getIn(['data', 'author']);
    const authorData = fieldsMetaData.getIn(['author', 'authors', authorSlug]).toJS();

    return h(
      'article',
      { style: { padding: '20px', maxWidth: '600px' } },
      h('h1', {}, entry.getIn(['data', 'title'])),

      authorData &&
        h(
          'div',
          { style: { marginBottom: '20px', fontStyle: 'italic', color: '#666' } },
          'By ',
          h('strong', {}, authorData.name),
        ),

      h('div', { style: { marginTop: '20px' } }, widgetFor('content')),

      h(
        'footer',
        { style: { marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #eee' } },
        h('small', {}, `Published: ${entry.getIn(['data', 'date'])}`),
      ),
    );
  },
});

CMS.registerPreviewTemplate('posts', ArticlePreview);
```

```jsx [With JSX]
export default class ArticlePreview extends React.Component {
  render() {
    const { entry, fieldsMetaData, widgetFor } = this.props;
    const authorSlug = entry.getIn(['data', 'author']);
    const authorData = fieldsMetaData.getIn(['author', 'authors', authorSlug]).toJS();

    return (
      <article style={{ padding: '20px', maxWidth: '600px' }}>
        <h1>{entry.getIn(['data', 'title'])}</h1>

        {authorData && (
          <div style={{ marginBottom: '20px', fontStyle: 'italic', color: '#666' }}>
            By <strong>{authorData.name}</strong>
          </div>
        )}

        <div style={{ marginTop: '20px' }}>{widgetFor('content')}</div>

        <footer style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
          <small>Published: {entry.getIn(['data', 'date'])}</small>
        </footer>
      </article>
    );
  }
}

CMS.registerPreviewTemplate('posts', ArticlePreview);
```

#### Using `getAsset`

Display multiple images from a gallery field with proper asset resolution:

```js [Without JSX]
const GalleryPreview = createClass({
  render: function () {
    const { entry, getAsset } = this.props;
    const images = entry.getIn(['data', 'gallery']) ?? [];

    return h(
      'div',
      { style: { padding: '20px' } },
      h('h2', {}, 'Image Gallery'),
      h(
        'div',
        { style: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' } },
        images.map(function (imagePath, index) {
          const asset = getAsset(imagePath);
          return asset
            ? h('img', {
                key: index,
                src: asset.url,
                alt: `Gallery image ${index + 1}`,
                style: { width: '100%', height: 'auto', borderRadius: '4px' },
              })
            : null;
        }),
      ),
    );
  },
});

CMS.registerPreviewTemplate('portfolio', GalleryPreview);
```

```jsx [With JSX]
export default class GalleryPreview extends React.Component {
  render() {
    const { entry, getAsset } = this.props;
    const images = entry.getIn(['data', 'gallery']) ?? [];

    return (
      <div style={{ padding: '20px' }}>
        <h2>Image Gallery</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          {images.map((imagePath, index) => {
            const asset = getAsset(imagePath);
            return asset ? (
              <img
                key={index}
                src={asset.url}
                alt={`Gallery image ${index + 1}`}
                style={{ width: '100%', height: 'auto', borderRadius: '4px' }}
              />
            ) : null;
          })}
        </div>
      </div>
    );
  }
}

CMS.registerPreviewTemplate('portfolio', GalleryPreview);
```

#### Using `getCollection`

Display related entries from another collection:

```js [Without JSX]
const ProductPreview = createClass({
  getInitialState: function () {
    return { relatedProducts: [] };
  },

  componentDidMount: function () {
    const { getCollection } = this.props;
    const relatedSlugs = this.props.entry.getIn(['data', 'related_products']) ?? [];

    getCollection('products').then((products) => {
      const related = products.filter(function (product) {
        const slug = product.get('slug');
        return relatedSlugs.includes(slug);
      });
      this.setState({ relatedProducts: related });
    });
  },

  render: function () {
    const { entry } = this.props;
    const { relatedProducts } = this.state;

    return h(
      'div',
      { style: { padding: '20px' } },
      h('h1', {}, entry.getIn(['data', 'title'])),
      h('p', {}, entry.getIn(['data', 'description'])),

      relatedProducts.length > 0 &&
        h(
          'div',
          { style: { marginTop: '30px', borderTop: '1px solid #ddd', paddingTop: '20px' } },
          h('h3', {}, 'Related Products'),
          h(
            'ul',
            {},
            relatedProducts.map(function (product, index) {
              return h('li', { key: index }, product.getIn(['data', 'title']));
            }),
          ),
        ),
    );
  },
});

CMS.registerPreviewTemplate('products', ProductPreview);
```

```jsx [With JSX]
export default class ProductPreview extends React.Component {
  constructor(props) {
    super(props);
    this.state = { relatedProducts: [] };
  }

  componentDidMount() {
    const { getCollection } = this.props;
    const relatedSlugs = this.props.entry.getIn(['data', 'related_products']) ?? [];

    // Fetch all products and filter for related ones
    getCollection('products').then((products) => {
      const related = products.filter((product) => {
        const slug = product.get('slug');
        return relatedSlugs.includes(slug);
      });
      this.setState({ relatedProducts: related });
    });
  }

  render() {
    const { entry } = this.props;
    const { relatedProducts } = this.state;

    return (
      <div style={{ padding: '20px' }}>
        <h1>{entry.getIn(['data', 'title'])}</h1>
        <p>{entry.getIn(['data', 'description'])}</p>

        {relatedProducts.length > 0 && (
          <div style={{ marginTop: '30px', borderTop: '1px solid #ddd', paddingTop: '20px' }}>
            <h3>Related Products</h3>
            <ul>
              {relatedProducts.map((product, index) => (
                <li key={index}>{product.getIn(['data', 'title'])}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }
}

CMS.registerPreviewTemplate('products', ProductPreview);
```

### Showcase

Real-world examples of custom preview templates can be found in our [showcase](https://sveltiacms.app/en/showcase?feature=preview-templates).

Source: https://sveltiacms.app/en/docs/api/preview-templates

---

## Custom Preview Styles

Sveltia CMS comes with built-in preview styles for the admin interface. However, you can also register your own custom preview styles to customize the appearance of the admin interface according to your needs.

### Overview

To register a custom preview style, use the `registerPreviewStyle` method on the [`CMS` object](https://sveltiacms.app/en/docs/api#accessing-the-cms-object):

```js
CMS.registerPreviewStyle(filePath);
```

```js
CMS.registerPreviewStyle(cssString, { raw: true });
```

There are two ways to register custom preview styles in Sveltia CMS: by providing a file path to a CSS file or by providing a raw CSS string. If you provide a raw CSS string, you need to set the `raw` option to `true`.

#### Parameters

- `filePath` (string): The path to the CSS file containing the custom styles. This file should be accessible from the CMS admin interface. It can be a relative path or an absolute URL.
- `cssString` (string): A string containing the raw CSS styles to be applied to the admin interface.
- `options` (object, optional): An options object that can contain the following property:
  - `raw` (boolean): Set this to `true` if you are providing a raw CSS string. Defaults to `false`.

### Examples

#### Registering a Preview Style from a File

To register a preview style from a CSS file, simply provide the file path as an argument to the `registerPreviewStyle` function.

```js
CMS.registerPreviewStyle('/path/to/your/custom-style.css');
```

#### Registering a Preview Style from a Raw CSS String

You can also register a preview style by providing a raw CSS string. Make sure to set the `raw` option to `true` in the options object.

```js [JavaScript]
const customCSS = `
  body {
    background-color: lightgoldenrodyellow;
  }
`;

CMS.registerPreviewStyle(customCSS, { raw: true });
```

#### Registering Multiple Preview Styles

You can register multiple preview styles by calling the `registerPreviewStyle` function multiple times. The styles will be applied in the order they were registered.

```js
CMS.registerPreviewStyle('/path/to/first-style.css');
CMS.registerPreviewStyle('/path/to/second-style.css');
```

This allows you to layer styles and create complex customizations for the Sveltia CMS admin interface.

### Showcase

Real-world examples of custom preview styles can be found in our [showcase](https://sveltiacms.app/en/showcase?feature=preview-styles).

Source: https://sveltiacms.app/en/docs/api/preview-styles

---

## Customization

Sveltia CMS offers various customization options to tailor the admin interface and functionality to your specific needs. This guide provides an overview of the available customization features in Sveltia CMS.

### Site URL

The `site_url` configuration option allows you to specify the base URL of your Sveltia CMS installation. This is useful for generating absolute URLs for assets, links, and redirects within the admin interface.

```yaml [YAML]
site_url: https://example.com
```

```toml [TOML]
site_url = "https://example.com"
```

```json [JSON]
{
  "site_url": "https://example.com"
}
```

```js [JavaScript]
{
  site_url: 'https://example.com',
}
```

### Logout Redirect URL

The `logout_redirect_url` configuration option allows you to specify a custom URL to which users will be redirected after they log out of the Sveltia CMS admin interface. This can be useful for directing users back to your main website or a specific landing page.

```yaml [YAML]
logout_redirect_url: https://example.com/logged-out
```

```toml [TOML]
logout_redirect_url = "https://example.com/logged-out"
```

```json [JSON]
{
  "logout_redirect_url": "https://example.com/logged-out"
}
```

```js [JavaScript]
{
  logout_redirect_url: 'https://example.com/logged-out',
}
```

### Custom Logo

You can customize the logo displayed in the Sveltia CMS admin interface by specifying a custom logo URL in the configuration file. This allows you to replace the default Sveltia CMS logo with your own branding.

The `logo` configuration option, defined at the root level of the configuration file, accepts an object with the following properties:

- `src`: The URL or path to the custom logo image. (Required)
- `show_in_header`: A boolean indicating whether to display the logo in the header. (Optional, default: `true`)

Configuration example:

```yaml [YAML]
logo:
  src: /path/to/your/logo.png
  show_in_header: true
```

```toml [TOML]
[logo]
src = "/path/to/your/logo.png"
show_in_header = true
```

```json [JSON]
{
  "logo": {
    "src": "/path/to/your/logo.png",
    "show_in_header": true
  }
}
```

```js [JavaScript]
{
  logo: {
    src: '/path/to/your/logo.png',
    show_in_header: true,
  },
}
```

For backward compatibility, the `logo_url` configuration option is still supported but deprecated. It is recommended to use the `logo` object for better flexibility and future-proofing.

```yaml [YAML]
logo_url: /path/to/your/logo.png
```

```toml [TOML]
logo_url = "/path/to/your/logo.png"
```

```json [JSON]
{
  "logo_url": "/path/to/your/logo.png"
}
```

```js [JavaScript]
{
  logo_url: '/path/to/your/logo.png',
}
```

#### Where the Logo Appears

- Login page
- Header of the admin interface (when `show_in_header` is set to `true`)
- Browser tab (favicon)
- Application icon when [installed as an app](https://sveltiacms.app/en/docs/ui#installing-as-an-app) on desktop and mobile devices

#### Logo Image Requirements

- Both raster (PNG, WebP, JPEG) and vector (SVG) formats are supported
- A square image works best
- The recommended size is 512 × 512 pixels, but the logo will be scaled down to fit the interface
- It is recommended to use a transparent background for better visual integration with the interface, especially for dark mode users

### Custom Application Title

With the `app_title` configuration option, you can set a custom title for the Sveltia CMS admin interface. This title will be displayed on the login page and in the browser tab. You may want to replace the default “Sveltia CMS” title with your company name or a specific title that reflects the purpose of the admin interface.

```yaml [YAML]
app_title: Acme Inc. Site Admin
```

```toml [TOML]
app_title = "Acme Inc. Site Admin"
```

```json [JSON]
{
  "app_title": "Acme Inc. Site Admin"
}
```

```js [JavaScript]
{
  app_title: 'Acme Inc. Site Admin',
}
```

Note that this is not a white-label solution, so the name of Sveltia CMS will remain visible in some places. When a custom title is set, a small ”Powered by Sveltia CMS” label will appear in the footer of the login page.

### Custom Mount Element

Sveltia CMS mounts the admin interface to the `<body>` element by default. However, you can specify a custom mount element by adding a `<div>` with a specific ID in your HTML. This way, you can embed the CMS admin interface within a specific section of your webpage, allowing to have a navigation bar or other content alongside the CMS.

The ID of the custom mount element is `nc-root`.

```html
<div id="nc-root"></div>
```

Make sure to properly style the custom mount element to ensure the CMS interface displays correctly within your layout. You may need to set dimensions, overflow properties, or other CSS styles depending on your design requirements. Otherwise, the admin interface may not render as expected.

Sveltia CMS will automatically detect the presence of the `nc-root` element and mount the admin interface there instead of the default `<body>` element.

**Tip**

`nc-root` is short for “Netlify CMS Root,” a naming convention carried over from Netlify/Decap CMS to maintain familiarity for users transitioning between the two systems.

### JavaScript API

Sveltia CMS offers a comprehensive API that enables developers to extend and customize its features. You can register custom field types, preview templates, editor components, and more to enhance the content management experience.

For detailed information on how to use the API, please refer to the [JavaScript API guide](https://sveltiacms.app/en/docs/api).

### Modifying Source Code

Sveltia CMS is an open source project licensed under the [MIT License](https://choosealicense.com/licenses/mit/), and its source code is available on [GitHub](https://github.com/sveltia/sveltia-cms). Advanced users and developers can fork the repository and modify the source code to implement custom features or changes that are not available through the standard customization options.

However, please note that our source code is under active development with significant refactoring and improvements happening regularly. We also plan to reevaluate the UI framework, currently [Svelte](https://svelte.dev/), at some point. Direct modifications to the source code may lead to compatibility issues with future updates.

Source: https://sveltiacms.app/en/docs/customization
