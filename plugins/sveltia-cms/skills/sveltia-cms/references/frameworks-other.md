# Framework Guides: Hugo, Jekyll, Middleman, MkDocs and Zola

Setting up Sveltia CMS with static site generators written in Go, Ruby, Python and Rust: where the admin page goes and example collections. For JavaScript frameworks, see `frameworks-js.md`.

Generated from the Sveltia CMS documentation. Do not edit by hand.

## Hugo Integration Guide

This guide provides resources and information for integrating Sveltia CMS with [Hugo](https://gohugo.io/), a popular static site generator.

### Starter Templates

Here are some starter templates built by the community using Hugo:

- [Hugo module](https://github.com/privatemaker/headless-cms) by [privatemaker](https://github.com/privatemaker)
- [Hugolify](https://www.hugolify.io/) by [sebousan](https://github.com/sebousan)

**Disclaimer**

These third-party resources are not necessarily reviewed by the Sveltia CMS team. We are not responsible for their maintenance or support. Please contact the respective authors for any issues or questions.

### Examples

See real-world examples of Hugo integrations in our [Showcase](https://sveltiacms.app/en/showcase?framework=hugo). Most of the listed sites include links to their source code, so you can explore how they implemented Sveltia CMS with Hugo.

### Setup

#### Adding the Admin Page

Hugo serves static files from the [`static` folder](https://gohugo.io/getting-started/directory-structure/). Create `static/admin/index.html` and `static/admin/config.yml` as described in the [Getting Started](https://sveltiacms.app/en/docs/start#manual-installation) guide. The admin page is then available at `/admin/` on the development server started with `hugo server` as well as on the built site.

### Configuration

Hugo stores content in the `content` folder, and each subfolder is a [section](https://gohugo.io/content-management/sections/), such as `content/posts`. The following example manages the posts section, storing each post as a [page bundle](https://gohugo.io/content-management/page-bundles/) with its images in the same folder:

```yaml [static/admin/config.yml]
media_folder: static/images
public_folder: /images
collections:
  - name: posts
    label: Posts
    folder: content/posts
    path: '{{slug}}/index'
    media_folder: ''
    public_folder: ''
    create: true
    fields:
      - { name: title, label: Title }
      - { name: date, label: Date, widget: datetime }
      - { name: draft, label: Draft, widget: boolean, default: true }
      - { name: description, label: Description, required: false }
      - { name: tags, label: Tags, widget: list, required: false }
      - { name: body, label: Body, widget: markdown }
```

Some notes on this configuration:

- The `path` option saves a post as `content/posts/my-post/index.md`, and the empty `media_folder` and `public_folder` options store its images in the same folder. See [Using Entry-Relative Folders](https://sveltiacms.app/en/docs/media/internal#using-entry-relative-folders) for details. If you prefer single files like `content/posts/my-post.md`, remove these three options, and images are saved in the `static/images` folder defined at the top level instead.
- Posts with `draft: true` are not published unless Hugo runs with the `--buildDrafts` option. The default value above makes new posts drafts, so editors need to turn the option off to publish them. Alternatively, use the [Editorial Workflow](https://sveltiacms.app/en/docs/workflows/editorial) to review posts before they’re published.
- Hugo supports YAML, TOML and JSON [front matter](https://gohugo.io/content-management/front-matter/). Sveltia CMS detects the format of existing files automatically and saves new files with YAML front matter by default. Set the collection’s [`format`](https://sveltiacms.app/en/docs/collections/entries/formats#format) option to `toml-frontmatter` if your site uses TOML.
- Hugo’s `_index.md` files, which hold the content of section list pages, can be managed along with the regular entries using the [`index_file`](https://sveltiacms.app/en/docs/collections/entries/listings#managing-hugo-s-special-index-file) collection option.

### Support for Hugo

We have implemented specific features to enhance the integration of Sveltia CMS with Hugo:

- [Entry-relative media folders](https://sveltiacms.app/en/docs/media/internal#using-entry-relative-folders): Store media files in folders relative to their associated entries, which is a common practice in Hugo projects called [page bundles](https://gohugo.io/content-management/page-bundles/).
- [Nested entries](https://sveltiacms.app/en/docs/collections/entries/nested): Manage a tree of [sections](https://gohugo.io/content-management/sections/) as a folder tree in the sidebar, where each entry is stored as an `_index.md` file in its own folder and can be moved along with its children.
- [Entry redirects](https://sveltiacms.app/en/docs/collections/entries/previews#redirects): Out-of-the-box support for Hugo’s [`aliases` front matter property](https://gohugo.io/content-management/urls/#aliases), which is updated when the entry slug is changed in Sveltia CMS.
- [Permalinks](https://sveltiacms.app/en/docs/collections/entries/previews#permalinks): Set the `permalink_field` option to `url` to fill Hugo’s [`url` front matter property](https://gohugo.io/content-management/urls/#url) from the `preview_path` option each time an entry is saved.
- [Manual entry reordering](https://sveltiacms.app/en/docs/collections/entries/operations#reordering-entries): Use the `reorder` option to add the [`weight` property](https://gohugo.io/methods/page/weight/) to entries for controlling their order in Hugo.
- [Index file inclusion](https://sveltiacms.app/en/docs/collections/entries/listings#managing-hugo-s-special-index-file): Manage Hugo’s [special `_index.md` files](https://gohugo.io/content-management/organization/#index-pages-_indexmd) for section entries.
- [Translation by content directory](https://sveltiacms.app/en/docs/i18n/structures#custom-locale-folder-placement): Put the `{{locale}}` placeholder in a collection’s `folder` option, e.g. `content/{{locale}}/posts`, to match a [multilingual Hugo site](https://gohugo.io/content-management/multilingual/#translation-by-content-directory) with a `contentDir` per language, section index files included.
- [Localizing entry slugs](https://sveltiacms.app/en/docs/i18n/slugs#localizing-entry-slugs): Generate localized slugs for [multilingual Hugo sites](https://gohugo.io/content-management/multilingual/) using the `translationKey` property of entries.
- [Editor components](https://sveltiacms.app/en/docs/api/editor-components#examples): Examples of custom components that insert Hugo [shortcodes](https://gohugo.io/content-management/shortcodes/) into Markdown content, such as an image with a caption and a YouTube embed.
- [Time formatting](https://sveltiacms.app/en/docs/data-output#general-conventions): A standard time is saved as `HH:mm:ss` instead of `HH:mm` for compatibility with Hugo.

Source: https://sveltiacms.app/en/docs/frameworks/hugo

---

## Jekyll Integration Guide

This guide provides resources and information for integrating Sveltia CMS with [Jekyll](https://jekyllrb.com/), a popular static site generator.

### Starter Templates

Here are some starter templates built by the community using Jekyll:

- [Jekyll Blades](https://github.com/anyblades/jekyll-blades) by [anyblades](https://github.com/anyblades)

**Disclaimer**

These third-party resources are not necessarily reviewed by the Sveltia CMS team. We are not responsible for their maintenance or support. Please contact the respective authors for any issues or questions.

### Examples

See real-world examples of Jekyll integrations in our [Showcase](https://sveltiacms.app/en/showcase?framework=jekyll). Most of the listed sites include links to their source code, so you can explore how they implemented Sveltia CMS with Jekyll.

### Setup

#### Adding the Admin Page

Jekyll copies any file without front matter to the generated site as is, so the admin folder can be placed in the root of your project.

Create `admin/index.html` and `admin/config.yml` as described in the [Getting Started](https://sveltiacms.app/en/docs/start#manual-installation) guide. Make sure the `admin` folder is not listed in the [`exclude`](https://jekyllrb.com/docs/configuration/options/) option of `_config.yml`. The admin page is then available at `/admin/` on the development server started with `jekyll serve` as well as on the built site.

### Configuration

#### Blog Posts

Jekyll requires [posts](https://jekyllrb.com/docs/posts/) in the `_posts` folder to be named `YEAR-MONTH-DAY-title.MARKUP`, such as `2026-10-01-hello-world.md`. Files that don’t follow this pattern are ignored. To create matching filenames, add the date to the [entry slug](https://sveltiacms.app/en/docs/collections/entries/slugs#defining-entry-slugs). The following example builds the date prefix from a DateTime field named `date` with the [`date` transformation](https://sveltiacms.app/en/docs/string-transformations#date):

```yaml [admin/config.yml]
media_folder: assets/images
public_folder: /assets/images
collections:
  - name: posts
    label: Posts
    folder: _posts
    slug: "{{date | date('YYYY-MM-DD')}}-{{slug}}"
    create: true
    fields:
      - { name: layout, label: Layout, widget: hidden, default: post }
      - { name: title, label: Title }
      - { name: date, label: Date, widget: datetime, default: '{{now}}' }
      - { name: categories, label: Categories, widget: list, required: false }
      - { name: tags, label: Tags, widget: list, required: false }
      - { name: body, label: Body, widget: markdown }
```

The `{{year}}-{{month}}-{{day}}-{{slug}}` template also takes the date from the `date` field, but [in UTC by default](https://sveltiacms.app/en/docs/collections/entries/slugs#slug-template-tags), which can be a day off from the date shown in the field. If you don’t need a `date` field, that template creates the prefix from the date the post is first saved instead.

The Hidden field adds `layout: post` to every new post without showing it in the Content Editor. You can remove it if you set the default layout with [front matter defaults](https://jekyllrb.com/docs/configuration/front-matter-defaults/) in `_config.yml`.

**Changing the Date of a Saved Post**

The filename is set when a post is first saved. If an editor changes the date of an existing post later, the `date` property in the front matter takes precedence. However, the filename and the post URL derived from it keep the original date.

To keep them in sync, update the date in the slug from the [Slug panel](https://sveltiacms.app/en/docs/ui/content-editor#slug-panel), which renames the file. Since Jekyll’s default post URLs include the date, consider setting up [entry redirects](https://sveltiacms.app/en/docs/collections/entries/previews#customizing-the-redirect-property) with the `jekyll-redirect-from` plugin so the old URL keeps working.

#### Drafts

[Drafts](https://jekyllrb.com/docs/posts/#drafts) are stored in the `_drafts` folder without a date in the filename and are only built with the `--drafts` option. If you want editors to manage drafts, add another collection with `folder: _drafts` and the default slug. To publish a draft, you need to move the file to `_posts` with a date prefix outside the CMS. Alternatively, use the [Editorial Workflow](https://sveltiacms.app/en/docs/workflows/editorial) to review posts before they’re published.

#### Data Files

[Data files](https://jekyllrb.com/docs/datafiles/) in the `_data` folder can be managed with a [file collection](https://sveltiacms.app/en/docs/collections/files). A data file whose top level is a list, such as `_data/members.yml`, can be edited with a [top-level List field](https://sveltiacms.app/en/docs/fields/list#top-level-list).

### Support for Jekyll

We have implemented specific features to enhance the integration of Sveltia CMS with Jekyll:

- [ASCII slugs](https://sveltiacms.app/en/docs/collections/entries/slugs#global-slug-options): Set the `encoding` slug option to `ascii` to transliterate non-ASCII characters, which can otherwise break Jekyll builds. ([Discussion](https://github.com/sveltia/sveltia-cms/discussions/544))
- [Nested entries](https://sveltiacms.app/en/docs/collections/entries/nested): Manage a folder tree of [pages](https://jekyllrb.com/docs/pages/) in the sidebar with the `subfolders: false` mode, where every file is a page at its own path and editors can create new folders as needed.
- [Entry redirects](https://sveltiacms.app/en/docs/collections/entries/previews#customizing-the-redirect-property): Use the `aliases_field` option to store previous paths in the `redirect_from` property expected by the [`jekyll-redirect-from`](https://github.com/jekyll/jekyll-redirect-from) plugin, which is updated when the entry slug is changed in Sveltia CMS.
- [Permalinks](https://sveltiacms.app/en/docs/collections/entries/previews#permalinks): Set the `permalink_field` option to `true` to fill Jekyll’s [`permalink` front matter property](https://jekyllrb.com/docs/permalinks/) from the `preview_path` option each time an entry is saved.
- [Top-level List field](https://sveltiacms.app/en/docs/fields/list#top-level-list): Use the `root` option to edit a [data file](https://jekyllrb.com/docs/datafiles/) whose top level is a list, such as a list of members.
- [Localizing entry slugs](https://sveltiacms.app/en/docs/i18n/slugs#localizing-entry-slugs): Generate localized slugs for multilingual Jekyll sites, using the `ref` property as the canonical slug key.

Source: https://sveltiacms.app/en/docs/frameworks/jekyll

---

## Middleman Integration Guide

This guide provides resources and information for integrating Sveltia CMS with [Middleman](https://middlemanapp.com/), a static site generator using Ruby.

### Examples

See real-world examples of Middleman integrations in our [Showcase](https://sveltiacms.app/en/showcase?framework=middleman). Most of the listed sites include links to their source code, so you can explore how they implemented Sveltia CMS with Middleman.

### Setup

#### Adding the Admin Page

All the files that make up a Middleman site live in the [`source` folder](https://middlemanapp.com/basics/directory-structure/). Create `source/admin/index.html` and `source/admin/config.yml` as described in the [Getting Started](https://sveltiacms.app/en/docs/start#manual-installation) guide.

Middleman applies the site [layout](https://middlemanapp.com/basics/layouts/) to every HTML file in the `source` folder, which would break the admin page. Turn off the layout for the admin folder in `config.rb`:

```ruby [config.rb]
page '/admin/*', layout: false
```

The admin page is then available at `/admin/` on the development server started with `middleman server` as well as on the built site.

### Configuration

Blog posts are usually managed with the [middleman-blog](https://middlemanapp.com/basics/blogging/) extension. Its `sources` option defines the filename pattern for posts, which includes the post date by default:

```ruby [config.rb]
activate :blog do |blog|
  blog.prefix = 'blog'
  blog.sources = '{year}-{month}-{day}-{title}.html'
end
```

With this configuration, posts are stored in `source/blog` with names like `2026-10-01-hello-world.html.md`. The matching Sveltia CMS entry collection needs three options to follow the pattern:

- `slug` creates the date prefix from the [slug template tags](https://sveltiacms.app/en/docs/collections/entries/slugs#slug-template-tags) `{{year}}`, `{{month}}` and `{{day}}`, which are based on the date the post is first saved.
- `extension` is set to `html.md`, because Middleman uses the double extension to determine the output format (`html`) and the template engine (Markdown).
- `format` is set to `frontmatter` so the files are read as Markdown with front matter despite the custom extension.

```yaml [source/admin/config.yml]
media_folder: source/images/uploads
public_folder: /images/uploads
collections:
  - name: blog
    label: Blog
    folder: source/blog
    slug: '{{year}}-{{month}}-{{day}}-{{slug}}'
    extension: html.md
    format: frontmatter
    create: true
    fields:
      - { name: title, label: Title }
      - { name: tags, label: Tags, widget: list, required: false }
      - { name: published, label: Published, widget: boolean, default: true }
      - { name: body, label: Body, widget: markdown }
```

`title` is the only required front matter property in middleman-blog, and posts with `published: false` are treated as drafts that only appear on the development server.

The post date is taken from the filename. If you also want editors to set the date, add a DateTime field named `date`. The date tags then follow the selected date instead of the save date, but [in UTC by default](https://sveltiacms.app/en/docs/collections/entries/slugs#slug-template-tags), which can be a day off from the date in the front matter. To keep the date as selected, build the slug from the field with the [`date` transformation](https://sveltiacms.app/en/docs/string-transformations#date):

```yaml
slug: "{{date | date('YYYY-MM-DD')}}-{{slug}}"
```

Keep in mind that middleman-blog stops the build if the date in the front matter doesn’t match the one in the filename. The filename is set when a post is first saved. If an editor changes the date of an existing post, they also need to update the date in the slug from the [Slug panel](https://sveltiacms.app/en/docs/ui/content-editor#slug-panel), which renames the file.

Source: https://sveltiacms.app/en/docs/frameworks/middleman

---

## MkDocs Integration Guide

This guide provides resources and information for integrating Sveltia CMS with [MkDocs](https://www.mkdocs.org/), a Python-based static site generator for project documentation. Many MkDocs sites use the [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/) theme, which this guide also covers.

### Examples

See real-world examples of MkDocs integrations in our [Showcase](https://sveltiacms.app/en/showcase?framework=mkdocs). Most of the listed sites include links to their source code, so you can explore how they implemented Sveltia CMS with MkDocs.

### Setup

#### Adding the Admin Page

MkDocs copies every file in the [`docs` folder](https://www.mkdocs.org/user-guide/configuration/#docs_dir) that isn’t Markdown to the built site [unaltered](https://www.mkdocs.org/user-guide/writing-your-docs/#file-layout). Create `docs/admin/index.html` and `docs/admin/config.yml` as described in the [Getting Started](https://sveltiacms.app/en/docs/start#manual-installation) guide. The admin page is then available at `/admin/` on the development server started with `mkdocs serve` as well as on the built site.

If you changed the `docs_dir` option in `mkdocs.yml`, put the `admin` folder in that folder instead.

Keep Markdown files out of the `admin` folder, because MkDocs renders them as pages. A `README.md` file there conflicts with `index.html`, so MkDocs leaves it out of the site with a warning.

#### Linking to the Admin Page

Link to the admin page with a relative path to its `index.html` file, as you would link to any other file in the `docs` folder. The path is relative to the Markdown file, so from `docs/guide/setup.md`, for example, the link looks like this:

```md [docs/guide/setup.md]
[Edit content](../admin/index.html)
```

MkDocs checks the link and [converts it](https://www.mkdocs.org/user-guide/writing-your-docs/#linking-to-pages) to a URL relative to the page, such as `../../admin/`. Unlike a link to `/admin/`, it keeps working when the site is served from a subfolder, e.g. a GitHub Pages project site at `https://username.github.io/repo/`.

Material for MkDocs’ [instant loading](https://squidfunk.github.io/mkdocs-material/setup/setting-up-navigation/#instant-loading) feature only handles links to the pages listed in the site’s sitemap. The admin page isn’t listed there, so the link opens it as a regular page.

### Configuration

#### Pages

Every Markdown file in the `docs` folder becomes a page at its own path. A collection of [nested entries](https://sveltiacms.app/en/docs/collections/entries/nested) in the `subfolders: false` mode manages this structure as a folder tree:

```yaml [docs/admin/config.yml]
media_folder: docs/assets/images
public_folder: /assets/images
collections:
  - name: pages
    label: Pages
    label_singular: Page
    folder: docs
    create: true
    nested:
      subfolders: false
    meta: { path: {} }
    fields:
      - { name: title, label: Title }
      - { name: description, label: Description, required: false }
      - { name: body, label: Body, widget: markdown }
```

The `title` field corresponds to the [`title` meta-data](https://www.mkdocs.org/user-guide/writing-your-docs/#meta-data) option. MkDocs can take the page title from the first heading instead. However, the `title` field is required here, because Sveltia CMS uses it to generate the filename of a new page. The `description` field sets the [page description](https://squidfunk.github.io/mkdocs-material/reference/#setting-the-page-description) in Material for MkDocs.

##### Navigation

If `mkdocs.yml` has no [`nav`](https://www.mkdocs.org/user-guide/configuration/#nav) option, MkDocs builds the navigation from all the Markdown files, sorted alphanumerically and nested by folder. A page created in the CMS then appears in the navigation automatically.

If you define the `nav` option, a page that isn’t listed in it is still built, but it’s not linked from the navigation. Someone has to add every new page to `mkdocs.yml` outside the CMS, so consider leaving out the `nav` option if editors create pages.

##### Images

MkDocs leaves [absolute paths](https://www.mkdocs.org/user-guide/configuration/#validation-of-absolute-links) like `/assets/images/photo.jpg` as is, which breaks images when the site is served from a subfolder. Since MkDocs 1.6, the `relative_to_docs` validation option makes MkDocs resolve such paths against the `docs` folder, check them and convert them to relative paths:

```yaml [mkdocs.yml]
validation:
  links:
    absolute_links: relative_to_docs
```

With this option, the global `media_folder` and `public_folder` options in the example above work wherever the site is served from.

#### Blog Posts

Material for MkDocs comes with a [blog plugin](https://squidfunk.github.io/mkdocs-material/plugins/blog/), which reads posts from the `docs/blog/posts` folder. Enable it in `mkdocs.yml`, and create `docs/blog/index.md` for the blog’s index page:

```yaml [mkdocs.yml]
plugins:
  - blog
```

The following collection manages the posts. Images inserted into a post are stored in the `images` folder next to the posts. MkDocs resolves their relative paths against each post file, so they work wherever the post is published:

```yaml [docs/admin/config.yml]
collections:
  - name: posts
    label: Blog Posts
    label_singular: Blog Post
    folder: docs/blog/posts
    create: true
    media_folder: images
    public_folder: images
    fields:
      - { name: title, label: Title }
      - { name: date, label: Date, widget: datetime, default: '{{now}}' }
      - { name: description, label: Description, required: false }
      - { name: categories, label: Categories, widget: list, required: false }
      - { name: draft, label: Draft, widget: boolean, required: false }
      - { name: body, label: Body, widget: markdown }
```

Some notes on the fields:

- The [`date`](https://squidfunk.github.io/mkdocs-material/plugins/blog/#meta.date) property is required, and the build fails without it. For a date without a time, add the [`type: date`](https://sveltiacms.app/en/docs/fields/datetime#type) option. Avoid the `format` option: a custom format like `DD/MM/YYYY` isn’t read as a date in YAML, so the plugin rejects it.
- [Categories](https://squidfunk.github.io/mkdocs-material/plugins/blog/#meta.categories) are free-form strings. If you limit them with the [`categories_allowed`](https://squidfunk.github.io/mkdocs-material/plugins/blog/#config.categories_allowed) plugin option, use a Select field with the same values as `options` and `multiple: true` instead of a List field.
- [Authors](https://squidfunk.github.io/mkdocs-material/plugins/blog/#meta.authors) are defined in the `docs/blog/.authors.yml` file, and the front matter refers to them by key, such as `authors: [jane]`. Since the file is a map keyed by author, it can’t be edited easily in the CMS. However, a Select field with the keys as `options` and `multiple: true` lets editors pick authors from the list.

The `pages` collection in the [previous section](#pages) also covers the `docs/blog/posts` folder. Each file belongs to the collection with the deepest matching folder, so the posts only appear in the `posts` collection.

### Support for MkDocs

We have implemented specific features to enhance the integration of Sveltia CMS with MkDocs:

- If an entry collection has only a Markdown `body` field, the [slug](https://sveltiacms.app/en/docs/collections/entries/slugs#entry-slugs) and [summary](https://sveltiacms.app/en/docs/collections/entries/listings#summaries) of the entries will be generated from a header in the Markdown content, if one exists. ([Discussion](https://github.com/sveltia/sveltia-cms/issues/230))
- [Nested entries](https://sveltiacms.app/en/docs/collections/entries/nested): Manage a [docs folder tree](https://www.mkdocs.org/user-guide/writing-your-docs/#file-layout) in the sidebar with the `subfolders: false` mode, where every file is a page at its own path and editors can create new folders as needed.

Source: https://sveltiacms.app/en/docs/frameworks/mkdocs

---

## Zola Integration Guide

This guide provides resources and information for integrating Sveltia CMS with [Zola](https://www.getzola.org/), a fast static site generator written in Rust.

### Starter Templates

Here are some starter templates built by the community using Zola:

- [Zola Sveltia Source](https://github.com/unicornfantasian/zola-sveltia-source) by [husenunicorn](https://github.com/husenunicorn)

**Disclaimer**

These third-party resources are not necessarily reviewed by the Sveltia CMS team. We are not responsible for their maintenance or support. Please contact the respective authors for any issues or questions.

### Examples

See real-world examples of Zola integrations in our [Showcase](https://sveltiacms.app/en/showcase?framework=zola). Most of the listed sites include links to their source code, so you can explore how they implemented Sveltia CMS with Zola.

### Setup

#### Adding the Admin Page

Zola serves static files from the [`static` folder](https://www.getzola.org/documentation/getting-started/directory-structure/#static). Create `static/admin/index.html` and `static/admin/config.yml` as described in the [Getting Started](https://sveltiacms.app/en/docs/start#manual-installation) guide. The admin page is then available at `/admin/` on the development server started with `zola serve` as well as on the built site.

### Configuration

Zola stores content in the `content` folder, where each subfolder with an `_index.md` file is a [section](https://www.getzola.org/documentation/content/section/), and the other Markdown files in it are [pages](https://www.getzola.org/documentation/content/page/). The following example manages the pages of a blog section in `content/blog`:

```yaml [static/admin/config.yml]
media_folder: static/images
public_folder: /images
collections:
  - name: blog
    label: Blog
    folder: content/blog
    format: toml-frontmatter
    create: true
    fields:
      - { name: title, label: Title }
      - { name: date, label: Date, widget: datetime, type: date }
      - { name: description, label: Description, required: false }
      - { name: draft, label: Draft, widget: boolean, default: false }
      - name: taxonomies
        label: Taxonomies
        widget: object
        fields:
          - { name: tags, label: Tags, widget: list, required: false }
      - name: extra
        label: Extra
        widget: object
        required: false
        fields:
          - { name: image, label: Image, widget: image, required: false }
      - { name: body, label: Body, widget: markdown }
```

Some notes on this configuration:

- Zola’s [front matter](https://www.getzola.org/documentation/content/page/#front-matter) is usually written in TOML with `+++` delimiters, so the `format` option is set to `toml-frontmatter`. YAML front matter is also supported by Zola, in which case the option can be omitted.
- Zola accepts a `date` in the `YYYY-MM-DD` or RFC 3339 format. The `type: date` option of the DateTime field saves a date without time. If you need the time as well, remove the `type` option and add `output_utc: true` so the value is saved with a timezone, as required by RFC 3339.
- Taxonomy terms like tags are stored in the `taxonomies` table, using the taxonomy names defined in `zola.toml`, so an [Object](https://sveltiacms.app/en/docs/fields/object) field is used to group them. Custom properties go in the `extra` table in the same way.
- The section’s own `_index.md` file is not part of this collection. You can manage it with the [`index_file`](https://sveltiacms.app/en/docs/collections/entries/listings#managing-hugo-s-special-index-file) collection option or a [file collection](https://sveltiacms.app/en/docs/collections/files).

### Support for Zola

We have implemented specific features to enhance the integration of Sveltia CMS with Zola:

- [Entry-relative media folders](https://sveltiacms.app/en/docs/media/internal#using-entry-relative-folders): Store media files in folders relative to their associated entries, following Zola’s [asset colocation](https://www.getzola.org/documentation/content/overview/#asset-colocation) convention.
- [Nested entries](https://sveltiacms.app/en/docs/collections/entries/nested): Manage a tree of [sections](https://www.getzola.org/documentation/content/section/) as a folder tree in the sidebar, where each entry is stored as an `_index.md` file in its own folder and can be moved along with its children.
- [Entry redirects](https://sveltiacms.app/en/docs/collections/entries/previews#redirects): Out-of-the-box support for Zola’s [`aliases` front matter property](https://www.getzola.org/documentation/content/page/#front-matter), which is updated when the entry slug is changed in Sveltia CMS.
- [Permalinks](https://sveltiacms.app/en/docs/collections/entries/previews#permalinks): Set the `permalink_field` option to `path` to fill Zola’s [`path` front matter property](https://www.getzola.org/documentation/content/page/#front-matter) from the `preview_path` option each time an entry is saved.
- [Manual entry reordering](https://sveltiacms.app/en/docs/collections/entries/operations#reordering-entries): Use the `reorder` option to add the [`weight` property](https://www.getzola.org/documentation/content/section/#weight) to entries for controlling their order in Zola.
- The [`value_type`](https://sveltiacms.app/en/docs/fields/number#value-type) Number field option supports `int/string` and `float/string` value types, which are useful for Zola sites that store numbers as strings in front matter. ([Discussion](https://github.com/sveltia/sveltia-cms/issues/574))
- The [`omit_default_locale_from_file_path`](https://sveltiacms.app/en/docs/i18n/options#top-level-configuration) i18n option allows omitting the locale suffix from filenames for entries in the default locale, which is useful for [multilingual Zola sites](https://www.getzola.org/documentation/content/multilingual/). ([Discussion](https://github.com/sveltia/sveltia-cms/discussions/394))

Source: https://sveltiacms.app/en/docs/frameworks/zola
