# Field Types: Rich Text and Code

The RichText/Markdown and Code field types. For custom editor components, see `api-customization.md`.

Generated from the Sveltia CMS documentation. Do not edit by hand.

## RichText Field

The RichText field type provides a rich text editor that supports Markdown content. It allows content editors to format text, add links, images, and other media, making it a versatile choice for creating rich content.

<!-- The RichText field type provides a rich text editor that supports both Markdown and HTML content. It allows content editors to format text, add links, images, and other media, making it a versatile choice for creating rich content. -->

**Note for Netlify/Decap CMS users**

For backward compatibility with Netlify/Decap CMS, the [Markdown](https://sveltiacms.app/en/docs/fields/markdown) field type remains available as an alias of the RichText field type. You can use either `richtext` or `markdown` as the `widget` value in your field configuration.

### User Interface

#### Editor

A [Lexical](https://lexical.dev/)-based rich text editor, including headings, lists, links, images, code blocks, and more. It provides a user-friendly interface for writing and formatting content.

The built-in toolbar includes buttons for common formatting options, which can be customized using the `buttons` option. The editor also supports different modes, including a raw Markdown editing mode, which can be configured using the `modes` option. Additional editor components can be added to enhance the editing experience using the `editor_components` option.

Local/remote images can be pasted or dropped into the editor to insert them. Note: pasting multiple images is [not supported in Firefox](https://bugzilla.mozilla.org/show_bug.cgi?id=864052).

Emoji autocomplete is enabled by default. Typing a colon followed by one or more characters, such as `:smi`, brings up a list of matching emojis, the same way it works on GitHub, Slack and other apps. Use the arrow keys to move through the list, the Enter or Tab key to insert the selected emoji, and the Escape key to dismiss the list. This can be turned off with the `use_emoji_autocomplete` option.

**Breaking change from Netlify/Decap CMS**

Remark plugins are not supported because Sveltia CMS uses the Lexical framework instead of Slate. The `CMS.registerRemarkPlugin` API method is a noop in Sveltia CMS.

#### Preview

A read-only view of the rich text content, rendered as HTML.

### Data Type

A Markdown string. See the [Data Output](https://sveltiacms.app/en/docs/data-output#markdown-syntax) documentation for details on the Markdown syntax used by Lexical.

<!-- If the `format` option is set to `markdown`, the value will be a Markdown string. If it is set to `html`, the value will be an HTML string. -->

If the `required` option is set to `false` and the field is left empty, the value will be an empty string.

<!-- When using the Markdown format, you need to parse the Markdown string using a Markdown parser in your framework to convert it to HTML for rendering on your website. Some frameworks have built-in support for Markdown, while others may require additional libraries. Please refer to your framework’s documentation on how to handle Markdown content. See also the [how-to](https://sveltiacms.app/en/docs/how-tos#rendering-soft-line-breaks-as-hard-line-breaks-in-markdown) for advice on handling line breaks in Markdown. -->

You need to parse the Markdown string using a Markdown parser in your framework to convert it to HTML for rendering on your website. Some frameworks have built-in support for Markdown, while others may require additional libraries. Please refer to your framework’s documentation on how to handle Markdown content. See also the [how-to](https://sveltiacms.app/en/docs/how-tos#rendering-soft-line-breaks-as-hard-line-breaks-in-markdown) for advice on handling line breaks in Markdown.

**Future Plans**

We plan to add support for HTML output in future releases. It will provide additional features specific to HTML content, including text alignment, link targets, and more.

### Data Validation

- If the `required` option is set to `true`, the rich text content must not be an empty string.
- If the `pattern` option is provided, the rich text content must match the specified regular expression pattern.

### Options

In addition to the [common field options](https://sveltiacms.app/en/docs/fields#common-options), the Markdown field supports the following options:

#### Required Options

##### `widget`

- **Type**: `string`
- **Default**: `string`

Must be set to `richtext`.

#### Optional Options

**Breaking changes from Netlify/Decap CMS**

Sveltia CMS has changed the default value of the `sanitize_preview` option to `true` for improved security. In Netlify/Decap CMS, the default is `false`, which may expose users to XSS vulnerabilities.

Also, Sveltia CMS does not support the deprecated camelCase `editorComponents` option. Use `editor_components` instead.

<!--
##### `format`

- **Type**: `string`
- **Default**: `markdown`

Specifies the data format of the content. Possible values are `markdown` and `html`.
-->

##### `default`

- **Type**: `string`
- **Default**: `""`

The default content for the field. The format should match the selected `format` option.

##### `minimal`

- **Type**: `boolean`
- **Default**: `false`

Whether to limit the editor height. When set to `true`, the editor height is reduced and a scrollbar appears when the content exceeds the height.

##### `modes`

- **Type**: `array`
- **Default**: `[rich_text, raw]`

The modes available in the editor. Possible values are `rich_text` and `raw`. The `raw` mode allows users to edit the raw Markdown text.

<!-- The modes available in the editor. Possible values are `rich_text` and `raw`. The `raw` mode allows users to edit the raw Markdown or HTML text. -->

The following configurations are possible:

- Default modes: `[rich_text, raw]`
- Turn on raw mode by default: `[raw, rich_text]`
- Rich text only: `[rich_text]`
- Raw mode only: `[raw]`

If multiple modes are enabled, users can switch between them using a mode selector in the editor toolbar.

##### `buttons`

- **Type**: `array`
- **Default**: all available buttons (see below)

The button names to display in the editor toolbar.

The following `buttons` are available in the rich text editor toolbar:

- Inline formatting: `bold`, `italic`, `strikethrough`, `code`, `link`
- Block types: `heading-one`, `heading-two`, `heading-three`, `heading-four`, `heading-five`, `heading-six`, `bulleted-list`, `numbered-list`, `quote`

By default, all buttons are enabled. You can customize the toolbar by specifying the desired buttons in the `buttons` option.

**Note for Netlify/Decap CMS users**

Unlike Netlify/Decap CMS, all the block type buttons are available under the block type selector in Sveltia CMS. Users can select the block type from a dropdown menu rather than having separate buttons for each block type.

**Future Plans**

These buttons are disabled when `raw` mode is active. This behavior may be changed in future releases to allow certain buttons to function in `raw` mode as well.

##### `editor_components`

- **Type**: `array`
- **Default**: `[code-block, image]`

The editor component names to include in the rich text editor.

Editor components are custom blocks that can be inserted into the content. Sveltia CMS includes built-in components and also allows for custom components.

Sveltia CMS includes the following built-in editor components for the RichText field:

- `code-block`: Allows users to insert and format code blocks with syntax highlighting.
- `image`: Enables users to add images to their content, with support for uploading and selecting images from the media storage. The image can be linked or unlinked based on the `linked_images` option.

Both are enabled by default. You can disable them by omitting them from the `editor_components` option.

**Note for Netlify/Decap CMS users**

Unlike Netlify/Decap CMS, the `code-block` component in Sveltia CMS is implemented as a block type. Users can insert it using the block type selector rather than the insert button. Also, the `image` component is displayed as a separate button in the toolbar for easier access.

**Future Plans**

More built-in editor components may be added in future releases, such as `table`.

Developers can create [custom editor components](https://sveltiacms.app/en/docs/api/editor-components) to extend the functionality of the rich text editor. Custom components can be registered globally in Sveltia CMS.

##### `allow_nested_components`

- **Type**: `boolean | 'exclude_self'`
- **Default**: `true`

Whether to allow nested rich text editor components within editor components.

- `true` (default): Allows all nested components, including nesting a component inside itself
- `false`: Disables all nested components
- `'exclude_self'`: Allows nested components but excludes the parent component itself. For example, if you have a “Note” component with a rich text field, you can insert other components inside it, but not another “Note” component. This prevents potential issues with regex pattern matching when a component is nested inside itself.

**Regex Matching Considerations**

When nesting a component inside itself (enabled with `allow_nested_components: true`), ensure your component’s regex `pattern` can correctly handle nested instances. Simple patterns may incorrectly match the opening tag of the parent with the closing tag of the nested child.

##### `linked_images`

- **Type**: `boolean`
- **Default**: `true`

Whether to allow linking images in the editor. When set to `true`, users can add links to images. When set to `false`, images will be inserted without links.

##### `use_emoji_autocomplete`

- **Type**: `boolean`
- **Default**: `true`

Whether to enable emoji autocomplete in the editor. When set to `true`, typing a colon followed by one or more characters, such as `:smi`, brings up a list of matching emojis that can be inserted into the content. The colon must be at the beginning of a line or preceded by a space or an opening bracket, so a colon in the middle of a word, as in `12:34`, does not trigger the suggestions. This works in both the rich text and raw Markdown editing modes.

##### `use_markdown_shortcuts`

- **Type**: `boolean`
- **Default**: `true`

Whether to enable Markdown shortcuts while typing in the editor. When set to `true`, typing `-` or `*` at the start of a line creates a bulleted list, `1.` creates a numbered list, `>` creates a blockquote, and `#`, `##`, `###` create headings. Standard keyboard shortcuts such as `Ctrl/Cmd+B` for bold and `Ctrl/Cmd+I` for italic are still enabled even when this option is `false`.

##### `sanitize_preview`

- **Type**: `boolean`
- **Default**: `true`

Whether to sanitize the preview content to prevent [cross-site scripting](https://developer.mozilla.org/en-US/docs/Web/Security/Attacks/XSS) (XSS) attacks. The sanitization process uses [DOMPurify](https://github.com/cure53/DOMPurify) to remove potentially harmful HTML tags and attributes from the content before rendering the preview.

**Security Risk**

Setting the `sanitize_preview` option to `false` can expose your CMS to XSS vulnerabilities if untrusted users have access to the CMS, especially when using [Open Authoring](https://sveltiacms.app/en/docs/workflows/open). Malicious users could inject harmful scripts into the content, which would then be executed in the browsers of anyone viewing the preview.

We recommend keeping this option enabled unless disabling it fixes a broken preview and you fully trust all users of your CMS or you’re the sole user.

### Global Field Defaults

You can define default options for all RichText fields globally using the `field_defaults.richtext` option at the root of your CMS configuration. This allows you to set common configurations for all RichText fields in your CMS without having to specify them in each field definition.

The following options can be defined globally:

- `default`
- `minimal`
- `modes`
- `buttons`
- `editor_components`
- `allow_nested_components`
- `linked_images`
- `use_emoji_autocomplete`
- `use_markdown_shortcuts`
- `sanitize_preview`

The following example configures all RichText fields to use `minimal: true`, disables Markdown shortcuts, and enables only the `bold`, `italic`, and `link` buttons by default.

```yaml [YAML]
field_defaults:
  richtext:
    minimal: true
    use_markdown_shortcuts: false
    buttons: [bold, italic, link]
```

```toml [TOML]
[field_defaults.richtext]
minimal = true
use_markdown_shortcuts = false
buttons = ["bold", "italic", "link"]
```

```json [JSON]
{
  "field_defaults": {
    "richtext": {
      "minimal": true,
      "use_markdown_shortcuts": false,
      "buttons": ["bold", "italic", "link"]
    }
  }
}
```

```js [JavaScript]
{
  field_defaults: {
    richtext: {
      minimal: true,
      use_markdown_shortcuts: false,
      buttons: ["bold", "italic", "link"],
    },
  },
}
```

### Examples

#### Standard Markdown Field

This example shows a basic Markdown editor with default settings.

```yaml [YAML]
- name: body
  label: Body
  widget: richtext
```

```toml [TOML]
[[fields]]
name = "body"
label = "Body"
widget = "richtext"
```

```json [JSON]
{
  "name": "body",
  "label": "Body",
  "widget": "richtext"
}
```

```js [JavaScript]
{
  name: "body",
  label: "Body",
  widget: "richtext",
}
```

<!--
#### Standard HTML field

This example shows a rich text editor that saves content in HTML format.

```yaml [YAML]
- name: body
  label: Body
  widget: richtext
  format: html
```

```toml [TOML]
[[fields]]
name = "body"
label = "Body"
widget = "richtext"
format = "html"
```

```json [JSON]
{
  "name": "body",
  "label": "Body",
  "widget": "richtext",
  "format": "html"
}
```

```js [JavaScript]
{
  name: "body",
  label: "Body",
  widget: "richtext",
  format: "html",
}
```

-->

#### Basic Markdown Field with Limited Buttons

This example shows a minimal Markdown editor with only bold, italic, and link buttons.

```yaml [YAML]
- name: content
  label: Content
  widget: richtext
  default: To get started, write your **Markdown** content here.
  minimal: true
  buttons: [bold, italic, link]
```

```toml [TOML]
[[fields]]
name = "content"
label = "Content"
widget = "richtext"
default = "To get started, write your **Markdown** content here."
minimal = true
buttons = ["bold", "italic", "link"]
```

```json [JSON]
{
  "name": "content",
  "label": "Content",
  "widget": "richtext",
  "default": "To get started, write your **Markdown** content here.",
  "minimal": true,
  "buttons": ["bold", "italic", "link"]
}
```

```js [JavaScript]
{
  name: "content",
  label: "Content",
  widget: "richtext",
  default: "To get started, write your **Markdown** content here.",
  minimal: true,
  buttons: ["bold", "italic", "link"],
}
```

#### Disabling Code Block Component

This example shows how to disable the `code-block` editor component.

```yaml [YAML]
- name: content
  label: Content
  widget: richtext
  editor_components: [image]
```

```toml [TOML]
[[fields]]
name = "content"
label = "Content"
widget = "richtext"
editor_components = ["image"]
```

```json [JSON]
{
  "name": "content",
  "label": "Content",
  "widget": "richtext",
  "editor_components": ["image"]
}
```

```js [JavaScript]
{
  name: "content",
  label: "Content",
  widget: "richtext",
  editor_components: ["image"],
}
```

Source: https://sveltiacms.app/en/docs/fields/richtext

---

## Markdown Field

The Markdown field type is an alias of the RichText field type, available for backward compatibility with Netlify/Decap CMS. It provides a rich text editor that allows content editors to create and format content using Markdown syntax.

<!-- The Markdown field type is a variant of the RichText field type that is specifically designed to handle content formatted in Markdown syntax. It provides a rich text editor that allows content editors to create and format content using Markdown syntax. -->

The `widget` property for this field type is `markdown`.

See the [RichText field documentation](https://sveltiacms.app/en/docs/fields/richtext) for details on the UI, data type, and available options.

<!-- Note that the `format` option is not available for the Markdown field type since it is fixed to `markdown`. -->

### Examples

#### Standard Markdown Field

This example shows a basic Markdown editor with default settings.

```yaml [YAML]
- name: body
  label: Body
  widget: markdown
```

```toml [TOML]
[[fields]]
name = "body"
label = "Body"
widget = "markdown"
```

```json [JSON]
{
  "name": "body",
  "label": "Body",
  "widget": "markdown"
}
```

```js [JavaScript]
{
  name: 'body',
  label: 'Body',
  widget: 'markdown',
}
```

Output example:

```markdown [Markdown]
# Welcome to the Markdown Field

This is a sample paragraph in **Markdown** format.

- Item 1
- Item 2
```

```yaml [YAML]
body: |
  # Welcome to the Markdown Field

  This is a sample paragraph in **Markdown** format.

  - Item 1
  - Item 2
```

```toml [TOML]
body = """
# Welcome to the Markdown Field

This is a sample paragraph in **Markdown** format.

- Item 1
- Item 2
"""
```

```json [JSON]
{
  "body": "# Welcome to the Markdown Field\n\nThis is a sample paragraph in **Markdown** format.\n\n- Item 1\n- Item 2\n"
}
```

We have included a Markdown example output along with YAML, TOML, and JSON representations because a field named `body` with the Markdown field type would be stored outside of the frontmatter in a Markdown file. If the name of the field were different, the content would be stored in the frontmatter instead. This behavior can be configured using the [`body_field` option](https://sveltiacms.app/en/docs/collections/entries/formats#body-field-for-front-matter-formats) for collections and collection files.

Source: https://sveltiacms.app/en/docs/fields/markdown

---

## Code Field

The Code field type provides a code editor with syntax highlighting for various programming languages. It allows users to write and edit code snippets easily within the CMS.

### User Interface

#### Editor

A [Lexical](https://lexical.dev/)-based code editor with syntax highlighting and line numbers.

**Breaking change from Netlify/Decap CMS**

Sveltia CMS does not support the theme and keymap inline settings, along with support for some languages, as we have moved away from CodeMirror to Lexical. We may add user settings for themes in the future.

#### Preview

A read-only view of the code snippet with syntax highlighting.

### Data Type

An object with the following structure:

```json
{ "code": "string", "lang": "string" }
```

The object keys can be customized using the `keys` option.

If the `output_code_only` option is set to `true`, the data type will be a string containing only the code.

### Data Validation

- If the `required` option is set to `true`, the code must not be an empty string.
- If the `pattern` option is provided, the code must match the specified regular expression pattern.

### Options

In addition to the [common field options](https://sveltiacms.app/en/docs/fields#common-options), the Code field supports the following options:

#### Required Options

##### `widget`

- **Type**: `string`
- **Default**: `string`

Must be set to `code`.

#### Optional Options

**Breaking change from Netlify/Decap CMS**

Sveltia CMS uses [Shiki](https://shiki.style/) for syntax highlighting. Therefore, the list of supported languages differ from that of Netlify/Decap CMS, which uses [CodeMirror](https://codemirror.net/).

This affects the `default_language` option and the language used in the `default` option, along with the language selection dropdown in the UI.

##### `default`

- **Type**: `object` or `string`
- **Default**: `{ code: "", lang: "" }`

The default value for the field, where `code` is a code snippet and `lang` is any valid programming language supported by [Shiki](https://shiki.style/languages).

If `output_code_only` is `true`, this should be a string containing the default code. A string is also accepted otherwise, in which case it’s taken as the code with no language.

An object default with a property that isn’t one of the [`keys`](#keys), or an object default with `output_code_only` set to `true`, is reported as a config validation error on the login screen, because the value would otherwise be dropped.

##### `keys`

- **Type**: `object`
- **Default**: `{ code: "code", lang: "lang" }`

An object that defines the keys used in the data object. The default keys are `code` for the code snippet and `lang` for the programming language.

If `output_code_only` is `true`, this option is ignored.

##### `output_code_only`

- **Type**: `boolean`
- **Default**: `false`

If set to `true`, the field will store and return only the code as a string, instead of an object containing both code and language.

##### `allow_language_selection`

- **Type**: `boolean`
- **Default**: `true`

If set to `false`, the language selection dropdown will be hidden, and the language will default to an empty string or the value specified in the `default` option.

**Note for Netlify/Decap CMS users**

The [Netlify/Decap CMS document](https://decapcms.org/docs/widgets/#Code) says the default value for the `allow_language_selection` option is `false`, but it’s actually `true`. The default value in Sveltia CMS is also `true`.

##### `default_language`

- **Type**: `string`
- **Default**: `""`

The default programming language for the code editor. See the [list of supported languages](https://shiki.style/languages) on the Shiki website for valid values.

### Examples

#### Basic Example

The simplest configuration of a Code field:

```yaml [YAML]
- widget: code
  label: Code Snippet
  name: code_snippet
```

```toml [TOML]
[[fields]]
name = "code_snippet"
label = "Code Snippet"
widget = "code"
```

```json [JSON]
{
  "name": "code_snippet",
  "label": "Code Snippet",
  "widget": "code"
}
```

```js [JavaScript]
{
  name: "code_snippet",
  label: "Code Snippet",
  widget: "code",
}
```

Output example:

```yaml [YAML]
code_snippet:
  code: |
    function greet() {
      console.log("Hello, World!");
    }
  lang: js
```

```toml [TOML]
[code_snippet]
code = """function greet() {
  console.log("Hello, World!");
}"""
lang = "js"
```

```json [JSON]
{
  "code_snippet": {
    "code": "function greet() {\n  console.log(\"Hello, World!\");\n}",
    "lang": "js"
  }
}
```

#### Code Only Output

This example configures the field to output only the code as a string:

```yaml [YAML]
- widget: code
  label: Code Only
  name: code_only
  output_code_only: true
```

```toml [TOML]
[[fields]]
name = "code_only"
label = "Code Only"
widget = "code"
output_code_only = true
```

```json [JSON]
{
  "name": "code_only",
  "label": "Code Only",
  "widget": "code",
  "output_code_only": true
}
```

```js [JavaScript]
{
  name: "code_only",
  label: "Code Only",
  widget: "code",
  output_code_only: true,
}
```

Output example:

```yaml [YAML]
code_only: |
  function greet() {
    console.log("Hello, World!");
  }
```

```toml [TOML]
code_only = """function greet() {
  console.log("Hello, World!");
}"""
```

```json [JSON]
{
  "code_only": "function greet() {\n  console.log(\"Hello, World!\");\n}"
}
```

#### Custom Keys and Default Value

This example customizes the keys used in the data object and sets a default value, with language selection disabled:

```yaml [YAML]
- widget: code
  label: Custom Code
  name: custom_code
  allow_language_selection: false
  keys:
    code: source_code
    lang: language
  default:
    source_code: "console.log('Hello, World!');"
    language: js
```

```toml [TOML]
[[fields]]
name = "custom_code"
label = "Custom Code"
widget = "code"
allow_language_selection = false
[keys]
code = "source_code"
lang = "language"
[default]
source_code = "console.log('Hello, World!');"
language = "js"
```

```json [JSON]
{
  "name": "custom_code",
  "label": "Custom Code",
  "widget": "code",
  "allow_language_selection": false,
  "keys": {
    "code": "source_code",
    "lang": "language"
  },
  "default": {
    "source_code": "console.log('Hello, World!');",
    "language": "js"
  }
}
```

```js [JavaScript]
{
  name: "custom_code",
  label: "Custom Code",
  widget: "code",
  allow_language_selection: false,
  keys: {
    code: "source_code",
    lang: "language",
  },
  default: {
    source_code: "console.log('Hello, World!');",
    language: "js",
  },
}
```

Output example:

```yaml [YAML]
custom_code:
  source_code: "console.log('Hello, World!');"
  language: js
```

```toml [TOML]
[custom_code]
source_code = "console.log('Hello, World!');"
language = "js"
```

```json [JSON]
{
  "custom_code": {
    "source_code": "console.log('Hello, World!');",
    "language": "js"
  }
}
```

Source: https://sveltiacms.app/en/docs/fields/code
