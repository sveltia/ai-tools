# Field Types: Common Options and Text Input

Options shared by every field type, plus the simple input types: String, Text, Number, Boolean, Select, Color and Hidden.

Generated from the Sveltia CMS documentation. Do not edit by hand.

## Fields

Each collection requires a `fields` property that defines the structure of the content within the collection. Fields specify the type of data to be collected, such as text, images, dates, or custom types.

### Field Types

A field type determines how a field is rendered and interacted with in the CMS. Each field type has its own set of options, behaviors, validations, and data formats.

**Note for Netlify/Decap CMS users**

In Sveltia CMS, what was previously referred to as a **widget** in Netlify/Decap CMS is now called a **field type**. This change was made to better align with common content management terminology, as originally [proposed](https://github.com/decaporg/decap-cms/issues/3719) by Netlify CMS maintainers themselves.

The functionality and configuration options remain the same. The `widget` property is still used in the configuration for backward compatibility.

#### Built-in field types

Sveltia CMS includes the following field types out of the box:

- [Boolean](https://sveltiacms.app/en/docs/fields/boolean): A toggle switch for true/false values.
- [Code](https://sveltiacms.app/en/docs/fields/code): A code editor for various programming languages.
- [Color](https://sveltiacms.app/en/docs/fields/color): A color picker.
- [Compute](https://sveltiacms.app/en/docs/fields/compute): A read-only field that computes its value based on other fields.
- [DateTime](https://sveltiacms.app/en/docs/fields/datetime): A date and time picker.
- [File](https://sveltiacms.app/en/docs/fields/file): A file uploader and selector.
- [Hidden](https://sveltiacms.app/en/docs/fields/hidden): A hidden field that is not displayed in the UI.
- [Image](https://sveltiacms.app/en/docs/fields/image): A variant of [File](https://sveltiacms.app/en/docs/fields/file) with image-specific features.
- [KeyValue](https://sveltiacms.app/en/docs/fields/keyvalue): A field for storing key-value pairs.
- [List](https://sveltiacms.app/en/docs/fields/list): A list of items, which can be of any field type.
- [Map](https://sveltiacms.app/en/docs/fields/map): A geo-location picker.
- [Markdown](https://sveltiacms.app/en/docs/fields/markdown): An alias of [RichText](https://sveltiacms.app/en/docs/fields/richtext).
- [Number](https://sveltiacms.app/en/docs/fields/number): A numeric input field.
- [Object](https://sveltiacms.app/en/docs/fields/object): A field for storing nested objects.
- [Relation](https://sveltiacms.app/en/docs/fields/relation): A field for creating relationships between entries in different collections.
- [RichText](https://sveltiacms.app/en/docs/fields/richtext): A rich text editor with Markdown support.
- [Select](https://sveltiacms.app/en/docs/fields/select): A dropdown or multi-select field.
- [String](https://sveltiacms.app/en/docs/fields/string): A single-line text input.
- [Text](https://sveltiacms.app/en/docs/fields/text): A multi-line text input.
- [UUID](https://sveltiacms.app/en/docs/fields/uuid): A field that generates a unique identifier.

**Breaking change from Netlify CMS**

The deprecated Date widget is not supported in Sveltia CMS (and Decap CMS). Use the DateTime widget instead.

#### Custom field types

Developers can create [custom field types](https://sveltiacms.app/en/docs/api/field-types) to extend the functionality of Sveltia CMS.

### Designing Fields

When designing fields for a collection, consider the following best practices:

- Use appropriate field types for the data being collected to ensure a good user experience.
- Provide clear labels and hints to guide users in entering data correctly.
- Utilize default values where applicable to streamline data entry.
- Organize fields logically, especially when using nested objects or lists.
- Leverage the [relation field](https://sveltiacms.app/en/docs/fields/relation) to create connections between different collections, enhancing data integrity and usability.
- Consider the use of [i18n](https://sveltiacms.app/en/docs/i18n) for fields that require localization.
- Take advantage of [field validation](#field-validation) to enforce data integrity.
- Plan for scalability by anticipating future data requirements and structuring fields accordingly.
- Regularly review and update field configurations to adapt to changing content needs.
- Test field configurations thoroughly to ensure they meet user requirements and function as expected.

See also the [Content Modeling Guide](https://sveltiacms.app/en/docs/content-modeling) for more in-depth advice on designing content structures.

### Common Options

In addition to field-specific options, all field types support the following common options.

An exception is the Hidden field type that only supports `name`, `widget`, `default` and `i18n` options since it has no UI.

#### Required Options

##### `name`

- **Type**: `string`

The unique identifier for the field within a field list. This option is required for all field types, including the [Hidden](https://sveltiacms.app/en/docs/fields/hidden) field type. It’s used as the key in the output data and to reference the field in various contexts, such as in [Compute](https://sveltiacms.app/en/docs/fields/compute) and [Relation](https://sveltiacms.app/en/docs/fields/relation) fields as well as an [entry collection](https://sveltiacms.app/en/docs/collections/entries)’s `identifier_field`, `summary`, `sortable_fields`, and so on.

The naming convention for field names is typically `snake_case` or `camelCase` — it’s up to you to choose a consistent style. However, it cannot contain spaces or special characters like a dot (`.`) or an asterisk (`*`).

There are two special field names to be aware of:

- A field named `title` is treated as the default `identifier_field` for an [entry collection](https://sveltiacms.app/en/docs/collections/entries), meaning it will be used as the entry title and slug unless another field is explicitly set as the `identifier_field`.
- A field named `body` is treated as the main content of the entry, and its value will be placed below the front matter if the collection uses a front matter format like YAML, TOML, or JSON. This behavior can be configured using the [`body_field` option](https://sveltiacms.app/en/docs/collections/entries#body-field-for-front-matter-formats) for collections and collection files.

#### Optional Options

##### `widget`

- **Type**: `string`
- **Default**: `string`

A field type. It’s one of the lowercase names of the [built-in field types](#built-in-field-types) or a registered [custom field type](https://sveltiacms.app/en/docs/api/field-types) name. If not specified, it defaults to `string`, which is a single-line text input.

##### `label`

- **Type**: `string`
- **Default**: value of the `name` option

The human-readable label for the field. It’s displayed in the UI as the field’s title.

##### `comment`

- **Type**: `string`
- **Default**: `""`

A description or comment for the field. It’s displayed between the field label and the field input in the UI. Basic Markdown formatting is supported, including bold, italics, links, and inline code.

##### `hint`

- **Type**: `string`
- **Default**: `""`

A short description or hint for the field value, which provides additional context to users. It’s displayed below the field input in the UI. Basic Markdown formatting is supported, including bold, italics, links, and inline code.

##### `required`

- **Type**: `boolean` or array of locale codes
- **Default**: `true`

A boolean indicating whether **data input** is required for the field. Unless explicitly set to `false`, fields are required by default, meaning users must provide a value when creating or editing an entry.

If [i18n](https://sveltiacms.app/en/docs/i18n) is enabled, the option accepts an array of locale codes to specify which locales require input. For example, `required: [en, fr]` means that input is required for English and French locales only.

If the `omit_empty_optional_fields` [output option](https://sveltiacms.app/en/docs/data-output#controlling-data-output) is enabled, this option affects **data output** as well. The default value is `true`, meaning optional fields left empty will be omitted from the output. If set to `false`, optional fields left empty will be included in the output with a value of `null`, empty string, or empty array/object, depending on the field type.

##### `pattern`

- **Type**: `array` of `string` (or `RegExp` in JavaScript API)

An array containing a [regular expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Regular_expressions) pattern and an error message to validate the field’s value. The regular expression can be provided in one of the following formats:

- A string representing the regex pattern without delimiters, e.g., `'^[A-Za-z0-9]+$'`.
- A string representing the regex pattern with delimiters and flags, e.g., `'/^[a-z0-9]+$/i'`. The delimiters must be slashes `/`.
- A `RegExp` object when using the [JavaScript API](https://sveltiacms.app/en/docs/api/initialization).

For example, to restrict a string field to only alphanumeric characters, you can use the following configuration:

```yaml [YAML]
pattern:
  - '^[A-Za-z0-9]+$'
  - 'Only alphanumeric characters are allowed.'
```

```toml [TOML]
pattern = [ "^[A-Za-z0-9]+$", "Only alphanumeric characters are allowed." ]
```

```json [JSON]
"pattern": [
  "^[A-Za-z0-9]+$",
  "Only alphanumeric characters are allowed."
]
```

```js [JavaScript]
pattern: [/^[A-Za-z0-9]+$/, 'Only alphanumeric characters are allowed.'];
```

##### `readonly`

- **Type**: `boolean`
- **Default**: `false` (except for UUID fields, which default to `true`)

A boolean indicating whether the field is read-only. It’s useful for fields with a default value that should not be modified by users.

##### `preview`

- **Type**: `boolean`
- **Default**: `true`

Whether to show a preview of the field’s value in the entry’s preview pane. This is useful for fields with large content, such as rich text or code fields, where a preview may not be necessary.

##### `i18n`

- **Type**: `boolean` or `duplicate`
- **Default**: `false`

Indicates whether the field supports internationalization (i18n). See the [i18n documentation](https://sveltiacms.app/en/docs/i18n#field-level-configuration) for more details.

### Field Validation

All visible fields support various validation options to ensure data integrity. Common validation options include:

- By default, fields are required to be filled out unless the `required` option is explicitly set to `false`. If i18n is enabled for a field, all localized versions of the field are required unless [specified otherwise](https://sveltiacms.app/en/docs/i18n#field-level-configuration).
- String-type and some other simple array-type fields support the `pattern` option, which allows you to define a regular expression that the field’s value must match. This is useful for enforcing specific formats.
- Some fields support minimum and maximum values/items/lengths or value types, depending on the field type. For example:
  - The [String](https://sveltiacms.app/en/docs/fields/string) field supports `minLength` and `maxLength` options as well as the `type` option that can enforce formats like `email` or `url`.
  - The [Number](https://sveltiacms.app/en/docs/fields/number) field supports `min`, `max` and `value_type` options.
  - Other multi-value fields like [List](https://sveltiacms.app/en/docs/fields/list) and [KeyValue](https://sveltiacms.app/en/docs/fields/keyvalue) support `min` and `max` options.

If more complicated validation logic is needed, consider creating a [custom field type](https://sveltiacms.app/en/docs/api/field-types) that implements the desired validation behavior.

### Examples

#### Blog Post Fields

Here is an example configuration for fields in a blog post collection:

```yaml [YAML]
fields:
  - name: title
    label: Title
    widget: string
    hint: The title of the blog post
    default: Untitled Post
  - name: published
    label: Published
    widget: boolean
    required: false
    default: false
  - name: date
    label: Publication Date
    widget: datetime
    default: '{{now}}'
  - name: body
    label: Body
    widget: richtext
```

```toml [TOML]
[[fields]]
name = "title"
label = "Title"
widget = "string"
hint = "The title of the blog post"
default = "Untitled Post"

[[fields]]
name = "published"
label = "Published"
widget = "boolean"
required = false
default = false

[[fields]]
name = "date"
label = "Publication Date"
widget = "datetime"
default = "{{now}}"

[[fields]]
name = "body"
label = "Body"
widget = "richtext"
```

```json [JSON]
{
  "fields": [
    {
      "name": "title",
      "label": "Title",
      "widget": "string",
      "hint": "The title of the blog post",
      "default": "Untitled Post"
    },
    {
      "name": "published",
      "label": "Published",
      "widget": "boolean",
      "required": false,
      "default": false
    },
    {
      "name": "date",
      "label": "Publication Date",
      "widget": "datetime",
      "default": "{{now}}"
    },
    {
      "name": "body",
      "label": "Body",
      "widget": "richtext"
    }
  ]
}
```

```js [JavaScript]
fields: [
  {
    name: 'title',
    label: 'Title',
    widget: 'string',
    hint: 'The title of the blog post',
    default: 'Untitled Post',
  },
  {
    name: 'published',
    label: 'Published',
    widget: 'boolean',
    required: false,
    default: false,
  },
  {
    name: 'date',
    label: 'Publication Date',
    widget: 'datetime',
    default: '{{now}}',
  },
  {
    name: 'body',
    label: 'Body',
    widget: 'richtext',
  },
];
```

Output data for a blog post using the above configuration might look like this:

```md [Markdown]
---
title: My First Blog Post
published: true
date: 2024-06-15T10:00:00Z
---

# Welcome to my blog

This is the content of my first blog post.
```

```yaml [YAML]
title: My First Blog Post
published: true
date: 2024-06-15T10:00:00Z
body: |
  # Welcome to my blog

  This is the content of my first blog post.
```

```toml [TOML]
title = "My First Blog Post"
published = true
date = 2024-06-15T10:00:00Z
body = '''# Welcome to my blog

This is the content of my first blog post.
'''
```

```json [JSON]
{
  "title": "My First Blog Post",
  "published": true,
  "date": "2024-06-15T10:00:00Z",
  "body": "# Welcome to my blog\n\nThis is the content of my first blog post."
}
```

Source: https://sveltiacms.app/en/docs/fields

---

## String Field

The String field type allows users to input and manage short to medium-length text strings within the CMS entry form.

**Alternative for longer or multiple strings**

If you need to handle longer text content, consider using the [Text](https://sveltiacms.app/en/docs/fields/text) or [RichText](https://sveltiacms.app/en/docs/fields/richtext) field type instead.

If you need to manage multiple strings, consider using the simple [List](https://sveltiacms.app/en/docs/fields/list) field type instead.

### User Interface

#### Editor

Single-line text input field for entering short to medium-length strings. It supports standard text input features like copy-paste, undo-redo, and basic keyboard shortcuts.

Additional text can be displayed before or after the input field using the `before_input` and `after_input` options.

A character counter can be displayed if `minlength` or `maxlength` option is set, and a user-friendly validation message will appear if the input does not meet the specified length requirements.

Emoji autocomplete is enabled by default, unless the `type` option is `url` or `email`. Typing a colon followed by one or more characters, such as `:smi`, brings up a list of matching emojis, the same way it works on GitHub, Slack and other apps. Use the arrow keys to move through the list, the Enter or Tab key to insert the selected emoji, and the Escape key to dismiss the list. This can be turned off with the `use_emoji_autocomplete` option.

#### Preview

A read-only view of the entered string. If the `prefix` or `suffix` options are set, they will be displayed along with the string in the preview.

If the string is a YouTube video URL, it will be automatically embedded in the preview for better visualization.

If the string is a regular URL, it will be displayed as a clickable link that opens in a new browser tab.

**CSP**

You may need to update your Content Security Policy (CSP) to allow embedding YouTube videos. See the [CSP documentation](https://sveltiacms.app/en/docs/security#setting-up-content-security-policy) for more details.

### Data Type

A string. If the `required` option is set to `false` and the field is left empty, the value will be an empty string.

### Data Validation

- If the `required` option is set to `true`, the string must not be empty.
- If `minlength` and/or `maxlength` options are specified, the string length must be within the defined limits.
- If the `pattern` option is provided, the string must match the specified regular expression pattern.

### Options

In addition to the [common field options](https://sveltiacms.app/en/docs/fields#common-options), the String field supports the following options:

#### Optional Options

##### `widget`

- **Type**: `string`
- **Default**: `string`

Must be set to `string`, but is optional since it is the default field type.

##### `default`

- Type: `string`
- **Default**: `""`

The default value for the field when creating a new entry.

##### `type`

- Type: `string`
- **Default**: `""`

The value type, either `url` or `email`. This option changes the input type attribute accordingly for better mobile keyboard support, and also enables basic validation for URL or email format.

##### `prefix`

- **Type**: `string`
- **Default**: `""`

Strings to be prepended to the value when saving or displaying it. If the value is empty, the prefix will not be added.

##### `suffix`

- **Type**: `string`
- **Default**: `""`

Strings to be appended to the value when saving or displaying it. If the value is empty, the suffix will not be added.

##### `minlength`

- **Type**: `integer`
- **Default**: `0`

Minimum length of the string. This enables character counter in the UI and validation.

##### `maxlength`

- **Type**: `integer`
- **Default**: `Infinity`

Maximum length of the string. This enables character counter in the UI and validation.

##### `before_input`

- **Type**: `string`
- **Default**: `""`

Text to display before the input field.

##### `after_input`

- **Type**: `string`
- **Default**: `""`

Text to display after the input field.

##### `use_emoji_autocomplete`

- **Type**: `boolean`
- **Default**: `true`, unless the `type` option is `url` or `email`

Whether to enable emoji autocomplete in the text input. When set to `true`, typing a colon followed by one or more characters, such as `:smi`, brings up a list of matching emojis that can be inserted into the field. The colon must be at the beginning of the input or preceded by a space or an opening bracket, so a colon in the middle of a word, as in `12:34`, does not trigger the suggestions.

### Examples

#### Basic String Field

The following example demonstrates a basic String field for entering a title. Note that the `widget` option is optional since `string` is the default field type.

```yaml [YAML]
- name: title
  label: Title
```

```toml [TOML]
[[fields]]
name = "title"
label = "Title"
```

```json [JSON]
{
  "name": "title",
  "label": "Title"
}
```

```js [JavaScript]
{
  name: "title",
  label: "Title",
}
```

Output example:

```yaml [YAML]
title: My First Post
```

```toml [TOML]
title = "My First Post"
```

```json [JSON]
{
  "title": "My First Post"
}
```

#### Minimum and Maximum Length

The following example demonstrates a String field with `minlength` and `maxlength` options set to enforce input length constraints. It also includes a `default` value.

```yaml [YAML]
- name: title
  label: Title
  widget: string
  default: 'Enter your title here.'
  minlength: 5
  maxlength: 100
```

```toml [TOML]
[[fields]]
name = "title"
label = "Title"
widget = "string"
default = "Enter your title here."
minlength = 5
maxlength = 100
```

```json [JSON]
{
  "name": "title",
  "label": "Title",
  "widget": "string",
  "default": "Enter your title here.",
  "minlength": 5,
  "maxlength": 100
}
```

```js [JavaScript]
{
  name: "title",
  label: "Title",
  widget: "string",
  default: "Enter your title here.",
  minlength: 5,
  maxlength: 100,
}
```

Output example:

```yaml [YAML]
title: My Second Post
```

```toml [TOML]
title = "My Second Post"
```

```json [JSON]
{
  "title": "My Second Post"
}
```

#### URL Field

The following example demonstrates a String field configured for URL input. Validation will ensure that the entered value is a properly formatted URL.

```yaml [YAML]
- name: website
  label: Website
  widget: string
  type: url
```

```toml [TOML]
[[fields]]
name = "website"
label = "Website"
widget = "string"
type = "url"
```

```json [JSON]
{
  "name": "website",
  "label": "Website",
  "widget": "string",
  "type": "url"
}
```

```js [JavaScript]
{
  name: "website",
  label: "Website",
  widget: "string",
  type: "url",
}
```

Output example:

```yaml [YAML]
website: https://example.com
```

```toml [TOML]
website = "https://example.com"
```

```json [JSON]
{
  "website": "https://example.com"
}
```

#### Email Field with Prefix and Suffix

Some use cases may require adding specific text before or after the input value, such as `mailto:` for email links or query parameters. The following example demonstrates a String field configured for email input with `prefix` and `suffix` options.

```yaml [YAML]
- name: contact_email_link
  label: Contact Email Link
  widget: string
  type: email
  prefix: 'mailto:'
  suffix: '?subject=Inquiry'
```

```toml [TOML]
[[fields]]
name = "contact_email_link"
label = "Contact Email Link"
widget = "string"
type = "email"
prefix = "mailto:"
suffix = "?subject=Inquiry"
```

```json [JSON]
{
  "name": "contact_email_link",
  "label": "Contact Email Link",
  "widget": "string",
  "type": "email",
  "prefix": "mailto:",
  "suffix": "?subject=Inquiry"
}
```

```js [JavaScript]
{
  name: "contact_email_link",
  label: "Contact Email Link",
  widget: "string",
  type: "email",
  prefix: "mailto:",
  suffix: "?subject=Inquiry",
}
```

Output example:

```yaml [YAML]
contact_email_link: mailto:contact@example.com?subject=Inquiry
```

```toml [TOML]
contact_email_link = "mailto:contact@example.com?subject=Inquiry"
```

```json [JSON]
{
  "contact_email_link": "mailto:contact@example.com?subject=Inquiry"
}
```

```js [JavaScript]
{
  contact_email_link: 'mailto:contact@example.com?subject=Inquiry';
}
```

Alternatively, you can use a Compute field to generate the full email link based on a separate email String field, as shown in the [Compute field documentation](https://sveltiacms.app/en/docs/fields/compute#email-link).

#### Hashtag Field

The following example demonstrates a String field configured for entering hashtags, with a `#` symbol displayed before the input field and a hint to guide users. Unlike the `prefix` option, which adds text to the saved value, the `before_input` option only affects the UI display, not the stored data.

```yaml [YAML]
- name: hashtag
  label: Hashtag
  widget: string
  before_input: '#'
  hint: 'Enter a hashtag without the # symbol.'
```

```toml [TOML]
[[fields]]
name = "hashtag"
label = "Hashtag"
widget = "string"
before_input = "#"
hint = "Enter a hashtag without the # symbol."
```

```json [JSON]
{
  "name": "hashtag",
  "label": "Hashtag",
  "widget": "string",
  "before_input": "#",
  "hint": "Enter a hashtag without the # symbol."
}
```

```js [JavaScript]
{
  name: "hashtag",
  label: "Hashtag",
  widget: "string",
  before_input: "#",
  hint: "Enter a hashtag without the # symbol.",
}
```

Output example:

```yaml [YAML]
hashtag: travel
```

```toml [TOML]
hashtag = "travel"
```

```json [JSON]
{
  "hashtag": "travel"
}
```

Source: https://sveltiacms.app/en/docs/fields/string

---

## Text Field

The Text field type provides a multi-line text area for users to input longer strings of text within the CMS.

**Alternative for shorter or rich text**

If you need to handle shorter text content, consider using the [String](https://sveltiacms.app/en/docs/fields/string) field type instead.

If you need rich text formatting, consider using the [RichText](https://sveltiacms.app/en/docs/fields/richtext) field type instead.

### User Interface

#### Editor

Multi-line text area for entering longer strings of text. It supports standard text input features like copy-paste, undo-redo, and basic keyboard shortcuts.

A character counter can be displayed if `minlength` or `maxlength` option is set, and a user-friendly validation message will appear if the input does not meet the specified length requirements.

Emoji autocomplete is enabled by default. Typing a colon followed by one or more characters, such as `:smi`, brings up a list of matching emojis, the same way it works on GitHub, Slack and other apps. Use the arrow keys to move through the list, the Enter or Tab key to insert the selected emoji, and the Escape key to dismiss the list. This can be turned off with the `use_emoji_autocomplete` option.

#### Preview

A read-only view of the entered text.

### Data Type

A string with possible line breaks (`\n` characters) representing the entered text. If the `required` option is set to `false` and the field is left empty, the value will be an empty string.

### Data Validation

- If the `required` option is set to `true`, the text must not be empty.
- If `minlength` and/or `maxlength` options are specified, the text length must be within the defined limits.
- If the `pattern` option is provided, the text must match the specified regular expression pattern.

### Options

In addition to the [common field options](https://sveltiacms.app/en/docs/fields#common-options), the Text field supports the following options:

#### Required Options

##### `widget`

- **Type**: `string`
- **Default**: `string`

Must be set to `text`.

#### Optional Options

##### `default`

- **Type**: `string`
- **Default**: `""`

The default value for the field when creating a new entry.

##### `minlength`

- **Type**: `integer`
- **Default**: `0`

Minimum length of the string. This enables character counter in the UI and validation.

##### `maxlength`

- **Type**: `integer`
- **Default**: `Infinity`

Maximum length of the string. This enables character counter in the UI and validation.

##### `use_emoji_autocomplete`

- **Type**: `boolean`
- **Default**: `true`

Whether to enable emoji autocomplete in the text area. When set to `true`, typing a colon followed by one or more characters, such as `:smi`, brings up a list of matching emojis that can be inserted into the field. The colon must be at the beginning of a line or preceded by a space or an opening bracket, so a colon in the middle of a word, as in `12:34`, does not trigger the suggestions.

### Examples

#### Basic Text Field

This example shows a simple Text field without any additional options.

```yaml [YAML]
- name: description
  label: Description
  widget: text
```

```toml [TOML]
[[fields]]
name = "description"
label = "Description"
widget = "text"
```

```json [JSON]
{
  "name": "description",
  "label": "Description",
  "widget": "text"
}
```

```js [JavaScript]
{
  name: "description",
  label: "Description",
  widget: "text",
}
```

Output example:

```yaml [YAML]
description: "This is a sample description.\nIt can span multiple lines."
```

```toml [TOML]
description = """This is a sample description.
It can span multiple lines."""
```

```json [JSON]
{
  "description": "This is a sample description.\nIt can span multiple lines."
}
```

#### Default Text Field with Length Restrictions

This example shows a Text field with a default value and length restrictions. The field requires a minimum of 10 characters and allows a maximum of 500 characters.

```yaml [YAML]
- name: description
  label: Description
  widget: text
  default: 'Enter your description here.'
  minlength: 10
  maxlength: 500
```

```toml [TOML]
[[fields]]
name = "description"
label = "Description"
widget = "text"
default = "Enter your description here."
minlength = 10
maxlength = 500
```

```json [JSON]
{
  "name": "description",
  "label": "Description",
  "widget": "text",
  "default": "Enter your description here.",
  "minlength": 10,
  "maxlength": 500
}
```

```js [JavaScript]
{
  name: "description",
  label: "Description",
  widget: "text",
  default: "Enter your description here.",
  minlength: 10,
  maxlength: 500,
}
```

Output example:

```yaml [YAML]
description: 'Enter your description here.'
```

```toml [TOML]
description = "Enter your description here."
```

```json [JSON]
{
  "description": "Enter your description here."
}
```

Source: https://sveltiacms.app/en/docs/fields/text

---

## Number Field

The Number field type allows users to input numeric values using a specialized input field that supports incrementing and decrementing values.

### User Interface

#### Editor

Text input field that only accepts numeric values. It includes up and down arrows for incrementing or decrementing the value, as well as support for decimal points and negative numbers.

Additional text can be displayed before or after the input field using the `before_input` and `after_input` options.

#### Preview

A localized string representation of the number, formatted according to the preview locale.

### Data Type

A number if the `value_type` option is set to `int` (default) or `float`. If the `required` option is set to `false` and the field is left empty, the value will be `null`.

If `value_type` is other than `int` or `float`, the value will be stored as a string.

### Data Validation

- If the `required` option is set to `true`, the number value must not be `null` (i.e., the field must not be left empty).
- The number value must be within the range defined by the `min` and `max` options, if specified.
- The number value must conform to the type defined by the `value_type` option.

### Options

In addition to the [common field options](https://sveltiacms.app/en/docs/fields#common-options), the Number field supports the following options:

#### Required Options

##### `widget`

- **Type**: `string`
- **Default**: `string`

Must be set to `number`.

#### Optional Options

**Breaking change from Netlify/Decap CMS**

Sveltia CMS does not support the deprecated camelCase `valueType` option. Use `value_type` instead.

##### `default`

- **Type**: `number`
- **Default**: `null`

The default value for the field.

##### `value_type`

- **Type**: `string`
- **Default**: `int`

The type of value to store. Can be one of the following:

- `int`: The UI only accepts integer input, and the value is stored as an integer.
- `float`: The UI accepts decimal input, and the value is stored as a floating-point number.
- `int/string`: The UI only accepts integer input, but the value is stored as a string.
- `float/string`: The UI accepts decimal input, but the value is stored as a string.

**Note for Netlify/Decap CMS users**

The [Netlify/Decap CMS document](https://decapcms.org/docs/widgets/#Number) says the `value_type` option accepts any type other than `int` and `float` , which results in the value being stored as a string. However, it actually doesn’t work in Decap CMS. So, Sveltia CMS only supports `int` and `float`, along with the new `int/string` and `float/string` types. Other types will default to `int`.

##### `min`

- **Type**: `number`
- **Default**: `-Infinity`

The minimum allowed value for the field. This enables validation to ensure that users enter a value greater than or equal to this minimum.

##### `max`

- **Type**: `number`
- **Default**: `Infinity`

The maximum allowed value for the field. This enables validation to ensure that users enter a value less than or equal to this maximum.

##### `step`

- **Type**: `number`
- **Default**: `1`

The increment/decrement step for the input field. This determines the amount by which the value changes when using the up and down arrows.

##### `before_input`

- **Type**: `string`
- **Default**: `""`

Additional text to display before the input field.

##### `after_input`

- **Type**: `string`
- **Default**: `""`

Additional text to display after the input field.

### Examples

#### Basic Number Field

This example demonstrates a simple Number field configuration that allows users to input integer values.

```yaml [YAML]
- name: quantity
  label: Quantity
  widget: number
```

```toml [TOML]
[[fields]]
name = "quantity"
label = "Quantity"
widget = "number"
```

```json [JSON]
{
  "name": "quantity",
  "label": "Quantity",
  "widget": "number"
}
```

```js [JavaScript]
{
  name: 'quantity',
  label: 'Quantity',
  widget: 'number',
}
```

Output example:

```yaml [YAML]
quantity: 5
```

```toml [TOML]
quantity = 5
```

```json [JSON]
{
  "quantity": 5
}
```

#### Price Field

This example demonstrates a Number field configured to store floating-point values, suitable for representing prices. It includes a dollar sign before the input field and sets a default value.

```yaml [YAML]
- name: price
  label: Price
  widget: number
  value_type: float
  before_input: $
  default: 9.99
```

```toml [TOML]
[[fields]]
name = "price"
label = "Price"
widget = "number"
value_type = "float"
before_input = "$"
default = 9.99
```

```json [JSON]
{
  "name": "price",
  "label": "Price",
  "widget": "number",
  "value_type": "float",
  "before_input": "$",
  "default": 9.99
}
```

```js [JavaScript]
{
  name: 'price',
  label: 'Price',
  widget: 'number',
  value_type: 'float',
  before_input: '$',
  default: 9.99,
}
```

Output example:

```yaml [YAML]
price: 19.99
```

```toml [TOML]
price = 19.99
```

```json [JSON]
{
  "price": 19.99
}
```

Source: https://sveltiacms.app/en/docs/fields/number

---

## Boolean Field

The Boolean field type allows users to select a true/false value using a toggle switch interface.

### User Interface

#### Editor

A toggle switch. It can be turned on or off by clicking or tapping it, like a checkbox.

Additional text can be displayed before or after the switch using the `before_input` and `after_input` options.

#### Preview

The preview shows the boolean value as `true` or `false`.

### Data Type

A boolean. If the `required` option is set to `false` and the field is left empty, the value will be `false`.

### Data Validation

No special validation is performed for Boolean fields as the value will always be either `true` or `false`.

### Options

In addition to the [common field options](https://sveltiacms.app/en/docs/fields#common-options), the Boolean field supports the following options:

#### Required Options

##### `widget`

- **Type**: `string`
- **Default**: `string`

Must be set to `boolean`.

#### Optional Options

##### `default`

- **Type**: `boolean`
- **Default**: `false`

The default value for the field when creating a new entry.

##### `before_input`

- **Type**: `string`
- **Default**: `""`

Text to display before the toggle switch. It’s placed at the `false` position.

##### `after_input`

- **Type**: `string`
- **Default**: `""`

Text to display after the toggle switch. It’s placed at the `true` position.

### Examples

#### Basic Boolean Field

Configuration example:

```yaml [YAML]
- name: draft
  label: Draft
  widget: boolean
  default: true
```

```toml [TOML]
[[fields]]
name = "draft"
label = "Draft"
widget = "boolean"
default = true
```

```json [JSON]
{
  "name": "draft",
  "label": "Draft",
  "widget": "boolean",
  "default": true
}
```

```js [JavaScript]
{
  name: "draft",
  label: "Draft",
  widget: "boolean",
  default: true,
}
```

Output example:

```yaml [YAML]
draft: true
```

```toml [TOML]
draft = true
```

```json [JSON]
{
  "draft": true
}
```

Source: https://sveltiacms.app/en/docs/fields/boolean

---

## Select Field

The Select field type allows users to choose one or more options from a predefined list within the CMS entry form.

**Alternative for dynamic or boolean selects**

The options in a Select field are meant to be a static list of a small number of choices defined in the configuration file. If you need dynamic options based on other collections, consider using the [Relation](https://sveltiacms.app/en/docs/fields/relation) field type instead. See also our [how-to guide](https://sveltiacms.app/en/docs/how-tos#using-entry-tags-for-categorization) on using entry tags for categorization.

For boolean (true/false) selections, consider using the [Boolean](https://sveltiacms.app/en/docs/fields/boolean) field type.

### User Interface

#### Editor

Radio buttons (single select) or checkboxes (multi select) for choosing options. If there are many entries, a dropdown with search functionality will be used instead. Use the `dropdown_threshold` option to customize when to switch to the dropdown UI.

For multi-select options with many entries, a tag input UI will be used instead of checkboxes to save space. Items can be reordered by dragging and dropping or using right/left arrow keys. Items can also be removed by clicking the ✕ icon on each item.

#### Preview

A string or a list of strings representing the selected option(s).

### Data Type

It depends on the `options`. Usually a string or an array of strings, depending on whether the `multiple` option is set to `true` or `false`, but can also be a number or an array of numbers if the options are defined as such.

If the `required` option is set to `false` and no option is selected, the value will be `null` for single select or an empty array for multi select.

### Data Validation

- If the `required` option is set to `true`, at least one option must be selected.
- If the `multiple` option is enabled, the number of selected options must be between the `min` and `max` limits, if specified.

### Options

In addition to the [common field options](https://sveltiacms.app/en/docs/fields#common-options), the Select field supports the following options:

#### Required Options

##### `widget`

- **Type**: `string`
- **Default**: `string` The `options` can be defined with custom labels and values. The following example shows a select field for choosing a color with specific hex values. Must be set to `select`.

##### `options`

- **Type**: `array`
- **Default**: `[]`

An array of options for the select field. Each option can be defined as a string/number or as an object with `label` and `value` properties. These options will be presented to the user in the UI.

The following are valid examples of the `options` configuration:

```yaml [YAML]
options:
  - London
  - Paris
  - New York
```

```toml [TOML]
options = ["London", "Paris", "New York"]
```

```json [JSON]
{
  "options": ["London", "Paris", "New York"]
}
```

```js [JavaScript]
options: ['London', 'Paris', 'New York'],
```

```yaml [YAML]
options: [1, 2, 3]
```

```toml [TOML]
options = [1, 2, 3]
```

```json [JSON]
{
  "options": [1, 2, 3]
}
```

```js [JavaScript]
options: [1, 2, 3],
```

```yaml [YAML]
options:
  - { label: Toronto, value: YYZ }
  - { label: Vancouver, value: YVR }
  - { label: Montreal, value: YUL }
```

```toml [TOML]
[[options]]
label = "Toronto"
value = "YYZ"
[[options]]
label = "Vancouver"
value = "YVR"
[[options]]
label = "Montreal"
value = "YUL"
```

```json [JSON]
{
  "options": [
    { "label": "Toronto", "value": "YYZ" },
    { "label": "Vancouver", "value": "YVR" },
    { "label": "Montreal", "value": "YUL" }
  ]
}
```

```js [JavaScript]
options: [
  { label: 'Toronto', value: 'YYZ' },
  { label: 'Vancouver', value: 'YVR' },
  { label: 'Montreal', value: 'YUL' },
],
```

```yaml [YAML]
options:
  - { label: Red, value: 1 }
  - { label: Green, value: 2 }
  - { label: Blue, value: 3 }
```

```toml [TOML]
[[options]]
label = "Red"
value = 1
[[options]]
label = "Green"
value = 2
[[options]]
label = "Blue"
value = 3
```

```json [JSON]
{
  "options": [
    { "label": "Red", "value": 1 },
    { "label": "Green", "value": 2 },
    { "label": "Blue", "value": 3 }
  ]
}
```

```js [JavaScript]
options: [
  { label: 'Red', value: 1 },
  { label: 'Green', value: 2 },
  { label: 'Blue', value: 3 },
],
```

#### Optional Options

##### `default`

- **Type**: `string`, `number`, `array of strings`, or `array of numbers`
- **Default**: `null` or `[]`

The default value for the field. Should be a string or number for single select, or an array of strings or numbers for multi select, depending on the `multiple` option.

##### `dropdown_threshold`

- **Type**: `integer`
- **Default**: `5`

The number of options at which to switch from radio buttons/checkboxes to a dropdown UI. If the number of options exceeds this threshold, a dropdown with search functionality will be used.

##### `multiple`

- **Type**: `boolean`
- **Default**: `false`

Whether to allow selecting multiple options.

##### `min`

- **Type**: `integer`
- **Default**: `0`

The minimum number of options required. This enables validation to ensure that users select at least this many options. Ignored if `multiple` is set to `false`.

##### `max`

- **Type**: `integer`
- **Default**: `Infinity`

The maximum number of options allowed. This enables validation to prevent users from selecting more than this many options. Ignored if `multiple` is set to `false`.

### Examples

#### Single Select

The following example shows a basic single select field for choosing a country.

```yaml [YAML]
- name: country
  label: Country
  widget: select
  options:
    - USA
    - Canada
    - Mexico
```

```toml [TOML]
[[fields]]
name = "country"
label = "Country"
widget = "select"
options = ["USA", "Canada", "Mexico"]
```

```json [JSON]
{
  "fields": [
    {
      "name": "country",
      "label": "Country",
      "widget": "select",
      "options": ["USA", "Canada", "Mexico"]
    }
  ]
}
```

```js [JavaScript]
{
  fields: [
    {
      name: 'country',
      label: 'Country',
      widget: 'select',
      options: ['USA', 'Canada', 'Mexico'],
    },
  ],
}
```

Output example when “Canada” is selected:

```yaml [YAML]
country: Canada
```

```toml [TOML]
country = "Canada"
```

```json [JSON]
{
  "country": "Canada"
}
```

#### Custom Labels and Values

The `options` can be defined with custom labels and values. The following example shows a select field for choosing a color with specific hex values.

```yaml [YAML]
- name: color
  label: Color
  widget: select
  options:
    - { label: Red, value: '#FF0000' }
    - { label: Green, value: '#00FF00' }
    - { label: Blue, value: '#0000FF' }
```

```toml [TOML]
[[fields]]
name = "color"
label = "Color"
widget = "select"
[[options]]
label = "Red"
value = "#FF0000"
[[options]]
label = "Green"
value = "#00FF00"
[[options]]
label = "Blue"
value = "#0000FF"
```

```json [JSON]
{
  "fields": [
    {
      "name": "color",
      "label": "Color",
      "widget": "select",
      "options": [
        { "label": "Red", "value": "#FF0000" },
        { "label": "Green", "value": "#00FF00" },
        { "label": "Blue", "value": "#0000FF" }
      ]
    }
  ]
}
```

```js [JavaScript]
{
  fields: [
    {
      name: 'color',
      label: 'Color',
      widget: 'select',
      options: [
        { label: 'Red', value: '#FF0000' },
        { label: 'Green', value: '#00FF00' },
        { label: 'Blue', value: '#0000FF' },
      ],
    },
  ],
}
```

Output example when “Green” is selected:

```yaml [YAML]
color: '#00FF00'
```

```toml [TOML]
color = "#00FF00"
```

```json [JSON]
{
  "color": "#00FF00"
}
```

#### Multi Select with Limits

The following example shows a multi select field for choosing fruits, with a minimum of 1 and a maximum of 3 selections.

```yaml [YAML]
- name: fruits
  label: Fruits
  widget: select
  options:
    - Apple
    - Banana
    - Cherry
    - Date
  multiple: true
  min: 1
  max: 3
```

```toml [TOML]
[[fields]]
name = "fruits"
label = "Fruits"
widget = "select"
options = ["Apple", "Banana", "Cherry", "Date"]
multiple = true
min = 1
max = 3
```

```json [JSON]
{
  "fields": [
    {
      "name": "fruits",
      "label": "Fruits",
      "widget": "select",
      "options": ["Apple", "Banana", "Cherry", "Date"],
      "multiple": true,
      "min": 1,
      "max": 3
    }
  ]
}
```

```js [JavaScript]
{
  fields: [
    {
      name: 'fruits',
      label: 'Fruits',
      widget: 'select',
      options: ['Apple', 'Banana', 'Cherry', 'Date'],
      multiple: true,
      min: 1,
      max: 3,
    },
  ],
}
```

Output example when “Apple” and “Cherry” are selected:

```yaml [YAML]
fruits:
  - Apple
  - Cherry
```

```toml [TOML]
fruits = ["Apple", "Cherry"]
```

```json [JSON]
{
  "fruits": ["Apple", "Cherry"]
}
```

Source: https://sveltiacms.app/en/docs/fields/select

---

## Color Field

The Color field type allows users to select and input colors using a color picker interface.

### User Interface

#### Editor

The browser’s native color picker.

If the `enableAlpha` option is set to `true`, a slider for selecting the alpha (transparency) channel will also be displayed.

If the `allowInput` option is set to `true`, users can manually enter color values as text.

**Future Plans**

We plan to enhance the UI with a custom color picker in the future.

#### Preview

A small color swatch showing the selected color, along with its RGB(A) hex value and `rgb()` function notation.

### Data Type

A string representing the color in RGB format, e.g. `#RRGGBB`. The value is stored in uppercase letters.

If the `enableAlpha` option is set to `true`, the color will be stored in RGBA format, e.g. `#RRGGBBAA`.

If the `required` option is set to `false` and the field is left empty, the value will be an empty string.

### Data Validation

- If the `required` option is set to `true`, the color value must not be an empty string.
- The color value must be a valid hex color code, either in RGB (`#RRGGBB`) or RGBA (`#RRGGBBAA`) format, depending on the `enableAlpha` option.
- If the `pattern` option is provided, the color value must match the specified regular expression pattern.

### Options

In addition to the [common field options](https://sveltiacms.app/en/docs/fields#common-options), the Color field supports the following options:

#### Required Options

##### `widget`

- **Type**: `string`
- **Default**: `string`

Must be set to `color`.

#### Optional Options

**Tip**

Unlike most of other config options, `enableAlpha` and `allowInput` are camelCased.

##### `default`

- **Type**: `string`
- **Default**: `""` (empty string)

The default color value for the field, e.g. `#FF0000` for red. If `enableAlpha` is `true`, the default value should include the alpha channel, e.g. `#FF0000FF` for opaque red.

##### `enableAlpha`

- **Type**: `boolean`
- **Default**: `false`

If set to `true`, the color picker will allow selection of the alpha (transparency) channel, and the color value will be stored in RGBA format.

##### `allowInput`

- **Type**: `boolean`
- **Default**: `false`

If set to `true`, users can manually enter color values as text in addition to using the color picker.

### Examples

#### Basic Color Field

This example shows a simple Color field configuration.

```yaml [YAML]
- name: background_color
  label: Background Color
  widget: color
```

```toml [TOML]
[[fields]]
name = "background_color"
label = "Background Color"
widget = "color"
```

```json [JSON]
{
  "name": "background_color",
  "label": "Background Color",
  "widget": "color"
}
```

```js [JavaScript]
{
  name: "background_color",
  label: "Background Color",
  widget: "color",
}
```

Output example:

```yaml [YAML]
background_color: '#FFFFFF'
```

```toml [TOML]
background_color = "#FFFFFF"
```

```json [JSON]
{
  "background_color": "#FFFFFF"
}
```

#### Color Field with Alpha and Input Allowed

This example shows a Color field configuration with alpha channel enabled, manual input allowed, and a default value set.

```yaml [YAML]
- name: overlay_color
  label: Overlay Color
  widget: color
  enableAlpha: true
  allowInput: true
  default: '#00000080'
```

```toml [TOML]
[[fields]]
name = "overlay_color"
label = "Overlay Color"
widget = "color"
enableAlpha = true
allowInput = true
default = "#00000080"
```

```json [JSON]
{
  "name": "overlay_color",
  "label": "Overlay Color",
  "widget": "color",
  "enableAlpha": true,
  "allowInput": true,
  "default": "#00000080"
}
```

```js [JavaScript]
{
  name: "overlay_color",
  label: "Overlay Color",
  widget: "color",
  enableAlpha: true,
  allowInput: true,
  default: "#00000080",
}
```

Output example:

```yaml [YAML]
overlay_color: '#00000080'
```

```toml [TOML]
overlay_color = "#00000080"
```

```json [JSON]
{
  "overlay_color": "#00000080"
}
```

Source: https://sveltiacms.app/en/docs/fields/color

---

## Hidden Field

The Hidden field type is used to store values that should not be visible or editable by users in the entry form. It is typically used for metadata or system-generated values.

### User Interface

None. A hidden field does not render any UI components in the entry form.

### Data Type

Any value assigned programmatically or via default settings.

### Data Validation

No specific data validation is applied to the Hidden field, as its value is not user-editable.

### Options

In addition to the [common field options](https://sveltiacms.app/en/docs/fields#common-options), the Hidden field supports the following options:

#### Required Options

##### `widget`

- **Type**: `string`
- **Default**: `string`

Must be set to `hidden`.

##### `default`

- **Type**: `any`
- **Default**: `""`

The default value for the hidden field when creating a new entry. Any data type is accepted (string, number, boolean, object, array, etc.) as long as it can be serialized to the collection’s data format (YAML, JSON, TOML, etc).

TOML does not support `null` values, so avoid using `null` as the default value when the collection’s data format is set to TOML.

The `default` value supports the following template tags:

- `{{locale}}`: The current locale code when [i18n support](https://sveltiacms.app/en/docs/i18n) is enabled, e.g. `en` or `fr`.
- `{{datetime}}`: The current date/time in [ISO 8601 format](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#date_time_string_format).
- `{{uuid}}`, `{{uuid_short}}` and `{{uuid_shorter}}`: A random UUID or its shorter version, just like the [slug template tags](https://sveltiacms.app/en/docs/collections/entries#slug-template-tags).
- `{{author-email}}`, `{{author-login}}` and `{{author-name}}`: The signed-in user’s email, login name and display name, respectively, just like [commit message tags](https://sveltiacms.app/en/docs/backends#commit-messages). These tags don’t work with the [local development workflow](https://sveltiacms.app/en/docs/workflows/local) because the user is not authenticated via a Git backend.

[String transformations](https://sveltiacms.app/en/docs/string-transformations) can be applied in this option.

### Examples

#### Embedding UUID in a Hidden Field

This example shows how to create a hidden field that automatically generates and stores a UUID for each entry. This can be useful for uniquely identifying entries.

```yaml [YAML]
- name: unique_id
  label: Unique ID
  widget: hidden
  default: '{{uuid}}'
```

```toml [TOML]
[[fields]]
name = "unique_id"
label = "Unique ID"
widget = "hidden"
default = "{{uuid}}"
```

```json [JSON]
{
  "name": "unique_id",
  "label": "Unique ID",
  "widget": "hidden",
  "default": "{{uuid}}"
}
```

```js [JavaScript]
{
  name: 'unique_id',
  label: 'Unique ID',
  widget: 'hidden',
  default: '{{uuid}}',
}
```

#### Embedding the Author’s Name in a Hidden Field

This example shows how to create a hidden field that automatically captures the name of the user creating the entry.

```yaml [YAML]
- name: author_name
  label: Author Name
  widget: hidden
  default: '{{author-name}}'
```

```toml [TOML]
[[fields]]
name = "author_name"
label = "Author Name"
widget = "hidden"
default = "{{author-name}}"
```

```json [JSON]
{
  "name": "author_name",
  "label": "Author Name",
  "widget": "hidden",
  "default": "{{author-name}}"
}
```

```js [JavaScript]
{
  name: 'author_name',
  label: 'Author Name',
  widget: 'hidden',
  default: '{{author-name}}',
}
```

Source: https://sveltiacms.app/en/docs/fields/hidden
