# Field Types: Structural

The List, Object and KeyValue field types that nest other fields. For rich text and code editing, see `fields-richtext.md`.

Generated from the Sveltia CMS documentation. Do not edit by hand.

## List Field

The List field type allows users to create and manage lists of items within the CMS entry form. It supports various configurations for defining the structure and type of items in the list, either as a simple array or as a list of complex objects.

### User Interface

#### Editor

The List field type has four different UI modes, depending on the configuration:

- Complex list field:
  - With the `field` option: A single subfield editor is shown for each item in the list.
  - With the `fields` option: A group of subfield editors is shown for each item in the list.
  - With the `types` option: A type selector is shown for each item, along with the corresponding subfield editors. This configuration is called a **variable type** list. It’s useful for creating flexible content structures like page builders.
- Simple list field:
  - Without the `field`, `fields` or `types` option: Each item is shown as a row with a single-line text input. Spaces and commas are treated as part of the item values instead of delimiters.

##### Complex list field

- Each item in the list can be expanded or collapsed to show or hide its subfields.
- Each item comes with a menu that allows users to duplicate the item, insert a new item above/below it, or remove it.
- Users can expand or collapse the entire list using the Expand All and Collapse All buttons.
- Each item can be reordered using the drag handle in the middle of its header:
  - Dragging the handle moves the item.
  - With the handle focused, the Up and Down arrow keys move the item one position, while Home and End send it to the top or bottom of the list.
  - On a touch screen, Move Up and Move Down buttons are shown in place of the handle, because drag and drop requires a mouse.

##### Simple list field

- Pressing Enter in an item’s input adds a new item below it. The Add button below the list appends one to the end.
- Each item comes with a Remove button.
- Each item can be reordered using the drag handle at the start of its row, with the same pointer, keyboard and touch screen behavior as a complex list field.
- The list always keeps one row, so that an empty list still offers somewhere to type. The Remove and reorder controls are disabled when a single item is left.
- Blank rows are ignored. The stored value is the list of the remaining items, each trimmed of surrounding spaces.

#### Preview

A list view displaying all items in the list. For complex list fields, grouped subfield values are shown for each item. For simple list fields, a bulleted list of string values is displayed.

### Data Type

An array. The elements can be strings or objects, depending on the configuration.

If the `required` option is set to `false` and the field is left empty, the value will be an empty array.

### Data Validation

- If the `required` option is set to `true`, the list must contain at least one item.
- If the `min` and/or `max` options are specified, the number of items in the list must be within the defined limits.
- Each item in the list is validated according to the subfield definitions, if applicable.

### Options

In addition to the [common field options](https://sveltiacms.app/en/docs/fields#common-options), the List field supports the following options:

#### Required Options

##### `widget`

- **Type**: `string`
- **Default**: `string`

Must be set to `list` to use the List field type.

#### General Options

##### `default`

- **Type**: `array`
- **Default**: `[]`

The default value for the field when creating a new entry. The shape of the array depends on how the list is configured:

- For a simple list without `field`, `fields` or `types`, an array of strings.
- For a list with a single `field`, an array of values for that subfield: strings for a String subfield, objects for an [Object](https://sveltiacms.app/en/docs/fields/object) or [KeyValue](https://sveltiacms.app/en/docs/fields/keyvalue) subfield, and so on.
- For a list with `fields`, an array of objects whose keys are the subfield names.
- For a list with `types`, an array of objects, each including the [`typeKey`](#typekey) property (`type` by default) to identify its variable type.

An item that doesn’t match the configuration — an object in a simple list, a plain value in a list with `fields` or `types`, a property that isn’t a subfield name, or a type name that isn’t one of the `types` — is reported as a config validation error on the login screen, because it would otherwise be silently dropped or saved to the entry as-is. See the [Default Values](#default-values) example below for each shape.

Note that the field can also be pre-filled with comma-separated [dynamic default values](https://sveltiacms.app/en/docs/ui/content-editor#dynamic-default-values) passed via URL query parameters. Dynamic values take precedence over the `default` option.

##### `label_singular`

- **Type**: `string`
- **Default**: The value of the `label` option

A label used for singular items in the list, e.g., “Member” for a list labeled “Members”. It will be displayed on the Add button and in other relevant places in the UI.

##### `min`

- **Type**: `integer`
- **Default**: `0`

The minimum number of items required in the list. If the number of items is below this value, a validation error will be shown.

##### `max`

- **Type**: `integer`
- **Default**: `Infinity`

The maximum number of items allowed in the list. If the number of items exceeds this value, a validation error will be shown.

#### Subfield Definition

These options are mutually exclusive; you can only use one of them at a time:

##### `field`

- **Type**: A single [field definition](https://sveltiacms.app/en/docs/fields)

##### `fields`

- **Type**: `array` of [field definitions](https://sveltiacms.app/en/docs/fields)

##### `types`

- **Type**: `array` of variable type definitions

Each type definition is an object with the following properties:

- `name` (string, required): The unique identifier for the type.
- `label` (string, required): The display label for the type.
- `widget` (string, optional): The field type for this type. It must be `object` if not omitted. Other field types are invalid.
- `fields` (array of field definitions, optional): The subfields for this type.

#### Subfield Options

These options are effective only when the `field`, `fields`, or `types` option is used:

##### `root`

- **Type**: `boolean`
- **Default**: `false`

Whether to store the list at the root level of the output file, without a parent key. This is useful for creating top-level lists in files.

The `root` option is ignored in the following cases:

- The file or singleton contains multiple fields. You can still have subfields under the List field.
- The file format is TOML, because TOML doesn’t support top-level arrays.

See the [Top-Level List](#top-level-list) example below for details.

##### `summary`

- **Type**: `string`
- **Default**: `""`

A template string used to generate a summary for each item in the collapsed view. It can include subfield values using the `{{subfield_name}}` syntax. [String transformations](https://sveltiacms.app/en/docs/string-transformations) can be applied in this option. If omitted, the summary will be automatically generated based on the first textual subfield found.

See the [Using Summary and Thumbnail](#using-summary-and-thumbnail) example below for details.

##### `thumbnail`

- **Type**: `string`
- **Default**: `""`

The name of an [Image](https://sveltiacms.app/en/docs/fields/image) or [File](https://sveltiacms.app/en/docs/fields/file) subfield to be used as the thumbnail for each list item in the collapsed view. The thumbnail is displayed next to the summary. A File subfield holding an image, video or PDF gets a thumbnail; other kinds of files are not shown. If omitted, no thumbnail will be displayed.

A subfield of a nested object can be referenced with dot notation, e.g. `mobile.src`. Like the `summary` template tags, the name can be prefixed with `fields.`. A name that doesn’t point to an Image or File subfield is reported as a config validation error on the login screen. With `types`, a name shared by the subfields of several types is accepted as long as one of them is an Image or File field.

See the [Using Summary and Thumbnail](#using-summary-and-thumbnail) example below for details.

##### `collapsed`

- **Type**: `boolean` or `auto`
- **Default**: `false`

Whether each item is initially collapsed in the UI. If set to `auto`, the UI is collapsed if an item has any filled subfields and expanded if all the subfields are empty.

##### `minimize_collapsed`

- **Type**: `boolean` or `auto`
- **Default**: `false`

Whether the entire list is minimized when collapsed. If set to `auto`, the list is minimized if any item has any filled subfields and expanded if all items are empty.

##### `allow_add`

- **Type**: `boolean`
- **Default**: `true`

Whether to allow adding new items to the list. If set to `false`, the Add button will be hidden.

##### `allow_remove`

- **Type**: `boolean`
- **Default**: `true`

Whether to allow removing items from the list. If set to `false`, the Remove button will be hidden.

##### `allow_duplicate`

- **Type**: `boolean`
- **Default**: `true`

Whether to allow duplicating items in the list. If set to `false`, the Duplicate button will be hidden.

##### `allow_reorder`

- **Type**: `boolean`
- **Default**: `true`

Whether to allow reordering of items in the list by dragging the handle in each item’s header, by using the keyboard while the handle is focused, or by using the Move Up and Move Down buttons shown on a touch screen. If set to `false`, the reorder controls will be hidden.

##### `add_to_top`

- **Type**: `boolean`
- **Default**: `false`

Whether to add new items to the top of the list instead of the bottom. If set to `true`, the Add button will appear at the top of the list.

##### `typeKey`

- **Type**: `string`
- **Default**: `type`

This option is effective only when the `types` option is used. It allows you to customize the name of the field that indicates the type of each item in the list. See the [Variable Type](#variable-type-with-custom-type-key) example below for details.

You cannot use a key that conflicts with any of the subfield names defined in the object.

**Tip**

Unlike most of other config options, `typeKey` is camelCased.

### Examples

#### Simple List

Configuration example:

```yaml [YAML]
- name: tags
  label: Tags
  widget: list
```

```toml [TOML]
[[fields]]
name = "tags"
label = "Tags"
widget = "list"
```

```json [JSON]
{
  "name": "tags",
  "label": "Tags",
  "widget": "list"
}
```

```js [JavaScript]
{
  name: "tags",
  label: "Tags",
  widget: "list",
}
```

Output example:

```yaml [YAML]
tags:
  - travel
  - photography
  - food
```

```toml [TOML]
tags = ["travel", "photography", "food"]
```

```json [JSON]
{
  "tags": ["travel", "photography", "food"]
}
```

#### Single Subfield

Configuration example:

```yaml [YAML]
- name: authors
  label: Authors
  widget: list
  field:
    name: author
    label: Author
    widget: string
```

```toml [TOML]
[[fields]]
name = "authors"
label = "Authors"
widget = "list"
[field]
name = "author"
label = "Author"
widget = "string"
```

```json [JSON]
{
  "name": "authors",
  "label": "Authors",
  "widget": "list",
  "field": {
    "name": "author",
    "label": "Author",
    "widget": "string"
  }
}
```

```js [JavaScript]
{
  name: "authors",
  label: "Authors",
  widget: "list",
  field: {
    name: "author",
    label: "Author",
    widget: "string",
  },
}
```

Output example:

```yaml [YAML]
authors:
  - Alice
  - Bob
  - Charlie
```

```toml [TOML]
authors = ["Alice", "Bob", "Charlie"]
```

```json [JSON]
{
  "authors": ["Alice", "Bob", "Charlie"]
}
```

Note that the `name` of the subfield will not appear in the output; only the values will be included in the list, just like a simple list.

#### Multiple Subfields

Configuration example:

```yaml [YAML]
- name: team_members
  label: Team Members
  widget: list
  fields:
    - name: name
      label: Name
      widget: string
    - name: role
      label: Role
      widget: string
```

```toml [TOML]
[[fields]]
name = "team_members"
label = "Team Members"
widget = "list"
[[fields.fields]]
name = "name"
label = "Name"
widget = "string"
[[fields.fields]]
name = "role"
label = "Role"
widget = "string"
```

```json [JSON]
{
  "name": "team_members",
  "label": "Team Members",
  "widget": "list",
  "fields": [
    {
      "name": "name",
      "label": "Name",
      "widget": "string"
    },
    {
      "name": "role",
      "label": "Role",
      "widget": "string"
    }
  ]
}
```

```js [JavaScript]
{
  name: "team_members",
  label: "Team Members",
  widget: "list",
  fields: [
    {
      name: "name",
      label: "Name",
      widget: "string",
    },
    {
      name: "role",
      label: "Role",
      widget: "string",
    },
  ],
}
```

Output example:

```yaml [YAML]
team_members:
  - name: Alice
    role: Developer
  - name: Bob
    role: Designer
  - name: Charlie
    role: Product Manager
```

```toml [TOML]
[[team_members]]
name = "Alice"
role = "Developer"

[[team_members]]
name = "Bob"
role = "Designer"

[[team_members]]
name = "Charlie"
role = "Product Manager"
```

```json [JSON]
{
  "team_members": [
    {
      "name": "Alice",
      "role": "Developer"
    },
    {
      "name": "Bob",
      "role": "Designer"
    },
    {
      "name": "Charlie",
      "role": "Product Manager"
    }
  ]
}
```

#### Using Summary and Thumbnail

Configuration example:

```yaml [YAML]
- name: projects
  label: Projects
  widget: list
  summary: "{{name}} - {{status}}"
  thumbnail: "image"
  fields:
    - name: name
      label: Name
      widget: string
    - name: status
      label: Status
      widget: string
    - name: image
      label: Image
      widget: image
```

```toml [TOML]
[[fields]]
name = "projects"
label = "Projects"
widget = "list"
summary = "{{name}} - {{status}}"
thumbnail = "image"
[[fields.fields]]
name = "name"
label = "Name"
widget = "string"
[[fields.fields]]
name = "status"
label = "Status"
widget = "string"
[[fields.fields]]
name = "image"
label = "Image"
widget = "image"
```

```json [JSON]
{
  "name": "projects",
  "label": "Projects",
  "widget": "list",
  "summary": "{{name}} - {{status}}",
  "thumbnail": "image",
  "fields": [
    {
      "name": "name",
      "label": "Name",
      "widget": "string"
    },
    {
      "name": "status",
      "label": "Status",
      "widget": "string"
    },
    {
      "name": "image",
      "label": "Image",
      "widget": "image"
    }
  ]
}
```

```js [JavaScript]
{
  name: "projects",
  label: "Projects",
  widget: "list",
  summary: "{{name}} - {{status}}",
  thumbnail: "image",
  fields: [
    {
      name: "name",
      label: "Name",
      widget: "string",
    },
    {
      name: "status",
      label: "Status",
      widget: "string",
    },
    {
      name: "image",
      label: "Image",
      widget: "image",
    },
  ],
}
```

#### Variable Type

The following example defines a variable type List field named `items` with two types: `text_item` and `image_item`. User can add either type of item to the list. These types can be mixed in any order.

```yaml [YAML]
- name: items
  label: Items
  widget: list
  types:
    - name: text_item
      label: Text Item
      fields:
        - name: text
          label: Text
          widget: string
    - name: image_item
      label: Image Item
      fields:
        - name: url
          label: Image URL
          widget: image
        - name: caption
          label: Caption
          widget: string
```

```toml [TOML]
[[fields]]
name = "items"
label = "Items"
widget = "list"
[[fields.types]]
label = "Text Item"
name = "text_item"
[[fields.types.fields]]
name = "text"
label = "Text"
widget = "string"
[[fields.types]]
label = "Image Item"
name = "image_item"
[[fields.types.fields]]
name = "url"
label = "Image URL"
widget = "image"
[[fields.types.fields]]
name = "caption"
label = "Caption"
widget = "string"
```

```json [JSON]
{
  "name": "items",
  "label": "Items",
  "widget": "list",
  "types": [
    {
      "label": "Text Item",
      "name": "text_item",
      "fields": [
        {
          "name": "text",
          "label": "Text",
          "widget": "string"
        }
      ]
    },
    {
      "label": "Image Item",
      "name": "image_item",
      "fields": [
        {
          "name": "url",
          "label": "Image URL",
          "widget": "image"
        },
        {
          "name": "caption",
          "label": "Caption",
          "widget": "string"
        }
      ]
    }
  ]
}
```

```js [JavaScript]
{
  name: "items",
  label: "Items",
  widget: "list",
  types: [
    {
      label: "Text Item",
      name: "text_item",
      fields: [
        {
          name: "text",
          label: "Text",
          widget: "string",
        },
      ],
    },
    {
      label: "Image Item",
      name: "image_item",
      fields: [
        {
          name: "url",
          label: "Image URL",
          widget: "image",
        },
        {
          name: "caption",
          label: "Caption",
          widget: "string",
        },
      ],
    },
  ],
}
```

Output example:

```yaml [YAML]
items:
  - type: text_item
    text: This is a text item.
  - type: image_item
    url: https://example.com/image.jpg
    caption: An example image.
  - type: text_item
    text: Another text item.
```

```toml [TOML]
[[items]]
type = "text_item"
text = "This is a text item."

[[items]]
type = "image_item"
url = "https://example.com/image.jpg"
caption = "An example image."

[[items]]
type = "text_item"
text = "Another text item."
```

```json [JSON]
{
  "items": [
    {
      "type": "text_item",
      "text": "This is a text item."
    },
    {
      "type": "image_item",
      "url": "https://example.com/image.jpg",
      "caption": "An example image."
    },
    {
      "type": "text_item",
      "text": "Another text item."
    }
  ]
}
```

#### Variable Type with Nested List

The following example defines a variable type List field named `sections` with two types: `text_section` and `image_gallery`. The `image_gallery` type contains a nested List field for multiple images.

**Tip**

You cannot have a List field directly under the `types` option; it must be nested within a type Object field, as shown in this example.

```yaml [YAML]
- name: sections
  label: Sections
  widget: list
  types:
    - name: text_section
      label: Text Section
      fields:
        - name: heading
          label: Heading
          widget: string
        - name: body
          label: Body
          widget: text
    - name: image_gallery
      label: Image Gallery
      fields:
        - name: title
          label: Title
          widget: string
        - name: images
          label: Images
          widget: list
          fields:
            - name: src
              label: Image URL
              widget: image
            - name: alt
              label: Alt Text
              widget: string
```

```toml [TOML]
[[fields]]
name = "sections"
label = "Sections"
widget = "list"
[[fields.types]]
name = "text_section"
label = "Text Section"
[[fields.types.fields]]
name = "heading"
label = "Heading"
widget = "string"
[[fields.types.fields]]
name = "body"
label = "Body"
widget = "text"
[[fields.types]]
name = "image_gallery"
label = "Image Gallery"
[[fields.types.fields]]
name = "title"
label = "Title"
widget = "string"
[[fields.types.fields]]
name = "images"
label = "Images"
widget = "list"
[[fields.types.fields.fields]]
name = "src"
label = "Image URL"
widget = "image"
[[fields.types.fields.fields]]
name = "alt"
label = "Alt Text"
widget = "string"
```

```json [JSON]
{
  "name": "sections",
  "label": "Sections",
  "widget": "list",
  "types": [
    {
      "name": "text_section",
      "label": "Text Section",
      "fields": [
        {
          "name": "heading",
          "label": "Heading",
          "widget": "string"
        },
        {
          "name": "body",
          "label": "Body",
          "widget": "text"
        }
      ]
    },
    {
      "name": "image_gallery",
      "label": "Image Gallery",
      "fields": [
        {
          "name": "title",
          "label": "Title",
          "widget": "string"
        },
        {
          "name": "images",
          "label": "Images",
          "widget": "list",
          "fields": [
            {
              "name": "src",
              "label": "Image URL",
              "widget": "image"
            },
            {
              "name": "alt",
              "label": "Alt Text",
              "widget": "string"
            }
          ]
        }
      ]
    }
  ]
}
```

```js [JavaScript]
{
  name: "sections",
  label: "Sections",
  widget: "list",
  types: [
    {
      name: "text_section",
      label: "Text Section",
      fields: [
        {
          name: "heading",
          label: "Heading",
          widget: "string",
        },
        {
          name: "body",
          label: "Body",
          widget: "text",
        },
      ],
    },
    {
      name: "image_gallery",
      label: "Image Gallery",
      fields: [
        {
          name: "title",
          label: "Title",
          widget: "string",
        },
        {
          name: "images",
          label: "Images",
          widget: "list",
          fields: [
            {
              name: "src",
              label: "Image URL",
              widget: "image",
            },
            {
              name: "alt",
              label: "Alt Text",
              widget: "string",
            },
          ],
        },
      ],
    },
  ],
}
```

Output example:

```yaml [YAML]
sections:
  - type: text_section
    heading: Welcome to Our Site
    body: This is the first section of our site.
  - type: image_gallery
    title: Our Gallery
    images:
      - src: https://example.com/image1.jpg
        alt: Image 1
      - src: https://example.com/image2.jpg
        alt: Image 2
```

```toml [TOML]
[[sections]]
type = "text_section"
heading = "Welcome to Our Site"
body = "This is the first section of our site."
[[sections]]
type = "image_gallery"
title = "Our Gallery"
[[sections.images]]
src = "https://example.com/image1.jpg"
alt = "Image 1"
[[sections.images]]
src = "https://example.com/image2.jpg"
alt = "Image 2"
```

```json [JSON]
{
  "sections": [
    {
      "type": "text_section",
      "heading": "Welcome to Our Site",
      "body": "This is the first section of our site."
    },
    {
      "type": "image_gallery",
      "title": "Our Gallery",
      "images": [
        {
          "src": "https://example.com/image1.jpg",
          "alt": "Image 1"
        },
        {
          "src": "https://example.com/image2.jpg",
          "alt": "Image 2"
        }
      ]
    }
  ]
}
```

#### Variable Type with Custom Type Key

By default, the type field is named `type`, but you can customize it using the `typeKey` option. Also, the `fields` option can be omitted if a type has no subfields.

The following example shows a simple page builder configuration with three block types: Heading, Paragraph, and Horizontal Rule.

```yaml [YAML]
- name: blocks
  label: Blocks
  widget: list
  typeKey: tag
  types:
    - name: h2
      label: Heading
      fields:
        - name: text
          label: Text
          widget: string
    - name: p
      label: Paragraph
      fields:
        - name: text
          label: Text
          widget: string
    - name: hr
      label: Horizontal Rule
```

```toml [TOML]
[[fields]]
name = "blocks"
label = "Blocks"
widget = "list"
typeKey = "tag"
[[fields.types]]
name = "h2"
label = "Heading"
[[fields.types.fields]]
name = "text"
label = "Text"
widget = "string"
[[fields.types]]
name = "p"
label = "Paragraph"
[[fields.types.fields]]
name = "text"
label = "Text"
widget = "string"
[[fields.types]]
name = "hr"
label = "Horizontal Rule"
```

```json [JSON]
{
  "name": "blocks",
  "label": "Blocks",
  "widget": "list",
  "typeKey": "tag",
  "types": [
    {
      "name": "h2",
      "label": "Heading",
      "fields": [
        {
          "name": "text",
          "label": "Text",
          "widget": "string"
        }
      ]
    },
    {
      "name": "p",
      "label": "Paragraph",
      "fields": [
        {
          "name": "text",
          "label": "Text",
          "widget": "string"
        }
      ]
    },
    {
      "name": "hr",
      "label": "Horizontal Rule"
    }
  ]
}
```

```js [JavaScript]
{
  name: "blocks",
  label: "Blocks",
  widget: "list",
  typeKey: "tag",
  types: [
    {
      name: "h2",
      label: "Heading",
      fields: [
        {
          name: "text",
          label: "Text",
          widget: "string",
        },
      ],
    },
    {
      name: "p",
      label: "Paragraph",
      fields: [
        {
          name: "text",
          label: "Text",
          widget: "string",
        },
      ],
    },
    {
      name: "hr",
      label: "Horizontal Rule",
    },
  ],
}
```

Output example:

```yaml [YAML]
blocks:
  - tag: h2
    text: Welcome to Our Site
  - tag: p
    text: This is the first paragraph of the site.
  - tag: hr
  - tag: p
    text: This is another paragraph after the horizontal rule.
```

```toml [TOML]
[[blocks]]
tag = "h2"
text = "Welcome to Our Site"
[[blocks]]
tag = "p"
text = "This is the first paragraph of the site."
[[blocks]]
tag = "hr"
[[blocks]]
tag = "p"
text = "This is another paragraph after the horizontal rule."
```

```json [JSON]
{
  "blocks": [
    {
      "tag": "h2",
      "text": "Welcome to Our Site"
    },
    {
      "tag": "p",
      "text": "This is the first paragraph of the site."
    },
    {
      "tag": "hr"
    },
    {
      "tag": "p",
      "text": "This is another paragraph after the horizontal rule."
    }
  ]
}
```

#### Top-Level List

It’s possible to define a List field at the top level of an output file, using the `root` option. The configuration below reproduces [this Jekyll data file example](https://jekyllrb.com/docs/datafiles/#example-list-of-members):

```yaml [YAML]
collections:
  - name: data
    label: Data Files
    files:
      - name: members
        label: Member List
        file: _data/members.yml # or members.json
        icon: group
        fields:
          - name: members
            label: Members
            label_singular: Member
            widget: list
            root: true
            fields:
              - name: name
                label: Name
              - name: github
                label: GitHub account
```

```toml [TOML]
[[collections]]
name = "data"
label = "Data Files"
[[collections.files]]
name = "members"
label = "Member List"
file = "_data/members.yml"
icon = "group"
[[collections.files.fields]]
name = "members"
label = "Members"
label_singular = "Member"
widget = "list"
root = true
[[collections.files.fields.fields]]
name = "name"
label = "Name"
[[collections.files.fields.fields]]
name = "github"
label = "GitHub account"
```

```json [JSON]
{
  "collections": [
    {
      "name": "data",
      "label": "Data Files",
      "files": [
        {
          "name": "members",
          "label": "Member List",
          "file": "_data/members.yml",
          "icon": "group",
          "fields": [
            {
              "name": "members",
              "label": "Members",
              "label_singular": "Member",
              "widget": "list",
              "root": true,
              "fields": [
                {
                  "name": "name",
                  "label": "Name"
                },
                {
                  "name": "github",
                  "label": "GitHub account"
                }
              ]
            }
          ]
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
      name: "data",
      label: "Data Files",
      files: [
        {
          name: "members",
          label: "Member List",
          file: "_data/members.yml",
          icon: "group",
          fields: [
            {
              name: "members",
              label: "Members",
              label_singular: "Member",
              widget: "list",
              root: true,
              fields: [
                {
                  name: "name",
                  label: "Name",
                },
                {
                  name: "github",
                  label: "GitHub account",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
```

It also works with a [singleton](https://sveltiacms.app/en/docs/collections/singletons). The configuration below reproduces the same data file example using a singleton:

```yaml [YAML]
singletons:
  - name: members
    label: Member List
    file: _data/members.yml # or members.json
    icon: group
    fields:
      - name: members
        label: Members
        label_singular: Member
        widget: list
        root: true
        fields:
          - name: name
            label: Name
          - name: github
            label: GitHub account
```

```toml [TOML]
[[singletons]]
name = "members"
label = "Member List"
file = "_data/members.yml"
icon = "group"
[[singletons.fields]]
name = "members"
label = "Members"
label_singular = "Member"
widget = "list"
root = true
[[singletons.fields.fields]]
name = "name"
label = "Name"
[[singletons.fields.fields]]
name = "github"
label = "GitHub account"
```

```json [JSON]
{
  "singletons": [
    {
      "name": "members",
      "label": "Member List",
      "file": "_data/members.yml",
      "icon": "group",
      "fields": [
        {
          "name": "members",
          "label": "Members",
          "label_singular": "Member",
          "widget": "list",
          "root": true,
          "fields": [
            {
              "name": "name",
              "label": "Name"
            },
            {
              "name": "github",
              "label": "GitHub account"
            }
          ]
        }
      ]
    }
  ]
}
```

```js [JavaScript]
{
  singletons: [
    {
      name: "members",
      label: "Member List",
      file: "_data/members.yml",
      icon: "group",
      fields: [
        {
          name: "members",
          label: "Members",
          label_singular: "Member",
          widget: "list",
          root: true,
          fields: [
            {
              name: "name",
              label: "Name",
            },
            {
              name: "github",
              label: "GitHub account",
            },
          ],
        },
      ],
    },
  ],
}
```

Output example:

```yaml [YAML]
- name: Alice
  github: alicehub123
- name: Bob
  github: bobgit456
- name: Charlie
  github: charliecode789
```

```json [JSON]
[
  {
    "name": "Alice",
    "github": "alicehub123"
  },
  {
    "name": "Bob",
    "github": "bobgit456"
  },
  {
    "name": "Charlie",
    "github": "charliecode789"
  }
]
```

As you can see, the list is stored directly at the root level of the output file, without a parent key (`members`). We don’t have a TOML example here because TOML format cannot represent top-level arrays; thus, the `root` option is ignored for TOML files.

#### Default Values

The shape of the [`default`](#default) option follows the shape of the list. A simple list takes an array of strings:

```yaml [YAML]
- name: tags
  label: Tags
  widget: list
  default: [travel, photography]
```

```toml [TOML]
[[fields]]
name = "tags"
label = "Tags"
widget = "list"
default = ["travel", "photography"]
```

```json [JSON]
{
  "name": "tags",
  "label": "Tags",
  "widget": "list",
  "default": ["travel", "photography"]
}
```

```js [JavaScript]
{
  name: "tags",
  label: "Tags",
  widget: "list",
  default: ["travel", "photography"],
}
```

A list with a single `field` takes an array of values for that subfield — here, objects for a [KeyValue](https://sveltiacms.app/en/docs/fields/keyvalue) subfield:

```yaml [YAML]
- name: attributes
  label: Attributes
  widget: list
  field:
    name: attribute
    label: Attribute
    widget: keyvalue
  default:
    - { color: red, size: large }
    - { color: blue, size: small }
```

```toml [TOML]
[[fields]]
name = "attributes"
label = "Attributes"
widget = "list"
default = [{ color = "red", size = "large" }, { color = "blue", size = "small" }]

[fields.field]
name = "attribute"
label = "Attribute"
widget = "keyvalue"
```

```json [JSON]
{
  "name": "attributes",
  "label": "Attributes",
  "widget": "list",
  "field": {
    "name": "attribute",
    "label": "Attribute",
    "widget": "keyvalue"
  },
  "default": [
    { "color": "red", "size": "large" },
    { "color": "blue", "size": "small" }
  ]
}
```

```js [JavaScript]
{
  name: "attributes",
  label: "Attributes",
  widget: "list",
  field: {
    name: "attribute",
    label: "Attribute",
    widget: "keyvalue",
  },
  default: [
    { color: "red", size: "large" },
    { color: "blue", size: "small" },
  ],
}
```

A list with `fields` takes an array of objects whose keys are the subfield names. A subfield left out of an item gets its own `default`, if any, or is left empty, just like an item added in the editor — so `external` is `false` for the first link below:

```yaml [YAML]
- name: links
  label: Links
  widget: list
  fields:
    - name: label
      label: Label
      widget: string
    - name: url
      label: URL
      widget: string
    - name: external
      label: External
      widget: boolean
      default: false
  default:
    - label: Home
      url: /
    - label: GitHub
      url: https://github.com/
      external: true
```

```toml [TOML]
[[fields]]
name = "links"
label = "Links"
widget = "list"
default = [
  { label = "Home", url = "/" },
  { label = "GitHub", url = "https://github.com/", external = true },
]

[[fields.fields]]
name = "label"
label = "Label"
widget = "string"

[[fields.fields]]
name = "url"
label = "URL"
widget = "string"

[[fields.fields]]
name = "external"
label = "External"
widget = "boolean"
default = false
```

```json [JSON]
{
  "name": "links",
  "label": "Links",
  "widget": "list",
  "fields": [
    { "name": "label", "label": "Label", "widget": "string" },
    { "name": "url", "label": "URL", "widget": "string" },
    { "name": "external", "label": "External", "widget": "boolean", "default": false }
  ],
  "default": [
    { "label": "Home", "url": "/" },
    { "label": "GitHub", "url": "https://github.com/", "external": true }
  ]
}
```

```js [JavaScript]
{
  name: "links",
  label: "Links",
  widget: "list",
  fields: [
    { name: "label", label: "Label", widget: "string" },
    { name: "url", label: "URL", widget: "string" },
    { name: "external", label: "External", widget: "boolean", default: false },
  ],
  default: [
    { label: "Home", url: "/" },
    { label: "GitHub", url: "https://github.com/", external: true },
  ],
}
```

A list with `types` takes an array of objects, each naming its variable type with the [`typeKey`](#typekey) property — `type` unless configured otherwise — alongside the subfields of that type. The subfields of that type left out of an item are filled in the same way:

```yaml [YAML]
- name: sections
  label: Sections
  widget: list
  types:
    - name: heading
      label: Heading
      fields:
        - name: text
          label: Text
          widget: string
    - name: paragraph
      label: Paragraph
      fields:
        - name: body
          label: Body
          widget: markdown
  default:
    - type: heading
      text: Introduction
    - type: paragraph
```

```toml [TOML]
[[fields]]
name = "sections"
label = "Sections"
widget = "list"
default = [{ type = "heading", text = "Introduction" }, { type = "paragraph" }]

[[fields.types]]
name = "heading"
label = "Heading"

[[fields.types.fields]]
name = "text"
label = "Text"
widget = "string"

[[fields.types]]
name = "paragraph"
label = "Paragraph"

[[fields.types.fields]]
name = "body"
label = "Body"
widget = "markdown"
```

```json [JSON]
{
  "name": "sections",
  "label": "Sections",
  "widget": "list",
  "types": [
    {
      "name": "heading",
      "label": "Heading",
      "fields": [{ "name": "text", "label": "Text", "widget": "string" }]
    },
    {
      "name": "paragraph",
      "label": "Paragraph",
      "fields": [{ "name": "body", "label": "Body", "widget": "markdown" }]
    }
  ],
  "default": [{ "type": "heading", "text": "Introduction" }, { "type": "paragraph" }]
}
```

```js [JavaScript]
{
  name: "sections",
  label: "Sections",
  widget: "list",
  types: [
    {
      name: "heading",
      label: "Heading",
      fields: [{ name: "text", label: "Text", widget: "string" }],
    },
    {
      name: "paragraph",
      label: "Paragraph",
      fields: [{ name: "body", label: "Body", widget: "markdown" }],
    },
  ],
  default: [{ type: "heading", text: "Introduction" }, { type: "paragraph" }],
}
```

Each of the following would be reported as a config validation error on the login screen, because the item would otherwise be silently dropped or saved to the entry as-is:

```yaml
# An object in a simple list
- name: tags
  widget: list
  default: [{ name: travel }]

# A plain value in a list with `fields`
- name: links
  widget: list
  fields: [{ name: label }, { name: url }]
  default: [Home]

# A property that isn’t a subfield name
- name: links
  widget: list
  fields: [{ name: label }, { name: url }]
  default: [{ label: Home, href: / }]

# A type name that isn’t one of the `types`
- name: sections
  widget: list
  types: [{ name: heading }, { name: paragraph }]
  default: [{ type: title }]
```

Source: https://sveltiacms.app/en/docs/fields/list

---

## Object Field

The Object field type allows users to create and manage nested objects within the CMS entry form. It provides a structured way to group related fields together.

### User Interface

#### Editor

The Object field type has two different UI modes, depending on the configuration. You can have conditional subfields using either the `fields` option or the `types` option.

- With the `fields` option: A group of subfield editors is shown within a collapsible section. If `required` is set to `false`, a checkbox to add or remove the object is displayed.
- With the `types` option: A type selector is shown, along with the corresponding subfield editors for the selected type. This configuration is called a **variable type** object. It’s useful for creating flexible content structures like page builders.

#### Preview

A read-only view of the object’s content, displaying the values of its nested fields in a structured format.

### Data Type

An object containing nested fields as defined in the configuration.

If the `required` option is set to `false` and subfields are not added, the value will be `null`.

### Data Validation

- If the `required` option is set to `true`, the object must not be `null` (i.e., a type must be selected if using variable types).

### Options

In addition to the [common field options](https://sveltiacms.app/en/docs/fields#common-options), the Object field supports the following options:

#### Required Options

##### `widget`

- **Type**: `string`
- **Default**: `string`

Must be set to `object` to use the Object field type.

##### `fields`

- **Type**: `array` of [field definitions](https://sveltiacms.app/en/docs/fields)

Either `fields` or `types` must be provided. You cannot use both options simultaneously.

##### `types`

- **Type**: `array` of variable type definitions

Either `fields` or `types` must be provided. You cannot use both options simultaneously.

Each type definition is an object with the following properties:

- `name` (string, required): The unique identifier for the type.
- `label` (string, required): The display label for the type.
- `widget` (string, optional): The field type for this type. It must be `object` if not omitted. Other field types are invalid.
- `fields` (array of field definitions, optional): The subfields for this type.

#### Optional Options

##### `default`

- **Type**: `object`
- **Default**: `{}`

The default value for the object field: an object whose keys are the subfield names. For an object with `types`, it must also include the [`typeKey`](#typekey) property (`type` by default) to identify the variable type, and its other keys are the names of that type’s subfields.

A property that isn’t a subfield name, a missing type key or a type name that isn’t one of the `types` is reported as a config validation error on the login screen, because it would otherwise be saved to the entry as-is or leave the object empty.

##### `collapsed`

- **Type**: `boolean` or `auto`
- **Default**: `false`

Whether the object field is initially collapsed in the UI. If set to `auto`, the UI is collapsed if the object has any filled subfields and expanded if all the subfields are empty.

##### `summary`

- **Type**: `string`
- **Default**: `""`

A string template used to generate a summary of the object’s content when it is collapsed in the UI. The template can include placeholders for subfield values using the syntax `{{fieldName}}`. [String transformations](https://sveltiacms.app/en/docs/string-transformations) can be applied in this option.

See the [Using Summary and Thumbnail](#using-summary-and-thumbnail) example below for details.

##### `thumbnail`

- **Type**: `string`
- **Default**: `""`

The name of an [Image](https://sveltiacms.app/en/docs/fields/image) or [File](https://sveltiacms.app/en/docs/fields/file) subfield to be used as the thumbnail of the object when it is collapsed in the UI. The thumbnail is displayed next to the summary. A File subfield holding an image, video or PDF gets a thumbnail; other kinds of files are not shown. If omitted, no thumbnail will be displayed.

A subfield of a nested object can be referenced with dot notation, e.g. `mobile.src`. Like the `summary` template tags, the name can be prefixed with `fields.`. A name that doesn’t point to an Image or File subfield is reported as a config validation error on the login screen. With `types`, a name shared by the subfields of several types is accepted as long as one of them is an Image or File field.

See the [Using Summary and Thumbnail](#using-summary-and-thumbnail) example below for details.

##### `typeKey`

- **Type**: `string`
- **Default**: `"type"`

The key used to store the selected type name in a variable type object. The default key is `type`.

You cannot use a key that conflicts with any of the subfield names defined in the object.

**Tip**

Unlike most of other config options, `typeKey` is camelCased.

### Examples

#### Standard Object

The following example defines an Object field named `author` with two subfields: `name` (a string) and `bio` (a text area).

```yaml [YAML]
- name: author
  label: Author
  widget: object
  fields:
    - name: name
      label: Name
      widget: string
    - name: bio
      label: Biography
      widget: text
```

```toml [TOML]
[[fields]]
name = "author"
label = "Author"
widget = "object"

[[fields.fields]]
name = "name"
label = "Name"
widget = "string"

[[fields.fields]]
name = "bio"
label = "Biography"
widget = "text"
```

```json [JSON]
{
  "name": "author",
  "label": "Author",
  "widget": "object",
  "fields": [
    {
      "name": "name",
      "label": "Name",
      "widget": "string"
    },
    {
      "name": "bio",
      "label": "Biography",
      "widget": "text"
    }
  ]
}
```

```js [JavaScript]
{
  name: "author",
  label: "Author",
  widget: "object",
  fields: [
    {
      name: "name",
      label: "Name",
      widget: "string",
    },
    {
      name: "bio",
      label: "Biography",
      widget: "text",
    },
  ],
},
```

Output example:

```yaml [YAML]
author:
  name: Jane Doe
  bio: Jane Doe is a writer and editor with over 10 years of experience.
```

```toml [TOML]
[author]
name = "Jane Doe"
bio = "Jane Doe is a writer and editor with over 10 years of experience."
```

```json [JSON]
{
  "author": {
    "name": "Jane Doe",
    "bio": "Jane Doe is a writer and editor with over 10 years of experience."
  }
}
```

#### Nested Object

An object can contain another object as a subfield. The following example defines an Object field named `book` with a nested Object field named `publisher`.

```yaml [YAML]
- name: book
  label: Book
  widget: object
  fields:
    - name: title
      label: Title
      widget: string
    - name: publisher
      label: Publisher
      widget: object
      fields:
        - name: name
          label: Name
          widget: string
        - name: address
          label: Address
          widget: text
```

```toml [TOML]
[[fields]]
name = "book"
label = "Book"
widget = "object"
[[fields.fields]]
name = "title"
label = "Title"
widget = "string"
[[fields.fields]]
name = "publisher"
label = "Publisher"
widget = "object"
[[fields.fields.fields]]
name = "name"
label = "Name"
widget = "string"
[[fields.fields.fields]]
name = "address"
label = "Address"
widget = "text"
```

```json [JSON]
{
  "name": "book",
  "label": "Book",
  "widget": "object",
  "fields": [
    {
      "name": "title",
      "label": "Title",
      "widget": "string"
    },
    {
      "name": "publisher",
      "label": "Publisher",
      "widget": "object",
      "fields": [
        {
          "name": "name",
          "label": "Name",
          "widget": "string"
        },
        {
          "name": "address",
          "label": "Address",
          "widget": "text"
        }
      ]
    }
  ]
}
```

```js [JavaScript]
{
  name: "book",
  label: "Book",
  widget: "object",
  fields: [
    {
      name: "title",
      label: "Title",
      widget: "string",
    },
    {
      name: "publisher",
      label: "Publisher",
      widget: "object",
      fields: [
        {
          name: "name",
          label: "Name",
          widget: "string",
        },
        {
          name: "address",
          label: "Address",
          widget: "text",
        },
      ],
    },
  ],
},
```

Output example:

```yaml [YAML]
book:
  title: The Great Gatsby
  publisher:
    name: Scribner
    address: '123 Publisher St, New York, NY'
```

```toml [TOML]
[book]
title = "The Great Gatsby"
[book.publisher]
name = "Scribner"
address = "123 Publisher St, New York, NY"
```

```json [JSON]
{
  "book": {
    "title": "The Great Gatsby",
    "publisher": {
      "name": "Scribner",
      "address": "123 Publisher St, New York, NY"
    }
  }
}
```

#### Using Summary and Thumbnail

The following example defines an Object field named `hero` that, when collapsed, shows the `heading` subfield value as the summary along with the image held by the `image` subfield.

```yaml [YAML]
- name: hero
  label: Hero
  widget: object
  summary: "{{heading}}"
  thumbnail: "image"
  fields:
    - name: heading
      label: Heading
      widget: string
    - name: image
      label: Image
      widget: image
```

```toml [TOML]
[[fields]]
name = "hero"
label = "Hero"
widget = "object"
summary = "{{heading}}"
thumbnail = "image"
[[fields.fields]]
name = "heading"
label = "Heading"
widget = "string"
[[fields.fields]]
name = "image"
label = "Image"
widget = "image"
```

```json [JSON]
{
  "name": "hero",
  "label": "Hero",
  "widget": "object",
  "summary": "{{heading}}",
  "thumbnail": "image",
  "fields": [
    {
      "name": "heading",
      "label": "Heading",
      "widget": "string"
    },
    {
      "name": "image",
      "label": "Image",
      "widget": "image"
    }
  ]
}
```

```js [JavaScript]
{
  name: "hero",
  label: "Hero",
  widget: "object",
  summary: "{{heading}}",
  thumbnail: "image",
  fields: [
    {
      name: "heading",
      label: "Heading",
      widget: "string",
    },
    {
      name: "image",
      label: "Image",
      widget: "image",
    },
  ],
}
```

#### Variable Type

The following example defines a variable type Object field named `contentBlock` with three types: `textBlock`, `imageBlock`, and `placeholderBlock`. Note that the `placeholderBlock` type does not have any subfields but is still a valid type.

```yaml [YAML]
- name: contentBlock
  label: Content Block
  widget: object
  types:
    - name: textBlock
      label: Text Block
      fields:
        - name: text
          label: Text
          widget: text
    - name: imageBlock
      label: Image Block
      fields:
        - name: image
          label: Image
          widget: image
    - name: placeholderBlock
      label: Placeholder Block
```

```toml [TOML]
[[fields]]
name = "contentBlock"
label = "Content Block"
widget = "object"

[[fields.types]]
name = "textBlock"
label = "Text Block"

[[fields.types.fields]]
name = "text"
label = "Text"
widget = "text"

[[fields.types]]
name = "imageBlock"
label = "Image Block"

[[fields.types.fields]]
name = "image"
label = "Image"
widget = "image"

[[fields.types]]
name = "placeholderBlock"
label = "Placeholder Block"
```

```json [JSON]
{
  "name": "contentBlock",
  "label": "Content Block",
  "widget": "object",
  "types": [
    {
      "name": "textBlock",
      "label": "Text Block",
      "fields": [
        {
          "name": "text",
          "label": "Text",
          "widget": "text"
        }
      ]
    },
    {
      "name": "imageBlock",
      "label": "Image Block",
      "fields": [
        {
          "name": "image",
          "label": "Image",
          "widget": "image"
        }
      ]
    }
    {
      "name": "placeholderBlock",
      "label": "Placeholder Block"
    }
  ]
}
```

```js [JavaScript]
{
  name: "contentBlock",
  label: "Content Block",
  widget: "object",
  types: [
    {
      name: "textBlock",
      label: "Text Block",
      fields: [
        {
          name: "text",
          label: "Text",
          widget: "text",
        },
      ],
    },
    {
      name: "imageBlock",
      label: "Image Block",
      fields: [
        {
          name: "image",
          label: "Image",
          widget: "image",
        },
      ],
    },
    {
      name: "placeholderBlock",
      label: "Placeholder Block",
    },
  ],
},
```

The output will vary based on the selected type, which is indicated by the `type` key (customizable via the `typeKey` option). If no `fields` are defined for a type, the object will only contain the `type` key, as shown in the `placeholderBlock` example below.

Output example for a `textBlock` type:

```yaml [YAML]
contentBlock:
  type: textBlock
  text: 'This is a sample text block.'
```

```toml [TOML]
[contentBlock]
type = "textBlock"
text = "This is a sample text block."
```

```json [JSON]
{
  "contentBlock": {
    "type": "textBlock",
    "text": "This is a sample text block."
  }
}
```

Output example for an `imageBlock` type:

```yaml [YAML]
contentBlock:
  type: imageBlock
  image: /images/sample.jpg
```

```toml [TOML]
[contentBlock]
type = "imageBlock"
image = "/images/sample.jpg"
```

```json [JSON]
{
  "contentBlock": {
    "type": "imageBlock",
    "image": "/images/sample.jpg"
  }
}
```

Output example for a `placeholderBlock` type:

```yaml [YAML]
contentBlock:
  type: placeholderBlock
```

```toml [TOML]
[contentBlock]
type = "placeholderBlock"
```

```json [JSON]
{
  "contentBlock": {
    "type": "placeholderBlock"
  }
}
```

Source: https://sveltiacms.app/en/docs/fields/object

---

## KeyValue Field

The KeyValue field type allows users to create and manage a dynamic list of key-value pairs, or dictionary entries, within the CMS entry form.

### User Interface

#### Editor

A dynamic list of key-value pairs, where users can add, edit, and remove entries. Each entry consists of a text input for the key and a text input for the value.

You can press Enter to move focus or add a new row while editing.

#### Preview

A table displaying the current key-value pairs in a structured format for easy review.

### Data Type

An object where each key corresponds to a user-defined key and each value corresponds to the associated value.

If the `required` option is set to `false` and the field is left empty, the value will be an empty object.

### Data Validation

- If the `required` option is set to `true`, at least one key-value pair must be present.
- Keys must be unique and non-empty strings. Keys cannot contain dots (`.`) as they may interfere with nested data structures.
- If `min` and/or `max` options are specified, the number of key-value pairs must be within the defined limits.

### Options

In addition to the [common field options](https://sveltiacms.app/en/docs/fields#common-options), the KeyValue field supports the following options:

#### Required Options

##### `widget`

- **Type**: `string`
- **Default**: `string`

Must be set to `keyvalue`.

#### Optional Options

##### `default`

- **Type**: `object`
- **Default**: `{}`

The default value for the field when creating a new entry.

##### `key_label`

- **Type**: `string`
- **Default**: `"Key"` or its localized equivalent

The label for the key input field.

##### `value_label`

- **Type**: `string`
- **Default**: `"Value"` or its localized equivalent

The label for the value input field.

##### `min`

- **Type**: `integer`
- **Default**: `0`

The minimum number of key-value pairs required. This enables validation to ensure that users add at least this many entries.

##### `max`

- **Type**: `integer`
- **Default**: `Infinity`

The maximum number of key-value pairs allowed. This enables validation to prevent users from adding more than this many entries.

##### `root`

- **Type**: `boolean`
- **Default**: `false`

If set to `true`, the key-value pairs will be stored at the root level of the entry data instead of nested under the field name. This is similar to how the [`root` option for the List field](https://sveltiacms.app/en/docs/fields/list#root) works. The option is ignored if the file or singleton contains multiple fields.

See the [Top-Level key-value pairs](#top-level-key-value-pairs) example below for details.

##### `i18n`

- **Type**: `boolean`, `duplicate` or `duplicate_keys`
- **Default**: `false`

In addition to the [common `i18n` option values](https://sveltiacms.app/en/docs/i18n#field-level-configuration), the KeyValue field accepts the `duplicate_keys` value, which is useful for dictionaries whose keys are shared across locales while their values are translated:

- The keys are copied from the default locale to the other locales, where they are read-only. Keys can only be added, renamed or removed in the default locale, and any such change is immediately reflected in the other locales.
- The values can be edited separately for each locale. When a key is renamed in the default locale, the other locales keep the value they had under the old name; a newly added key starts with an empty value in the other locales.

See the [Translated Values with Shared Keys](#translated-values-with-shared-keys) example below for details.

### Examples

#### Basic Key-Value Field

This example demonstrates a simple KeyValue field configuration:

```yaml [YAML]
- name: settings
  label: Settings
  widget: keyvalue
```

```toml [TOML]
[[fields]]
name = "settings"
label = "Settings"
widget = "keyvalue"
```

```json [JSON]
{
  "name": "settings",
  "label": "Settings",
  "widget": "keyvalue"
}
```

```js [JavaScript]
{
  name: 'settings',
  label: 'Settings',
  widget: 'keyvalue',
}
```

Output example:

```yaml [YAML]
settings:
  theme: dark
  notifications: enabled
```

```toml [TOML]
[settings]
theme = "dark"
notifications = "enabled"
```

```json [JSON]
{
  "settings": {
    "theme": "dark",
    "notifications": "enabled"
  }
}
```

#### Translated Values with Shared Keys

This example demonstrates how to use the `duplicate_keys` i18n strategy so that the same keys are used in all locales while the values are translated. This requires i18n to be [enabled](https://sveltiacms.app/en/docs/i18n) for the collection:

```yaml [YAML]
- name: labels
  label: Labels
  widget: keyvalue
  i18n: duplicate_keys
```

```toml [TOML]
[[fields]]
name = "labels"
label = "Labels"
widget = "keyvalue"
i18n = "duplicate_keys"
```

```json [JSON]
{
  "name": "labels",
  "label": "Labels",
  "widget": "keyvalue",
  "i18n": "duplicate_keys"
}
```

```js [JavaScript]
{
  name: 'labels',
  label: 'Labels',
  widget: 'keyvalue',
  i18n: 'duplicate_keys',
}
```

Output example, with English as the default locale and the `single_file` i18n structure:

```yaml [YAML]
en:
  labels:
    submit: Submit
    cancel: Cancel
ja:
  labels:
    submit: 送信
    cancel: キャンセル
```

```toml [TOML]
[en.labels]
submit = "Submit"
cancel = "Cancel"

[ja.labels]
submit = "送信"
cancel = "キャンセル"
```

```json [JSON]
{
  "en": {
    "labels": {
      "submit": "Submit",
      "cancel": "Cancel"
    }
  },
  "ja": {
    "labels": {
      "submit": "送信",
      "cancel": "キャンセル"
    }
  }
}
```

#### Top-Level Key-Value Pairs

This example demonstrates how to use the `root` option to store key-value pairs at the root level of the entry data:

```yaml [YAML]
- name: settings
  label: Settings
  widget: keyvalue
  root: true
```

```toml [TOML]
[[fields]]
name = "settings"
label = "Settings"
widget = "keyvalue"
root = true
```

```json [JSON]
{
  "name": "settings",
  "label": "Settings",
  "widget": "keyvalue",
  "root": true
}
```

```js [JavaScript]
{
  name: 'settings',
  label: 'Settings',
  widget: 'keyvalue',
  root: true,
}
```

Output example:

```yaml [YAML]
theme: dark
notifications: enabled
```

```toml [TOML]
theme = "dark"
notifications = "enabled"
```

```json [JSON]
{
  "theme": "dark",
  "notifications": "enabled"
}
```

Source: https://sveltiacms.app/en/docs/fields/keyvalue
