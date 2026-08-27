---
name: sveltia-cms
description: Set up, configure and debug Sveltia CMS, the Git-based headless CMS that replaces Netlify CMS and Decap CMS. Use when adding a CMS to a static site (Astro, Eleventy, Hugo, Jekyll, Next.js, Nuxt, SvelteKit, VitePress, Zola or any other), writing or reviewing an admin config file (config.yml, config.toml, config.json) with backend, collections, fields or i18n options, migrating from Netlify/Decap/Static CMS, or troubleshooting a CMS admin page that shows a blank screen, fails to authenticate, or reports config validation errors on the login screen. Also use whenever a project contains a config file with a `backend` and `collections` structure, or an admin page loading sveltia-cms.js.
license: MIT
compatibility: Reference material works anywhere. The bundled validator needs Node.js 18+, npm and network access on first run.
metadata:
  authority: Generated from the official documentation at https://sveltiacms.app
  documentation: https://sveltiacms.app
  repository: https://github.com/sveltia/sveltia-cms
---

# Sveltia CMS

Sveltia CMS is a Git-based headless CMS delivered as a single JavaScript bundle from a CDN. It reads and writes content files directly in a Git repository, so there is no database, no server and no build step for the CMS itself.

It is a drop-in replacement for Netlify CMS and Decap CMS: the configuration format is largely compatible, so an existing config usually works after swapping the script tag.

Sveltia CMS is pre-1.0 and ships several times a week. Never state a version number or claim a feature exists from memory — check the configuration schema or the documentation instead.

## Ground rules

1. **Validate every config you write or change.** Run the bundled script before telling the user the configuration is correct. See [Validate the configuration](#validate-the-configuration).
2. **Read the reference file for the area you are working in** before writing options. The table in [Where to look things up](#where-to-look-things-up) maps areas to files. Do not guess option names — the CMS reports unknown options as validation errors on the login screen.
3. **Never invent options.** If an option is not in the reference files or the JSON schema, it does not exist.

## Minimal setup

Two files in a folder named `admin` inside the site's static folder.

`admin/index.html` — this exact content, nothing more:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="robots" content="noindex" />
    <title>Sveltia CMS</title>
  </head>
  <body>
    <script src="https://unpkg.com/@sveltia/cms/dist/sveltia-cms.js"></script>
  </body>
</html>
```

Three mistakes to avoid in that file, all of which break the CMS:

- **Do not add a stylesheet link.** There is no `sveltia-cms.css`. Every style is bundled in the JavaScript file. A `<link rel="stylesheet" href=".../sveltia-cms.css">` tag is a Static CMS artifact and is always wrong here.
- **Do not add `type="module"` to the script tag.** Sveltia CMS is not distributed as an ES module, and the attribute can break the JavaScript API.
- **Do not add a favicon, analytics or any other markup.** Keep the page standalone.

`admin/config.yml`:

```yaml
# yaml-language-server: $schema=https://unpkg.com/@sveltia/cms/schema/sveltia-cms.json

backend:
  name: github
  repo: user/repo

media_folder: /public/media
public_folder: /media

collections:
  - name: posts
    label: Posts
    label_singular: Post
    folder: /content/posts
    fields:
      - { label: Title, name: title, widget: string }
      - { label: Date, name: date, widget: datetime, type: date }
      - { label: Body, name: body, widget: richtext }
```

Always include the schema reference line. It gives the user autocomplete and inline validation in their editor, and it is the single cheapest thing that keeps a config correct over time. Use the form that matches the file format:

| Format | Line to add at the top |
| --- | --- |
| YAML | `# yaml-language-server: $schema=https://unpkg.com/@sveltia/cms/schema/sveltia-cms.json` |
| TOML | `#:schema https://unpkg.com/@sveltia/cms/schema/sveltia-cms.json` |
| JSON | `"$schema": "https://unpkg.com/@sveltia/cms/schema/sveltia-cms.json",` |

### Where the static folder is

Put the `admin` folder inside the framework's static folder, so the page is served at `/admin/`.

| Framework                                        | Static folder       |
| ------------------------------------------------ | ------------------- |
| Eleventy, GitBook, Jekyll                        | `/` (repo root)     |
| Astro, Next.js, Nuxt, Remix, UmiJS, VitePress    | `/public`           |
| Docusaurus, Fresh, Gatsby, Hugo, SvelteKit, Zola | `/static`           |
| Pelican                                          | `/content`          |
| MkDocs, Docsify                                  | `/docs`             |
| Hexo, Slate                                      | `/source`           |
| mdBook                                           | `/src`              |
| VuePress                                         | `/.vuepress/public` |

Check the framework's own documentation if it is not listed. Some frameworks need the folder excluded from content processing — see `references/setup.md`.

## Validate the configuration

```bash
node scripts/validate-config.mjs public/admin/config.yml
```

The script path is relative to this skill's own directory, and the config path is relative to the user's project. With no config path the script searches the usual locations. It validates against the JSON schema published with the current CMS release, and additionally checks for problems the schema cannot express: names containing spaces, dots or asterisks, and the admin page mistakes listed above.

Options: `--version <cms-version>` pins the schema to a release, `--offline` uses the cached schema. The first run installs its dependencies into `~/.cache/sveltia-cms-skill` and needs npm and network access; nothing is added to the user's project.

Exit code 0 means valid, 1 means problems were found, 2 means the check could not run.

A config split across several files with `<link rel="cms-config-url">` can only be validated as a whole, so validate the merged result or each complete file.

## Where to look things up

Read the file that covers the area before writing options. Each is plain Markdown generated from the official documentation.

| Working on | Read |
| --- | --- |
| Installing, framework integration, how the CMS loads | `references/setup.md` |
| Global options, config file formats, output and slug options | `references/config.md` |
| `backend`, OAuth clients, authentication | `references/backends.md` |
| Collection types, file collections, singletons, content modeling | `references/collections.md` |
| Entry collection paths, slugs, sorting, filtering, nested collections | `references/entries.md` |
| Shared field options; String, Text, Number, Boolean, Select, Color | `references/fields.md` |
| List, Object, KeyValue, RichText/Markdown, Code fields | `references/fields-structural.md` |
| Image, File, DateTime, Relation, Compute, UUID, Map fields | `references/fields-other.md` |
| `media_folder`, `public_folder`, internal Git media storage | `references/media.md` |
| Cloudinary, Uploadcare, S3-compatible storage, stock photos | `references/media-external.md` |
| Multilingual content, `i18n` options, translation services | `references/i18n.md` |
| Moving from Netlify CMS, Decap CMS or Static CMS; version upgrades | `references/migration.md` |
| Blank page, auth failures, build errors, CSP, FAQs | `references/troubleshooting.md` |
| Local development, editorial workflow, open authoring, deploy previews | `references/workflows.md` |
| The admin UI editors work in: content library, editor, asset library | `references/admin-ui.md` |
| `CMS.init()`, events, custom field types, file formats | `references/api.md` |
| Custom editor components, preview templates, preview styles | `references/api-customization.md` |

For anything not covered, fetch the live documentation at <https://sveltiacms.app> — the index is at <https://sveltiacms.app/llms.txt> and the full text at <https://sveltiacms.app/llms-full.txt> (large; prefer a specific page).

## Configuration essentials

### Backend

Supported: `github`, `gitlab`, `gitea` (also Forgejo), and `test-repo` for local testing without a repository.

Not supported, unlike Netlify/Decap CMS: **Azure DevOps**, **Bitbucket** and **Git Gateway**. A site using one of those must switch hosting before migrating. `CMS.registerBackend()` is a no-op.

Most setups need an OAuth application registered with the Git host, plus an OAuth client to handle the token exchange. Read `references/backends.md` before configuring one; the required options differ per backend (Gitea, for example, requires `app_id`).

### Collections and fields

- An **entry collection** (`folder`) manages many files of the same shape.
- A **file collection** (`files`) manages a fixed set of individual files.
- A **singleton** manages one standalone file.

Field types are declared with `widget`, the name kept for Netlify/Decap compatibility. The documentation calls them field types. Available: `boolean`, `code`, `color`, `compute`, `datetime`, `file`, `hidden`, `image`, `keyvalue`, `list`, `map`, `markdown`, `number`, `object`, `relation`, `richtext`, `select`, `string`, `text`, `uuid`.

`markdown` is an alias of `richtext`. The Netlify CMS `date` widget does not exist — use `datetime` with `type: date`.

Every `name` — collection, file, field and variable type — must be unique in its scope and must not contain spaces, dots or asterisks. Dots and asterisks are reserved for nested key paths and wildcards. Use nested objects rather than a dotted name.

### Media

`media_folder` is where files are written in the repository; `public_folder` is the path used in the generated content. Both are needed for images to resolve on the built site.

## Common failure modes

Match the symptom, then read the linked section of `references/troubleshooting.md`.

| Symptom | Cause and fix |
| --- | --- |
| Blank admin page on Cloudflare | Rocket Loader interferes with the bundle. Add `data-cfasync="false"` to the script tag. |
| Blank page, or a stylesheet 404 | A `sveltia-cms.css` link or `type="module"` on the script tag. Remove both. |
| "Authentication Aborted" on sign-in | A `Cross-Origin-Opener-Policy` header breaks the OAuth popup. Use `same-origin-allow-popups`; for GitLab remove the header entirely. |
| Config validation errors on the login screen | Unknown options, or a `name` with a space, dot or asterisk. Run the validator. |
| Broken or unstyled CMS UI | The admin page uses a framework layout. Apply a blank layout; Tailwind in particular conflicts. |
| Astro build fails on content schema validation | Set `omit_empty_optional_fields: true` so empty optional fields are dropped from the output. |
| Build fails on special characters in image paths | Set `encode_file_path: true`. |
| Jekyll or CI build fails on slugs | Set the global slug `encoding: ascii`, and `maxlength` if slugs are too long. |
| API errors behind Nginx or Apache (Gitea) | The reverse proxy double-encodes path characters. Fix the proxy's URL encoding. |

## Migrating from Netlify CMS or Decap CMS

The configuration is largely compatible. Replace the CMS script tag with the Sveltia CMS one and remove any stylesheet link. Then check `references/migration.md` for the differences that matter: unsupported backends, removed options, and behavior changes. Do not assume a Netlify/Decap option still exists — validate the config after switching.

## Testing a setup

Use the local development workflow rather than deploying to check a config: it runs against local files and surfaces validation errors immediately. See `references/workflows.md`.

The `test-repo` backend runs the CMS with no repository at all, which is useful for confirming a config loads before the OAuth setup exists.
