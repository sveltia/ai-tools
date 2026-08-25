# Field Types: Structural and Rich Text

The List, Object, KeyValue, RichText/Markdown and Code field types.

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

An Image subfield name to be used as the thumbnail for each list item in the collapsed view, if applicable. If omitted, no thumbnail will be displayed.

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

This option is effective only when the `types` option is used. It allows you to customize the name of the field that indicates the type of each item in the list. See the [Variable Type](#variable-type) example below for details.

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

The default value for the object field.

##### `collapsed`

- **Type**: `boolean` or `auto`
- **Default**: `false`

Whether the object field is initially collapsed in the UI. If set to `auto`, the UI is collapsed if the object has any filled subfields and expanded if all the subfields are empty.

##### `summary`

- **Type**: `string`
- **Default**: `""`

A string template used to generate a summary of the object’s content when it is collapsed in the UI. The template can include placeholders for subfield values using the syntax `{{fieldName}}`. [String transformations](https://sveltiacms.app/en/docs/string-transformations) can be applied in this option.

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

---

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

We have included a Markdown example output along with YAML, TOML, and JSON representations because a field named `body` with the Markdown field type would be stored outside of the frontmatter in a Markdown file. If the name of the field were different, the content would be stored in the frontmatter instead. This behavior can be configured using the [`body_field` option](https://sveltiacms.app/en/docs/collections/entries#body-field-for-front-matter-formats) for collections and collection files.

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

If `output_code_only` is `true`, this should be a string containing the default code.

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
