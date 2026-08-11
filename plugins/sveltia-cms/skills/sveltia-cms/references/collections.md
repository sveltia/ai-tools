# Collections

Collection types, file collections, singletons and content modeling. For entry collection options and slugs, see `entries.md`.

Generated from the Sveltia CMS documentation. Do not edit by hand.

## Collections

The `collections` option allows you to define groups of related content in your project. It’s an array of objects, each representing a collection with specific properties.

There are two types of collections, as well as dividers to visually separate sections in your navigation. These can be mixed as needed.

### Collection Types

There are two main types of collections in Sveltia CMS:

- [Entry Collections](https://sveltiacms.app/en/docs/collections/entries): Used for managing multiple entries of similar content, such as blog posts, tags, products and events. Each entry is stored as a separate file in a specified folder.
- [File Collections](https://sveltiacms.app/en/docs/collections/files): Used for managing individual files, such as static pages or configuration files. Each file is defined explicitly in the configuration.

Additionally, there is a special type of file collection:

- [Singleton Collection](https://sveltiacms.app/en/docs/collections/singletons): Defined at the top level of the config file, singletons are used for managing unique content items, such as site settings or homepage content.

### Designing Content Models with Collections

In Sveltia CMS, collections are fundamental building blocks for creating content models. They help organize and structure your content effectively. See the [Content Modeling Guide](https://sveltiacms.app/en/docs/content-modeling) for more information on designing effective content models using collections.

### Creating Collections

Collections are defined in your configuration file under the `collections` property. Here’s how to create both entry and file collections:

```yaml [YAML]{5,12}
collections:
  # Entry Collection for Blog Posts
  - name: posts
    label: Blog Posts
    folder: content/posts
    fields:
      - { name: title, label: Title }
      - { name: body, label: Body, widget: richtext }
  # File Collection for Static Pages
  - name: pages
    label: Pages
    files:
      - name: about
        label: About Page
        file: content/pages/about.md
        fields:
          - { name: title, label: Title }
          - { name: body, label: Body, widget: richtext }
```

```toml [TOML]{4,22}
[[collections]]
name = "posts"
label = "Blog Posts"
folder = "content/posts"

[[collections.fields]]
name = "title"
label = "Title"

[[collections.fields]]
name = "body"
label = "Body"
widget = "richtext"

[[collections]]
name = "pages"
label = "Pages"

[[collections.files]]
name = "about"
label = "About Page"
file = "content/pages/about.md"

[[collections.files.fields]]
name = "title"
label = "Title"

[[collections.files.fields]]
name = "body"
label = "Body"
widget = "richtext"
```

```json [JSON]{6,15}
{
  "collections": [
    {
      "name": "posts",
      "label": "Blog Posts",
      "folder": "content/posts",
      "fields": [
        { "name": "title", "label": "Title" },
        { "name": "body", "label": "Body", "widget": "richtext" }
      ]
    },
    {
      "name": "pages",
      "label": "Pages",
      "files": [
        {
          "name": "about",
          "label": "About Page",
          "file": "content/pages/about.md",
          "fields": [
            { "name": "title", "label": "Title" },
            { "name": "body", "label": "Body", "widget": "richtext" }
          ]
        }
      ]
    }
  ]
}
```

```js [JavaScript]{6,15}
{
  collections: [
    {
      name: "posts",
      label: "Blog Posts",
      folder: "content/posts",
      fields: [
        { name: "title", label: "Title" },
        { name: "body", label: "Body", widget: "richtext" },
      ],
    },
    {
      name: "pages",
      label: "Pages",
      files: [
        {
          name: "about",
          label: "About Page",
          file: "content/pages/about.md",
          fields: [
            { name: "title", label: "Title" },
            { name: "body", label: "Body", widget: "richtext" },
          ],
        },
      ],
    },
  ],
}
```

The two collections defined above will appear in the Sveltia CMS interface as separate sections for managing blog posts and static pages. These two collection types can be mixed and matched as needed to suit your content management requirements.

It’s easy to distinguish between entry and file collections in the configuration file. Entry collections use the `folder` property to specify the directory where entries are stored, while file collections use the `files` property to define individual files.

There is no hard limit to the number of collections you can define in your configuration file. You can create as many collections as needed to effectively organize and manage your content. However, for optimal user experience, it’s recommended to keep the number of collections manageable and logically grouped.

### Customizing Collection List Appearance

You can customize the appearance of your collection list in Sveltia CMS by adding icons and dividers. This helps improve navigation and organization, especially when you have multiple collections.

#### Icons

You can specify an icon for each collection for easy identification in the collection list. You don’t need to install a custom icon set because the Material Symbols font file is already loaded for the application UI. Just pick one of the 2,500+ icons:

1. Visit the [Material Symbols](https://fonts.google.com/icons?icon.set=Material+Symbols&icon.platform=web) page on Google Fonts.
1. Browse and select an icon, and copy the icon name that appears at the bottom of the right pane.
1. Add it to one of your collection definitions in `config.yml` as the new `icon` property, like the example below.
1. Repeat the same steps for all the collections if desired.
1. Commit and push the changes to your Git repository.
1. Reload Sveltia CMS once the updated config file is deployed.

Here’s an example of adding an icon to an entry collection that manages tags:

```yaml [YAML]{4}
collections:
  - name: tags
    label: Tags
    icon: sell
    folder: content/tags
```

```toml [TOML]{4}
[[collections]]
name = "tags"
label = "Tags"
icon = "sell"
folder = "content/tags"
```

```json [JSON]{6}
{
  "collections": [
    {
      "name": "tags",
      "label": "Tags",
      "icon": "sell",
      "folder": "content/tags"
    }
  ]
}
```

```js [JavaScript]{6}
{
  collections: [
    {
      name: "tags",
      label: "Tags",
      icon: "sell",
      folder: "content/tags",
    },
  ],
}
```

#### Dividers

With Sveltia CMS, developers can add dividers to the collection list to distinguish between different types of collections. To do so, insert a new item with the `divider` option set to `true`. In VS Code, you may receive a validation error if `config.yml` is treated as a Netlify CMS configuration file. You can resolve this issue by [using our JSON schema](https://sveltiacms.app/en/docs/config-basics#json-schema).

```yaml [YAML]{4}
collections:
  - name: products
    ...
  - divider: true
  - name: pages
    ...
```

```toml [TOML]{5}
[[collections]]
name = "products"

[[collections]]
divider = true

[[collections]]
name = "pages"
```

```json [JSON]{7}
{
  "collections": [
    {
      "name": "products"
    },
    {
      "divider": true
    },
    {
      "name": "pages"
    }
  ]
}
```

```js [JavaScript]{7}
{
  collections: [
    {
      name: "products",
    },
    {
      divider: true,
    },
    {
      name: "pages",
    },
  ],
}
```

The [singleton collection](https://sveltiacms.app/en/docs/collections/files#singletons) also supports dividers.

Source: https://sveltiacms.app/en/docs/collections

---

## File Collections

A file collection contains pre-defined files, each representing a single piece of content. Editors can edit the content of these files but cannot create or delete them. Typical use cases for file collections include site settings, homepage content or about pages.

### Creating a File Collection

The example below defines a file collection for managing static pages:

```yaml [YAML]
collections:
  - name: pages
    label: Pages
    files:
      - name: about
        label: About Page
        file: content/pages/about.md
        fields:
          - { name: title, label: Title }
          - { name: body, label: Body, widget: richtext }
```

```toml [TOML]
[[collections]]
name = "pages"
label = "Pages"

[[collections.files]]
name = "about"
label = "About Page"
file = "content/pages/about.md"

[[collections.files.fields]]
name = "title"
label = "Title"

[[collections.files.fields]]
name = "body"
label = "Body"
widget = "richtext"
```

```json [JSON]
{
  "collections": [
    {
      "name": "pages",
      "label": "Pages",
      "files": [
        {
          "name": "about",
          "label": "About Page",
          "file": "content/pages/about.md",
          "fields": [
            { "name": "title", "label": "Title" },
            { "name": "body", "label": "Body", "widget": "richtext" }
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
      name: "pages",
      label: "Pages",
      files: [
        {
          name: "about",
          label: "About Page",
          file: "content/pages/about.md",
          fields: [
            { name: "title", label: "Title" },
            { name: "body", label: "Body", widget: "richtext" },
          ],
        },
      ],
    },
  ],
}
```

Each file in the collection is defined with a `name`, `label`, `file` path, and a set of `fields`. Editors can modify the content of these files through the Sveltia CMS interface.

#### Collection Options

A file collection supports the following options:

- `name`: A unique identifier for the collection. Required.
- `label`: A human-readable name for the collection. Optional.
- `icon`: A Material Symbols icon name to represent the collection in the CMS UI. Optional.
- `files`: An array of file definitions within the collection. Required.

#### File Options

A file definition within a file collection supports the following options:

- `name`: A unique identifier for the file within the collection. Required.
- `label`: A human-readable name for the file. Optional.
- `icon`: A Material Symbols icon name to represent the file in the CMS UI. Optional.
- `file`: The path to the file in the content repository. Required.
- `format`: The file format (e.g., `yaml`, `json`, `toml`, `yaml-frontmatter`, etc.). Optional. [See below](#file-format-and-extension) for details.
- `fields`: An array of field definitions for the file content. Required.

### File Format and Extension

The file format and extension for each file in a file collection can be customized using the `format` property within each file definition. Sveltia CMS supports various file formats, including Markdown, YAML, JSON, and TOML.

By default, file format is determined based on the file extension. If it is a Markdown file (e.g., `.md`), it uses `yaml-frontmatter` format. For other extensions, it uses the corresponding format (e.g., `.yaml` uses `yaml` format).

To illustrate, here is a file collection with two files using different formats:

```yaml [YAML]{7,13}
collections:
  - name: pages
    label: Pages
    files:
      - name: about
        label: About Page
        file: content/pages/about.json
        fields:
          - { name: title, label: Title }
          - { name: body, label: Body, widget: richtext }
      - name: contact
        label: Contact Page
        file: content/pages/contact.yaml
        fields:
          - { name: title, label: Title }
          - { name: body, label: Body, widget: richtext }
```

```toml [TOML]{8,22}
[[collections]]
name = "pages"
label = "Pages"

[[collections.files]]
name = "about"
label = "About Page"
file = "content/pages/about.json"

[[collections.files.fields]]
name = "title"
label = "Title"

[[collections.files.fields]]
name = "body"
label = "Body"
widget = "richtext"

[[collections.files]]
name = "contact"
label = "Contact Page"
file = "content/pages/contact.yaml"

[[collections.files.fields]]
name = "title"
label = "Title"

[[collections.files.fields]]
name = "body"
label = "Body"
widget = "richtext"
```

```json [JSON]{10,19}
{
  "collections": [
    {
      "name": "pages",
      "label": "Pages",
      "files": [
        {
          "name": "about",
          "label": "About Page",
          "file": "content/pages/about.json",
          "fields": [
            { "name": "title", "label": "Title" },
            { "name": "body", "label": "Body", "widget": "richtext" }
          ]
        },
        {
          "name": "contact",
          "label": "Contact Page",
          "file": "content/pages/contact.yaml",
          "fields": [
            { "name": "title", "label": "Title" },
            { "name": "body", "label": "Body", "widget": "richtext" }
          ]
        }
      ]
    }
  ]
}
```

```js [JavaScript]{10,19}
{
  collections: [
    {
      name: "pages",
      label: "Pages",
      files: [
        {
          name: "about",
          label: "About Page",
          file: "content/pages/about.json",
          fields: [
            { name: "title", label: "Title" },
            { name: "body", label: "Body", widget: "richtext" },
          ],
        },
        {
          name: "contact",
          label: "Contact Page",
          file: "content/pages/contact.yaml",
          fields: [
            { name: "title", label: "Title" },
            { name: "body", label: "Body", widget: "richtext" },
          ],
        },
      ],
    },
  ],
}
```

#### Format

To explicitly set the file format, you can add the `format` property to each file definition. This is useful if you want to use TOML or JSON formats for Markdown files. Here is an example:

```yaml [YAML]{4}
collections:
  - name: pages
    label: Pages
    format: json-frontmatter
    files:
      - name: about
        label: About Page
        file: content/pages/about.md
```

```toml [TOML]{4}
[[collections]]
name = "pages"
label = "Pages"
format = "json-frontmatter"

[[collections.files]]
name = "about"
label = "About Page"
file = "content/pages/about.md"
```

```json [JSON]{6}
{
  "collections": [
    {
      "name": "pages",
      "label": "Pages",
      "format": "json-frontmatter",
      "files": [
        {
          "name": "about",
          "label": "About Page",
          "file": "content/pages/about.md"
        }
      ]
    }
  ]
}
```

```js [JavaScript]{6}
{
  collections: [
    {
      name: "pages",
      label: "Pages",
      format: "json-frontmatter",
      files: [
        {
          name: "about",
          label: "About Page",
          file: "content/pages/about.md",
        },
      ],
    },
  ],
}
```

The `format` can be set at the collection level to apply to all files within that collection, or at the individual file level to override the collection setting for specific files.

Note that when specifying a format, ensure that the file extension matches the chosen format to avoid confusion. If there is an obvious mismatch between the file extension and the specified format, Sveltia CMS will raise a validation error.

#### Extension

Unlike entry collections, file collections do not support the `extension` option to define allowed file extensions, since each file is pre-defined with a specific path containing its extension.

Extension-less files are supported in file collections. When using extension-less files, it is recommended to explicitly set the `format` property to ensure the correct parsing of the file content. If `format` is not set, it defaults to `yaml-frontmatter`.

See [Editing site deployment configuration files](https://sveltiacms.app/en/docs/how-tos#editing-site-deployment-configuration-files) in our how-tos for an example of using extension-less files in a file collection.

#### Front Matter Delimiter

As with entry collections, the [`frontmatter_delimiter` option](https://sveltiacms.app/en/docs/collections/entries#front-matter-delimiter) can also be used to customize the front matter delimiter for Markdown files, either at the collection or file level. Here is an example of setting both `format` and `frontmatter_delimiter` at the file level:

```yaml [YAML]{8-9}
collections:
  - name: pages
    label: Pages
    files:
      - name: about
        label: About Page
        file: content/pages/about.md
        format: toml-frontmatter
        frontmatter_delimiter: ~~~
```

```toml [TOML]{9-10}
[[collections]]
name = "pages"
label = "Pages"

[[collections.files]]
name = "about"
label = "About Page"
file = "content/pages/about.md"
format = "toml-frontmatter"
frontmatter_delimiter = "~~~"
```

```json [JSON]{11-12}
{
  "collections": [
    {
      "name": "pages",
      "label": "Pages",
      "files": [
        {
          "name": "about",
          "label": "About Page",
          "file": "content/pages/about.md",
          "format": "toml-frontmatter",
          "frontmatter_delimiter": "~~~"
        }
      ]
    }
  ]
}
```

```js [JavaScript]{11-12}
{
  collections: [
    {
      name: "pages",
      label: "Pages",
      files: [
        {
          name: "about",
          label: "About Page",
          file: "content/pages/about.md",
          format: "toml-frontmatter",
          frontmatter_delimiter: "~~~",
        },
      ],
    },
  ],
}
```

#### Body Field for Front Matter Formats

When using front matter formats (e.g., `yaml-frontmatter`, `toml-frontmatter`, `json-frontmatter`), you can configure the body field to specify where the main content of the file should be stored. By default, the body field is named `body`, but you can customize this by setting the `body_field` option at either the collection or file level.

See [Body Field for Front Matter Formats](https://sveltiacms.app/en/docs/collections/entries#body-field-for-front-matter-formats) in the entry collections documentation for more details.

### Singletons

The singleton collection is a special type of file collection that allows you to manage a set of pre-defined files without the ability to create or delete them. Singletons are useful for managing site-wide settings or content that should only exist as a single instance. See [Singletons](https://sveltiacms.app/en/docs/collections/singletons) for more details.

Source: https://sveltiacms.app/en/docs/collections/files

---

## Singletons

The Singleton collection is a special type of file collection that allows you to manage a set of pre-defined data files, each representing a unique resource in your project. Unlike regular file collections, the Singleton collection does not have a collection name or label, and each file is defined directly at the root level of the configuration.

**Tip**

Singletons may be referred to as “singles” or “singular resources” in other CMSs.

### Differences from File Collections

The differences between the Singleton collection and a regular [file collection](https://sveltiacms.app/en/docs/collections/files) are as follows:

#### Configuration

- The Singleton collection does not have the `name` or `label` property at the root level of the configuration.
- Each file in the Singleton collection is defined directly under the `singletons` array at the root level of the configuration, rather than being nested under a `files` property within a named collection.
- Singleton files cannot be nested within folders; each file must be defined at the top level of the `singletons` array.

#### User Interface

- On desktop, singleton files appear directly in the sidebar under the “Singletons” group, rather than within a collection that shows a list of files.
  - When clicking on a singleton file in the sidebar, the editor opens directly for that file.
  - However, if there are no other collections, the Singleton collection appears as a regular file collection.
- On mobile, singleton files are accessible via a dedicated “Singletons” section in the content library.

### When to Use Singletons

If your project has multiple similar files, you might consider creating a regular [file collection](https://sveltiacms.app/en/docs/collections/files) and include all your relevant files there. A typical example is a `pages` collection that contains multiple page files like `home`, `about`, and `contact`.

However, if your project has only a few pages or configuration files that are not part of a larger collection, using singletons can be more straightforward.

For example, you might have a `home` page and a `settings` file that you want to manage. Instead of creating a `pages` collection with just one file, you can define these files directly in the Singleton collection.

### Creating the Singleton Collection

To create this special file collection, add the new `singletons` option, along with an array of file definitions, to the root level of your CMS configuration.

Here’s an example configuration with two singleton files:

```yaml [YAML]
singletons:
  - name: home
    label: Home Page
    file: content/home.yaml
    fields:
      - { label: Title, name: title }
      - { label: Body, name: body, widget: richtext }
  - name: settings
    label: Site Settings
    file: content/settings.yaml
    fields:
      - { label: Site Title, name: site_title }
      - { label: Description, name: description, widget: text }
```

```toml [TOML]
[[singletons]]
name = "home"
label = "Home Page"
file = "content/home.yaml"

[[singletons.fields]]
label = "Title"
name = "title"

[[singletons.fields]]
label = "Body"
name = "body"
widget = "richtext"

[[singletons]]
name = "settings"
label = "Site Settings"
file = "content/settings.yaml"

[[singletons.fields]]
label = "Site Title"
name = "site_title"

[[singletons.fields]]
label = "Description"
name = "description"
widget = "text"
```

```json [JSON]
{
  "singletons": [
    {
      "name": "home",
      "label": "Home Page",
      "file": "content/home.yaml",
      "fields": [
        { "label": "Title", "name": "title" },
        { "label": "Body", "name": "body", "widget": "richtext" }
      ]
    },
    {
      "name": "settings",
      "label": "Site Settings",
      "file": "content/settings.yaml",
      "fields": [
        { "label": "Site Title", "name": "site_title" },
        { "label": "Description", "name": "description", "widget": "text" }
      ]
    }
  ]
}
```

```js [JavaScript]
{
  singletons: [
    {
      name: "home",
      label: "Home Page",
      file: "content/home.yaml",
      fields: [
        { label: "Title", name: "title" },
        { label: "Body", name: "body", widget: "richtext" },
      ],
    },
    {
      name: "settings",
      label: "Site Settings",
      file: "content/settings.yaml",
      fields: [
        { label: "Site Title", name: "site_title" },
        { label: "Description", name: "description", widget: "text" },
      ],
    },
  ],
}
```

File options are the same as those for [file collections](https://sveltiacms.app/en/docs/collections/files).

### Converting from File Collections

It’s easy to convert an existing file collection into the Singleton collection. This is a conventional file collection:

```yaml [YAML]{1-4}
collections:
  - name: data
    label: Data
    files:
      - name: home
        label: Home Page
        file: content/home.yaml
        fields: ...
      - name: settings
        label: Site Settings
        file: content/settings.yaml
        fields: ...
```

```toml [TOML]{1-3}
[[collections]]
name = "data"
label = "Data"

[[collections.files]]
name = "home"
label = "Home Page"
file = "content/home.yaml"

[[collections.files]]
name = "settings"
label = "Site Settings"
file = "content/settings.yaml"
```

```json [JSON]{2-6}
{
  "collections": [
    {
      "name": "data",
      "label": "Data",
      "files": [
        {
          "name": "home",
          "label": "Home Page",
          "file": "content/home.yaml"
        },
        {
          "name": "settings",
          "label": "Site Settings",
          "file": "content/settings.yaml"
        }
      ]
    }
  ]
}
```

```js [JavaScript]{2-6}
{
  collections: [
    {
      name: "data",
      label: "Data",
      files: [
        {
          name: "home",
          label: "Home Page",
          file: "content/home.yaml",
        },
        {
          name: "settings",
          label: "Site Settings",
          file: "content/settings.yaml",
        },
      ],
    },
  ],
}
```

It can be converted to the Singleton collection like this:

```yaml [YAML]{1}
singletons:
  - name: home
    label: Home Page
    file: content/home.yaml
    fields: ...
  - name: settings
    label: Site Settings
    file: content/settings.yaml
    fields: ...
```

```toml [TOML]
[[singletons]]
name = "home"
label = "Home Page"
file = "content/home.yaml"

[[singletons]]
name = "settings"
label = "Site Settings"
file = "content/settings.yaml"
```

```json [JSON]{2}
{
  "singletons": [
    {
      "name": "home",
      "label": "Home Page",
      "file": "content/home.yaml"
    },
    {
      "name": "settings",
      "label": "Site Settings",
      "file": "content/settings.yaml"
    }
  ]
}
```

```js [JavaScript]{2}
{
  singletons: [
    {
      name: "home",
      label: "Home Page",
      file: "content/home.yaml",
    },
    {
      name: "settings",
      label: "Site Settings",
      file: "content/settings.yaml",
    },
  ],
}
```

### Adding Icons and Dividers

You can add icons to singleton items using the `icon` option, and you can add dividers between items using the `divider` option. Here’s an example:

```yaml [YAML]{5,7,11}
singletons:
  - name: home
    label: Home Page
    file: content/home.yaml
    icon: home
    fields: ...
  - divider: true
  - name: settings
    label: Site Settings
    file: content/settings.yaml
    icon: settings
    fields: ...
```

```toml [TOML]{5,8,14}
[[singletons]]
name = "home"
label = "Home Page"
file = "content/home.yaml"
icon = "home"

[[singletons]]
divider = true

[[singletons]]
name = "settings"
label = "Site Settings"
file = "content/settings.yaml"
icon = "settings"
```

```json [JSON]{7,10,16}
{
  "singletons": [
    {
      "name": "home",
      "label": "Home Page",
      "file": "content/home.yaml",
      "icon": "home"
    },
    {
      "divider": true
    },
    {
      "name": "settings",
      "label": "Site Settings",
      "file": "content/settings.yaml",
      "icon": "settings"
    }
  ]
}
```

```js [JavaScript]{7,10,16}
{
  singletons: [
    {
      name: "home",
      label: "Home Page",
      file: "content/home.yaml",
      icon: "home",
    },
    {
      divider: true,
    },
    {
      name: "settings",
      label: "Site Settings",
      file: "content/settings.yaml",
      icon: "settings",
    },
  ],
}
```

### Referencing Singleton Files

If you want to reference a singleton file with a [Relation](https://sveltiacms.app/en/docs/fields/relation) field, use `_singletons` (note an underscore prefix) as the `collection` name.

Source: https://sveltiacms.app/en/docs/collections/singletons

---

## Content Modeling Guide

Sveltia CMS is a generic-purpose content management system that can be adapted to various use cases. How to structure your collections and design your content models depends on your project requirements. Here are some guidelines and examples to help you get started.

### Planning Your Content Model

Content modeling is primarily a non-technical task that requires understanding of your content and how it will be used. It’s recommended to involve content editors and stakeholders in the planning process to ensure the content model meets everyone’s needs. If you are building a site for a client, collaborate with them to understand their content requirements and workflows.

### Understanding Content Models

A content model defines the structure and organization of your content within Sveltia CMS. It consists of [collections](https://sveltiacms.app/en/docs/collections), which are groups of related content items, and [fields](https://sveltiacms.app/en/docs/fields), which define the properties of each content item.

When designing your content model, consider the following:

- **Content types**: Identify the different types of content you need to manage (e.g., blog posts, products, pages).
- **Collections**: Decide whether to use [entry collections](https://sveltiacms.app/en/docs/collections/entries) (for multiple similar items) or [file collections](https://sveltiacms.app/en/docs/collections/files) (for individual files) based on your content types.
- **Fields**: Define the fields required for each content type, including their data types and validation rules.
- **Relationships**: Determine if there are any relationships between different content types that need to be represented (e.g., authors for blog posts, categories for products).

### Tips for Designing Content Models

Some best practices for designing effective content models in Sveltia CMS include:

- **Plan ahead**: Take the time to think through your content structure before creating collections and fields. This will help avoid unnecessary changes later.
- **Keep it simple**: Start with a basic structure and expand as needed. Avoid overcomplicating your content model.
- **Use meaningful names**: Choose clear and descriptive names for collections and fields to make it easier to understand.
- **Leverage field types**: Utilize the [various field types](https://sveltiacms.app/en/docs/fields#field-types) available in Sveltia CMS to capture different kinds of data effectively.
- **Plan for scalability**: Consider how your content model may need to evolve over time and design it to accommodate future changes.
- **Test and iterate**: Regularly review and refine your content model based on feedback from content editors and users.

### Using Relations Between Collections

Sveltia CMS supports [Relation fields](https://sveltiacms.app/en/docs/fields/relation) that allow you to create relationships between different collections. This is useful for linking related content items, such as associating blog posts with authors or products with categories.

When using relations, consider the following:

- **Cardinality**: Decide whether the relationship is one-to-one, one-to-many, or many-to-many, and configure the Relation field accordingly.
- **Performance**: Be mindful of the potential performance implications of complex relationships, especially with large datasets.
- **User experience**: Ensure that the relationship is intuitive for content editors, providing clear labels and options in the CMS interface.

### Examples of Content Models

Here are some common content models for different types of websites and applications, along with suggestions on how to structure your collections and fields.

#### Blog or News Site

- **Posts**: [entry collection](https://sveltiacms.app/en/docs/collections/entries) for blog posts or news articles, with fields: title (String, required), body (RichText, required), author (Relation), date (DateTime, required), tags (Relation), status (Select: draft/published/archived), featured_image (Image), and excerpt (Text). Organized by date with draft/published workflow.
- **Tags**: entry collection for managing available tags, linked to posts via a Relation field. For more details, see our [how-to](https://sveltiacms.app/en/docs/how-tos#using-entry-tags-for-categorization) on this topic.
- **Authors**: entry collection for managing the list of authors, with fields: name (String, required), bio (RichText), photo (Image), and email (String), linked to posts via a Relation field.
- **Pages**: [file collection](https://sveltiacms.app/en/docs/collections/files) for static pages like About or Contact.

#### Documentation Site

- **Documents**: [entry collection](https://sveltiacms.app/en/docs/collections/entries) for documentation pages, with fields: title (String, required), body (RichText, required), version (Relation), sidebar_position (Number), published (Boolean), and search_keywords (String, optional), linked to versions via a Relation field.
- **Versions**: entry collection for managing available versions (e.g., v1.0, v2.0), linked to documentation pages via a Relation field.
- **Categories**: entry collection for organizing documentation by category, with fields: name (String, required), slug (String, required), and order (Number), linked to documents via a Relation field.
- **Tutorials**: entry collection for step-by-step tutorials and guides, with fields: title (String, required), content (RichText, required), difficulty (Select: beginner/intermediate/advanced), estimated_time (Number), and published (Boolean), linked to the Tutorials page via a Relation field.
- **Pages**: [file collection](https://sveltiacms.app/en/docs/collections/files) for static pages like Getting Started or FAQ.

#### Portfolio Site

- **Portfolio items**: [entry collection](https://sveltiacms.app/en/docs/collections/entries) for portfolio items, with fields: title (String, required), description (RichText), images (List of Images), project_url (String), categories (Relation), skills (Relation), year (Number), and status (Select: in_progress/completed/archived), linked to categories and skills via Relation fields.
- **Categories**: entry collection for managing available categories (e.g., Web Design, Branding, Photography), linked to portfolio items via a Relation field.
- **Skills**: entry collection for managing the list of skills or technologies used (e.g., React, Figma, CSS), linked to portfolio items via a Relation field.
- **Testimonials**: entry collection for client testimonials, with fields: client_name (String, required), testimonial_text (Text, required), company (String), photo (Image), and rating (Select: 1-5 stars), linked to portfolio items via a Relation field.
- **Pages**: [file collection](https://sveltiacms.app/en/docs/collections/files) for static pages like About Me or Services.

#### Corporate Website

- **Pages**: [file collection](https://sveltiacms.app/en/docs/collections/files) for static pages like Home, About Us, Services, and Contact.
- **Services**: [entry collection](https://sveltiacms.app/en/docs/collections/entries) for services offered, with fields: name (String, required), description (RichText, required), icon (Image), price (String), and featured (Boolean).
- **Products**: entry collection for products or offerings, with fields: name (String, required), brand (Relation), description (RichText), price (Number), image (Image), sku (String, required), and in_stock (Boolean).
- **Brands**: entry collection for brand information, with fields: name (String, required), logo (Image), description (RichText), website (String), and featured (Boolean).
- **Clients**: entry collection for client logos or profiles, with fields: name (String, required), logo (Image), website (String), and contact_person (String), linked to testimonials and case studies via Relation fields.
- **Testimonials**: entry collection for client testimonials, with fields: client (Relation, required), testimonial_text (Text, required), contact_person (String, required), photo (Image), and rating (Select: 1-5 stars), linked to clients via a Relation field.
- **Case studies**: entry collection for case studies, with fields: title (String, required), description (RichText), client (Relation, required), images (List of Images), results (RichText), and featured (Boolean), linked to clients via a Relation field.
- **Leadership**: entry collection for team members, with fields: name (String, required), role (String, required), bio (RichText), photo (Image), email (String), and social_links (KeyValue).
- **Locations**: entry collection for office locations, with fields: name (String, required), address (String), city (String), country (String), phone (String), email (String), and map_url (String).
- **Careers**: entry collection for job openings, with fields: job_title (String, required), description (RichText), location (Relation), employment_type (Select: full-time/part-time/contract), and application_url (String).
- **News**: entry collection for news or press releases, with fields: title (String, required), content (RichText), date (DateTime), and published (Boolean).

#### Personal Blog with Static Pages

- **Posts**: [entry collection](https://sveltiacms.app/en/docs/collections/entries) for blog posts, with fields: title (String, required), body (RichText, required), date (DateTime, required), tags (Relation), excerpt (Text), featured_image (Image), published (Boolean), and reading_time (Number, auto-calculated), linked to tags via a Relation field.
- **Tags**: entry collection for managing available tags, linked to posts via a Relation field. For more details, see our [how-to](https://sveltiacms.app/en/docs/how-tos#using-entry-tags-for-categorization) on this topic.
- **Projects**: entry collection for personal projects or side projects, with fields: title (String, required), description (RichText), images (List of Images), url (String), technology (String), and featured (Boolean).
- **Pages**: [file collection](https://sveltiacms.app/en/docs/collections/files) for static pages like About Me and Contact.

#### Event Management Site

- **Events**: [entry collection](https://sveltiacms.app/en/docs/collections/entries) for events, with fields: name (String, required), date (DateTime, required), location (Relation), description (RichText), registration_url (String), capacity (Number), status (Select: upcoming/ongoing/completed/cancelled), and featured (Boolean), linked to categories, locations, and sessions via Relation fields.
- **Categories**: entry collection for event categories (e.g., Conference, Webinar, Workshop), linked to events via a Relation field.
- **Locations**: entry collection for available venues, with fields: name (String, required), address (String), city (String), capacity (Number), and map_url (String), linked to events via a Relation field.
- **Organizers**: entry collection for event organizers, with fields: name (String, required), role (String), bio (RichText), and photo (Image).
- **Speakers**: entry collection for event speakers, with fields: name (String, required), bio (RichText), photo (Image), and website (String).
- **Sessions**: entry collection for event sessions, with fields: title (String, required), speaker (Relation), time (DateTime), duration (Number), room (String), and description (RichText).
- **Sponsors**: entry collection for event sponsors, with fields: name (String, required), logo (Image), website (String), sponsorship_level (Select: bronze/silver/gold/platinum), and featured (Boolean), linked to events via a Relation field.
- **Pages**: [file collection](https://sveltiacms.app/en/docs/collections/files) for static pages like Event Guidelines or FAQ.

#### Music Band Website

- **Albums**: [entry collection](https://sveltiacms.app/en/docs/collections/entries) for albums, with fields: title (String, required), release_date (DateTime), tracklist (Relation), cover_image (Image), description (RichText), genre (Select), and streaming_links (KeyValue), linked to tracks via a Relation field.
- **Tracks**: entry collection for tracks within each album, with fields: title (String, required), duration (Number), audio_url (String), lyrics (RichText, optional), and featured_artist (String), linked to albums via a Relation field.
- **Members**: entry collection for band members, with fields: name (String, required), role (String, required), bio (RichText), photo (Image), and social_links (KeyValue).
- **Tour dates**: entry collection for tour dates, with fields: event_name (String, required), date (DateTime, required), location (Relation), ticket_url (String), and sold_out (Boolean), linked to locations via a Relation field.
- **Locations**: entry collection for available venues, with fields: name (String, required), city (String), country (String), and capacity (Number), linked to tour dates via a Relation field.
- **Media**: entry collection for band media including photos and concert videos, with fields: title (String, required), type (Select: photo/video), files (List of Images or File), date (DateTime), event (String, optional), and featured (Boolean), organized by date with featured media highlighted on the gallery page.
- **Pages**: [file collection](https://sveltiacms.app/en/docs/collections/files) for static pages like About the Band or Contact.

#### Recipe Website

- **Recipes**: [entry collection](https://sveltiacms.app/en/docs/collections/entries) for recipes, with fields: title (String, required), description (RichText), categories (Relation), ingredients (Relation), instructions (RichText, required), cooking_time (Number), prep_time (Number), servings (Number), difficulty (Select: easy/medium/hard), and images (List of Images), linked to categories, ingredients, and chefs via Relation fields.
- **Categories**: entry collection for recipe categories (e.g., Appetizers, Desserts, Main Courses), linked to recipes via a Relation field.
- **Ingredients**: entry collection for available ingredients, with fields: name (String, required), description (RichText, optional), image (Image), and unit (String), linked to recipes via a Relation field.
- **Chefs**: entry collection for chefs, with fields: name (String, required), bio (RichText), specialties (String), photo (Image), and website (String), linked to recipes via a Relation field.
- **Cooking tips**: entry collection for cooking tips, with fields: title (String, required), content (RichText, required), category (Select), and images (List of Images).
- **Pages**: [file collection](https://sveltiacms.app/en/docs/collections/files) for static pages like Cooking Tips or About the Chef.

#### Educational Platform

- **Courses**: [entry collection](https://sveltiacms.app/en/docs/collections/entries) for courses, with fields: title (String, required), description (RichText, required), instructor (Relation, required), categories (Relation), location (Relation, optional), enrollment_link (String), level (Select: beginner/intermediate/advanced), price (Number, optional), status (Select: draft/published/archived), linked to instructors, categories, lessons, and locations via Relation fields.
- **Instructors**: entry collection for instructors, with fields: name (String, required), bio (RichText), photo (Image), email (String), contact_info (KeyValue), and expertise (String), linked to courses and blog posts via Relation fields.
- **Lessons**: entry collection for lessons within each course, with fields: title (String, required), course (Relation, required), content (RichText), resources (List of Strings), order (Number), and video_url (String, optional), linked to courses via a Relation field.
- **Categories**: entry collection for course categories (e.g., Web Development, Design, Business), linked to courses via a Relation field.
- **Locations**: entry collection for available venues (for in-person courses), with fields: name (String), city (String), and address (String), linked to courses via a Relation field.
- **Testimonials**: entry collection for student testimonials, with fields: student_name (String, required), course (Relation), testimonial_text (Text, required), rating (Select: 1-5), and photo (Image, optional).
- **Events**: entry collection for upcoming educational events (workshops, webinars), with fields: title (String, required), date (DateTime, required), description (RichText), registration_url (String), and capacity (Number).
- **Blog posts**: entry collection for educational articles and updates, with fields: title (String, required), body (RichText, required), author (Relation), date (DateTime, required), tags (Relation), published (Boolean), and featured_image (Image), linked to instructors (as authors) and tags via Relation fields.
- **Tags**: entry collection for managing blog post tags, linked to blog posts via a Relation field.
- **Pages**: [file collection](https://sveltiacms.app/en/docs/collections/files) for static pages like About Us or Contact.

#### Nonprofit Organization Site

- **Pages**: [file collection](https://sveltiacms.app/en/docs/collections/files) for static pages like Mission, Programs, Leadership, Donate, and Contact.
- **News**: [entry collection](https://sveltiacms.app/en/docs/collections/entries) for news related to the organization, with fields: title (String, required), content (RichText, required), date (DateTime, required), featured_image (Image), author (String), and published (Boolean).
- **Events**: entry collection for upcoming events, with fields: name (String, required), date (DateTime, required), location (Relation), description (RichText), registration_url (String), and featured (Boolean).
- **Locations**: entry collection for available venues, with fields: name (String, required), address (String), city (String), and capacity (Number), linked to events via a Relation field.
- **Board Members**: entry collection for board members, with fields: name (String, required), role (String, required), bio (RichText), photo (Image), and email (String), linked to the Leadership page via a Relation field.
- **Programs**: entry collection for programs offered by the organization, with fields: name (String, required), description (RichText, required), goals (List of Strings), images (List of Images), budget (Number, optional), and impact (RichText), linked to the Programs page via a Relation field.
- **Volunteer Opportunities**: entry collection for volunteer roles, with fields: title (String, required), description (RichText), requirements (List of Strings), commitment (Select: flexible/regular/one-time), and application_url (String).
- **Success Stories**: entry collection for success stories, with fields: title (String, required), content (RichText, required), featured_image (Image), author (String), date (DateTime), and impact_metric (String).
- **Partners**: entry collection for partner organizations, with fields: name (String, required), description (RichText, optional), logo (Image), website (String), and partnership_type (String).
- **Sponsors**: entry collection for sponsors, with fields: name (String, required), description (RichText, optional), logo (Image), website (String), and sponsorship_level (Select: bronze/silver/gold/platinum).
- **Campaigns**: entry collection for fundraising campaigns, with fields: title (String, required), description (RichText, required), goal_amount (Number), raised_amount (Number, auto-updated), end_date (DateTime, required), images (List of Images), and status (Select: active/completed/paused).

### Real-World Examples

To see how others have structured their content models using Sveltia CMS, check out our [Showcase](https://sveltiacms.app/en/showcase) page. It features a variety of websites using Sveltia CMS. Most of them include a link to their source code, which can provide valuable insights into different content modeling approaches.

Source: https://sveltiacms.app/en/docs/content-modeling
