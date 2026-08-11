# Configuration Reference

Configuration file formats, global options, string transformations and data output options.

Generated from the Sveltia CMS documentation. Do not edit by hand.

## Configuration Basics

This guide covers the basics of configuring Sveltia CMS using a configuration file. It explains the supported file formats, how to specify the configuration file location, and how to enable validation and autocomplete in your code editor. It also provides information on using AI agents to assist with configuration.

**Future Plans**

We plan to introduce a graphical configuration editor in a future release, allowing users to create and modify the configuration directly within the CMS interface. For now, please refer to this guide for manual configuration.

### Supported Formats

Sveltia CMS supports configuration files in the following formats:

#### YAML

The CMS configuration file is usually written in YAML format. Ensure that your file adheres to proper YAML syntax to avoid parsing errors. If you are new to YAML, consider reviewing a [YAML tutorial](https://www.redhat.com/en/topics/automation/what-is-yaml) to familiarize yourself with the syntax.

Sveltia CMS currently uses the [`yaml` npm package](https://www.npmjs.com/package/yaml) for parsing and serializing YAML files.

Here are some key YAML syntax features to keep in mind:

##### Comments

YAML supports comments using the `#` symbol. Comments can be placed on their own line or at the end of a line:

```yaml
# This is a comment
title: My Site # This is an inline comment
```

##### Shorthand Notation

Sometimes we use shorthand notation for brevity. For example,

```yaml
fields:
  - name: title
    label: Title
    widget: string
  - name: align
    label: Alignment
    widget: select
    options:
      - left
      - center
      - right
```

is the same as

```yaml
fields:
  - { name: title, label: Title, widget: string }
  - { name: align, label: Alignment, widget: select, options: [left, center, right] }
```

##### Quoting Strings

In YAML, strings can be quoted using single (`'`) or double (`"`) quotes. Quoting is necessary when the string contains special characters, leading/trailing spaces, or when you want to preserve the exact formatting. For example:

```yaml
description: 'A site with special characters: #, :, -'
```

##### Multiline Strings

YAML allows multiline strings using the `|` (literal) or `>` (folded) indicators. For example:

```yaml
description: |
  This is a multiline
  string that preserves
  line breaks.
summary: >
  This is a folded multiline string that replaces line breaks with spaces.
```

##### Anchors and Aliases

YAML supports anchors and aliases to reuse configuration snippets. This is an advanced feature that can help reduce duplication. For example:

```yaml
fields:
  - &title_field
    name: title
    label: Title
    widget: string
  - name: subtitle
    label: Subtitle
    widget: string
  - <<: *title_field
    name: headline
    label: Headline
```

#### TOML

TOML format is also supported for configuration files. If you prefer TOML, create a file named `config.toml` instead of `config.yml` and write the configuration in TOML syntax. Make sure to add a `<link>` tag in your HTML to point to the file with the correct MIME type (see the [Config URL](#toml-or-json-configuration-file) section below).

Sveltia CMS currently uses the [`smol-toml` npm package](https://www.npmjs.com/package/smol-toml) for parsing and serializing TOML files.

#### JSON

Sveltia CMS also supports JSON format for configuration files. However, JSON is mainly intended for programmatic generation of configuration files rather than manual editing, due to its verbosity and lack of support for comments.

To use a JSON configuration file, create a file named `config.json` instead of `config.yml` and write the configuration in JSON syntax, and add a `<link>` tag in your HTML to point to the file with the correct MIME type (see the [Config URL](#toml-or-json-configuration-file) section below).

We don’t support JSONC, JSON5, or other JSON variants — only standard JSON that can be parsed by [`JSON.parse`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse) and serialized by [`JSON.stringify`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify). If you want to write comments in your configuration file, use YAML format instead.

#### JavaScript/TypeScript

Instead of using a static configuration file, you can also provide the CMS configuration as a JavaScript object when [manually initializing](https://sveltiacms.app/en/docs/api/initialization) the CMS. It gives you the most flexibility and control over the configuration, allowing you to dynamically generate or modify the configuration based on your application logic.

The field configuration for [custom editor components](https://sveltiacms.app/en/docs/api/editor-components) also uses JavaScript objects.

### Config URL

You can customize the configuration file location and format by specifying a URL in your HTML using a `<link>` tag with `rel="cms-config-url"`. This is useful if you want to store the configuration file in a different location or use a different format than the default.

**Configuration is Public**

Regardless of the location, the configuration file is publicly accessible on the web server. Avoid including sensitive information, such as API keys or passwords, in the configuration file.

#### Custom Configuration File Path

By default, Sveltia CMS looks for a YAML configuration file named `config.yml` located in the same folder as the `index.html` file. The file is typically accessible at `/admin/config.yml` on a web server. There is no need to specify this default location explicitly.

To specify a custom configuration file path, add a `<link>` tag in your HTML’s `<head>` section:

```html
<link href="/cms/config.yaml" type="application/yaml" rel="cms-config-url" />
```

The MIME type for YAML files is `application/yaml` (standardized) or `text/yaml` (legacy). Both are supported.

#### TOML or JSON Configuration File

If you use a TOML or JSON configuration file instead of YAML, you need to add a `<link>` tag with the appropriate MIME type. This tells Sveltia CMS to load the configuration from the specified file instead of the default `config.yml`. Below are examples for both formats.

```html
<link href="/admin/config.toml" type="application/toml" rel="cms-config-url" />
```

```html
<link href="/admin/config.json" type="application/json" rel="cms-config-url" />
```

#### Multiple Configuration Files

You can specify multiple configuration files by adding multiple `<link>` tags. Sveltia CMS will merge them in the order they appear in the HTML.

```html
<link href="/admin/config.yml" type="application/yaml" rel="cms-config-url" />
<link href="/admin/collections/authors.yml" type="application/yaml" rel="cms-config-url" />
<link href="/admin/collections/pages.yml" type="application/yaml" rel="cms-config-url" />
<link href="/admin/collections/posts.yml" type="application/yaml" rel="cms-config-url" />
```

**Limitations**

YAML anchors, aliases and merge keys only work if they are in the same file. This is because the files are parsed as separate JavaScript objects and then merged using the [`deepmerge`](https://www.npmjs.com/package/deepmerge) library.

Also, modularized configuration files may raise errors if you enable JSON schema validation in your code editor, as the schema expects a complete configuration object.

### Validation and Autocomplete

For a better development experience, Sveltia CMS provides JSON schema support and TypeScript types for configuration validation and autocomplete.

#### JSON Schema

Sveltia CMS provides a full [JSON schema](https://json-schema.org/) for the configuration file, so you can get autocomplete and validation in your favorite code editor while editing the CMS configuration. The schema is generated from the source and always up to date with the latest CMS version.

##### Enabling JSON Schema Validation in VS Code

If you use VS Code, you can enable it for the YAML configuration file by installing the [YAML extension](https://marketplace.visualstudio.com/items?itemName=redhat.vscode-yaml) and adding the following comment to the top of `config.yml`:

```yaml
# yaml-language-server: $schema=https://unpkg.com/@sveltia/cms/schema/sveltia-cms.json
```

For TOML files, install the [Even Better TOML extension](https://marketplace.visualstudio.com/items?itemName=tamasfe.even-better-toml) and add the following comment to the top of `config.toml`:

```toml
#:schema https://unpkg.com/@sveltia/cms/schema/sveltia-cms.json
```

JSON files have native support in VS Code, so no extension is needed. Just add the following line to the top of `config.json`, within the curly braces:

```json
"$schema": "https://unpkg.com/@sveltia/cms/schema/sveltia-cms.json",
```

**Workspace-level configuration**

Instead of adding the schema comment to the top of the configuration file, you can also set it up at the workspace level in VS Code. Add the following to your project’s [VS Code settings file](https://code.visualstudio.com/docs/configure/settings#_settings-json-file) at `.vscode/settings.json`, within the outer curly braces.

For YAML files:

```jsonc
"yaml.schemas": {
  "https://unpkg.com/@sveltia/cms/schema/sveltia-cms.json": ["/public/admin/config.yml"]
}
```

For JSON files:

```jsonc
"json.schemas": [
  {
    "fileMatch": ["/public/admin/config.json"],
    "url": "https://unpkg.com/@sveltia/cms/schema/sveltia-cms.json"
  }
]
```

The configuration file location varies by framework and project structure, so adjust the path accordingly. For example, if you use Hugo, the file is typically located in the `/static/admin/` directory.

##### Other Editors

Check your code editor or IDE documentation to see if it supports JSON schema validation for YAML, TOML, or JSON files. If supported, use the following schema URL:

```
https://unpkg.com/@sveltia/cms/schema/sveltia-cms.json
```

[WebStorm](https://www.jetbrains.com/help/webstorm/yaml.html#json_schema) and other JetBrains IDEs have built-in support for JSON schema validation in YAML and JSON files. You can configure the schema in the IDE settings.

#### TypeScript Support

When using the `@sveltia/cms` package in a TypeScript-enabled project, you can get type checking and autocomplete for the [API](https://sveltiacms.app/en/docs/api), including the configuration object when [manually initializing](https://sveltiacms.app/en/docs/api/initialization) the CMS.

The type definitions are generated from the JSDoc comments in the source code, ensuring they are accurate and up to date with the latest CMS version.

#### Runtime Validation

Sveltia CMS performs runtime validation of the configuration file when the CMS initializes. If there are any errors in the configuration, they will be displayed on the login screen.

This helps catch issues early and ensures that the CMS operates with a valid configuration, preventing potential runtime errors. The runtime validation includes checks for:

- Common backend misconfigurations
- File format and extension mismatches
- Invalid or duplicate collection or field names
- Mutually exclusive config options
- Invalid references in Relation fields

**Unfinished feature**

Comprehensive runtime validation is still under development and may not cover all configuration options yet. We recommend using JSON schema validation in your code editor for the most reliable feedback while editing the configuration file.

Source: https://sveltiacms.app/en/docs/config-basics

---

## String Transformations

String transformations allow you to manipulate and format string values in your content entries. These transformations can be applied in various contexts, such as generating summaries or formatting dates.

**Note for Netlify/Decap CMS users**

In Netlify/Decap CMS, this feature is known as **summary string transformations**. We simply refer to them as **string transformations** because, in Sveltia CMS, they can be used in multiple contexts beyond just entry summaries.

### Available Contexts

String transformations can be applied in the following contexts:

- [Entry Collection](https://sveltiacms.app/en/docs/collections/entries): the `summary`, `slug`, `path`, `preview_path` options
- [Compute Field](https://sveltiacms.app/en/docs/fields/compute): the `value` option
- [Hidden Field](https://sveltiacms.app/en/docs/fields/hidden): the `default` option
- [List Field](https://sveltiacms.app/en/docs/fields/list): the `summary` option
- [Object Field](https://sveltiacms.app/en/docs/fields/object): the `summary` option

**Future Plans**

More contexts may be added in future releases.

### Syntax

String transformations are applied using the following syntax:

```
{{value | transformation_name}}
```

or with arguments:

```
{{value | transformation_name(arguments)}}
```

Where:

- `value`: The original string value to be transformed. This is typically a field name enclosed in double curly braces (e.g., `{{title}}`).
- `transformation_name`: The name of the transformation to apply (e.g., `upper`, `lower`, `truncate`).
- `arguments`: Optional arguments required by certain transformations, enclosed in parentheses.

Multiple transformations can be chained together by separating them with a pipe (`|`). The output of one transformation serves as the input for the next. For example:

```
{{value | transformation1 | transformation2(arguments)}}
```

#### Notes on Syntax Rules

There are some syntax rules to keep in mind when using string transformations:

- String arguments must be enclosed in single quotes.
- Numeric arguments should not be quoted.
- No spaces are allowed between the transformation name and the opening parenthesis.
- No spaces are allowed after the starting curly braces (`{{`) or before the ending curly braces (`}}`).
- A space is required before and after the pipe character (`|`).

We might relax some of these rules in future releases.

### Available Transformations

#### `upper`

Transform the string to uppercase.

```
{{value | upper}}
```

Configuration example:

```yaml [YAML]
summary: '{{title | upper}}'
```

```toml [TOML]
summary = "{{title | upper}}"
```

```json [JSON]
{
  "summary": "{{title | upper}}"
}
```

```js [JavaScript]
{
  summary: "{{title | upper}}",
}
```

#### `lower`

Transform the string to lowercase.

```
{{value | lower}}
```

Configuration example:

```yaml [YAML]
summary: '{{title | lower}}'
```

```toml [TOML]
summary = "{{title | lower}}"
```

```json [JSON]
{
  "summary": "{{title | lower}}"
}
```

```js [JavaScript]
{
  summary: "{{title | lower}}",
}
```

#### `slugify`

Convert the string to a URL-friendly slug.

```
{{value | slugify}}
```

The transformation converts the string based on the [global slug options](https://sveltiacms.app/en/docs/collections/entries#global-slug-options).

Configuration example:

```yaml [YAML]
summary: '{{title | slugify}}'
```

```toml [TOML]
summary = "{{title | slugify}}"
```

```json [JSON]
{
  "summary": "{{title | slugify}}"
}
```

```js [JavaScript]
{
  summary: "{{title | slugify}}",
}
```

For example, if the `title` field has the value `Hello, World! This is a Test`, the result will be:

```
hello-world-this-is-a-test
```

#### `truncate`

Truncate the string to a specified length, optionally adding a suffix.

```
{{value | truncate(<length>)}}
```

```
{{value | truncate(<length>, '<suffix>')}}
```

The `length` argument specifies the maximum number of characters to keep. If the string exceeds this length, it will be truncated. The optional `suffix` argument allows you to specify a string to append to the truncated string (e.g., an ellipsis).

Configuration examples:

```yaml [YAML]
summary: '{{content | truncate(100)}}'
```

```toml [TOML]
summary = "{{content | truncate(100)}}"
```

```json [JSON]
{
  "summary": "{{content | truncate(100)}}"
}
```

```js [JavaScript]
{
  summary: "{{content | truncate(100)}}",
}
```

```yaml [YAML]
summary: "{{content | truncate(100, '...')}}"
```

```toml [TOML]
summary = "{{content | truncate(100, '...')}}"
```

```json [JSON]
{
  "summary": "{{content | truncate(100, '...')}}"
}
```

```js [JavaScript]
{
  summary: "{{content | truncate(100, '...')}}",
}
```

#### `default`

Provide a default value if the original value is null or empty.

```
{{value | default('<default_value>')}}
```

The `default_value` is returned if the original value is null or an empty string; otherwise, the original value is returned.

Configuration example:

```yaml [YAML]
summary: "{{description | default('No description available.')}}"
```

```toml [TOML]
summary = "{{description | default('No description available.')}}"
```

```json [JSON]
{
  "summary": "{{description | default('No description available.')}}"
}
```

```js [JavaScript]
{
  summary: "{{description | default('No description available.')}}",
}
```

It’s possible to fall back to another field’s value using a nested template:

```yaml [YAML]
preview_path: "/{{fields.slug | default('{{fields.title}}')}}/"
```

```toml [TOML]
preview_path = "/{{fields.slug | default('{{fields.title}}')}}/"
```

```json [JSON]
{
  "preview_path": "/{{fields.slug | default('{{fields.title}}')}}/"
}
```

```js [JavaScript]
{
  preview_path: "/{{fields.slug | default('{{fields.title}}')}}/",
}
```

#### `ternary`

Choose between two values based on the truthiness of the original value.

```
{{value | ternary('<true_value>', '<false_value>')}}
```

The `true_value` is returned if the original value is truthy; otherwise, the `false_value` is returned.

Configuration examples:

```yaml [YAML]
summary: "{{is_private | ternary('Private', 'Public')}}: {{title}}"
```

```toml [TOML]
summary = "{{is_private | ternary('Private', 'Public')}}: {{title}}"
```

```json [JSON]
{
  "summary": "{{is_private | ternary('Private', 'Public')}}: {{title}}"
}
```

```js [JavaScript]
{
  summary: "{{is_private | ternary('Private', 'Public')}}: {{title}}",
}
```

```yaml [YAML]
summary: "{{title}} – {{featured | ternary('Featured', 'Regular')}} Event"
```

```toml [TOML]
summary = "{{title}} – {{featured | ternary('Featured', 'Regular')}} Event"
```

```json [JSON]
{
  "summary": "{{title}} – {{featured | ternary('Featured', 'Regular')}} Event"
}
```

```js [JavaScript]
{
  summary: "{{title}} – {{featured | ternary('Featured', 'Regular')}} Event",
}
```

```yaml [YAML]
summary: "{{title}} {{published | ternary('', '(DRAFT)')}}"
```

```toml [TOML]
summary = "{{title}} {{published | ternary('', '(DRAFT)')}}"
```

```json [JSON]
{
  "summary": "{{title}} {{published | ternary('', '(DRAFT)')}}"
}
```

```js [JavaScript]
{
  summary: "{{title}} {{published | ternary('', '(DRAFT)')}}",
}
```

#### `date`

Format a date string, with an optional timezone.

```
{{value | date('<format>')}}
```

```
{{value | date('<format>', '<timezone>')}}
```

The `format` argument specifies the desired date format using [Day.js formatting tokens](https://day.js.org/docs/en/display/format).

The optional `timezone` argument allows you to specify the time zone for formatting. It only supports `utc` for Coordinated Universal Time. If no timezone is provided, the local timezone will be used.

If an invalid date is provided, an empty string will be returned.

Configuration examples:

```yaml [YAML]
summary: "{{publish_date | date('YYYY-MM-DD')}}"
```

```toml [TOML]
summary = "{{publish_date | date('YYYY-MM-DD')}}"
```

```json [JSON]
{
  "summary": "{{publish_date | date('YYYY-MM-DD')}}"
}
```

```js [JavaScript]
{
  summary: "{{publish_date | date('YYYY-MM-DD')}}",
}
```

```yaml [YAML]
summary: "{{publish_date | date('YYYY-MM-DD', 'utc')}}"
```

```toml [TOML]
summary = "{{publish_date | date('YYYY-MM-DD', 'utc')}}"
```

```json [JSON]
{
  "summary": "{{publish_date | date('YYYY-MM-DD', 'utc')}}"
}
```

```js [JavaScript]
{
  summary: "{{publish_date | date('YYYY-MM-DD', 'utc')}}",
}
```

**Breaking change from Netlify/Decap CMS**

Sveltia CMS (and Decap CMS 3.1.1) has replaced the Moment.js library with Day.js for date formatting and parsing. Since [Day.js tokens](https://day.js.org/docs/en/display/format) are not 100% compatible with [Moment.js tokens](https://momentjs.com/docs/#/displaying/format/), this could be a breaking change in certain cases. Check your date/time format if you’re migrating from Netlify CMS or earlier versions of Decap CMS.

### Examples

#### Summary with Multiple Transformations

The below example demonstrates how to use multiple string transformations in the `summary` option of a collection:

```yaml [YAML]
collections:
  - name: blog
    label: Blog
    summary: "{{title | upper}} — {{publish_date | date('YYYY-MM-DD')}} — {{body | truncate(20, '...')}}"
    fields:
      - name: title
        label: Title
        widget: string
      - name: publish_date
        label: Publish Date
        widget: datetime
      - name: body
        label: Body
        widget: richtext
```

```toml [TOML]
[[collections]]
name = "blog"
label = "Blog"
summary = "{{title | upper}} — {{publish_date | date('YYYY-MM-DD')}} — {{body | truncate(20, '...')}}"

[[collections.fields]]
name = "title"
label = "Title"
widget = "string"

[[collections.fields]]
name = "publish_date"
label = "Publish Date"
widget = "datetime"

[[collections.fields]]
name = "body"
label = "Body"
widget = "richtext"
```

```json [JSON]
{
  "collections": [
    {
      "name": "blog",
      "label": "Blog",
      "summary": "{{title | upper}} — {{publish_date | date('YYYY-MM-DD')}} — {{body | truncate(20, '...')}}",
      "fields": [
        {
          "name": "title",
          "label": "Title",
          "widget": "string"
        },
        {
          "name": "publish_date",
          "label": "Publish Date",
          "widget": "datetime"
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
      name: "blog",
      label: "Blog",
      summary: "{{title | upper}} — {{publish_date | date('YYYY-MM-DD')}} — {{body | truncate(20, '...')}}",
      fields: [
        {
          name: "title",
          label: "Title",
          widget: "string",
        },
        {
          name: "publish_date",
          label: "Publish Date",
          widget: "datetime",
        },
        {
          name: "body",
          label: "Body",
          widget: "richtext",
        },
      ],
    },
  ],
}
```

It will transform the `title` to uppercase, format the `publish_date` to `YYYY-MM-DD`, and truncate the `body` to 20 characters with an ellipsis. For example, if an entry has the following values:

```yaml [YAML]
title: My First Blog Post
publish_date: 2024-06-15T10:30:00Z
body: This is the content of my first blog post. It has a lot of interesting information
```

```toml [TOML]
title = "My First Blog Post"
publish_date = 2024-06-15T10:30:00Z
body = "This is the content of my first blog post. It has a lot of interesting information"
```

```json [JSON]
{
  "title": "My First Blog Post",
  "publish_date": "2024-06-15T10:30:00Z",
  "body": "This is the content of my first blog post. It has a lot of interesting information"
}
```

The resulting summary will be:

```
MY FIRST BLOG POST — 2024-06-15 — This is the content...
```

#### Chaining Transformations

You can chain multiple transformations together by separating them with a pipe (`|`). For example, to convert a title to uppercase and then truncate it to 10 characters, you can use:

```yaml [YAML]
summary: "{{title | upper | truncate(10, '...')}}"
```

```toml [TOML]
summary = "{{title | upper | truncate(10, '...')}}"
```

```json [JSON]
{
  "summary": "{{title | upper | truncate(10, '...')}}"
}
```

```js [JavaScript]
{
  summary: "{{title | upper | truncate(10, '...')}}",
}
```

Source: https://sveltiacms.app/en/docs/string-transformations

---

## Data Output

Content in Sveltia CMS is stored in static files, which can be in various formats such as Markdown, YAML, TOML, or JSON. The format used for storing content can be configured on a per-collection basis.

In most cases, you don’t need to worry about the details of data output, as Sveltia CMS and consuming tools, like your frameworks, static site generators (SSGs) or parser libraries, handle it seamlessly. However, understanding how data is output can help you avoid unexpected issues, especially when using strict type validations or manually editing data files.

### File Formats

#### Standard Formats

Sveltia CMS supports the following data output formats for content files out of the box:

- Markdown with YAML, TOML or JSON front matter
- YAML
- TOML
- JSON
- Raw text files, such as plain text, JSON, XML, or CSV files

To customize the format for each collection, see the [Entry Collection](https://sveltiacms.app/en/docs/collections/entries#file-format-and-extension) and [File Collection](https://sveltiacms.app/en/docs/collections/files#file-format-and-extension) documentation.

#### Custom Formats

Sveltia CMS allows you to define custom data output formats using the API. You can create your own format handlers to meet specific requirements for your project. For more information on how to create custom formats, please refer to the [Custom File Formats API reference](https://sveltiacms.app/en/docs/api/file-formats).

### Data Output Conventions

Here are some key aspects of data output in Sveltia CMS:

#### General Conventions

- **Field Ordering**: Fields are always saved in the order they are defined in the configuration, with key-value pairs, making Git commits clean and consistent. Some [exceptions](#understanding-exceptions) apply.
- **Time Formatting**: A standard time is formatted as `HH:mm:ss` instead of `HH:mm` for better framework compatibility.
- **File Formatting**: Line breaks are LF (`\n`) across all formats. A newline is added at the end of the file to prevent unnecessary changes.
- **Text Processing**: Leading and trailing whitespaces in text-type field values are automatically removed when you save an entry. No configuration option is required for this behavior.
- **Complete and Consistent Data Output**: Sveltia CMS saves proper values for all fields, such as an empty string, an empty array, or `null`, instead of omitting them. This differs from Netlify/Decap CMS, which often omits optional and empty fields.
  - `required: false` makes data input optional, but doesn't make data output optional.
  - To omit empty optional fields from data output, use `omit_empty_optional_fields: true` in the [output options](#controlling-data-output). This is useful if you have data type validations that expect `undefined`.

#### Format-Specific Conventions

- **YAML String Folding**: YAML string folding (maximum line width) is disabled for improved framework compatibility.
- **Indentation**: Indentation is 2 spaces for YAML and JSON by default (configurable).
- **Quoting in YAML**: Strings in YAML can be unquoted, single-quoted, or double-quoted (configurable).
- **JSON and YAML Formatting Options**: Fully configurable in the [output options](#controlling-data-output).
- **TOML DateTime Values**: DateTime field values in ISO 8601 format are stored in native date/time format instead of quoted strings.

#### Markdown Syntax

Due to the underlying [Lexical framework](https://lexical.dev/) used in Sveltia CMS, the following Markdown conventions are applied to the output of the [rich text editor](https://sveltiacms.app/en/docs/fields/richtext):

- **Indentation**: 4 spaces for nested lists and code blocks instead of 2 spaces.
- **Unordered List Markers**: Hyphens (`-`) are used for unordered list markers instead of asterisks (`*`).
- **Bold Text**: Double asterisks (`**`) are used for bold text instead of double underscores (`__`).
- **Italic Text**: Underscores (`_`) are used for italics instead of asterisks (`*`).
- **Horizontal Rules**: Three asterisks (`***`) are used for horizontal rules instead of three hyphens (`---`).
- **Line Breaks**: Soft line breaks (single line breaks) are used instead of hard line breaks (two or more spaces, escaped line breaks `\`, or HTML `<br>` tags). In your framework, you may need to [enable the appropriate option](https://sveltiacms.app/en/docs/how-tos#rendering-soft-line-breaks-as-hard-line-breaks-in-markdown) to render soft line breaks as hard line breaks.

### Controlling Data Output

Sveltia CMS supports some data output options, including JSON/YAML formatting preferences, at the root level of the configuration file. The default options are listed below:

```yaml [YAML]
output:
  omit_empty_optional_fields: false
  encode_file_path: false # true to URL-encode file paths for File/Image fields
  json:
    indent_style: space # or tab
    indent_size: 2
  yaml:
    quote: none # or single or double
    indent_size: 2
    indent_sequences: true # false for compact style
```

```toml [TOML]
[output]
omit_empty_optional_fields = false
encode_file_path = false # true to URL-encode file paths for File/Image fields
[output.json]
indent_style = "space" # or "tab"
indent_size = 2
[output.yaml]
quote = "none" # or "single" or "double"
indent_size = 2
indent_sequences = true # false for compact style
```

```json [JSON]
{
  "output": {
    "omit_empty_optional_fields": false,
    "encode_file_path": false,
    "json": {
      "indent_style": "space",
      "indent_size": 2
    },
    "yaml": {
      "quote": "none",
      "indent_size": 2,
      "indent_sequences": true
    }
  }
}
```

```js [JavaScript]
{
  output: {
    omit_empty_optional_fields: false,
    encode_file_path: false,
    json: {
      indent_style: 'space',
      indent_size: 2,
    },
    yaml: {
      quote: 'none',
      indent_size: 2,
      indent_sequences: true,
    },
  },
}
```

### Understanding Exceptions

Content is generally saved as key-value pairs in a file, where the key is the field name and the value is the field value. However, there are some exceptions you should be aware of.

#### The `body` Field

If the format is front matter, the `body` field is saved outside of the front matter block:

```yaml
---
title: My Post
date: 2025-01-01
---
This is the body of my post.
```

instead of

```yaml
---
title: My Post
date: 2025-01-01
body: This is the body of my post.
---
```

If there is only the `body` field, the front matter block is omitted altogether:

```yaml
This is the body of my post.
```

This behavior can be configured using the [`body_field` option](https://sveltiacms.app/en/docs/collections/entries#body-field-for-front-matter-formats) for collections and collection files.

When i18n is enabled with the `single_file` structure, this behavior doesn’t apply at all. In this case, the `body` field is saved as part of key-value pairs under each locale in the front matter block:

```yaml
---
en:
  title: My Post
  date: 2025-01-01
  body: This is the body of my post.
fr:
  title: Mon article
  date: 2025-01-01
  body: C’est le corps de mon article.
---
```

#### List Widget

There are two exceptional cases for the List widget:

##### `field` vs. `fields` Option

When the `fields` (plural) option is used, each item is saved as an object with key-value pairs. For example, the following configuration:

```yaml [YAML]
- name: images
  label: Images
  widget: list
  fields:
    - { name: image, label: Image, widget: image }
```

```toml [TOML]
[[fields]]
name = "images"
label = "Images"
widget = "list"
[[fields.fields]]
name = "image"
label = "Image"
widget = "image"
```

```json [JSON]
{
  "fields": [
    {
      "name": "images",
      "label": "Images",
      "widget": "list",
      "fields": [
        { "name": "image", "label": "Image", "widget": "image" }
      ]
    }
  ]
}
```

```js [JavaScript]
{
  fields: [
    {
      name: "images",
      label: "Images",
      widget: "list",
      fields: [
        { name: "image", label: "Image", widget: "image" },
      ],
    },
  ],
}
```

will produce the output:

```yaml [YAML]
images:
  - image: https://example.com/image1.jpg
  - image: https://example.com/image2.jpg
```

```toml [TOML]
[[images]]
image = "https://example.com/image1.jpg"
[[images]]
image = "https://example.com/image2.jpg"
```

```json [JSON]
{
  "images": [
    { "image": "https://example.com/image1.jpg" },
    { "image": "https://example.com/image2.jpg" }
  ]
}
```

On the other hand, when the `field` (singular) option is used, the `name` property is omitted from the output.

```yaml [YAML]
- name: images
  label: Images
  widget: list
  field: { name: image, label: Image, widget: image }
```

```toml [TOML]
[[fields]]
name = "images"
label = "Images"
widget = "list"
[fields.field]
name = "image"
label = "Image"
widget = "image"
```

```json [JSON]
{
  "fields": [
    {
      "name": "images",
      "label": "Images",
      "widget": "list",
      "field": { "name": "image", "label": "Image", "widget": "image" }
    }
  ]
}
```

```js [JavaScript]
{
  fields: [
    {
      name: "images",
      label: "Images",
      widget: "list",
      field: { name: "image", label: "Image", widget: "image" },
    },
  ],
}
```

The output will be:

```yaml [YAML]
images:
  - https://example.com/image1.jpg
  - https://example.com/image2.jpg
```

```toml [TOML]
images = ["https://example.com/image1.jpg", "https://example.com/image2.jpg"]
```

```json [JSON]
{
  "images": ["https://example.com/image1.jpg", "https://example.com/image2.jpg"]
}
```

##### `root` Option

When the [`root` option](https://sveltiacms.app/en/docs/fields/list#top-level-list) is set to `true`, the List field is saved as a top-level list without a field name:

```yaml [YAML]
- name: John Doe
  id: 12345
- name: Jane Smith
  id: 67890
```

```json [JSON]
[
  { "name": "John Doe", "id": 12345 },
  { "name": "Jane Smith", "id": 67890 }
]
```

instead of

```yaml [YAML]
members:
  - name: John Doe
    id: 12345
  - name: Jane Smith
    id: 67890
```

```json [JSON]
{
  "members": [
    { "name": "John Doe", "id": 12345 },
    { "name": "Jane Smith", "id": 67890 }
  ]
}
```

This `root` option doesn’t work with TOML format, as TOML doesn’t support top-level arrays.

Source: https://sveltiacms.app/en/docs/data-output
