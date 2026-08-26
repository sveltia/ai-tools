# Entry Collections

Folder-based entry collections in depth: paths, slugs, sorting, filtering, previews and nested collections.

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
- `folder`: (required) The folder path where the entries are stored, relative to the repository’s root directory. It can be an empty string (or `.` or `/`) to store entries in the root folder.
- `fields`: (required) An array defining the [fields](https://sveltiacms.app/en/docs/fields) for each entry in the collection. Each field has a `name`, `label`, and optional `widget` type.

### File Format and Extension

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

#### Format

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

#### Extension

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

#### Front Matter Delimiter

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

#### Body Field for Front Matter Formats

By default, a Markdown field named `body` is treated as the main content of the file, while other fields are stored in the front matter. This behavior can be configured using the `body_field` option in the collection definition. The `body_field` option allows you to specify a different field name for the main content or to store the body content directly in the front matter.

##### Body Field Name

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

##### Inline Body Field

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

### Managing Entry Slugs

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

To use a field named `slug`, you need to prefix it with `fields.`, like `{{fields.slug}}`, to avoid confusion with the `slug` template tag itself.

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

By default, an entry’s slug is generated from the `title` field or the template defined in the `slug` option, and users never see it while writing. To have users choose the slug themselves instead, set the `slug` option to the special `{{fields._slug}}` tag.

With that option in place, a required Slug field appears above the other fields in the Edit Pane. It looks like a standard string field, but its value becomes the entry slug. The field starts out empty, so the entry can’t be saved until a slug has been entered, and slashes and whitespace are rejected.

**Only while creating an entry**

The Slug field is shown only while an entry is being created, including when an existing entry is duplicated. Once the entry has been saved, the field disappears.

A saved entry can still be renamed, but only with the [Slug Editor](https://sveltiacms.app/en/docs/ui/content-editor#slug-editor) in the 3-dot menu of the Content Editor. Renaming moves the entry’s file and rewrites every reference to it, so it’s deliberately kept out of the Edit Pane, where it could otherwise be changed by accident in the middle of routine editing.

In an [i18n](https://sveltiacms.app/en/docs/i18n)-enabled collection, `{{fields._slug}}` makes the slug editable in the default locale only, and the remaining locales show the same value as read-only. To let users enter a different slug for each locale, set the `slug` option to `{{fields._slug | localize}}` instead.

### Managing File Paths

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

You can create nested structures like Hugo’s [page bundles](https://gohugo.io/content-management/page-bundles/) using the `path`, [`media_folder` and `public_folder` options](https://sveltiacms.app/en/docs/media/internal#using-entry-relative-folders) together. For example, to create a leaf bundle for each blog post, you can use the following configuration:

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

#### Constructing File Paths

A folder collection’s file path is determined by multiple factors: the `i18n`, `folder`, `path`, `slug` and `extension` options. The configuration can be complex, especially with i18n support, so let’s break it down.

- The [`i18n`](https://sveltiacms.app/en/docs/i18n) global or collection option (optional)
  - It can be configured to add internationalization (i18n) support to your site.
  - The `structure` and `omit_default_locale_from_file_path` options affect the entry file path.
- The `folder` collection option (required)
  - It specifies the folder where the collection entries are stored, relative to the repository’s root directory.
  - It can contain slashes to create a nested folder structure.
- The [`path`](#using-subfolders) collection option (optional)
  - It defaults to `{{slug}}`, which is the `slug` collection option value.
  - It can contain template tags.
  - It can also contain slashes to create a nested folder structure.
- The [`slug`](#managing-entry-slugs) collection option (optional)
  - It defaults to `{{title}}`, which is the entry’s `title` field value’s slugified version.
  - It can contain template tags but _cannot_ contain slashes.
- The [`extension`](#extension) collection option (optional)
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
  /<locale>/<folder>/<path>.<extension> # other locales
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

#### Creating Editable Nested Structures

With the `nested` and `meta` options, you can organize contents that have a hierarchical relationship, such as categories and subcategories, and allow editors to create nested entries easily. This feature is called [nested collections](https://decapcms.org/docs/collection-nested/) in Netlify/Decap CMS.

**Unimplemented**

This feature from Netlify/Decap CMS is not yet supported in Sveltia CMS. It will be added before the [1.0 release](https://sveltiacms.app/en/docs/roadmap#v1-0). Check our [release notes](https://sveltiacms.app/en/docs/releases#release-information) for updates.

### Managing Preview Paths

The `preview_path` option allows you to define a custom URL path for previewing entries on your live site. This option accepts a string with template tags that will be replaced with entry-specific values when generating the preview URL. The CMS provides links to preview the entries based on this URL structure.

The path is appended to your site’s own address, or to the address of a build made for the entry when your repository is connected to a CI/CD provider. See [Deploy Previews](https://sveltiacms.app/en/docs/workflows/deploy-previews) for how those are found.

The [slug template tags](#slug-template-tags) can be used in the `preview_path` option, with the following exceptions:

- `{{slug}}`: the entire slug of the entry, not just the slugified entry identifier.
- `{{year}}`, `{{month}}`, `{{day}}`, `{{hour}}`, `{{minute}}`, `{{second}}`: these tags are based on the entry’s [DateTime field](https://sveltiacms.app/en/docs/fields/datetime). The CMS looks for the first DateTime field in the collection to extract the date and time information. Use the `preview_path_date_field` option to specify a different date field. If no DateTime field is found, the `preview_path` option will be ignored, and a configuration warning is shown so the missing link doesn’t go unexplained. A field that exists but is left empty on an entry has the same effect on that entry.
- `{{dirname}}`: the directory name of the entry file relative to the collection `folder`. This is useful when using the `path` option to create subfolders.
- `{{filename}}`: the filename of the entry without the extension. This is useful when you want to use the exact filename in the preview URL.
- `{{extension}}`: the file extension of the entry. This is useful when you want to include the file type in the preview URL.
- `{{locale}}`: the locale code of the entry when using [i18n support](https://sveltiacms.app/en/docs/i18n). This is useful when you want to include the locale in the preview URL.

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

- It lets the CMS keep links working when an entry is renamed. See [Managing Redirects](#managing-redirects) below.
- It’s what [Deploy Previews](https://sveltiacms.app/en/docs/workflows/deploy-previews) need in order to point at an entry. Without it there’s nothing to append to the site or preview address, so no preview link is shown.

### Managing Redirects

Changing an entry’s slug usually changes its URL, which breaks existing links to it, including internal links, external links and search engine results. To prevent this, Sveltia CMS can record the entry’s previous path in its data, so your framework can redirect visitors from the old URL to the new one.

This requires the [`preview_path` option](#managing-preview-paths), because that option is what tells the CMS where an entry lives on your live site. Once it’s set, saving an entry with a modified slug adds the previous path to the entry’s `aliases` property:

- If the property doesn’t exist yet, it’s created as a list with a single item.
- If the property already exists as a list, the previous path is appended to it, so redirects accumulate as an entry is renamed over time.

Entry slugs can be changed with the [Slug Editor](https://sveltiacms.app/en/docs/ui/content-editor#slug-editor), which can be accessed via the 3-dot menu in the Content Editor.

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

### Controlling Entry Creation

Sveltia CMS provides options to control entry creation and deletion, limit the number of entries, and hide collections from the Sveltia CMS interface.

#### Disabling Creation and Deletion

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

#### Disabling duplication

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

#### Limiting Entry Count

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

#### Hiding the Collection

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

### Managing Entry Listings

After creating an entry collection, you might want to customize how entries are displayed in the Sveltia CMS interface. The following options allow you to control various aspects of entry listings.

#### Summaries

By default, Sveltia CMS uses the `title` field (or a field defined with the [`identifier_field` option](#specifying-an-identifier-field)) as the summary for each entry in the listing view.

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

The following template tags are supported in the `summary` option, in addition to [slug template tags](#slug-template-tags) except date-related ones:

- `{{dirname}}`: The name of the directory containing the entry file, relative to the collection `folder`.
- `{{filename}}`: The entry file name without the extension.
- `{{extension}}`: The entry file extension.
- `{{commit_author}}`: The last commit author of the entry file from Git history (if available).
- `{{commit_date}}`: The last commit date of the entry file from Git history (if available).
- `{{locales}}`: The enabled locales for the entry when using [i18n support](https://sveltiacms.app/en/docs/i18n).

**Known issue**

Git commit information is not available with the GitLab backend due to API limitations.

#### Thumbnails

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

#### Including and Excluding Entries

Sometimes, you may want to include or exclude specific entries from being displayed in the Sveltia CMS interface. Sveltia CMS provides options to manage this.

##### Managing Hugo’s Special Index file

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

Note that the special index file is placed right under the `folder`, regardless of the collection’s [`path` option](#using-subfolders). For example, if the `path` is `{{year}}/{{slug}}`, a regular entry would be saved as `content/posts/2025/title.md`, but the index file remains at `content/posts/_index.md`.

##### Filtering Entries

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

### Managing Entry Order

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

Entering reorder mode normally clears any active grouping, so the entry list becomes a single flat sequence. If the order value is only meaningful within a group — for example, articles ordered per category — you can instead keep the list grouped while reordering by adding a `group` property to the `reorder` option. Its value is the `name` of one of the collection’s [view groups](#grouping):

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

### Managing Entry Views

Sveltia CMS provides several options to customize how entries are displayed in the listing view. Users can sort, group, and filter entries based on specific fields to improve navigation and organization.

#### Sorting

By default, Sveltia CMS supports sorting by `title`, `date`, `author` and `description` fields if they exist in the collection. If the `date` and `author` fields are not present, Sveltia CMS will look for commit date and author information from Git history (if available) to enable sorting by those fields.

When the [`summary` option](#summaries) is defined for a collection, Sveltia CMS also enables sorting by entry summaries. This allows you to sort entries based on the customized summary content, which can include multiple fields and string transformations.

When the [`reorder` option](#managing-entry-order) is enabled for a collection, Sveltia CMS enables manual sorting of entries in the listing view. This allows users to drag and drop entries to reorder them as needed.

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

#### Grouping

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

A named view group can also be used with the [`reorder` option](#reordering-within-groups) to let editors reorder entries within their own group.

#### Filtering

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

Source: https://sveltiacms.app/en/docs/collections/entries
