# Field Types: Relation, Compute and UUID

The Relation field type that references other entries, plus the Compute and UUID field types that derive or generate values.

Generated from the Sveltia CMS documentation. Do not edit by hand.

## Relation Field

The Relation field type enables users to create relationships between entries in different collections within the CMS. There are two types of relations supported, depending on the target collection type:

- Entries in an [entry collection](https://sveltiacms.app/en/docs/collections/entries)
- List items in a specific file in a [file collection](https://sveltiacms.app/en/docs/collections/files)

The Content Editor comes with the [Backlinks sidebar panel](https://sveltiacms.app/en/docs/ui/content-editor#sidebar) that shows all entries that reference the current entry via Relation fields. This makes it easy to see how entries are connected and navigate between them, for example, to see all blog posts that are tagged with a specific tag.

### User Interface

#### Editor

Radio buttons (single select) or checkboxes (multi select) for choosing related entries from another collection. If there are many entries, a dropdown with search functionality will be used instead. Use the `dropdown_threshold` option to customize when to switch to the dropdown UI.

For multi-select options with many entries, a tag input UI will be used instead of checkboxes to save space. Items can be reordered by dragging and dropping or using right/left arrow keys. Items can also be removed by clicking the ✕ icon on each item.

#### Creating Related Entries

When the related collection is an entry collection, the field also offers an **Add** button labelled with the collection’s singular label, e.g. “Add Tag” or “Add Author”. It opens a dialog to create a related entry without leaving the entry you’re editing, so you don’t have to save your work, go to the other collection, create the entry there and come back — or pick a wrong entry just to be able to save.

The dialog is a single-pane editor with all the fields of the related collection. If the collection has [multiple locales](https://sveltiacms.app/en/docs/i18n), a locale switcher in the dialog header lets you fill in each of them. Clicking **Add** validates the new entry the same way a save does; if a required field is empty, the dialog stays open and the error is shown on the field. Once added, the new entry is selected in the Relation field right away, listed among the options like any other entry, and shown by its label in the Preview Pane.

The new entry is not saved on its own. It’s kept with your draft and committed **together with the entry you’re editing** when you save, in a single commit, so the two never go out of sync: a blog post and the tags created for it land in the repository at the same time. Until then, the entry only exists in your draft:

- If you deselect the new entry before saving, it’s dropped rather than created for nothing.
- If you add two entries with the same title, the second one gets a distinct slug, e.g. `svelte-1`, the same way it would if you created them one after another.
- The dialog can be nested: a Relation field in the new entry has its own **Add** button, and the entries created there are saved along with everything else, as long as they are still referenced.
- Files attached to the new entry, such as an author’s avatar, are uploaded in the same commit.
- The pending entries are part of the [auto-saved draft](https://sveltiacms.app/en/docs/ui/content-editor#auto-saving-drafts), so they survive a page reload along with the rest of your changes.

The button is not offered in the following cases:

- The related collection is a [file collection](https://sveltiacms.app/en/docs/collections/files), with the [`file`](#file) option. The button creates a new entry, but such a field selects an item from a list within an existing file. Adding an item would mean editing that file from another entry, which could conflict with changes made to the file elsewhere, so the item is added by editing the file itself instead.
- The related collection has the [`create: false`](https://sveltiacms.app/en/docs/collections/entries/operations#disabling-creation-and-deletion) option.
- The related collection has reached its [`limit`](https://sveltiacms.app/en/docs/collections/entries/operations#limiting-entry-count), counting the entries pending in your draft. The button is then shown disabled.
- The Relation field is read-only.
- The entry you’re editing is saved through the [Editorial Workflow](https://sveltiacms.app/en/docs/workflows/editorial), or the related collection is under the workflow on its own. A pull request stands for a single entry in the workflow, so an entry created on the fly would either be invisible until the pull request is published, or skip the review the related collection asks for. Create the related entry in its own collection instead.

#### Preview

A string or a list of strings representing the selected related entries, formatted according to the `display_fields` option.

### Data Type

A string or an array of strings, depending on whether the `multiple` option is set to `true` or `false`. Each string represents the value of the related entry as defined by the `value_field` option.

In some cases, it can also be a number or an array of numbers if the `value_field` of the related collection is of a numeric type, like an ID.

If the `required` option is set to `false` and no related entries are selected, the value will be `null` for single select or an empty array for multi select.

#### Cascading Updates

Like a relational database that cascades an update of a referenced key, Sveltia CMS keeps Relation field values pointing at the right entry when the entry they reference is renamed. Renaming a related entry in the [Slug panel](https://sveltiacms.app/en/docs/ui/content-editor#slug-panel) rewrites every entry referencing it, in the same commit as the rename, so no references are left dangling.

This applies whenever the stored value is derived from the related entry’s identity, which covers the default `{{slug}}`, any template containing `{{slug}}`, such as `{{locale}}/{{slug}}`, and the canonical slug key. It does not apply to a `value_field` pointing at an ordinary content field, such as `{{title}}`, because such a value doesn’t change when the entry is renamed — but it does break if somebody edits that field. It’s one more reason to prefer the default `{{slug}}`, as noted under [`value_field`](#value-field).

#### Cascading Deletions

Deletions are cascaded in the same way. When you delete an entry, whether from the Content Editor or by [selecting one or more entries](https://sveltiacms.app/en/docs/ui/content-library#bulk-actions) in the entry list, every entry referencing it through a Relation field is rewritten in the same commit as the deletion: a single-select field is cleared, and the deleted entry is dropped from a multi-select field’s list. The confirmation dialog tells you how many entries will be updated. Unlike a rename, this applies whatever the `value_field` is, because references are matched on the stored value rather than derived from the slug. With the [Editorial Workflow](https://sveltiacms.app/en/docs/workflows/editorial), the updates go into the same pull request as the deletion.

A reference is never removed at the cost of the referencing entry’s validity, though. If clearing it would break the field’s own [validation rules](#data-validation) — a `required` field left with nothing selected, or a multi-select field left with fewer than `min` items — the deletion is refused, and the dialog lists the entries and fields standing in the way so that you can update them first. The check covers the whole selection: deleting two entries at once may be refused where deleting either on its own would go through. The [Backlinks sidebar panel](https://sveltiacms.app/en/docs/ui/content-editor#sidebar) shows what references an entry, so you can see what a deletion would touch before you start.

### Data Validation

- If the `required` option is set to `true`, at least one related entry must be selected.
- If the `multiple` option is enabled, the number of selected entries must be between the `min` and `max` limits, if specified.

### Options

In addition to the [common field options](https://sveltiacms.app/en/docs/fields#common-options), the Relation field supports the following options:

#### Required Options

##### `widget`

- **Type**: `string`
- **Default**: `string`

Must be set to `relation`.

##### `collection`

- **Type**: `string`
- **Default**: `undefined`

The name of the collection to relate to. This collection must exist in the CMS configuration, and can be either an entry collection or a file collection. If the target collection is a file collection, the `file` option must also be specified.

#### Optional Options

**Breaking changes from Netlify/Decap CMS**

Sveltia CMS does not support the deprecated camelCase `valueField`, `displayFields` and `searchFields` options. Use `value_field`, `display_fields` and `search_fields` instead.

The `options_length` option is also not supported in Sveltia CMS because the performance has been improved significantly.

##### `file`

- **Type**: `string`
- **Default**: `undefined`

The name of a file within the target [file collection](https://sveltiacms.app/en/docs/collections/files) to relate to. Required if the target collection is a file collection.

##### `value_field`

- **Type**: `string`
- **Default**: `{{slug}}`

The field from the related collection to use as the value for the relation. This field’s value will be stored in the entry using the Relation field. It can be one of the following:

- `{{slug}}`: Use the slug of the related entry.
- A field name from the related collection, e.g., `id` or `title`.
- A template string that references fields in the related collection using the syntax `{{field_name}}`. For example, `{{fields.id}}` or `{{fields.title}}`.
- `translationKey`, or any other key configured with the `i18n.canonical_slug.key` option: Use the canonical slug of the related entry, which is shared across locales. See [below](#referencing-entries-across-locales).

The `{{locale}}` template tag can be used to include the current locale in the value field, e.g. `{{locale}}/{{slug}}`, which is useful for [i18n support](https://sveltiacms.app/en/docs/i18n).

In a [nested collection](https://sveltiacms.app/en/docs/collections/entries/nested), an entry’s slug is its path below the collection folder, so `{{slug}}` resolves to something like `company/about`. Where every entry is stored as an index file, the shared file name is left out of that path, exactly as it is in a [preview path](https://sveltiacms.app/en/docs/collections/entries/previews#preview-paths): an entry stored at `content/pages/company/about/_index.md` is referenced as `company/about`, not `company/about/_index`. The collection’s own index file is the exception, keeping its name so that a reference to it isn’t empty.

When using template strings, keep the following in mind:

- A field named `slug` must be prefixed with `fields.` like `{{fields.slug}}` to avoid ambiguity with the special `{{slug}}` variable.
- Nested fields can also be referenced using dot notation, e.g., `{{author.name}}`.
- To reference list items, use a wildcard `*` for the index, e.g., `{{tags.*}}` or `{{gallery.*.image}}`. This works for a list field with the `field` or `fields` option.

The value field must be unique across all entries in the related collection to avoid conflicts. For example, using `{{title}}` as the value field is not recommended unless you can guarantee that all titles are unique. That’s why the default is `{{slug}}`, which is unique by design.

##### `display_fields`

- **Type**: `array` of `strings`
- **Default**: `["title"]` if `value_field` is `{{slug}}`, otherwise the value of `value_field` option

The fields from the related collection to display in the Relation field UI when selecting related entries. This should be an array of field names. The values of these fields will be concatenated and shown as the label for each related entry.

String templates can be used to customize the display format. For example, to show both first and last names from separate fields, you can use either of the following:

```yaml [YAML]
display_fields: ['{{first_name}} {{last_name}}']
```

```toml [TOML]
display_fields = ["{{first_name}} {{last_name}}"]
```

```json [JSON]
{
  "display_fields": ["{{first_name}} {{last_name}}"]
}
```

```js [JavaScript]
{
  display_fields: ["{{first_name}} {{last_name}}"],
}
```

```yaml [YAML]
display_fields: ['first_name', 'last_name']
```

```toml [TOML]
display_fields = ["first_name", "last_name"]
```

```json [JSON]
{
  "display_fields": ["first_name", "last_name"]
}
```

```js [JavaScript]
{
  display_fields: ["first_name", "last_name"],
}
```

##### `search_fields`

- **Type**: `array` of `strings`
- **Default**: value of `display_fields` option

The fields from the related collection to search against when filtering related entries in the Relation field UI. This should be an array of field names. By default, it uses the same fields as specified in the `display_fields` option.

##### `default`

- **Type**: `string`, `number`, `array of strings`, or `array of numbers`
- **Default**: `null` or `[]`

The default value for the field. Should be a string or number for single select, or an array of strings or numbers for multi select, depending on the `multiple` option. An array with `multiple` off, or a single value with `multiple` on, is reported as a config validation error on the login screen.

##### `dropdown_threshold`

- **Type**: `integer`
- **Default**: `5`

The number of related entries at which to switch from radio buttons/checkboxes to a dropdown with search functionality. If the number of entries in the target collection is greater than this threshold, a dropdown will be used.

##### `multiple`

- **Type**: `boolean`
- **Default**: `false`

Whether to allow selecting multiple related entries.

##### `min`

- **Type**: `integer`
- **Default**: `0`

The minimum number of related entries required. This enables validation to ensure that users select at least this many entries. Ignored if `multiple` is set to `false`.

##### `max`

- **Type**: `integer`
- **Default**: `Infinity`

The maximum number of related entries allowed. This enables validation to prevent users from selecting more than this many entries. Ignored if `multiple` is set to `false`.

##### `filters`

- **Type**: `array` of filter objects
- **Default**: `[]`

An array of filter objects to limit the related entries shown in the Relation field UI. Each filter object has the following properties:

- `field`: The field name in the **related** collection to filter on. Use `slug` to filter by entry slug or `fields.fieldName` to filter by a content field named `fieldName` (the `fields.` prefix is required to disambiguate from the entry slug when the field is literally named `slug`). A `slug` filter matches the same form the value takes, so in a nested collection it’s the entry’s path without the shared index file name. If the field holds multiple values, such as a [Select](https://sveltiacms.app/en/docs/fields/select) field with `multiple: true` or a [List](https://sveltiacms.app/en/docs/fields/list) field without subfields, an entry matches when any of its values is included in `values`.
- `values`: An array of strings or numbers representing the values to match. String values may contain the following template tags that are resolved from the **current** entry being edited:
  - `{{slug}}`: Resolved to the current entry's slug.
  - `{{fields.fieldName}}`: Resolved to the value of a field named `fieldName` in the current entry. If the field holds multiple values, the template is expanded to all of them, so an entry matches when it shares any of them with the current entry.

  Unresolvable templates (e.g. `{{slug}}` for a new, unsaved entry, or `{{fields.fieldName}}` for a field with no values) are ignored, causing the filter to be skipped.

- `exclude` _(optional)_: If `true`, entries **matching** the filter are excluded instead of included. An entry whose field holds multiple values is excluded when any of them matches. Default: `false`.

Example — show only published entries in a specific category:

```yaml [YAML]
filters:
  - field: draft
    values: [false]
  - field: category
    values: ['news', 'updates']
```

```toml [TOML]
[[filters]]
field = "draft"
values = [false]

[[filters]]
field = "category"
values = ["news", "updates"]
```

```json [JSON]
{
  "filters": [
    {
      "field": "draft",
      "values": [false]
    },
    {
      "field": "category",
      "values": ["news", "updates"]
    }
  ]
}
```

```js [JavaScript]
{
  filters: [
    {
      field: 'draft',
      values: [false],
    },
    {
      field: 'category',
      values: ['news', 'updates'],
    },
  ],
}
```

Example — exclude the current entry from a “Related Articles” Relation field (self-exclusion):

```yaml [YAML]
filters:
  - field: slug
    values: ['{{slug}}']
    exclude: true
```

```toml [TOML]
[[filters]]
field = "slug"
values = ["{{slug}}"]
exclude = true
```

```json [JSON]
{
  "filters": [
    {
      "field": "slug",
      "values": ["{{slug}}"],
      "exclude": true
    }
  ]
}
```

```js [JavaScript]
{
  filters: [
    {
      field: 'slug',
      values: ['{{slug}}'],
      exclude: true,
    },
  ],
}
```

### Examples

#### Selecting Entries from an Entry Collection

Assuming you have the following entry collection named `categories`:

```yaml [YAML]
collections:
  - name: categories
    label: Categories
    folder: content/categories
    fields:
      - name: title
        label: Title
        widget: string
      - name: slug
        label: Slug
        widget: string
      - name: description
        label: Description
        widget: text
```

```toml [TOML]
[[collections]]
name = "categories"
label = "Categories"
folder = "content/categories"
[[collections.fields]]
name = "title"
label = "Title"
widget = "string"
[[collections.fields]]
name = "slug"
label = "Slug"
widget = "string"
[[collections.fields]]
name = "description"
label = "Description"
widget = "text"
```

```json [JSON]
{
  "collections": [
    {
      "name": "categories",
      "label": "Categories",
      "folder": "content/categories",
      "fields": [
        {
          "name": "title",
          "label": "Title",
          "widget": "string"
        },
        {
          "name": "slug",
          "label": "Slug",
          "widget": "string"
        },
        {
          "name": "description",
          "label": "Description",
          "widget": "text"
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
      name: 'categories',
      label: 'Categories',
      folder: 'content/categories',
      fields: [
        {
          name: 'title',
          label: 'Title',
          widget: 'string',
        },
        {
          name: 'slug',
          label: 'Slug',
          widget: 'string',
        },
        {
          name: 'description',
          label: 'Description',
          widget: 'text',
        },
      ],
    },
  ],
}
```

You can create a Relation field in another collection to select a single category:

```yaml [YAML]
fields:
  - name: category
    label: Category
    widget: relation
    collection: categories
    value_field: slug
    display_fields: [title]
    search_fields: [title, description]
```

```toml [TOML]
[[fields]]
name = "category"
label = "Category"
widget = "relation"
collection = "categories"
value_field = "slug"
display_fields = ["title"]
search_fields = ["title", "description"]
```

```json [JSON]
{
  "fields": [
    {
      "name": "category",
      "label": "Category",
      "widget": "relation",
      "collection": "categories",
      "value_field": "slug",
      "display_fields": ["title"],
      "search_fields": ["title", "description"]
    }
  ]
}
```

```js [JavaScript]
{
  fields: [
    {
      name: 'category',
      label: 'Category',
      widget: 'relation',
      collection: 'categories',
      value_field: 'slug',
      display_fields: ['title'],
      search_fields: ['title', 'description'],
    },
  ],
}
```

Output example when the selected category has a slug of `news`:

```yaml [YAML]
category: news
```

```toml [TOML]
category = "news"
```

```json [JSON]
{
  "category": "news"
}
```

#### Referencing a File in a File Collection, Multiple Select

Assuming you have the following `cities` file in a `data` file collection:

```yaml [YAML]
collections:
  - name: data
    label: Data
    files:
      - name: locations
        label: Locations
        file: data/locations.yaml
        fields:
          - name: cities
            label: Cities
            widget: list
            fields:
              - name: name
                label: Name
                widget: string
              - name: country
                label: Country
                widget: string
```

```toml [TOML]
[[collections]]
name = "data"
label = "Data"
[[collections.files]]
name = "locations"
label = "Locations"
file = "data/locations.yaml"
[[collections.files.fields]]
name = "cities"
label = "Cities"
widget = "list"
[[collections.files.fields.fields]]
name = "name"
label = "Name"
widget = "string"
[[collections.files.fields.fields]]
name = "country"
label = "Country"
widget = "string"
```

```json [JSON]
{
  "collections": [
    {
      "name": "data",
      "label": "Data",
      "files": [
        {
          "name": "locations",
          "label": "Locations",
          "file": "data/locations.yaml",
          "fields": [
            {
              "name": "cities",
              "label": "Cities",
              "widget": "list",
              "fields": [
                {
                  "name": "name",
                  "label": "Name",
                  "widget": "string"
                },
                {
                  "name": "country",
                  "label": "Country",
                  "widget": "string"
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
      name: 'data',
      label: 'Data',
      files: [
        {
          name: 'locations',
          label: 'Locations',
          file: 'data/locations.yaml',
          fields: [
            {
              name: 'cities',
              label: 'Cities',
              widget: 'list',
              fields: [
                {
                  name: 'name',
                  label: 'Name',
                  widget: 'string',
                },
                {
                  name: 'country',
                  label: 'Country',
                  widget: 'string',
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

You can create a Relation field in another collection to select multiple cities from the `locations` file:

```yaml [YAML]
fields:
  - name: favorite_cities
    label: Favorite Cities
    widget: relation
    collection: data
    file: locations
    multiple: true
    min: 1
    max: 3
    value_field: '{{cities.*.name}}'
    display_fields: ['{{cities.*.name}}, {{cities.*.country}}']
    search_fields: ['{{cities.*.name}}']
```

```toml [TOML]
[[fields]]
name = "favorite_cities"
label = "Favorite Cities"
widget = "relation"
collection = "data"
file = "locations"
multiple = true
min = 1
max = 3
value_field = "{{cities.*.name}}"
display_fields = ["{{cities.*.name}}, {{cities.*.country}}"]
search_fields = ["{{cities.*.name}}"]
```

```json [JSON]
{
  "fields": [
    {
      "name": "favorite_cities",
      "label": "Favorite Cities",
      "widget": "relation",
      "collection": "data",
      "file": "locations",
      "multiple": true,
      "min": 1,
      "max": 3,
      "value_field": "{{cities.*.name}}",
      "display_fields": ["{{cities.*.name}}, {{cities.*.country}}"],
      "search_fields": ["{{cities.*.name}}"]
    }
  ]
}
```

```js [JavaScript]
{
  fields: [
    {
      name: 'favorite_cities',
      label: 'Favorite Cities',
      widget: 'relation',
      collection: 'data',
      file: 'locations',
      multiple: true,
      min: 1,
      max: 3,
      value_field: '{{cities.*.name}}',
      display_fields: ['{{cities.*.name}}, {{cities.*.country}}'],
      search_fields: ['{{cities.*.name}}'],
    },
  ],
}
```

Note that a wildcard (`*`) is used in the `value_field`, `display_fields`, and `search_fields` options to reference list items within the `cities` field.

Output example when the selected favorite cities are “San Francisco”, “Tokyo”, and “Paris”:

```yaml [YAML]
favorite_cities:
  - San Francisco
  - Tokyo
  - Paris
```

```toml [TOML]
favorite_cities = ["San Francisco", "Tokyo", "Paris"]
```

```json [JSON]
{
  "favorite_cities": ["San Francisco", "Tokyo", "Paris"]
}
```

#### Referencing Entries Across Locales

When [entry slugs are localized](https://sveltiacms.app/en/docs/i18n/slugs#localizing-entry-slugs), each localized entry stores the default locale’s slug in an extra `translationKey` property. Unlike `{{slug}}`, that property holds the same value in every locale, so it can be used as the value field to reference an entry regardless of the locale being edited:

```yaml [YAML]
fields:
  - name: parent
    label: Parent Page
    widget: relation
    i18n: true
    collection: pages
    value_field: translationKey
    display_fields: [title]
    search_fields: [title]
```

```toml [TOML]
[[fields]]
name = "parent"
label = "Parent Page"
widget = "relation"
i18n = true
collection = "pages"
value_field = "translationKey"
display_fields = ["title"]
search_fields = ["title"]
```

```json [JSON]
{
  "fields": [
    {
      "name": "parent",
      "label": "Parent Page",
      "widget": "relation",
      "i18n": true,
      "collection": "pages",
      "value_field": "translationKey",
      "display_fields": ["title"],
      "search_fields": ["title"]
    }
  ]
}
```

```js [JavaScript]
{
  fields: [
    {
      name: 'parent',
      label: 'Parent Page',
      widget: 'relation',
      i18n: true,
      collection: 'pages',
      value_field: 'translationKey',
      display_fields: ['title'],
      search_fields: ['title'],
    },
  ],
}
```

The `translationKey` property is not defined as a field, but it’s still a valid value field. If you have renamed the property with the [`i18n.canonical_slug.key`](https://sveltiacms.app/en/docs/i18n/slugs#localizing-entry-slugs) option, such as `ref` for Jekyll, use that key instead.

Source: https://sveltiacms.app/en/docs/fields/relation

---

## Compute Field

The Compute field type displays read-only computed values based on other fields in the entry. It automatically updates the displayed value when the dependent fields change.

### User Interface

#### Editor

Read-only display of computed values based on other fields in the entry. The value is automatically updated when the dependent fields change.

#### Preview

A read-only display of the computed value.

### Data Type

A string representing the computed value.

If the `{{index}}` variable is used within a list, the value will be a number representing the current index of the item in the list.

If the template contains a UUID variable, the generated UUID is preserved in the saved value across edits.

### Data Validation

No specific data validation is applied to the Compute field, as its value is derived from other fields.

### Options

In addition to the [common field options](https://sveltiacms.app/en/docs/fields#common-options), the Compute field supports the following options:

#### Required Options

##### `widget`

- **Type**: `string`
- **Default**: `string`

Must be set to `compute`.

##### `value`

- **Type**: `string`

The value can be computed using a template string that references other fields. It supports:

- A value template that defines how to compute the field’s value. It can include references to other fields using the syntax `{{fields.name}}`, where `name` is the name of the field to reference. [String transformations](https://sveltiacms.app/en/docs/string-transformations) can be applied.
- The special variable `{{index}}` to reference the current index when used within a list. It only works inside a [List field](https://sveltiacms.app/en/docs/fields/list).
- The special variables `{{uuid}}`, `{{uuid_short}}` and `{{uuid_shorter}}` to generate a random UUID or its shorter version, just like the [slug template tags](https://sveltiacms.app/en/docs/collections/entries/slugs#slug-template-tags). The UUID is generated once when the entry is created and kept afterwards, even as the other parts of the value change, so it can serve as a stable identifier. A duplicated entry gets a new UUID. See the [example below](#generating-a-unique-identifier).

**Warning**

To be kept, a UUID variable has to be at either end of the template, or only be separated from the ends by literal text and other UUID variables, like `{{fields.slug}}-{{uuid_short}}`. A UUID variable sitting between two field references, such as `{{fields.a}}{{uuid}}{{fields.b}}`, can’t be told apart from the values around it once saved, so a new UUID is generated whenever the entry is opened. The same applies when a string transformation changes the shape of the UUID, e.g. `truncate`; `upper` and `lower` are fine.

### Examples

#### Basic Example

This example demonstrates a Compute field that concatenates the values of two string fields, `first_name` and `last_name`, to create a `full_name` field.

```yaml [YAML]
fields:
  - name: first_name
    label: First Name
    widget: string
  - name: last_name
    label: Last Name
    widget: string
  - name: full_name
    label: Full Name
    widget: compute
    value: '{{fields.first_name}} {{fields.last_name}}'
```

```toml [TOML]
[[fields]]
name = "first_name"
label = "First Name"
widget = "string"
[[fields]]
name = "last_name"
label = "Last Name"
widget = "string"
[[fields]]
name = "full_name"
label = "Full Name"
widget = "compute"
value = "{{fields.first_name}} {{fields.last_name}}"
```

```json [JSON]
{
  "fields": [
    {
      "name": "first_name",
      "label": "First Name",
      "widget": "string"
    },
    {
      "name": "last_name",
      "label": "Last Name",
      "widget": "string"
    },
    {
      "name": "full_name",
      "label": "Full Name",
      "widget": "compute",
      "value": "{{fields.first_name}} {{fields.last_name}}"
    }
  ]
}
```

```js [JavaScript]
{
  fields: [
    {
      name: 'first_name',
      label: 'First Name',
      widget: 'string',
    },
    {
      name: 'last_name',
      label: 'Last Name',
      widget: 'string',
    },
    {
      name: 'full_name',
      label: 'Full Name',
      widget: 'compute',
      value: '{{fields.first_name}} {{fields.last_name}}',
    },
  ];
}
```

Output example when `first_name` is “John” and `last_name` is “Doe“:

```yaml [YAML]
first_name: John
last_name: Doe
full_name: John Doe
```

```toml [TOML]
first_name = "John"
last_name = "Doe"
full_name = "John Doe"
```

```json [JSON]
{
  "first_name": "John",
  "last_name": "Doe",
  "full_name": "John Doe"
}
```

```js [JavaScript]
{
  first_name: 'John',
  last_name: 'Doe',
  full_name: 'John Doe',
}
```

#### Email Link

This example demonstrates a Compute field that generates a mailto link using an email address from another String field.

```yaml [YAML]
fields:
  - name: contact_email
    label: Contact Email
    widget: string
    type: email
  - name: contact_email_link
    label: Contact Email Link
    widget: compute
    value: 'mailto:{{fields.contact_email}}?subject=Inquiry'
```

```toml [TOML]
[[fields]]
name = "contact_email"
label = "Contact Email"
widget = "string"
type = "email"
[[fields]]
name = "contact_email_link"
label = "Contact Email Link"
widget = "compute"
value = "mailto:{{fields.contact_email}}?subject=Inquiry"
```

```json [JSON]
{
  "fields": [
    {
      "name": "contact_email",
      "label": "Contact Email",
      "widget": "string",
      "type": "email"
    },
    {
      "name": "contact_email_link",
      "label": "Contact Email Link",
      "widget": "compute",
      "value": "mailto:{{fields.contact_email}}?subject=Inquiry"
    }
  ]
}
```

```js [JavaScript]
{
  fields: [
    {
      name: 'contact_email',
      label: 'Contact Email',
      widget: 'string',
      type: 'email',
    },
    {
      name: 'contact_email_link',
      label: 'Contact Email Link',
      widget: 'compute',
      value: 'mailto:{{fields.contact_email}}?subject=Inquiry',
    },
  ];
}
```

Output example when `contact_email` is “contact@example.com“:

```yaml [YAML]
contact_email: contact@example.com
contact_email_link: mailto:contact@example.com?subject=Inquiry
```

```toml [TOML]
contact_email = "contact@example.com"
contact_email_link = "mailto:contact@example.com?subject=Inquiry"
```

```json [JSON]
{
  "contact_email": "contact@example.com",
  "contact_email_link": "mailto:contact@example.com?subject=Inquiry"
}
```

```js [JavaScript]
{
  contact_email: 'contact@example.com',
  contact_email_link: 'mailto:contact@example.com?subject=Inquiry';
}
```

#### Using `index` in a List

The `{{index}}` variable can be used within a list to reference the current item’s index. In this example, we create a list of items where each item has a computed `index` based on its index in the list.

```yaml [YAML]
fields:
  - name: items
    label: Items
    widget: list
    fields:
      - name: name
        label: Name
        widget: string
      - name: index
        label: Item Index
        widget: compute
        value: '{{index}}'
```

```toml [TOML]
[[fields]]
name = "items"
label = "Items"
widget = "list"

[[fields.fields]]
name = "name"
label = "Name"
widget = "string"

[[fields.fields]]
name = "index"
label = "Item Index"
widget = "compute"
value = "{{index}}"
```

```json [JSON]
{
  "fields": [
    {
      "name": "items",
      "label": "Items",
      "widget": "list",
      "fields": [
        {
          "name": "name",
          "label": "Name",
          "widget": "string"
        },
        {
          "name": "index",
          "label": "Item Index",
          "widget": "compute",
          "value": "{{index}}"
        }
      ]
    }
  ]
}
```

```js [JavaScript]
{
  fields: [
    {
      name: 'items',
      label: 'Items',
      widget: 'list',
      fields: [
        {
          name: 'name',
          label: 'Name',
          widget: 'string',
        },
        {
          name: 'index',
          label: 'Item Index',
          widget: 'compute',
          value: '{{index}}',
        },
      ],
    },
  ];
}
```

Output example when three items are added with names “Apple“, “Banana“, and “Cherry“:

```yaml [YAML]
items:
  - name: Apple
    index: 0
  - name: Banana
    index: 1
  - name: Cherry
    index: 2
```

```toml [TOML]
[[items]]
name = "Apple"
index = 0
[[items]]
name = "Banana"
index = 1
[[items]]
name = "Cherry"
index = 2
```

```json [JSON]
{
  "items": [
    {
      "name": "Apple",
      "index": 0
    },
    {
      "name": "Banana",
      "index": 1
    },
    {
      "name": "Cherry",
      "index": 2
    }
  ]
}
```

#### Generating a Unique Identifier

The `{{uuid}}`, `{{uuid_short}}` and `{{uuid_shorter}}` variables can be combined with other fields to build a readable identifier that stays unique. In this example, the `id` field combines the slugified title with a short random string. Once the entry has been saved, the random part is kept even if the title is edited later.

```yaml [YAML]
fields:
  - name: title
    label: Title
    widget: string
  - name: id
    label: ID
    widget: compute
    value: '{{fields.title | slugify}}-{{uuid_shorter}}'
```

```toml [TOML]
[[fields]]
name = "title"
label = "Title"
widget = "string"
[[fields]]
name = "id"
label = "ID"
widget = "compute"
value = "{{fields.title | slugify}}-{{uuid_shorter}}"
```

```json [JSON]
{
  "fields": [
    {
      "name": "title",
      "label": "Title",
      "widget": "string"
    },
    {
      "name": "id",
      "label": "ID",
      "widget": "compute",
      "value": "{{fields.title | slugify}}-{{uuid_shorter}}"
    }
  ]
}
```

```js [JavaScript]
{
  fields: [
    {
      name: 'title',
      label: 'Title',
      widget: 'string',
    },
    {
      name: 'id',
      label: 'ID',
      widget: 'compute',
      value: '{{fields.title | slugify}}-{{uuid_shorter}}',
    },
  ];
}
```

Output example when `title` is “Hello World“:

```yaml [YAML]
title: Hello World
id: hello-world-e7bc7d91
```

```toml [TOML]
title = "Hello World"
id = "hello-world-e7bc7d91"
```

```json [JSON]
{
  "title": "Hello World",
  "id": "hello-world-e7bc7d91"
}
```

```js [JavaScript]
{
  title: 'Hello World',
  id: 'hello-world-e7bc7d91',
}
```

Source: https://sveltiacms.app/en/docs/fields/compute

---

## UUID Field

The UUID field type provides a read-only field that automatically generates and displays a Universally Unique Identifier (UUID). It’s useful for uniquely identifying entries within the CMS.

### User Interface

#### Editor

Read-only display of a [UUID](https://developer.mozilla.org/en-US/docs/Glossary/UUID) (Universally Unique Identifier) value. The UUID is automatically generated when a new entry is created and cannot be modified by the user.

#### Preview

A read-only view of the UUID value.

### Data Type

A string representing a UUID in the standard 36-character format (e.g., `df733d7e-d2f7-4e4f-8f27-803046b64040`). Alphabetic characters are in lowercase.

If `use_b32_encoding` is set to true, the UUID will be represented in a 26-character [Base32](https://en.wikipedia.org/wiki/Base32) format (e.g., `C5T6KX3M6N7G4Y2Z1A0B9C8D7E`).

### Data Validation

No specific data validation is applied to the UUID field, as its value is automatically generated.

### Options

In addition to the [common field options](https://sveltiacms.app/en/docs/fields#common-options), the UUID field supports the following options:

#### Required Options

##### `widget`

- **Type**: `string`
- **Default**: `string`

Must be set to `uuid`.

#### Optional Options

**Deprecation Notice**

The `read_only` option has been deprecated in favor of the `readonly` common field option. The `read_only` option will be removed in Sveltia CMS v1.0.0. If you are upgrading from an older version, update your configuration accordingly.

##### `default`

- **Type**: `string`
- **Default**: A newly generated UUID

The default value for the field. If not provided, a new UUID will be generated when the entry is created.

##### `prefix`

- **Type**: `string`
- **Default**: `""`

A string prefix to prepend to the generated UUID. Useful for adding context or categorization to the UUID.

##### `use_b32_encoding`

- **Type**: `boolean`
- **Default**: `false`

Whether to use Base32 encoding for the UUID. If set to `true`, the UUID will be represented in a 26-character Base32 format instead of the standard 36-character format.

### Examples

#### Basic UUID Field

This example demonstrates a basic UUID field that generates a standard UUID.

```yaml [YAML]
- name: product_id
  label: Product ID
  widget: uuid
```

```toml [TOML]
[[fields]]
name = "product_id"
label = "Product ID"
widget = "uuid"
```

```json [JSON]
{
  "name": "product_id",
  "label": "Product ID",
  "widget": "uuid"
}
```

```js [JavaScript]
{
  name: 'product_id',
  label: 'Product ID',
  widget: 'uuid',
}
```

Output example:

```yaml [YAML]
product_id: df733d7e-d2f7-4e4f-8f27-803046b64040
```

```toml [TOML]
product_id = "df733d7e-d2f7-4e4f-8f27-803046b64040"
```

```json [JSON]
{
  "product_id": "df733d7e-d2f7-4e4f-8f27-803046b64040"
}
```

#### UUID Field with Prefix and Base32 Encoding

This example demonstrates a UUID field that includes a prefix and uses Base32 encoding.

```yaml [YAML]
- name: order_id
  label: Order ID
  widget: uuid
  prefix: ORD-
  use_b32_encoding: true
```

```toml [TOML]
[[fields]]
name = "order_id"
label = "Order ID"
widget = "uuid"
prefix = "ORD-"
use_b32_encoding = true
```

```json [JSON]
{
  "name": "order_id",
  "label": "Order ID",
  "widget": "uuid",
  "prefix": "ORD-",
  "use_b32_encoding": true
}
```

```js [JavaScript]
{
  name: 'order_id',
  label: 'Order ID',
  widget: 'uuid',
  prefix: 'ORD-',
  use_b32_encoding: true,
}
```

Output example:

```yaml [YAML]
order_id: ORD-C5T6KX3M6N7G4Y2Z1A0B9C8D7E
```

```toml [TOML]
order_id = "ORD-C5T6KX3M6N7G4Y2Z1A0B9C8D7E"
```

```json [JSON]
{
  "order_id": "ORD-C5T6KX3M6N7G4Y2Z1A0B9C8D7E"
}
```

Source: https://sveltiacms.app/en/docs/fields/uuid
