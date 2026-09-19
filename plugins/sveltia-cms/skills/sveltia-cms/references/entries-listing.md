# Entry Collections: Listings, Views and Operations

How entries appear and behave in the content library: summaries, thumbnails, index files, sorting, grouping, filtering, reordering, and creation and deletion controls.

Generated from the Sveltia CMS documentation. Do not edit by hand.

## Entry Operations

Sveltia CMS provides options to control entry creation, deletion and duplication, limit the number of entries, hide collections from the interface, and let editors reorder entries manually.

### Disabling Creation and Deletion

You can disable entry creation and deletion by setting the `create` option to `false` and the `delete` option to `false` in the collection definition. This is useful for collections where entries are managed programmatically or through other means, and you don’t want editors to create or delete entries.

```yaml [YAML]{5-6}
collections:
  - name: posts
    label: Blog Posts
    folder: /content/posts
    create: false
    delete: false
    fields:
      - { name: title, label: Title }
      - { name: body, label: Body, widget: richtext }
```

```toml [TOML]{5-6}
[[collections]]
name = "posts"
label = "Blog Posts"
folder = "/content/posts"
create = false
delete = false

[[collections.fields]]
name = "title"
label = "Title"

[[collections.fields]]
name = "body"
label = "Body"
widget = "richtext"
```

```json [JSON]{7-8}
{
  "collections": [
    {
      "name": "posts",
      "label": "Blog Posts",
      "folder": "/content/posts",
      "create": false,
      "delete": false,
      "fields": [
        { "name": "title", "label": "Title" },
        { "name": "body", "label": "Body", "widget": "richtext" }
      ]
    }
  ]
}
```

```js [JavaScript]{7-8}
{
  collections: [
    {
      name: "posts",
      label: "Blog Posts",
      folder: "/content/posts",
      create: false,
      delete: false,
      fields: [
        { name: "title", label: "Title" },
        { name: "body", label: "Body", widget: "richtext" },
      ],
    },
  ],
}
```

**Breaking change from Netlify/Decap CMS**

In Sveltia CMS, the `create` option for entry collections defaults to `true` because, in 99.99% of cases, users want to create new entries and adding `create: true` to every collection is redundant. To disable entry creation, set `create: false` explicitly.

### Disabling Duplication

You can disable entry duplication by setting the `duplicate` option to `false` in the collection definition. This is useful for collections where entries should not be duplicated, such as unique content types.

When the `duplicate` option is set to `false`, the “Duplicate” button will be disabled in the Sveltia CMS interface, preventing users from creating duplicate entries.

```yaml [YAML]{5}
collections:
  - name: products
    label: Products
    folder: /content/products
    duplicate: false
```

```toml [TOML]{5}
[[collections]]
name = "products"
label = "Products"
folder = "/content/products"
duplicate = false
```

```json [JSON]{7}
{
  "collections": [
    {
      "name": "products",
      "label": "Products",
      "folder": "/content/products",
      "duplicate": false
    }
  ]
}
```

```js [JavaScript]{7}
{
  collections: [
    {
      name: "products",
      label: "Products",
      folder: "/content/products",
      duplicate: false,
    },
  ],
}
```

### Limiting Entry Count

You can limit the number of entries in an entry collection using the `limit` option. This is useful for collections where you want to restrict the number of items, such as featured articles or top products.

```yaml [YAML]{5}
collections:
  - name: featured_articles
    label: Featured Articles
    folder: /content/featured_articles
    limit: 5
    fields:
      - { name: title, label: Title }
      - { name: body, label: Body, widget: richtext }
```

```toml [TOML]{5}
[[collections]]
name = "featured_articles"
label = "Featured Articles"
folder = "/content/featured_articles"
limit = 5

[[collections.fields]]
name = "title"
label = "Title"

[[collections.fields]]
name = "body"
label = "Body"
widget = "richtext"
```

```json [JSON]{7}
{
  "collections": [
    {
      "name": "featured_articles",
      "label": "Featured Articles",
      "folder": "/content/featured_articles",
      "limit": 5,
      "fields": [
        { "name": "title", "label": "Title" },
        { "name": "body", "label": "Body", "widget": "richtext" }
      ]
    }
  ]
}
```

```js [JavaScript]{7}
{
  collections: [
    {
      name: "featured_articles",
      label: "Featured Articles",
      folder: "/content/featured_articles",
      limit: 5,
      fields: [
        { name: "title", label: "Title" },
        { name: "body", label: "Body", widget: "richtext" },
      ],
    },
  ],
}
```

With the above configuration, editors can only create up to 5 entries in the `featured_articles` collection. Once the limit is reached, the “Create new” button will be disabled in the Sveltia CMS interface.

### Hiding the Collection

You can hide an entry collection from the Sveltia CMS interface using the `hide` option. This is useful for collections that are managed programmatically or through other means, and you don’t want editors to see or modify them.

```yaml [YAML]{5}
collections:
  - name: posts
    label: Blog Posts
    folder: /content/posts
    hide: true
    fields:
      - { name: title, label: Title }
      - { name: body, label: Body, widget: richtext }
```

```toml [TOML]{5}
[[collections]]
name = "posts"
label = "Blog Posts"
folder = "/content/posts"
hide = true

[[collections.fields]]
name = "title"
label = "Title"

[[collections.fields]]
name = "body"
label = "Body"
widget = "richtext"
```

```json [JSON]{7}
{
  "collections": [
    {
      "name": "posts",
      "label": "Blog Posts",
      "folder": "/content/posts",
      "hide": true,
      "fields": [
        { "name": "title", "label": "Title" },
        { "name": "body", "label": "Body", "widget": "richtext" }
      ]
    }
  ]
}
```

```js [JavaScript]{7}
{
  collections: [
    {
      name: "posts",
      label: "Blog Posts",
      folder: "/content/posts",
      hide: true,
      fields: [
        { name: "title", label: "Title" },
        { name: "body", label: "Body", widget: "richtext" },
      ],
    },
  ],
}
```

When the `hide` option is set to `true`, the collection will not appear in the Sveltia CMS interface, and editors will not be able to access or modify its entries.

### Reordering Entries

When the `reorder` option is set to `true`, Sveltia CMS enables manual reordering of entries in the listing view. This is useful for collections where the order of the entries matters, such as a list of featured products or a custom navigation menu.

With this option enabled, users can reorder entries by dragging and dropping them or using the arrow buttons.

```yaml [YAML]{5}
collections:
  - name: posts
    label: Blog Posts
    folder: /content/posts
    reorder: true
    fields:
      - { name: title, label: Title }
      - { name: body, label: Body, widget: richtext }
```

```toml [TOML]{5}
[[collections]]
name = "posts"
label = "Blog Posts"
folder = "/content/posts"
reorder = true

[[collections.fields]]
name = "title"
label = "Title"

[[collections.fields]]
name = "body"
label = "Body"
widget = "richtext"
```

```json [JSON]{7}
{
  "collections": [
    {
      "name": "posts",
      "label": "Blog Posts",
      "folder": "/content/posts",
      "reorder": true,
      "fields": [
        { "name": "title", "label": "Title" },
        { "name": "body", "label": "Body", "widget": "richtext" }
      ]
    }
  ]
}
```

```js [JavaScript]{7}
{
  collections: [
    {
      name: "posts",
      label: "Blog Posts",
      folder: "/content/posts",
      reorder: true,
      fields: [
        { name: "title", label: "Title" },
        { name: "body", label: "Body", widget: "richtext" },
      ],
    },
  ],
}
```

By default, orders are saved in an additional property named `order` in each entry’s data, starting from `1`. However, you can customize this setting by providing an object with a `key` property that specifies a different field name for storing the order value. For example, to use the `weight` field for [Hugo](https://gohugo.io/methods/page/weight/) or [Zola](https://www.getzola.org/documentation/content/section/#weight), configure it like this:

```yaml [YAML]{5-6}
collections:
  - name: posts
    label: Blog Posts
    folder: /content/posts
    reorder:
      key: weight
    fields:
      - { name: title, label: Title }
      - { name: body, label: Body, widget: richtext }
```

```toml [TOML]{5}
[[collections]]
name = "posts"
label = "Blog Posts"
folder = "/content/posts"
reorder = { key = "weight" }

[[collections.fields]]
name = "title"
label = "Title"

[[collections.fields]]
name = "body"
label = "Body"
widget = "richtext"
```

```json [JSON]{7}
{
  "collections": [
    {
      "name": "posts",
      "label": "Blog Posts",
      "folder": "/content/posts",
      "reorder": { "key": "weight" },
      "fields": [
        { "name": "title", "label": "Title" },
        { "name": "body", "label": "Body", "widget": "richtext" }
      ]
    }
  ]
}
```

```js [JavaScript]{7}
{
  collections: [
    {
      name: "posts",
      label: "Blog Posts",
      folder: "/content/posts",
      reorder: { key: "weight" },
      fields: [
        { name: "title", label: "Title" },
        { name: "body", label: "Body", widget: "richtext" },
      ],
    },
  ],
}
```

#### Reordering Within Groups

Entering reorder mode normally clears any active grouping, so the entry list becomes a single flat sequence. If the order value is only meaningful within a group — for example, articles ordered per category — you can instead keep the list grouped while reordering by adding a `group` property to the `reorder` option. Its value is the `name` of one of the collection’s [view groups](https://sveltiacms.app/en/docs/collections/entries/views#grouping):

```yaml [YAML]{5-11}
collections:
  - name: articles
    label: Articles
    folder: /content/articles
    reorder:
      group: categories
    view_groups:
      groups:
        - name: categories
          label: Categories
          field: category
    fields:
      - { name: title, label: Title }
      - { name: category, label: Category }
      - { name: body, label: Body, widget: richtext }
```

```toml [TOML]{5,7-10}
[[collections]]
name = "articles"
label = "Articles"
folder = "/content/articles"
reorder = { group = "categories" }

[[collections.view_groups.groups]]
name = "categories"
label = "Categories"
field = "category"

[[collections.fields]]
name = "title"
label = "Title"

[[collections.fields]]
name = "category"
label = "Category"

[[collections.fields]]
name = "body"
label = "Body"
widget = "richtext"
```

```json [JSON]{7-10}
{
  "collections": [
    {
      "name": "articles",
      "label": "Articles",
      "folder": "/content/articles",
      "reorder": { "group": "categories" },
      "view_groups": {
        "groups": [{ "name": "categories", "label": "Categories", "field": "category" }]
      },
      "fields": [
        { "name": "title", "label": "Title" },
        { "name": "category", "label": "Category" },
        { "name": "body", "label": "Body", "widget": "richtext" }
      ]
    }
  ]
}
```

```js [JavaScript]{7-10}
{
  collections: [
    {
      name: "articles",
      label: "Articles",
      folder: "/content/articles",
      reorder: { group: "categories" },
      view_groups: {
        groups: [{ name: "categories", label: "Categories", field: "category" }],
      },
      fields: [
        { name: "title", label: "Title" },
        { name: "category", label: "Category" },
        { name: "body", label: "Body", widget: "richtext" },
      ],
    },
  ],
}
```

With the above configuration, the entry list is grouped by `category` whenever a user enters reorder mode, and entries can only be dragged within their own group. Dropping an entry into a different group is rejected, because that would not change the `category` field that determines which group it belongs to.

A few things to keep in mind:

- The group is referenced by `name`, so the view group must have one. The `name` property is required in the extended syntax shown above, and can also be added to individual entries in the plain array syntax.
- The configured group replaces whatever grouping the user has selected in the Group menu. Their own selection is restored once they leave reorder mode.
- Order values are still assigned as a single sequence starting from `1`, numbered group by group. They do not restart at `1` in each group, so the first entry of the second group continues from where the first group ended.
- If the named group is not defined in `view_groups`, Sveltia CMS raises a configuration error on startup.

Source: https://sveltiacms.app/en/docs/collections/entries/operations

---

## Entry Listings

After creating an entry collection, you might want to customize how entries are displayed in the Sveltia CMS interface. The following options allow you to control various aspects of entry listings.

### Summaries

By default, Sveltia CMS uses the `title` field (or a field defined with the [`identifier_field` option](https://sveltiacms.app/en/docs/collections/entries/slugs#specifying-an-identifier-field)) as the summary for each entry in the listing view.

Sometimes entries might only have a `body` field without a `title` field. In such cases, Sveltia CMS will look for a header in the Markdown body field, if it exists, or use the entry slug as a fallback to ensure that the summary is never empty. This behavior supports typical Markdown-based setups like [VitePress](https://sveltiacms.app/en/docs/frameworks/vitepress) and [Docusaurus](https://sveltiacms.app/en/docs/frameworks/docusaurus).

You can customize the summary displayed for each entry using the `summary` option. This option accepts a string with template tags that will be replaced with entry-specific values when generating the summary. For example, to display both the title and date of each entry in the summary, you can use the following configuration:

```yaml [YAML]
summary: '{{title}} ({{date}})'
```

```toml [TOML]
summary = "{{title}} ({{date}})"
```

```json [JSON]
{
  "summary": "{{title}} ({{date}})"
}
```

```js [JavaScript]
{
  summary: "{{title}} ({{date}})",
}
```

Basic Markdown syntax is supported in the `summary` option, including bold, italics and inline code. For example:

```yaml [YAML]
summary: '**{{title}}** - _{{date}}_ `{{status}}`'
```

```toml [TOML]
summary = "**{{title}}** - _{{date}}_ `{{status}}`"
```

```json [JSON]
{
  "summary": "**{{title}}** - _{{date}}_ `{{status}}`"
}
```

```js [JavaScript]
{
  summary: "**{{title}}** - _{{date}}_ `{{status}}`",
}
```

You can use [string transformations](https://sveltiacms.app/en/docs/string-transformations) with these template tags as well. For example:

```yaml [YAML]
summary: "{{title}} - {{date | date('DD MMM YYYY')}} {{published | ternary('', '(draft)')}}"
```

```toml [TOML]
summary = "{{title}} - {{date | date('DD MMM YYYY')}} {{published | ternary('', '(draft)')}}"
```

```json [JSON]
{
  "summary": "{{title}} - {{date | date('DD MMM YYYY')}} {{published | ternary('', '(draft)')}}"
}
```

```js [JavaScript]
{
  summary: "{{title}} - {{date | date('DD MMM YYYY')}} {{published | ternary('', '(draft)')}}",
}
```

The following template tags are supported in the `summary` option, in addition to [slug template tags](https://sveltiacms.app/en/docs/collections/entries/slugs#slug-template-tags) except date-related ones:

- `{{dirname}}`: The name of the directory containing the entry file, relative to the collection `folder`.
- `{{filename}}`: The entry file name without the extension.
- `{{extension}}`: The entry file extension.
- `{{commit_author}}`: The last commit author of the entry file from Git history (if available).
- `{{commit_date}}`: The last commit date of the entry file from Git history (if available).
- `{{locales}}`: The enabled locales for the entry when using [i18n support](https://sveltiacms.app/en/docs/i18n).

**Known issue**

Git commit information is not available with the GitLab backend due to API limitations.

### Thumbnails

By default, Sveltia CMS automatically looks for any non-nested, non-empty Image or File field in the entry to use as a thumbnail in the entry listing view. However, you can customize this behavior using the `thumbnail` option.

```yaml [YAML]{5}
collections:
  - name: posts
    label: Blog Posts
    folder: /content/posts
    thumbnail: featuredImage
    fields:
      - { name: title, label: Title }
      - { name: featuredImage, label: Featured Image, widget: image }
      - { name: body, label: Body, widget: richtext }
```

```toml [TOML]{5}
[[collections]]
name = "posts"
label = "Blog Posts"
folder = "/content/posts"
thumbnail = "featuredImage"

[[collections.fields]]
name = "title"
label = "Title"

[[collections.fields]]
name = "featuredImage"
label = "Featured Image"
widget = "image"

[[collections.fields]]
name = "body"
label = "Body"
widget = "richtext"
```

```json [JSON]{7}
{
  "collections": [
    {
      "name": "posts",
      "label": "Blog Posts",
      "folder": "/content/posts",
      "thumbnail": "featuredImage",
      "fields": [
        { "name": "title", "label": "Title" },
        { "name": "featuredImage", "label": "Featured Image", "widget": "image" },
        { "name": "body", "label": "Body", "widget": "richtext" }
      ]
    }
  ]
}
```

```js [JavaScript]{7}
{
  collections: [
    {
      name: "posts",
      label: "Blog Posts",
      folder: "/content/posts",
      thumbnail: "featuredImage",
      fields: [
        { name: "title", label: "Title" },
        { name: "featuredImage", label: "Featured Image", widget: "image" },
        { name: "body", label: "Body", widget: "richtext" },
      ],
    },
  ],
}
```

The `thumbnail` option can take a string or an array of strings representing the field names to be used as thumbnails. The first field that contains a valid image will be used as the thumbnail. For example:

```yaml [YAML]
thumbnail: [thumbnailImage, coverImage]
```

```toml [TOML]
thumbnail = ["thumbnailImage", "coverImage"]
```

```json [JSON]
{
  "thumbnail": ["thumbnailImage", "coverImage"]
}
```

```js [JavaScript]
{
  thumbnail: ["thumbnailImage", "coverImage"],
}
```

A nested field can be specified using dot notation, e.g. `heroImage.src`. A wildcard in the field name is also supported, e.g. `images.*.src`, to target images in a list field.

Occasionally, you may not have suitable images for thumbnails. For example, your images may have subtle differences or varied aspect ratios. In that case, you can disable the thumbnail feature by setting the `thumbnail` option to `false` or an empty array:

```yaml [YAML]
thumbnail: false
```

```toml [TOML]
thumbnail = false
```

```json [JSON]
{
  "thumbnail": false
}
```

```js [JavaScript]
{
  thumbnail: false,
}
```

### Including and Excluding Entries

Sometimes, you may want to include or exclude specific entries from being displayed in the Sveltia CMS interface. Sveltia CMS provides options to manage this.

#### Managing Hugo’s Special Index File

By default, Hugo’s [special `_index.md` file](https://gohugo.io/content-management/organization/#index-pages-_indexmd) are hidden in a folder collection unless the `path` option is configured to end with `_index` and the `extension` is set to `md`. You have to create a [file collection](https://sveltiacms.app/en/docs/collections/files) to manage the file, since it usually comes with a different set of fields than regular entry fields.

The `index_file` option allows you to include and manage the special index file within the same folder collection. This way, editors can easily access and edit the index file alongside regular entries.

```yaml [YAML]{10-13}
collections:
  - name: posts
    label: Blog posts
    folder: /content/posts
    fields: # Fields for regular entries
      - { name: title, label: Title }
      - { name: date, label: Published Date, widget: datetime }
      - { name: description, label: Description }
      - { name: body, label: Body, widget: richtext }
    index_file:
      fields: # Fields for the index file
        - { name: title, label: Title }
        - { name: body, label: Body, widget: richtext }
```

```toml [TOML]{24-33}
[[collections]]
name = "posts"
label = "Blog posts"
folder = "/content/posts"

[[collections.fields]]
name = "title"
label = "Title"

[[collections.fields]]
name = "date"
label = "Published Date"
widget = "datetime"

[[collections.fields]]
name = "description"
label = "Description"

[[collections.fields]]
name = "body"
label = "Body"
widget = "richtext"

[collections.index_file]

[[collections.index_file.fields]]
name = "title"
label = "Title"

[[collections.index_file.fields]]
name = "body"
label = "Body"
widget = "richtext"
```

```json [JSON]{13-18}
{
  "collections": [
    {
      "name": "posts",
      "label": "Blog posts",
      "folder": "/content/posts",
      "fields": [
        { "name": "title", "label": "Title" },
        { "name": "date", "label": "Published Date", "widget": "datetime" },
        { "name": "description", "label": "Description" },
        { "name": "body", "label": "Body", "widget": "richtext" }
      ],
      "index_file": {
        "fields": [
          { "name": "title", "label": "Title" },
          { "name": "body", "label": "Body", "widget": "richtext" }
        ]
      }
    }
  ]
}
```

```js [JavaScript]{13-18}
{
  collections: [
    {
      name: "posts",
      label: "Blog posts",
      folder: "/content/posts",
      fields: [
        { name: "title", label: "Title" },
        { name: "date", label: "Published Date", widget: "datetime" },
        { name: "description", label: "Description" },
        { name: "body", label: "Body", widget: "richtext" },
      ],
      index_file: {
        fields: [
          { name: "title", label: "Title" },
          { name: "body", label: "Body", widget: "richtext" },
        ],
      },
    },
  ],
}
```

Here is an example of full customization. All options are optional.

```yaml [YAML]
index_file:
  name: _index # File name without a locale or extension. Default: _index
  label: Index File # Human-readable file label. Default: Index File
  icon: home # Material Symbols icon name. Default: home
  fields: # Fields for the index file. If omitted, regular entry fields are used
    ...
  editor:
    preview: false # Hide the preview pane if needed. Default: true
```

```toml [TOML]
[index_file]
name = "_index"
label = "Index File"
icon = "home"
# fields would be defined as [[index_file.fields]] elements
# editor configuration
[index_file.editor]
preview = false
```

```json [JSON]
{
  "index_file": {
    "name": "_index",
    "label": "Index File",
    "icon": "home",
    "fields": [],
    "editor": {
      "preview": false
    }
  }
}
```

```js [JavaScript]
{
  index_file: {
    name: "_index",
    label: "Index File",
    icon: "home",
    fields: [],
    editor: {
      preview: false,
    },
  },
}
```

If your regular entry fields and index file fields are identical and you don’t need any options, simply write:

```yaml [YAML]
index_file: true
```

```toml [TOML]
index_file = true
```

```json [JSON]
{
  "index_file": true
}
```

```js [JavaScript]
{
  index_file: true,
}
```

Note that the special index file is placed right under the `folder`, regardless of the collection’s [`path` option](https://sveltiacms.app/en/docs/collections/entries/slugs#using-subfolders). For example, if the `path` is `{{year}}/{{slug}}`, a regular entry would be saved as `content/posts/2025/title.md`, but the index file remains at `content/posts/_index.md`.

#### Filtering Entries

With the `filter` option, you can limit the entries displayed in the Sveltia CMS interface based on specific criteria. This is useful for collections where you want to show only a subset of entries, such as a specific language or category.

This option takes an object with two properties:

- `field`: The name of the field to filter by.
- `value` or `pattern`: The value that the field must match for an entry to be included.
  - The `value` property checks for exact matches, while the `pattern` property allows for regular expression matching.
  - The `value` can be a single value or an array of values. If an array is provided, entries matching any of the values will be included. If `null` is provided as a value, entries where the field is not set will be included.
  - The `pattern` property should be a string representing a valid regular expression.

The example below shows how to create two separate collections for English and French blog posts, filtering entries based on the `lang` field:

```yaml [YAML]{5,13}
collections:
  - name: english-posts
    label: English Posts
    folder: /content/posts
    filter: { field: lang, value: en }
    fields:
      - { name: lang, label: Language, widget: select, options: [en, fr] }
      - { name: title, label: Title }
      - { name: body, label: Body, widget: richtext }
  - name: french-posts
    label: French Posts
    folder: /content/posts
    filter: { field: lang, value: fr }
    fields:
      - { name: lang, label: Language, widget: select, options: [en, fr] }
      - { name: title, label: Title }
      - { name: body, label: Body, widget: richtext }
```

```toml [TOML]{5,26}
[[collections]]
name = "english-posts"
label = "English Posts"
folder = "/content/posts"
filter = { field = "lang", value = "en" }

[[collections.fields]]
name = "lang"
label = "Language"
widget = "select"
options = ["en", "fr"]

[[collections.fields]]
name = "title"
label = "Title"

[[collections.fields]]
name = "body"
label = "Body"
widget = "richtext"

[[collections]]
name = "french-posts"
label = "French Posts"
folder = "/content/posts"
filter = { field = "lang", value = "fr" }

[[collections.fields]]
name = "lang"
label = "Language"
widget = "select"
options = ["en", "fr"]

[[collections.fields]]
name = "title"
label = "Title"

[[collections.fields]]
name = "body"
label = "Body"
widget = "richtext"
```

```json [JSON]{7,18}
{
  "collections": [
    {
      "name": "english-posts",
      "label": "English Posts",
      "folder": "/content/posts",
      "filter": { "field": "lang", "value": "en" },
      "fields": [
        { "name": "lang", "label": "Language", "widget": "select", "options": ["en", "fr"] },
        { "name": "title", "label": "Title" },
        { "name": "body", "label": "Body", "widget": "richtext" }
      ]
    },
    {
      "name": "french-posts",
      "label": "French Posts",
      "folder": "/content/posts",
      "filter": { "field": "lang", "value": "fr" },
      "fields": [
        { "name": "lang", "label": "Language", "widget": "select", "options": ["en", "fr"] },
        { "name": "title", "label": "Title" },
        { "name": "body", "label": "Body", "widget": "richtext" }
      ]
    }
  ]
}
```

```js [JavaScript]{7,18}
{
  collections: [
    {
      name: "english-posts",
      label: "English Posts",
      folder: "/content/posts",
      filter: { field: "lang", value: "en" },
      fields: [
        { name: "lang", label: "Language", widget: "select", options: ["en", "fr"] },
        { name: "title", label: "Title" },
        { name: "body", label: "Body", widget: "richtext" },
      ],
    },
    {
      name: "french-posts",
      label: "French Posts",
      folder: "/content/posts",
      filter: { field: "lang", value: "fr" },
      fields: [
        { name: "lang", label: "Language", widget: "select", options: ["en", "fr"] },
        { name: "title", label: "Title" },
        { name: "body", label: "Body", widget: "richtext" },
      ],
    },
  ],
}
```

Source: https://sveltiacms.app/en/docs/collections/entries/listings

---

## Entry Views

Sveltia CMS provides several options to customize how entries are displayed in the listing view. Users can sort, group, and filter entries based on specific fields to improve navigation and organization.

### Sorting

By default, Sveltia CMS supports sorting by `title`, `date`, `author` and `description` fields if they exist in the collection. If the `date` and `author` fields are not present, Sveltia CMS will look for commit date and author information from Git history (if available) to enable sorting by those fields.

When the [`summary` option](https://sveltiacms.app/en/docs/collections/entries/listings#summaries) is defined for a collection, Sveltia CMS also enables sorting by entry summaries. This allows you to sort entries based on the customized summary content, which can include multiple fields and string transformations.

When the [`reorder` option](https://sveltiacms.app/en/docs/collections/entries/operations#reordering-entries) is enabled for a collection, Sveltia CMS enables manual sorting of entries in the listing view. This allows users to drag and drop entries to reorder them as needed.

You can customize the sortable fields using the `sortable_fields` option. It accepts an array of field names that you want to enable for sorting in the entry listing view. It also accepts a special `slug` field to sort entries by their slugs.

The example below shows how to enable sorting by custom fields such as `category` and nested fields like `author.name`:

```yaml [YAML]{16}
collections:
  - name: posts
    label: Blog posts
    folder: /content/posts
    fields:
      - { name: title, label: Title }
      - { name: published_date, label: Published Date, widget: datetime }
      - {
          name: author,
          label: Author,
          widget: object,
          fields: [{ name: name, label: Name }, { name: email, label: Email }],
        }
      - { name: category, label: Category }
      - { name: body, label: Body, widget: richtext }
    sortable_fields: [title, published_date, author.name, category]
```

```toml [TOML]{5}
[[collections]]
name = "posts"
label = "Blog posts"
folder = "/content/posts"
sortable_fields = ["title", "published_date", "author.name", "category"]

[[collections.fields]]
name = "title"
label = "Title"

[[collections.fields]]
name = "published_date"
label = "Published Date"
widget = "datetime"

[[collections.fields]]
name = "author"
label = "Author"
widget = "object"

[[collections.fields.fields]]
name = "name"
label = "Name"

[[collections.fields.fields]]
name = "email"
label = "Email"

[[collections.fields]]
name = "category"
label = "Category"

[[collections.fields]]
name = "body"
label = "Body"
widget = "richtext"
```

```json [JSON]{22}
{
  "collections": [
    {
      "name": "posts",
      "label": "Blog posts",
      "folder": "/content/posts",
      "fields": [
        { "name": "title", "label": "Title" },
        { "name": "published_date", "label": "Published Date", "widget": "datetime" },
        {
          "name": "author",
          "label": "Author",
          "widget": "object",
          "fields": [
            { "name": "name", "label": "Name" },
            { "name": "email", "label": "Email" }
          ]
        },
        { "name": "category", "label": "Category" },
        { "name": "body", "label": "Body", "widget": "richtext" }
      ],
      "sortable_fields": ["title", "published_date", "author.name", "category"]
    }
  ]
}
```

```js [JavaScript]{17}
{
  collections: [
    {
      name: "posts",
      label: "Blog posts",
      folder: "/content/posts",
      fields: [
        { name: "title", label: "Title" },
        { name: "published_date", label: "Published Date", widget: "datetime" },
        { name: "author", label: "Author", widget: "object", fields: [
          { name: "name", label: "Name" },
          { name: "email", label: "Email" },
        ] },
        { name: "category", label: "Category" },
        { name: "body", label: "Body", widget: "richtext" },
      ],
      sortable_fields: ["title", "published_date", "author.name", "category"],
    },
  ],
}
```

**Extended syntax**

Sveltia CMS supports an extended syntax used in [Static CMS](https://staticjscms.netlify.app/docs/collection-overview#sortable-fields) to define a default sort field and direction. This is useful if you want entries to be sorted by a date field in descending order by default. Here is the same configuration using the extended syntax:

```yaml
sortable_fields:
  fields: [title, published_date, author.name, category]
  default:
    field: published_date
    direction: descending
```

The default direction is `ascending` if not specified.

For backward compatibility with Static CMS, the `direction` option accepts title case values: `Ascending` and `Descending`. However, `None` is not supported and has the same effect as `ascending`.

**Known issue**

Git commit information is not available with the GitLab backend due to API limitations.

### Grouping

The `view_groups` option allows you to group entries in the listing view based on specific field values. This is useful for organizing entries into categories or sections for easier navigation.

The example below demonstrates how to group blog posts by their `draft` status and by the year extracted from the `date` field:

```yaml [YAML]{10-15}
collections:
  - name: posts
    label: Blog posts
    folder: /content/posts
    fields:
      - { name: title, label: Title }
      - { name: date, label: Published Date, widget: datetime }
      - { name: draft, label: Draft, widget: boolean }
      - { name: body, label: Body, widget: richtext }
    view_groups:
      - field: draft
      - label: Drafts
        field: date
        label: Year
        pattern: '\d{4}'
```

```toml [TOML]{25-32}
[[collections]]
name = "posts"
label = "Blog posts"
folder = "/content/posts"

[[collections.fields]]
name = "title"
label = "Title"

[[collections.fields]]
name = "date"
label = "Published Date"
widget = "datetime"

[[collections.fields]]
name = "draft"
label = "Draft"
widget = "boolean"

[[collections.fields]]
name = "body"
label = "Body"
widget = "richtext"

[[collections.view_groups]]
label = "Drafts"
field = "draft"

[[collections.view_groups]]
label = "Year"
field = "date"
pattern = "\\d{4}"
```

```json [JSON]{13-23}
{
  "collections": [
    {
      "name": "posts",
      "label": "Blog posts",
      "folder": "/content/posts",
      "fields": [
        { "name": "title", "label": "Title" },
        { "name": "date", "label": "Published Date", "widget": "datetime" },
        { "name": "draft", "label": "Draft", "widget": "boolean" },
        { "name": "body", "label": "Body", "widget": "richtext" }
      ],
      "view_groups": [
        {
          "label": "Drafts",
          "field": "draft"
        },
        {
          "label": "Year",
          "field": "date",
          "pattern": "\\d{4}"
        }
      ]
    }
  ]
}
```

```js [JavaScript]{13-23}
{
  collections: [
    {
      name: "posts",
      label: "Blog posts",
      folder: "/content/posts",
      fields: [
        { name: "title", label: "Title" },
        { name: "date", label: "Published Date", widget: "datetime" },
        { name: "draft", label: "Draft", widget: "boolean" },
        { name: "body", label: "Body", widget: "richtext" },
      ],
      view_groups: [
        {
          label: "Drafts",
          field: "draft",
        },
        {
          label: "Year",
          field: "date",
          pattern: "\\d{4}",
        },
      ],
    },
  ],
}
```

**Extended syntax**

Sveltia CMS supports an extended syntax used in [Static CMS](https://staticjscms.netlify.app/docs/collection-overview#view-groups) to define a default group. Here is the same configuration using the extended syntax:

```yaml
view_groups:
  groups:
    - name: drafts
      label: Drafts
      field: draft
    - name: year
      label: Year
      field: date
      pattern: '\d{4}'
  default: year
```

To sort the Year group in descending order by date, you can add the `sortable_fields` property as described in the [Sorting](#sorting) section above:

```yaml
sortable_fields:
  fields: [date, title]
  default:
    field: date
    direction: descending
```

A named view group can also be used with the [`reorder` option](https://sveltiacms.app/en/docs/collections/entries/operations#reordering-within-groups) to let editors reorder entries within their own group.

#### Grouping by a Comparison

A view group can also split the entries by a comparison, using the same options as a [view filter](#comparing-values). The entries satisfying the condition are grouped under the group’s `label`, and the other entries under “Other”. For example, the following group lists the upcoming events first, followed by the past and undated ones:

```yaml
view_groups:
  - label: Upcoming
    field: date
    gte: '{{today}}'
```

### Filtering

The `view_filters` option allows you to define preset filters that editors can quickly apply to the entry listing view. This is useful for quickly accessing specific subsets of entries based on common criteria.

```yaml [YAML]{11-20}
collections:
  - name: posts
    label: Blog posts
    folder: /content/posts
    fields:
      - { name: title, label: Title }
      - { name: date, label: Published Date, widget: datetime }
      - { name: draft, label: Draft, widget: boolean }
      - { name: category, label: Category }
      - { name: body, label: Body, widget: richtext }
    view_filters:
      - label: Drafts
        field: draft
        pattern: true
      - label: Posts from 2024
        field: date
        pattern: '^2024'
      - label: Travel or Food
        field: category
        pattern: travel|food
```

```toml [TOML]{29-42}
[[collections]]
name = "posts"
label = "Blog posts"
folder = "/content/posts"

[[collections.fields]]
name = "title"
label = "Title"

[[collections.fields]]
name = "date"
label = "Published Date"
widget = "datetime"

[[collections.fields]]
name = "draft"
label = "Draft"
widget = "boolean"

[[collections.fields]]
name = "category"
label = "Category"

[[collections.fields]]
name = "body"
label = "Body"
widget = "richtext"

[[collections.view_filters]]
label = "Drafts"
field = "draft"
pattern = "true"

[[collections.view_filters]]
label = "Posts from 2024"
field = "date"
pattern = "^2024"

[[collections.view_filters]]
label = "Travel or Food"
field = "category"
pattern = "travel|food"
```

```json [JSON]{14-30}
{
  "collections": [
    {
      "name": "posts",
      "label": "Blog posts",
      "folder": "/content/posts",
      "fields": [
        { "name": "title", "label": "Title" },
        { "name": "date", "label": "Published Date", "widget": "datetime" },
        { "name": "draft", "label": "Draft", "widget": "boolean" },
        { "name": "category", "label": "Category" },
        { "name": "body", "label": "Body", "widget": "richtext" }
      ],
      "view_filters": [
        {
          "label": "Drafts",
          "field": "draft",
          "pattern": "true"
        },
        {
          "label": "Posts from 2024",
          "field": "date",
          "pattern": "^2024"
        },
        {
          "label": "Travel or Food",
          "field": "category",
          "pattern": "travel|food"
        }
      ]
    }
  ]
}
```

```js [JavaScript]{14-30}
{
  collections: [
    {
      name: "posts",
      label: "Blog posts",
      folder: "/content/posts",
      fields: [
        { name: "title", label: "Title" },
        { name: "date", label: "Published Date", widget: "datetime" },
        { name: "draft", label: "Draft", widget: "boolean" },
        { name: "category", label: "Category" },
        { name: "body", label: "Body", widget: "richtext" },
      ],
      view_filters: [
        {
          label: "Drafts",
          field: "draft",
          pattern: "true",
        },
        {
          label: "Posts from 2024",
          field: "date",
          pattern: "^2024",
        },
        {
          label: "Travel or Food",
          field: "category",
          pattern: "travel|food",
        },
      ],
    },
  ],
}
```

**Extended syntax**

Sveltia CMS supports an extended syntax used in [Static CMS](https://staticjscms.netlify.app/docs/collection-overview#view-filters) to define a default filter. Here is the same configuration using the extended syntax:

```yaml
view_filters:
  filters:
    - name: drafts
      label: Drafts
      field: draft
      pattern: true
    - name: posts_2024
      label: Posts from 2024
      field: date
      pattern: '^2024'
    - name: travel_or_food
      label: Travel or Food
      field: category
      pattern: travel|food
  default: drafts
```

#### Comparing Values

A view filter can compare the field value with a given value instead of, or in addition to, matching a `pattern`. This makes it possible to filter entries by a date, such as upcoming and past events, or by a number, such as products above a certain price. The following options are available:

| Option   | Description                                                                         |
| -------- | ----------------------------------------------------------------------------------- |
| `eq`     | The field value has to be equal to the given value.                                 |
| `ne`     | The field value has to be different from the given value.                           |
| `lt`     | The field value has to be less than the given value.                                |
| `lte`    | The field value has to be less than or equal to the given value.                    |
| `gt`     | The field value has to be greater than the given value.                             |
| `gte`    | The field value has to be greater than or equal to the given value.                 |
| `in`     | The field value has to be equal to one of the given values, defined as an array.    |
| `not_in` | The field value has to be different from all the given values, defined as an array. |

The value of a DateTime field is compared as a date, so the given value has to be in the same format as the field value, or one of the following template tags:

| Tag                                                                        | Description                                                                                                                                                         |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `{{now}}`                                                                  | The current date and time.                                                                                                                                          |
| `{{today}}`                                                                | The current date in the `YYYY-MM-DD` format. Use this rather than `{{now}}` with a date-only field, so that an entry dated today is included in a `gte` comparison. |
| `{{year}}`, `{{month}}`, `{{day}}`, `{{hour}}`, `{{minute}}`, `{{second}}` | The parts of the current date and time, which can also be used in a `pattern`, e.g. `^{{year}}` for the entries of this year.                                       |

The tags are resolved in the user’s local time zone whenever the entry list is updated, and every minute while such a filter or group is applied, so a filter like “Upcoming events” keeps working without any change to the configuration.

A number field value and a numeric given value are compared as numbers; any other value is compared as a string. An entry without a value for the field only matches `ne` and `not_in`. When several options are defined for one filter, all of them have to be satisfied.

The comparison options can also be used with the [extended syntax](#filtering) described above, for example to apply the “Upcoming” filter by default:

```yaml
view_filters:
  filters:
    - name: upcoming
      label: Upcoming
      field: date
      gte: '{{today}}'
    - name: past
      label: Past
      field: date
      lt: '{{today}}'
  default: upcoming
```

The example below defines the filters for a list of events:

```yaml [YAML]{10-24}
collections:
  - name: events
    label: Events
    folder: /content/events
    fields:
      - { name: title, label: Title }
      - { name: date, label: Date, widget: datetime, time_format: false }
      - { name: capacity, label: Capacity, widget: number }
      - { name: status, label: Status, widget: select, options: [scheduled, cancelled] }
    view_filters:
      - label: Upcoming
        field: date
        gte: '{{today}}'
      - label: Past
        field: date
        lt: '{{today}}'
      - label: This year
        field: date
        pattern: '^{{year}}'
      - label: Large venues
        field: capacity
        gte: 100
      - label: Not cancelled
        field: status
        ne: cancelled
```

```toml [TOML]{28-51}
[[collections]]
name = "events"
label = "Events"
folder = "/content/events"

[[collections.fields]]
name = "title"
label = "Title"

[[collections.fields]]
name = "date"
label = "Date"
widget = "datetime"
time_format = false

[[collections.fields]]
name = "capacity"
label = "Capacity"
widget = "number"

[[collections.fields]]
name = "status"
label = "Status"
widget = "select"
options = ["scheduled", "cancelled"]

[[collections.view_filters]]
label = "Upcoming"
field = "date"
gte = "{{today}}"

[[collections.view_filters]]
label = "Past"
field = "date"
lt = "{{today}}"

[[collections.view_filters]]
label = "This year"
field = "date"
pattern = "^{{year}}"

[[collections.view_filters]]
label = "Large venues"
field = "capacity"
gte = 100

[[collections.view_filters]]
label = "Not cancelled"
field = "status"
ne = "cancelled"
```

```json [JSON]{13-39}
{
  "collections": [
    {
      "name": "events",
      "label": "Events",
      "folder": "/content/events",
      "fields": [
        { "name": "title", "label": "Title" },
        { "name": "date", "label": "Date", "widget": "datetime", "time_format": false },
        { "name": "capacity", "label": "Capacity", "widget": "number" },
        { "name": "status", "label": "Status", "widget": "select", "options": ["scheduled", "cancelled"] }
      ],
      "view_filters": [
        {
          "label": "Upcoming",
          "field": "date",
          "gte": "{{today}}"
        },
        {
          "label": "Past",
          "field": "date",
          "lt": "{{today}}"
        },
        {
          "label": "This year",
          "field": "date",
          "pattern": "^{{year}}"
        },
        {
          "label": "Large venues",
          "field": "capacity",
          "gte": 100
        },
        {
          "label": "Not cancelled",
          "field": "status",
          "ne": "cancelled"
        }
      ]
    }
  ]
}
```

```js [JavaScript]{13-39}
{
  collections: [
    {
      name: "events",
      label: "Events",
      folder: "/content/events",
      fields: [
        { name: "title", label: "Title" },
        { name: "date", label: "Date", widget: "datetime", time_format: false },
        { name: "capacity", label: "Capacity", widget: "number" },
        { name: "status", label: "Status", widget: "select", options: ["scheduled", "cancelled"] },
      ],
      view_filters: [
        {
          label: "Upcoming",
          field: "date",
          gte: "{{today}}",
        },
        {
          label: "Past",
          field: "date",
          lt: "{{today}}",
        },
        {
          label: "This year",
          field: "date",
          pattern: "^{{year}}",
        },
        {
          label: "Large venues",
          field: "capacity",
          gte: 100,
        },
        {
          label: "Not cancelled",
          field: "status",
          ne: "cancelled",
        },
      ],
    },
  ],
}
```

Source: https://sveltiacms.app/en/docs/collections/entries/views
