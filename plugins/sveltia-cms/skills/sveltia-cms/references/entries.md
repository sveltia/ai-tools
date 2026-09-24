# Entry Collections: Formats, Slugs and Paths

Folder-based entry collections in depth: file formats, slugs, file paths, nested collections, preview paths and redirects. For listing, view and operation options, see `entries-listing.md`.

Generated from the Sveltia CMS documentation. Do not edit by hand.

## Entry Collections

An entry collection contains multiple entries of the same type. Editors can usually create, edit, and delete entries within the collection. Typical use cases for entry collections include blog posts, tags, products or events. Each entry in the collection is represented by a separate file.

**Note for Netlify/Decap CMS users**

In Sveltia CMS, what was previously referred to as a **folder collection** in Netlify/Decap CMS is now called an **entry collection**. This change was made to better reflect the purpose and functionality of these collections within the CMS.

### Creating an Entry Collection

Here is an example configuration defining a simple blog posts collection:

```yaml [YAML]
collections:
  - name: blog
    label: Blog Posts
    label_singular: Blog Post
    folder: content/blog
    fields:
      - { name: title, label: Title }
      - { name: body, label: Body, widget: richtext }
```

```toml [TOML]
[[collections]]
name = "blog"
label = "Blog Posts"
label_singular = "Blog Post"
folder = "content/blog"

[[collections.fields]]
name = "title"
label = "Title"

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
      "label": "Blog Posts",
      "label_singular": "Blog Post",
      "folder": "content/blog",
      "fields": [
        { "name": "title", "label": "Title" },
        { "name": "body", "label": "Body", "widget": "richtext" }
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
      label: "Blog Posts",
      label_singular: "Blog Post",
      folder: "content/blog",
      fields: [
        { name: "title", label: "Title" },
        { name: "body", label: "Body", widget: "richtext" },
      ],
    },
  ],
}
```

#### Options

The following options are commonly used when defining an entry collection:

- `name`: (required) A unique identifier for the collection. Should not contain spaces or special characters.
- `label`: A human-readable name for the collection. If omitted, the `name` value is used.
- `label_singular`: A human-readable singular name for the collection. If omitted, the `label` value is used. Used in some parts of the UI like the “Create new” button.
- `description`: A brief description of the collection, displayed in the UI. Basic Markdown formatting is supported, including bold, italic, strikethrough, code, and links.
- `folder`: (required) The folder path where the entries are stored, relative to the repository’s root directory. It can be an empty string (or `.` or `/`) to store entries in the root folder. With i18n enabled, it can contain the `{{locale}}` placeholder as a folder name, e.g. `content/{{locale}}/posts`, to say where the locale folder goes. See [Custom Locale Folder Placement](https://sveltiacms.app/en/docs/i18n/structures#custom-locale-folder-placement).
- `fields`: (required) An array defining the [fields](https://sveltiacms.app/en/docs/fields) for each entry in the collection. Each field has a `name`, `label`, and optional `widget` type.

### Configuration Guides

The remaining entry collection options are documented on the following pages:

- [File Formats](https://sveltiacms.app/en/docs/collections/entries/formats): Choose between Markdown with front matter, YAML, JSON and TOML, and customize the file extension, front matter delimiter and body field.
- [Slugs and File Paths](https://sveltiacms.app/en/docs/collections/entries/slugs): Generate entry slugs from fields and template tags, make slugs editable, and organize entries into subfolders and page bundles.
- [Nested Collections](https://sveltiacms.app/en/docs/collections/entries/nested): Manage hierarchical content in a folder tree that editors can browse and organize.
- [Preview Paths and Redirects](https://sveltiacms.app/en/docs/collections/entries/previews): Point the CMS at an entry’s URL on your site for previews, and record redirects when slugs change.
- [Entry Operations](https://sveltiacms.app/en/docs/collections/entries/operations): Disable creation, deletion or duplication, limit the entry count, hide the collection, and enable manual reordering.
- [Entry Listings](https://sveltiacms.app/en/docs/collections/entries/listings): Customize entry summaries and thumbnails, manage Hugo’s index file, and include or exclude entries.
- [Entry Views](https://sveltiacms.app/en/docs/collections/entries/views): Define sorting, grouping and filtering options for the listing view.

Source: https://sveltiacms.app/en/docs/collections/entries

---

## File Formats

Sveltia CMS supports various file formats for entry collections, including Markdown, YAML, JSON, and TOML. The default format is Markdown with YAML front matter.

The example below defines a simple blog posts collection:

```yaml [YAML]
collections:
  - name: posts
    label: Blog Posts
    folder: /content/posts
    fields:
      - { name: title, label: Title }
      - { name: date, label: Date, widget: datetime }
      - { name: body, label: Body, widget: richtext }
```

```toml [TOML]
[[collections]]
name = "posts"
label = "Blog Posts"
folder = "/content/posts"

[[collections.fields]]
name = "title"
label = "Title"

[[collections.fields]]
name = "date"
label = "Date"
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
      "name": "posts",
      "label": "Blog Posts",
      "folder": "/content/posts",
      "fields": [
        { "name": "title", "label": "Title" },
        { "name": "date", "label": "Date", "widget": "datetime" },
        { "name": "body", "label": "Body", "widget": "richtext" }
      ]
    }
  ]
}
```

```js [JavaScript]
{
  collections: [
    {
      name: "posts",
      label: "Blog Posts",
      folder: "/content/posts",
      fields: [
        { name: "title", label: "Title" },
        { name: "date", label: "Date", widget: "datetime" },
        { name: "body", label: "Body", widget: "richtext" },
      ],
    },
  ],
}
```

By default, entry collections use the `title` field as the slug (filename). The default format is `yaml-frontmatter` with the `md` extension, meaning each entry will be saved as a Markdown file with YAML front matter. A Markdown field named `body` is treated as the main content of the file, while other fields are stored in the front matter; this behavior can be configured using the [`body_field` option](#body-field-for-front-matter-formats) in the collection definition.

If you create a blog post with the title “My First Post”, the file will be saved at `content/posts/my-first-post.md`, with the following content:

```md [my-first-post.md]
---
title: My First Post
date: 2024-06-01T12:00:00Z
---

This is the body of my first post.
```

You can customize the file format using the `format` property of the collection. The example below shows how to use JSON for file format:

```yaml [YAML]{5}
collections:
  - name: posts
    label: Blog Posts
    folder: /content/posts
    format: json
```

```toml [TOML]{5}
[[collections]]
name = "posts"
label = "Blog Posts"
folder = "/content/posts"
format = "json"
```

```json [JSON]{7}
{
  "collections": [
    {
      "name": "posts",
      "label": "Blog Posts",
      "folder": "/content/posts",
      "format": "json"
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
      format: "json",
    },
  ],
}
```

The output file for a post created with this configuration would look like this:

```json [my-first-post.json]
{
  "title": "My First Post",
  "date": "2024-06-01T12:00:00Z",
  "body": "This is the body of my first post."
}
```

### Format

The following file formats are supported for entry collections. You can specify the desired format using the `format` option to define how entries are parsed and saved. The default format is `yaml-frontmatter`.

- `yml` or `yaml`: YAML files with the `yml` extension by default.
- `toml`: TOML files with the `toml` extension by default.
- `json`: JSON files with the `json` extension by default.
- `yaml-frontmatter`: Markdown files with YAML front matter, the `md` extension and the `---` delimiter by default.
- `toml-frontmatter`: Markdown files with TOML front matter, the `md` extension and the `+++` delimiter by default.
- `json-frontmatter`: Markdown files with JSON front matter, the `md` extension and the `{` / `}` delimiter by default.
- `frontmatter`: Markdown files with front matter in any of the supported formats. The format is automatically detected based on the front matter delimiters. However, when creating new entries, the format defaults to `yaml-frontmatter`. The `md` extension and `---` delimiter are used by default.
- `raw`: Raw text files with the `txt` extension by default. When using this format, make sure to have only one field named `body` with the `widget` type set to `code`, `markdown`, `richtext` or `text`. This is useful for a file collection that manages plain text files without any front matter, such as JSON, XML, or CSV files.

The JSON and YAML formats can be customized via the [global `output` option](https://sveltiacms.app/en/docs/data-output#controlling-data-output).

**Deprecation Notice**

The collection-level `yaml_quote` option has been deprecated in favor of the `quote` option in the [global `output` option](https://sveltiacms.app/en/docs/data-output#controlling-data-output). The `yaml_quote` option will be removed in Sveltia CMS v1.0.0. If you are upgrading from an older version, update your configuration accordingly. `yaml_quote: true` is equivalent to `quote: double` in the global YAML format options.

If you want to use a different file format, register a custom format using the [Custom File Formats API](https://sveltiacms.app/en/docs/api/file-formats) and specify its name in the `format` option.

### Extension

You can customize the file extension using the `extension` property of the collection. The default extensions for each format are explained above, but you can change them as needed. For example, to use the `markdown` extension for Markdown files with YAML front matter:

```yaml [YAML]{5}
collections:
  - name: posts
    label: Blog Posts
    folder: /content/posts
    extension: markdown
```

```toml [TOML]{5}
[[collections]]
name = "posts"
label = "Blog Posts"
folder = "/content/posts"
extension = "markdown"
```

```json [JSON]{7}
{
  "collections": [
    {
      "name": "posts",
      "label": "Blog Posts",
      "folder": "/content/posts",
      "extension": "markdown"
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
      extension: "markdown",
    },
  ],
}
```

You can use any valid file extension, such as `html`, `txt`, or `mdx`. Just make sure that the file format and extension are compatible. If there is an obvious mismatch, Sveltia CMS will raise a validation error. For example, if you use `json` format with `md` extension, it will result in an error because JSON files should have a `json` extension.

### Front Matter Delimiter

The front matter delimiter can be customized using the `frontmatter_delimiter` option. It accepts either a string or an array of two strings representing the opening and closing delimiters. For example, to use `~~~` as the delimiter for TOML front matter:

```yaml [YAML]{5-6}
collections:
  - name: posts
    label: Blog Posts
    folder: /content/posts
    format: toml-frontmatter
    frontmatter_delimiter: ~~~ # or [~~~, ~~~]
```

```toml [TOML]{5-6}
[[collections]]
name = "posts"
label = "Blog Posts"
folder = "/content/posts"
format = "toml-frontmatter"
frontmatter_delimiter = "~~~"
```

```json [JSON]{7-8}
{
  "collections": [
    {
      "name": "posts",
      "label": "Blog Posts",
      "folder": "/content/posts",
      "format": "toml-frontmatter",
      "frontmatter_delimiter": "~~~"
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
      format: "toml-frontmatter",
      frontmatter_delimiter: "~~~",
    },
  ],
}
```

### Body Field for Front Matter Formats

By default, a Markdown field named `body` is treated as the main content of the file, while other fields are stored in the front matter. This behavior can be configured using the `body_field` option in the collection definition. The `body_field` option allows you to specify a different field name for the main content or to store the body content directly in the front matter.

#### Body Field Name

If you want to use a different field name for the main content, you can specify it using the `key` property of the `body_field` option. For example, to use a field named `content` as the body field:

```yaml [YAML]{6-7}
collections:
  - name: posts
    label: Blog Posts
    folder: /content/posts
    format: yaml-frontmatter
    body_field:
      key: content
    fields:
      - { name: title, label: Title }
      - { name: content, label: Content, widget: markdown }
```

```toml [TOML]{6}
[[collections]]
name = "posts"
label = "Blog Posts"
folder = "/content/posts"
format = "yaml-frontmatter"
body_field.key = "content"

[[collections.fields]]
name = "title"
label = "Title"

[[collections.fields]]
name = "content"
label = "Content"
widget = "markdown"
```

```json [JSON]{8-10}
{
  "collections": [
    {
      "name": "posts",
      "label": "Blog Posts",
      "folder": "/content/posts",
      "format": "yaml-frontmatter",
      "body_field": {
        "key": "content"
      },
      "fields": [
        { "name": "title", "label": "Title" },
        { "name": "content", "label": "Content", "widget": "markdown" }
      ]
    }
  ]
}
```

```js [JavaScript]{8-10}
{
  collections: [
    {
      name: "posts",
      label: "Blog Posts",
      folder: "/content/posts",
      format: "yaml-frontmatter",
      body_field: {
        key: "content",
      },
      fields: [
        { name: "title", label: "Title" },
        { name: "content", label: "Content", widget: "markdown" },
      ],
    },
  ],
}
```

#### Inline Body Field

You can set `inline: true` in the `body_field` option to store the body content directly in the front matter instead of the file body, while using the `body` field name for the main content. This is useful when you want to keep all the entry data in the front matter without any content in the file body.

```yaml [YAML]{6-7}
collections:
  - name: posts
    label: Blog Posts
    folder: /content/posts
    format: yaml-frontmatter
    body_field:
      inline: true
    fields:
      - { name: title, label: Title }
      - { name: body, label: Body, widget: markdown }
```

```toml [TOML]{6}
[[collections]]
name = "posts"
label = "Blog Posts"
folder = "/content/posts"
format = "yaml-frontmatter"
body_field.inline = true

[[collections.fields]]
name = "title"
label = "Title"

[[collections.fields]]
name = "body"
label = "Body"
widget = "markdown"
```

```json [JSON]{8-10}
{
  "collections": [
    {
      "name": "posts",
      "label": "Blog Posts",
      "folder": "/content/posts",
      "format": "yaml-frontmatter",
      "body_field": {
        "inline": true
      },
      "fields": [
        { "name": "title", "label": "Title" },
        { "name": "body", "label": "Body", "widget": "markdown" }
      ]
    }
  ]
}
```

```js [JavaScript]{8-10}
{
  collections: [
    {
      name: "posts",
      label: "Blog Posts",
      folder: "/content/posts",
      format: "yaml-frontmatter",
      body_field: {
        inline: true,
      },
      fields: [
        { name: "title", label: "Title" },
        { name: "body", label: "Body", widget: "markdown" },
      ],
    },
  ],
}
```

With `inline: false` (the default), the output file would look like this:

```yaml
---
title: My Post
---
This is the body of my post.
```

With `inline: true`, the output file for a post created with the above configuration would look like this:

```yaml
---
title: My Post
body: This is the body of my post.
---
```

Source: https://sveltiacms.app/en/docs/collections/entries/formats

---

## Slugs and File Paths

An entry’s slug is its filename, and the file path is where that file is stored under the collection’s `folder`. Both can be customized with the options described on this page.

### Entry Slugs

Sveltia CMS provides several ways to customize the slug (filename) of an entry in a collection.

#### Global Slug Options

The `slug` option defined at the top-level of the configuration file applies to all collections. The default settings are as follows:

```yaml [YAML]
slug:
  encoding: unicode
  clean_accents: false
  sanitize_replacement: '-'
  trim: true
  lowercase: true
  timezone: utc
```

```toml [TOML]
[slug]
encoding = "unicode"
clean_accents = false
sanitize_replacement = "-"
trim = true
lowercase = true
timezone = "utc"
```

```json [JSON]
{
  "slug": {
    "encoding": "unicode",
    "clean_accents": false,
    "sanitize_replacement": "-",
    "trim": true,
    "lowercase": true,
    "timezone": "utc"
  }
}
```

```js [JavaScript]
{
  slug: {
    encoding: "unicode",
    clean_accents: false,
    sanitize_replacement: "-",
    trim: true,
    lowercase: true,
    timezone: "utc",
  },
}
```

The available options are:

- `encoding`: Specifies the encoding method for slugs. Supported values are `unicode` (default) and `ascii`.
  - `unicode`: Allows Unicode characters in slugs, preserving non-Latin scripts.
  - `ascii`: Sanitizes slugs to ASCII characters only. The allowed characters are 0-9, a-z, A-Z, hyphen (`-`) underscore (`_`) and tilde (`~`). Other characters are replaced with the value specified in the `sanitize_replacement` option.
- `clean_accents`: A boolean value indicating whether to remove accents from characters in slugs. If enabled, accented characters are converted to their unaccented equivalents (e.g., `é` becomes `e`). Also, certain characters like German umlauts are [transliterated](https://en.wikipedia.org/wiki/Transliteration) to their ASCII equivalents (e.g., `ß` becomes `ss`). The default value is `false`.
  - See the `transliterate` library’s [replacements list](https://github.com/sindresorhus/transliterate/blob/main/replacements.js) for details on how specific characters are transliterated. [Additional rules](https://github.com/sindresorhus/transliterate/blob/main/locale-replacements.js) are applied when [i18n support](https://sveltiacms.app/en/docs/i18n) is enabled for [specific locales](https://github.com/sindresorhus/transliterate#supported-locales).
- `sanitize_replacement`: A string used to substitute invalid characters. The default value is a hyphen (`-`).
- `maxlength`: An integer specifying the maximum length of the slug. If the generated slug exceeds this length, it will be truncated. This is useful for CI/CD services or filesystems that impose filename length restrictions. The default value is `undefined`, meaning there is no length limit.
- `trim`: A boolean value indicating whether to trim leading and trailing `sanitize_replacement` characters from the slug. The default value is `true`.
- `lowercase`: A boolean value indicating whether to convert the slug to lowercase. The default value is `true`. Changing this to `false` will preserve the original casing of the title or identifier field.
- `timezone`: A string specifying the timezone to use when generating date-based slugs with [template tags](#slug-template-tags) like `{{day}}` and `{{hour}}`. The default value is `utc`. You can set this to `local` to use the local timezone of the user.

**Deprecation Notice**

The collection-level `slug_length` option has been deprecated in favor of the `maxlength` global slug option described above. The `slug_length` option will be removed in Sveltia CMS v1.0.0. If you are upgrading from an older version, update your configuration accordingly.

#### How Slugs are Generated

By default, Sveltia CMS uses the `title` field as the slug (filename) for entries in a collection.

If a collection only has the Markdown `body` field, an entry slug will be generated from a header in the `body`, if exists. This aims to support a typical [VitePress](https://sveltiacms.app/en/docs/frameworks/vitepress) or [Docusaurus](https://sveltiacms.app/en/docs/frameworks/docusaurus) setup. If no title or header is found, a part of a random UUID will be used to ensure uniqueness.

#### Specifying an Identifier Field

If you want to use a different field as the entry identifier for generating slugs and filenames, you can specify it using the `identifier_field` option in the collection definition. This is useful when your entries have a unique identifier field other than `title`, such as `name` or `id`. For example, to use a `product_name` field as the identifier:

```yaml [YAML]{5}
collections:
  - name: products
    label: Products
    folder: /content/products
    identifier_field: product_name
    fields:
      - { name: product_name, label: Product Name }
      - { name: description, label: Description, widget: richtext }
```

```toml [TOML]{5}
[[collections]]
name = "products"
label = "Products"
folder = "/content/products"
identifier_field = "product_name"

[[collections.fields]]
name = "product_name"
label = "Product Name"

[[collections.fields]]
name = "description"
label = "Description"
widget = "richtext"
```

```json [JSON]{7}
{
  "collections": [
    {
      "name": "products",
      "label": "Products",
      "folder": "/content/products",
      "identifier_field": "product_name",
      "fields": [
        { "name": "product_name", "label": "Product Name" },
        { "name": "description", "label": "Description", "widget": "richtext" }
      ]
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
      identifier_field: "product_name",
      fields: [
        { name: "product_name", label: "Product Name" },
        { name: "description", label: "Description", widget: "richtext" },
      ],
    },
  ],
}
```

#### Defining Entry Slugs

The `slug` option allows you to define a custom template for generating entry slugs using various [template tags](#slug-template-tags) and field names.

For example, to create slugs that include the year and month of creation along with the entry slug, you can use the following configuration:

```yaml [YAML]{5}
collections:
  - name: posts
    label: Blog Posts
    folder: /content/posts
    slug: '{{year}}-{{month}}-{{slug}}'
```

```toml [TOML]{5}
[[collections]]
name = "posts"
label = "Blog Posts"
folder = "/content/posts"
slug = "{{year}}-{{month}}-{{slug}}"
```

```json [JSON]{7}
{
  "collections": [
    {
      "name": "posts",
      "label": "Blog Posts",
      "folder": "/content/posts",
      "slug": "{{year}}-{{month}}-{{slug}}"
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
      slug: "{{year}}-{{month}}-{{slug}}",
    },
  ],
}
```

Any field name defined in the collection’s `fields` option can be used as a template tag in the `slug` option. For example, if you have a `date` field in the collection, you can use `{{date}}` in the `slug` option to include the date in the slug. For nested fields, use dot notation, e.g. `{{author.name}}`.

If a field’s name matches one of the [predefined template tags](#slug-template-tags), such as `slug`, `year` or `uuid`, you need to prefix it with `fields.`, like `{{fields.slug}}`, to avoid confusion with the tag itself.

You can use [string transformations](https://sveltiacms.app/en/docs/string-transformations) with these template tags as well. For example, to create slugs that include the full date in `YYYY-MM-DD` format along with a custom `slug` field, you can use the following configuration:

```yaml [YAML]{5}
collections:
  - name: posts
    label: Blog Posts
    folder: /content/posts
    slug: "{{date | date('YYYY-MM-DD')}}-{{fields.slug}}"
```

```toml [TOML]{5}
[[collections]]
name = "posts"
label = "Blog Posts"
folder = "/content/posts"
slug = "{{date | date('YYYY-MM-DD')}}-{{fields.slug}}"
```

```json [JSON]{7}
{
  "collections": [
    {
      "name": "posts",
      "label": "Blog Posts",
      "folder": "/content/posts",
      "slug": "{{date | date('YYYY-MM-DD')}}-{{fields.slug}}"
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
      slug: "{{date | date('YYYY-MM-DD')}}-{{fields.slug}}",
    },
  ],
}
```

**Tip**

The `slug` option value should not contain slashes (`/`). If you need to create a nested folder structure for entries, use the [`path` option](#using-subfolders) instead.

The `slug` option can also be an object, whose `template` option specifies the template, along with the options to [make slugs editable](#making-slugs-editable).

#### Slug Template Tags

The following template tags are supported in the `slug` option:

- `{{slug}}`: The slugified version of the entry’s `title` field (or the field defined with the [`identifier_field` option](#specifying-an-identifier-field)).
- `{{year}}`: 4-digit year of the entry creation date.
- `{{month}}`: 2-digit month of the entry creation date.
- `{{day}}`: 2-digit day of the entry creation date.
- `{{hour}}`: 2-digit hour of the entry creation date.
- `{{minute}}`: 2-digit minute of the entry creation date.
- `{{second}}`: 2-digit second of the entry creation date.

By default, the entry creation date is based on the UTC timezone for backward compatibility with Netlify/Decap CMS. To use the local timezone of the user instead, set the `timezone` option to `local` in the [global slug options](#global-slug-options).

Additionally, the following unique identifier tags are available. These tags generate random values for each entry, ensuring uniqueness. This is particularly useful when the entry title may change later or when the title contains characters that are not suitable for filenames, such as non-Latin scripts.

- `{{uuid}}`: A random UUID v4, e.g. `4fc0917c-8aea-4ad5-a476-392bdcf3b642`
- `{{uuid_short}}`: The last 12 characters of a random UUID v4, e.g. `392bdcf3b642`.
- `{{uuid_shorter}}`: The first 8 characters of a random UUID v4, e.g. `4fc0917c`.

#### Making Slugs Editable

Entry slugs are shown and edited in the Slug panel of the Content Editor’s [sidebar](https://sveltiacms.app/en/docs/ui/content-editor#slug-panel). By default, users can edit the slug both while creating an entry and once it has been saved:

- In a new entry, the panel shows the slug the entry will be saved with, which follows the `slug` template as the entry is edited. The pencil button lets users change it, and emptying it goes back to the template.
- In a saved entry, the pencil button renames the entry. Renaming moves the entry’s file and rewrites every reference to it when the entry is saved. See [Slug Panel](https://sveltiacms.app/en/docs/ui/content-editor#slug-panel) for details.

To control this, set the `slug` option to an object instead of a template string. The object accepts the following options:

- `template`: The [slug template](#defining-entry-slugs), which is what a string `slug` option specifies. The default is the [identifier field](#specifying-an-identifier-field), like `{{title}}`.
- `editable`: Whether users can edit the slug. `true` (default) allows it both when an entry is created and once it has been saved, and `false` allows neither. An array picks the stages: `[create]` for new entries only, or `[update]` for saved entries only.
- `hint`: A short description shown in the Slug panel, e.g. to explain what the slug is used for.
- `pattern`: A regular expression the slug has to match, along with an error message, e.g. `['^[a-z-]+$', 'Use lowercase letters and hyphens only']`. It works like the [`pattern` field option](https://sveltiacms.app/en/docs/fields#pattern) and applies to a slug typed in by the user.
- `i18n`: Whether each locale has a slug of its own. See [Localizing Entry Slugs](https://sveltiacms.app/en/docs/i18n/slugs#making-slugs-editable).

For example, to let users give a new blog post a slug of its own while keeping saved posts at their original URLs:

```yaml [YAML]{5-7}
collections:
  - name: posts
    label: Blog Posts
    folder: /content/posts
    slug:
      template: '{{year}}-{{month}}-{{day}}-{{slug}}'
      editable: [create]
```

```toml [TOML]{6-8}
[[collections]]
name = "posts"
label = "Blog Posts"
folder = "/content/posts"

[collections.slug]
template = "{{year}}-{{month}}-{{day}}-{{slug}}"
editable = ["create"]
```

```json [JSON]{7-10}
{
  "collections": [
    {
      "name": "posts",
      "label": "Blog Posts",
      "folder": "/content/posts",
      "slug": {
        "template": "{{year}}-{{month}}-{{day}}-{{slug}}",
        "editable": ["create"]
      }
    }
  ]
}
```

```js [JavaScript]{7-10}
{
  collections: [
    {
      name: "posts",
      label: "Blog Posts",
      folder: "/content/posts",
      slug: {
        template: "{{year}}-{{month}}-{{day}}-{{slug}}",
        editable: ["create"],
      },
    },
  ],
}
```

**Locking entry URLs**

Renaming an entry changes its URL on your live site, unless your framework [redirects the old URL](https://sveltiacms.app/en/docs/collections/entries/previews#redirects). If your editors shouldn’t change the slug once an entry has been published, set `editable` to `[create]`, or to `false` to have the slug always generated from the template.

##### Having Users Type the Slug

When the slug can’t be derived from the entry’s content, e.g. when the file name is the only place a value is stored, you can have users type the slug themselves. Set the `editable` option to allow editing on creation, without a `template`. The slug is then required: the Slug panel opens by itself when a new entry is created, and the entry can’t be saved until a slug has been entered.

For example, a collection of languages whose file names are [BCP 47](https://en.wikipedia.org/wiki/IETF_language_tag) language codes, such as `en.json` or `pt-br.json`, can guide users with the `hint` and `pattern` options:

```yaml [YAML]{6-9}
collections:
  - name: languages
    label: Languages
    folder: /content/languages
    format: json
    slug:
      editable: true
      hint: A BCP 47 language code, like en or pt-br
      pattern: ['^[a-z]{2,3}(-[a-z0-9]+)*$', 'Must be a BCP 47 language code']
    fields:
      - { name: native_name, label: Native Name }
```

```toml [TOML]{7-10}
[[collections]]
name = "languages"
label = "Languages"
folder = "/content/languages"
format = "json"

[collections.slug]
editable = true
hint = "A BCP 47 language code, like en or pt-br"
pattern = ["^[a-z]{2,3}(-[a-z0-9]+)*$", "Must be a BCP 47 language code"]

[[collections.fields]]
name = "native_name"
label = "Native Name"
```

```json [JSON]{8-12}
{
  "collections": [
    {
      "name": "languages",
      "label": "Languages",
      "folder": "/content/languages",
      "format": "json",
      "slug": {
        "editable": true,
        "hint": "A BCP 47 language code, like en or pt-br",
        "pattern": ["^[a-z]{2,3}(-[a-z0-9]+)*$", "Must be a BCP 47 language code"]
      },
      "fields": [{ "name": "native_name", "label": "Native Name" }]
    }
  ]
}
```

```js [JavaScript]{8-12}
{
  collections: [
    {
      name: "languages",
      label: "Languages",
      folder: "/content/languages",
      format: "json",
      slug: {
        editable: true,
        hint: "A BCP 47 language code, like en or pt-br",
        pattern: ["^[a-z]{2,3}(-[a-z0-9]+)*$", "Must be a BCP 47 language code"],
      },
      fields: [{ name: "native_name", label: "Native Name" }],
    },
  ],
}
```

Without the `editable` option, a collection without a `template` generates the slug from the identifier field as usual, and users can still change it in the Slug panel if they like.

A slug can also be given to a new entry with the `_slug` query parameter when [linking to the Content Editor](https://sveltiacms.app/en/docs/ui/content-editor#entry-slug).

**Deprecation Notice**

The special `{{fields._slug}}` and `{{fields._slug | localize}}` slug template tags have been deprecated in favour of the `editable` and `i18n` options described above, and will be removed in Sveltia CMS v1.0.0. `slug: '{{fields._slug}}'` is equivalent to `slug: { editable: true }`, and `slug: '{{fields._slug | localize}}'` is equivalent to `slug: { editable: true, i18n: true }`.

Also, in earlier versions, setting the collection’s `delete` option to `false` prevented a saved entry’s slug from being edited. This is no longer the case; use `editable: [create]` or `editable: false` instead.

### File Paths

Sveltia CMS provides a couple of options to customize the file paths of entries in a collection.

#### Using Subfolders

By default, Sveltia CMS saves entries directly under the specified `folder` using the slug as the filename. However, you can organize entries into subfolders using the `path` option.

Just like the [`slug` option](#defining-entry-slugs) described above, the `path` option can use template tags to create dynamic folder structures. The [slug template tags](#slug-template-tags) and [string transformations](https://sveltiacms.app/en/docs/string-transformations) can be used in the `path` option, along with any field names defined in the collection’s `fields` option. For nested fields, use dot notation, e.g. `{{author.name}}`.

For example, to save blog posts in subfolders based on the year and month of creation, you can use the following configuration:

```yaml [YAML]{5}
collections:
  - name: posts
    label: Blog Posts
    folder: /content/posts
    path: '{{year}}/{{month}}/{{slug}}'
```

```toml [TOML]{5}
[[collections]]
name = "posts"
label = "Blog Posts"
folder = "/content/posts"
path = "{{year}}/{{month}}/{{slug}}"
```

```json [JSON]{7}
{
  "collections": [
    {
      "name": "posts",
      "label": "Blog Posts",
      "folder": "/content/posts",
      "path": "{{year}}/{{month}}/{{slug}}"
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
      path: "{{year}}/{{month}}/{{slug}}",
    },
  ],
}
```

With the above configuration, a blog post created on June 15, 2025, with the title “My First Post” will be saved at `content/posts/2025/06/my-first-post.md`.

##### Creating Page Bundles

You can create nested structures like Hugo’s [page bundles](https://gohugo.io/content-management/page-bundles/), or Zola’s [asset colocation](https://www.getzola.org/documentation/content/overview/#asset-colocation), which uses the same `index.md` convention, using the `path`, [`media_folder` and `public_folder` options](https://sveltiacms.app/en/docs/media/internal#using-entry-relative-folders) together. For example, to create a leaf bundle for each blog post, you can use the following configuration:

```yaml [YAML]{5-7}
collections:
  - name: posts
    label: Blog Posts
    folder: /content/posts
    path: '{{slug}}/index'
    media_folder: ''
    public_folder: ''
```

```toml [TOML]{5-7}
[[collections]]
name = "posts"
label = "Blog Posts"
folder = "/content/posts"
path = "{{slug}}/index"
media_folder = ""
public_folder = ""
```

```json [JSON]{7-9}
{
  "collections": [
    {
      "name": "posts",
      "label": "Blog Posts",
      "folder": "/content/posts",
      "path": "{{slug}}/index",
      "media_folder": "",
      "public_folder": ""
    }
  ]
}
```

```js [JavaScript]{7-9}
{
  collections: [
    {
      name: "posts",
      label: "Blog Posts",
      folder: "/content/posts",
      path: "{{slug}}/index",
      media_folder: "",
      public_folder: "",
    },
  ],
}
```

With the above configuration, a blog post with the title “My First Post” will be saved at `content/posts/my-first-post/index.md`, and its media files will be stored in the same folder.

The same options can be combined with the `nested` option to build a tree of page bundles, where each entry has both its own media folder and its own child entries. See [Nesting Page Bundles](https://sveltiacms.app/en/docs/collections/entries/nested#nesting-page-bundles).

#### Constructing File Paths

A folder collection’s file path is determined by multiple factors: the `i18n`, `folder`, `path`, `slug` and `extension` options. The configuration can be complex, especially with i18n support, so let’s break it down.

- The [`i18n`](https://sveltiacms.app/en/docs/i18n) global or collection option (optional)
  - It can be configured to add internationalization (i18n) support to your site.
  - The `structure` and `omit_default_locale_from_file_path` options affect the entry file path.
- The `folder` collection option (required)
  - It specifies the folder where the collection entries are stored, relative to the repository’s root directory.
  - It can contain slashes to create a nested folder structure.
  - With i18n enabled, it can contain the `{{locale}}` placeholder as a folder name to say where the locale folder goes, which takes precedence over the `structure` i18n option. See [Custom Locale Folder Placement](https://sveltiacms.app/en/docs/i18n/structures#custom-locale-folder-placement).
- The [`path`](#using-subfolders) collection option (optional)
  - It defaults to `{{slug}}`, which is the `slug` collection option value.
  - It can contain template tags.
  - It can also contain slashes to create a nested folder structure.
- The [`slug`](#entry-slugs) collection option (optional)
  - It defaults to `{{title}}`, which is the entry’s `title` field value’s slugified version.
  - It can contain template tags but _cannot_ contain slashes.
- The [`extension`](https://sveltiacms.app/en/docs/collections/entries/formats#extension) collection option (optional)
  - It defaults to `md`.

Looking at the above options, the entry file path can be constructed as follows:

- With i18n disabled:
  ```yaml
  /<folder>/<path>.<extension>
  ```
- With the `single_file` i18n structure
  ```yaml
  /<folder>/<path>.<extension>
  ```
- With the `multiple_files` i18n structure:
  ```yaml
  /<folder>/<path>.<locale>.<extension>
  ```
  When the `omit_default_locale_from_file_path` i18n option is set to `true`, the path depends on the locale:
  ```yaml
  /<folder>/<path>.<extension> # default locale
  /<folder>/<path>.<locale>.<extension> # other locales
  ```
- With the `multiple_folders` i18n structure:
  ```yaml
  /<folder>/<locale>/<path>.<extension>
  ```
  When the `omit_default_locale_from_file_path` i18n option is set to `true`, the path depends on the locale:
  ```yaml
  /<folder>/<path>.<extension> # default locale
  /<folder>/<locale>/<path>.<extension> # other locales
  ```
- With the `multiple_root_folders` i18n structure:
  ```yaml
  /<locale>/<folder>/<path>.<extension>
  ```
  When the `omit_default_locale_from_file_path` i18n option is set to `true`, the path depends on the locale:
  ```yaml
  /<folder>/<path>.<extension> # default locale
  /<locale>/<folder>/<path>.<extension> # other locales
  ```
- With the `{{locale}}` placeholder in the `folder` option, e.g. `content/{{locale}}/posts`, whatever the i18n structure:
  ```yaml
  /<folder with the locale filled in>/<path>.<extension>
  ```
  When the `omit_default_locale_from_file_path` i18n option is set to `true`, the path depends on the locale:
  ```yaml
  /<folder without the locale>/<path>.<extension> # default locale
  /<folder with the locale filled in>/<path>.<extension> # other locales
  ```

Source: https://sveltiacms.app/en/docs/collections/entries/slugs

---

## Nested Collections

With the `nested` and `meta` options, you can organize contents that have a hierarchical relationship, such as categories and subcategories, and allow editors to create nested entries easily.

**Note for Netlify/Decap CMS users**

Sveltia CMS fixes a number of long-standing problems with this feature, which remains in beta in Netlify/Decap CMS. These include entry paths, preview paths, media folders, folder labels and i18n support. See [Nested collection enhancements](https://sveltiacms.app/en/docs/successor-to-netlify-cms#better-collections) for the details.

The `nested` option turns the collection into a folder tree in the sidebar and lets entries live in subfolders of any depth. The `meta.path` option adds a Path field to the Content Editor, so editors can choose where a new entry goes and move an existing one later.

```yaml [YAML]{6-10}
collections:
  - name: pages
    label: Pages
    label_singular: Page
    folder: /content/pages
    nested:
      depth: 100
      summary: '{{title}}'
      subfolders: true
    meta: { path: { index_file: _index } }
    fields:
      - { name: title, label: Title }
      - { name: body, label: Body, widget: markdown }
```

```toml [TOML]{6-17}
[[collections]]
name = "pages"
label = "Pages"
label_singular = "Page"
folder = "/content/pages"

[collections.nested]
depth = 100
summary = "{{title}}"
subfolders = true

[collections.meta.path]
index_file = "_index"

[[collections.fields]]
name = "title"
label = "Title"

[[collections.fields]]
name = "body"
label = "Body"
widget = "markdown"
```

```json [JSON]{8-17}
{
  "collections": [
    {
      "name": "pages",
      "label": "Pages",
      "label_singular": "Page",
      "folder": "/content/pages",
      "nested": {
        "depth": 100,
        "summary": "{{title}}",
        "subfolders": true
      },
      "meta": {
        "path": {
          "index_file": "_index"
        }
      },
      "fields": [
        { "name": "title", "label": "Title" },
        { "name": "body", "label": "Body", "widget": "markdown" }
      ]
    }
  ]
}
```

```js [JavaScript]{8-17}
{
  collections: [
    {
      name: "pages",
      label: "Pages",
      label_singular: "Page",
      folder: "/content/pages",
      nested: {
        depth: 100,
        summary: "{{title}}",
        subfolders: true,
      },
      meta: {
        path: {
          index_file: "_index",
        },
      },
      fields: [
        { name: "title", label: "Title" },
        { name: "body", label: "Body", widget: "markdown" },
      ],
    },
  ],
}
```

### Nested Collection Options

The `nested` option accepts the following properties:

- `depth`: The maximum number of path segments below the collection `folder`, counting the file name itself. A file stored deeper than this is not part of the collection. The default is unlimited.
  - In the default `subfolders` mode, where the last segment is always the index file, `depth: 3` allows up to two folder levels, such as `products/hardware/_index.md`.
  - The segments of a [`path`](https://sveltiacms.app/en/docs/collections/entries/slugs#using-subfolders) template are part of the count, too.
- `summary`: A [summary template](https://sveltiacms.app/en/docs/collections/entries/listings#summaries) used to label the folders in the tree. It overrides the collection’s own `summary` option, which continues to be used in the entry list. The default is the collection’s `summary` option value.
- `subfolders`: Whether each entry is stored as an index file in its own folder. The default is `true`. See below for what changes when it’s `false`.

### Storing Nested Entries

In the default `subfolders` mode, a folder _is_ an entry: each entry is stored as an index file, and the folders below it are its children. This suits [Hugo](https://sveltiacms.app/en/docs/frameworks/hugo) and [Zola](https://sveltiacms.app/en/docs/frameworks/zola), which both make a folder a section by putting an `_index.md` file in it, and any other generator that gives a folder a page of its own:

```
.
└─ content/
   └─ pages/
      ├─ _index.md              # Home
      └─ products/
         ├─ _index.md           # Products
         ├─ hardware/
         │  └─ _index.md        # Hardware
         └─ software/
            └─ _index.md        # Software
```

With `subfolders: false`, entries are regular files that keep their own names, and folders are just folders. This suits [Docusaurus](https://sveltiacms.app/en/docs/frameworks/docusaurus), [VitePress](https://sveltiacms.app/en/docs/frameworks/vitepress), [Starlight](https://starlight.astro.build/guides/project-structure/), [MkDocs](https://www.mkdocs.org/user-guide/writing-your-docs/), as well as the pages of an [Eleventy](https://sveltiacms.app/en/docs/frameworks/eleventy) or [Jekyll](https://sveltiacms.app/en/docs/frameworks/jekyll) site, and similar setups, where every file becomes a page at its own path:

```
.
└─ content/
   └─ pages/
      ├─ overview.md            # Overview
      └─ products/
         ├─ hardware.md         # Hardware
         └─ software.md         # Software
```

The mode determines which entries are listed when a folder is selected. In the `subfolders` mode, the list shows the entries in the immediate subfolders, plus the collection’s own index file at the root — `Products` in the tree above lists `Hardware` and `Software`, and the collection root lists `Home` and `Products`. Otherwise, the list shows the files stored directly in the selected folder, so `products` lists `Hardware` and `Software` while the root lists `Overview`.

An entry in a nested collection is identified by where it sits rather than by a name of its own, so its [slug](https://sveltiacms.app/en/docs/collections/entries/slugs#entry-slugs) is its path below the collection folder — `products/hardware` for the tree above. Wherever that slug is used to refer to the entry, the file name shared by every entry is left out: in a [preview path](https://sveltiacms.app/en/docs/collections/entries/previews#preview-paths), and in the value a [Relation field](https://sveltiacms.app/en/docs/fields/relation#value-field) stores. The collection’s own index file keeps its name, because there would be nothing left of it.

The root index file is only picked up when it fits the collection’s file paths. With a [`path`](https://sveltiacms.app/en/docs/collections/entries/slugs#using-subfolders) option such as `{{slug}}/_index`, a bare `content/pages/_index.md` has no slug folder in front of it and is therefore not part of the collection; use the [`index_file`](https://sveltiacms.app/en/docs/collections/entries/listings#managing-hugo-s-special-index-file) collection option to bring it in, which also lets it have fields of its own.

The mode also decides what happens when an entry is filed elsewhere with the [path editor](#choosing-a-parent-folder): in the `subfolders` mode the entry’s whole folder moves, taking its children along, while otherwise only the entry’s own file moves and it keeps its name.

### Nesting Page Bundles

Because the `subfolders` mode gives each entry a folder of its own, a relative [`media_folder`](https://sveltiacms.app/en/docs/media/internal#using-entry-relative-folders) is enough to turn the collection into a tree of [page bundles](https://sveltiacms.app/en/docs/collections/entries/slugs#creating-page-bundles), where each entry keeps its media beside its index file. Adding the `path` option on top restricts the collection to those index files, so that other files stored in the same folders are left alone:

```yaml [YAML]{6-8}
collections:
  - name: pages
    label: Pages
    label_singular: Page
    folder: /content/pages
    path: '{{slug}}/_index'
    media_folder: ''
    public_folder: ''
    nested:
      depth: 100
      summary: '{{title}}'
      subfolders: true
    meta: { path: { index_file: _index } }
    fields:
      - { name: title, label: Title }
      - { name: body, label: Body, widget: markdown }
      - { name: image, label: Image, widget: image }
```

```toml [TOML]{6-8}
[[collections]]
name = "pages"
label = "Pages"
label_singular = "Page"
folder = "/content/pages"
path = "{{slug}}/_index"
media_folder = ""
public_folder = ""

[collections.nested]
depth = 100
summary = "{{title}}"
subfolders = true

[collections.meta.path]
index_file = "_index"

[[collections.fields]]
name = "title"
label = "Title"

[[collections.fields]]
name = "body"
label = "Body"
widget = "markdown"

[[collections.fields]]
name = "image"
label = "Image"
widget = "image"
```

```json [JSON]{8-10}
{
  "collections": [
    {
      "name": "pages",
      "label": "Pages",
      "label_singular": "Page",
      "folder": "/content/pages",
      "path": "{{slug}}/_index",
      "media_folder": "",
      "public_folder": "",
      "nested": {
        "depth": 100,
        "summary": "{{title}}",
        "subfolders": true
      },
      "meta": {
        "path": {
          "index_file": "_index"
        }
      },
      "fields": [
        { "name": "title", "label": "Title" },
        { "name": "body", "label": "Body", "widget": "markdown" },
        { "name": "image", "label": "Image", "widget": "image" }
      ]
    }
  ]
}
```

```js [JavaScript]{8-10}
{
  collections: [
    {
      name: "pages",
      label: "Pages",
      label_singular: "Page",
      folder: "/content/pages",
      path: "{{slug}}/_index",
      media_folder: "",
      public_folder: "",
      nested: {
        depth: 100,
        summary: "{{title}}",
        subfolders: true,
      },
      meta: {
        path: {
          index_file: "_index",
        },
      },
      fields: [
        { name: "title", label: "Title" },
        { name: "body", label: "Body", widget: "markdown" },
        { name: "image", label: "Image", widget: "image" },
      ],
    },
  ],
}
```

The `path` option is optional here. In a nested collection it says where an entry sits within the folder holding it, rather than within the collection folder, so it takes the same form as in a flat collection, and its last segment — the file name — has to match `meta.path.index_file`. Leave it out and the collection takes in every file below its folder; set it and only the index files are entries, which is what you want if the same folders hold other Markdown that isn’t a page.

Either way, entries can be nested to any depth, each with media of its own:

```
.
└─ content/
   └─ pages/
      └─ about/
         ├─ _index.md           # About
         ├─ portrait.jpg
         └─ team/
            ├─ _index.md        # Team
            └─ group-photo.jpg
```

The `depth` option counts path segments the same way as it does without `path`, with the template’s own segments included in the count. Because `{{slug}}/_index` takes two of them, `depth: 3` allows one more folder level, such as `about/team/_index.md`.

### Browsing Nested Entries

The collection appears in the sidebar as a tree. Selecting a folder lists its entries in the main area, and the URL reflects the folder you’re browsing, so a link to a specific folder can be shared:

```
https://YOUR_DOMAIN/admin/#/collections/COLLECTION_NAME/filter/FOLDER_PATH
```

Such a link keeps working for as long as the folder does. A folder exists while it holds an entry, directly or further down, so one that has been emptied — or that never existed — shows a Not Found page rather than an empty list, and so does a folder path on a collection without the `nested` option. A folder that still holds an entry but has nothing to list, such as a page with no children, shows an empty list as usual.

In the `subfolders` mode, a folder that has no subfolder of its own is left out of the tree, because such a folder is an entry rather than a container — it’s already listed in its parent folder’s entry list. Set `subfolders: false` if you want every folder to appear in the tree.

Each folder in the tree is labelled with the summary of its index file, falling back to the folder name. With `subfolders: false`, the folder name is always used.

### Choosing a Parent Folder

The `meta.path` option adds a Parent Folder field above the other fields in the Content Editor. It shows the folder the entry is filed in and opens a folder tree for choosing a different one. The option accepts the following properties:

- `index_file`: The file name, without an extension, that every entry in the collection is saved as, such as `_index` or `index`. The `subfolders` mode needs it, because a folder’s own entry has to have a fixed name; without it, each entry is named after its slug and stored as a regular file in the chosen folder. It has no effect with `subfolders: false`, where entries always keep their own names.
- `widget` and `label`: Accepted for compatibility with Netlify/Decap CMS but ignored. The field is always a folder picker.

**Note for Netlify/Decap CMS users**

Netlify offered an [experimental `parent` widget](https://github.com/netlify-labs/netlify-cms-widget-parent) that allowed users to select a parent folder from a dropdown list rather than a string field. However, this feature was never integrated into Netlify CMS itself and is not compatible with Decap CMS. Sveltia CMS has its own built-in folder picker to improve the user experience, so the `widget` option is ignored. The `label` option is also ignored because the field is always labeled “Parent Folder”.

The option has no effect on its own: it needs `nested`, because without a hierarchy there is no folder to choose.

When an editor creates an entry while browsing a folder, the field starts on that folder, so the new entry is filed alongside the ones already listed. The tree lists every folder in the collection, and the folder an entry occupies is left out of its own picker so it can’t be filed within itself.

In the `subfolders` mode, a new entry gets a folder of its own within the chosen one, named after its [slug](https://sveltiacms.app/en/docs/collections/entries/slugs#entry-slugs). Creating “Release Notes” while browsing `docs/guides` therefore stores it at `docs/guides/release-notes/_index.md`. Elsewhere, the entry is a regular file named after its slug, so the same page becomes `docs/guides/release-notes.md`.

With `subfolders: false`, creating an entry never creates a folder, so the tree could otherwise only ever show the folders that already hold a file. A New Folder button below the tree fills that gap: pick the folder to create it in, give it a name, and the new folder becomes the entry’s parent. The name is normalized like an [entry slug](https://sveltiacms.app/en/docs/collections/entries/slugs#entry-slugs) — “User Guides” becomes `user-guides` — and is rejected if it contains a slash, starts with a dot, which would hide the folder, keeps no letter or number once normalized, or is already used by a folder in the same parent. The folder itself reaches the repository when the entry is saved into it, because Git tracks files rather than folders and so has no way to commit an empty folder. The button isn’t shown in the `subfolders` mode, where creating an entry already creates the folder that holds it.

Choosing a different folder for an existing entry moves its file, keeping the name it already has. To change that name instead of the folder it sits in, use the [Slug panel](https://sveltiacms.app/en/docs/ui/content-editor#slug-panel), which renames the entry’s own folder and takes everything below it along the same way. The Save button is enabled by the folder alone, so an entry can be moved without touching its content. In the `subfolders` mode, everything below the entry’s folder moves with it in the same commit — its child entries as well as any [entry-relative media](https://sveltiacms.app/en/docs/media/internal#using-entry-relative-folders) stored alongside them — so a whole section can be reorganized in one save. The CMS rejects a folder that is already taken by another entry.

**`index_file` vs `meta.path.index_file`**

These two options look similar but do different things. The [`index_file`](https://sveltiacms.app/en/docs/collections/entries/listings#managing-hugo-s-special-index-file) collection option includes _one_ special file, Hugo’s `_index.md`, in a regular entry collection and lets it have its own set of fields. The `meta.path.index_file` option names _every_ entry in a nested collection. You can use both in the same collection if the root index file needs different fields than the section pages.

Source: https://sveltiacms.app/en/docs/collections/entries/nested

---

## Preview Paths and Redirects

The `preview_path` option tells Sveltia CMS where an entry lives on your site, which enables site previews, deploy previews and automatic redirects when an entry’s slug changes.

### Preview Paths

The `preview_path` option allows you to define a custom URL path for previewing entries on your live site. This option accepts a string with template tags that will be replaced with entry-specific values when generating the preview URL. The CMS provides links to preview the entries based on this URL structure.

The path is appended to your site’s own address, or to the address of a build made for the entry when your repository is connected to a CI/CD provider. See [Deploy Previews](https://sveltiacms.app/en/docs/workflows/deploy-previews) for how those are found.

The [slug template tags](https://sveltiacms.app/en/docs/collections/entries/slugs#slug-template-tags) can be used in the `preview_path` option, with the following exceptions:

- `{{slug}}`: the entire slug of the entry, not just the slugified entry identifier.
- `{{year}}`, `{{month}}`, `{{day}}`, `{{hour}}`, `{{minute}}`, `{{second}}`: these tags are based on the entry’s [DateTime field](https://sveltiacms.app/en/docs/fields/datetime). The CMS looks for the first DateTime field in the collection to extract the date and time information. Use the `preview_path_date_field` option to specify a different date field. If no DateTime field is found, the `preview_path` option will be ignored, and a configuration warning is shown so the missing link doesn’t go unexplained. A field that exists but is left empty on an entry has the same effect on that entry.
- `{{dirname}}`: the directory name of the entry file relative to the collection `folder`. This is useful when using the `path` option to create subfolders.
- `{{filename}}`: the filename of the entry without the extension. This is useful when you want to use the exact filename in the preview URL.
- `{{extension}}`: the file extension of the entry. This is useful when you want to include the file type in the preview URL.
- `{{locale}}`: the locale code of the entry when using [i18n support](https://sveltiacms.app/en/docs/i18n/slugs#preview-paths). This is useful when you want to include the locale in the preview URL.

Just like the `slug` and `path` options, any field name defined in the collection’s `fields` option can also be used as a template tag in `preview_path`. If a field’s name matches one of the predefined tags listed above or in the [slug template tags](https://sveltiacms.app/en/docs/collections/entries/slugs#slug-template-tags), such as `slug`, `year` or `uuid`, you need to prefix it with `fields.`, like `{{fields.slug}}`, to avoid confusion with the tag itself.

You can use [string transformations](https://sveltiacms.app/en/docs/string-transformations) with these template tags.

The example below shows how to configure a blog posts collection with a custom preview URL structure.

```yaml [YAML]{5-6}
collections:
  - name: posts
    label: Blog Posts
    folder: /content/posts
    preview_path: '/blog/{{year}}/{{month}}/{{slug}}'
    preview_path_date_field: created_at
    fields:
      - { name: title, label: Title }
      - { name: created_at, label: Created At, widget: datetime }
      - { name: body, label: Body, widget: richtext }
```

```toml [TOML]{5-6}
[[collections]]
name = "posts"
label = "Blog Posts"
folder = "/content/posts"
preview_path = "/blog/{{year}}/{{month}}/{{slug}}"
preview_path_date_field = "created_at"
[[collections.fields]]
name = "title"
label = "Title"
[[collections.fields]]
name = "created_at"
label = "Created At"
widget = "datetime"
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
      "preview_path": "/blog/{{year}}/{{month}}/{{slug}}",
      "preview_path_date_field": "created_at",
      "fields": [
        { "name": "title", "label": "Title" },
        { "name": "created_at", "label": "Created At", "widget": "datetime" },
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
      preview_path: "/blog/{{year}}/{{month}}/{{slug}}",
      preview_path_date_field: "created_at",
      fields: [
        { name: "title", label: "Title" },
        { name: "created_at", label: "Created At", widget: "datetime" },
        { name: "body", label: "Body", widget: "richtext" },
      ],
    },
  ],
}
```

With the above configuration, a blog post created on June 15, 2025, with the title “My First Post” will have a preview URL of `/blog/2025/06/my-first-post`.

Setting the `preview_path` option does two more things:

- It lets the CMS keep links working when an entry is renamed. See [Redirects](#redirects) below.
- It’s what [Deploy Previews](https://sveltiacms.app/en/docs/workflows/deploy-previews) need in order to point at an entry. Without it there’s nothing to append to the site or preview address, so no preview link is shown.

### Redirects

Changing an entry’s slug usually changes its URL, which breaks existing links to it, including internal links, external links and search engine results. To prevent this, Sveltia CMS can record the entry’s previous path in its data, so your framework can redirect visitors from the old URL to the new one.

This requires the [`preview_path` option](#preview-paths), because that option is what tells the CMS where an entry lives on your live site. Once it’s set, saving an entry with a modified slug adds the previous path to the entry’s `aliases` property:

- If the property doesn’t exist yet, it’s created as a list with a single item.
- If the property already exists as a list, the previous path is appended to it, so redirects accumulate as an entry is renamed over time.

Entry slugs can be changed in the [Slug panel](https://sveltiacms.app/en/docs/ui/content-editor#slug-panel) of the Content Editor’s sidebar.

With the `preview_path` configuration shown above, renaming a June 2025 blog post from `my-first-post` to `hello-world` results in the following front matter:

```yaml
---
aliases:
  - /blog/2025/06/my-first-post
title: Hello World
created_at: 2025-06-15T09:00:00.000Z
---
```

The `aliases` property is supported out of the box by [Hugo](https://gohugo.io/content-management/urls/#aliases) and [Zola](https://www.getzola.org/documentation/content/page/#front-matter), which generate the redirects for you. Other frameworks may expect a different property name or require a plugin.

#### Customizing the Redirect Property

You can store the previous paths in a property other than `aliases` using the `aliases_field` option. For example, [Jekyll](https://jekyllrb.com/) sites using the [`jekyll-redirect-from`](https://github.com/jekyll/jekyll-redirect-from) plugin expect a `redirect_from` property:

```yaml [YAML]{6}
collections:
  - name: posts
    label: Blog Posts
    folder: /content/posts
    preview_path: '/blog/{{year}}/{{month}}/{{slug}}'
    aliases_field: redirect_from
```

```toml [TOML]{6}
[[collections]]
name = "posts"
label = "Blog Posts"
folder = "/content/posts"
preview_path = "/blog/{{year}}/{{month}}/{{slug}}"
aliases_field = "redirect_from"
```

```json [JSON]{8}
{
  "collections": [
    {
      "name": "posts",
      "label": "Blog Posts",
      "folder": "/content/posts",
      "preview_path": "/blog/{{year}}/{{month}}/{{slug}}",
      "aliases_field": "redirect_from"
    }
  ]
}
```

```js [JavaScript]{8}
{
  collections: [
    {
      name: "posts",
      label: "Blog Posts",
      folder: "/content/posts",
      preview_path: "/blog/{{year}}/{{month}}/{{slug}}",
      aliases_field: "redirect_from",
    },
  ],
}
```

#### Disabling Redirects

If your framework doesn’t support redirects defined in entry data, set the `aliases_field` option to `false`. The CMS will then leave the property untouched when an entry is renamed, and no redirects will be generated.

```yaml [YAML]{6}
collections:
  - name: posts
    label: Blog Posts
    folder: /content/posts
    preview_path: '/blog/{{year}}/{{month}}/{{slug}}'
    aliases_field: false
```

```toml [TOML]{6}
[[collections]]
name = "posts"
label = "Blog Posts"
folder = "/content/posts"
preview_path = "/blog/{{year}}/{{month}}/{{slug}}"
aliases_field = false
```

```json [JSON]{8}
{
  "collections": [
    {
      "name": "posts",
      "label": "Blog Posts",
      "folder": "/content/posts",
      "preview_path": "/blog/{{year}}/{{month}}/{{slug}}",
      "aliases_field": false
    }
  ]
}
```

```js [JavaScript]{8}
{
  collections: [
    {
      name: "posts",
      label: "Blog Posts",
      folder: "/content/posts",
      preview_path: "/blog/{{year}}/{{month}}/{{slug}}",
      aliases_field: false,
    },
  ],
}
```

The same applies if you define a field with the same name as the redirect property in the `fields` option. The CMS assumes that you want to manage the redirects yourself in the Content Editor, so it won’t write to the property on its own. This is the way to go if you’d rather curate the list by hand while still being able to see and edit it in the CMS.

Source: https://sveltiacms.app/en/docs/collections/entries/previews
