# Installation and Framework Setup

How to install Sveltia CMS, how it loads, and the list of framework guides. For a specific framework, see `frameworks-js.md` or `frameworks-other.md`.

Generated from the Sveltia CMS documentation. Do not edit by hand.

## Getting Started

This guide will help you get Sveltia CMS up and running in your project. Follow the steps below to install, configure, test, and deploy Sveltia CMS.

Already using **Netlify CMS**, **Decap CMS**, **Static CMS** or **Pages CMS**? Check out the [Migration Guides](https://sveltiacms.app/en/docs/migration) for specific instructions.

**Stable Version Not Yet Available**

Sveltia CMS is still in beta. Although it’s already being used in production by [many users](https://sveltiacms.app/en/showcase), there might still be breaking changes before the stable 1.0 release. We recommend keeping an eye on the [release information](https://sveltiacms.app/en/docs/releases#release-information) for any updates.

### 1. Install

You can use either a starter template or manually install Sveltia CMS into your existing project.

#### Starter Templates

While we don’t have official starter templates yet, the community has created several templates for popular frameworks. Here are some you can try:

##### Astro

- [Astros](https://github.com/majesticooss/astros) by [zanhk](https://github.com/zanhk)
- [Astro i18n Starter](https://github.com/yacosta738/astro-cms) by [yacosta738](https://github.com/yacosta738)
- [astro-sveltia-cms](https://github.com/knolljo/astro-sveltia-cms) by [knolljo](https://github.com/knolljo)

##### Eleventy

- [Eleventy starter template](https://github.com/danurbanowicz/eleventy-sveltia-cms-starter) by [danurbanowicz](https://github.com/danurbanowicz)
- [ZeroPoint](https://getzeropoint.com/) by [MWDelaney](https://github.com/MWDelaney)
- [Huwindty](https://github.com/aloxe/huwindty) by [aloxe](https://github.com/aloxe)
- [One Starter](https://github.com/buildawesome-one/starter) by [buildawesome-one](https://github.com/buildawesome-one)

##### HonoX

- [HonoX + PandaCSS + Sveltia CMS Starter](https://github.com/Chen-Software/honox-cms) by [yumin-chen](https://github.com/yumin-chen)

##### Hugo

- [Hugo module](https://github.com/privatemaker/headless-cms) by [privatemaker](https://github.com/privatemaker)
- [Hugolify](https://www.hugolify.io/) by [sebousan](https://github.com/sebousan)

##### Jekyll

- [Jekyll Blades](https://github.com/anyblades/jekyll-blades) by [anyblades](https://github.com/anyblades)

##### Zola

- [Zola Sveltia Source](https://github.com/unicornfantasian/zola-sveltia-source) by [husenunicorn](https://github.com/husenunicorn)

##### Other Frameworks

The Netlify/Decap CMS website has more [templates](https://decapcms.org/docs/start-with-a-template/) and [examples](https://decapcms.org/docs/examples/). You can probably use one of them and [replace the CMS script](https://sveltiacms.app/en/docs/migration/netlify-decap-cms#switching-to-sveltia-cms) since they are largely compatible.

**Disclaimer**

These third-party resources are not necessarily reviewed by the Sveltia CMS team. We are not responsible for their maintenance or support. Please contact the respective authors for any issues or questions.

#### Manual Installation

Even without a starter template, you can easily add Sveltia CMS to your existing project. Follow the steps below to set it up.

Sveltia CMS requires a static files folder to serve the admin interface, configuration file, and media assets. First, you need to identify or create your static files folder. This folder is typically named `public` or `static`, depending on your framework or static site generator. If the static folder does not exist, create it in the root of your project.

**Common static folder names**

Here’s a quick reference for various frameworks:

| Framework / SSG | Static Folder Name |
| --- | --- |
| Eleventy, Jekyll, Lume | `/` (root) |
| Pelican, Quartz | `/content` |
| Docsify, MkDocs | `/docs` |
| Rspress, VitePress | `/docs/public`¹ |
| Nikola | `/files` |
| Angular, Astro, Fumadocs, HonoX, Next.js, Nextra, Nuxt, Qwik, React Router (Remix), SolidStart, TanStack Start, UmiJS, Vite | `/public` |
| Hexo, Middleman | `/source` |
| Bridgetown, mdBook | `/src` |
| Analog | `/src/public` |
| Docusaurus, Fresh, Gatsby, Gridsome, Hugo, Nuxt 2, SvelteKit, Zola | `/static` |
| VuePress | `/docs/.vuepress/public`¹ |

¹ The `public` folder is placed under the source folder, which is often named `docs`. If your site’s Markdown files are in the root folder, use `/public` (VitePress) or `/.vuepress/public` (VuePress) instead.

Some frameworks process HTML or YAML files in these folders instead of copying them as is, so the admin folder needs extra configuration:

- **Eleventy**: Add `eleventyConfig.addPassthroughCopy('admin')` to the configuration file. Otherwise, `index.html` is rendered as a template and `config.yml` is not copied at all.
- **Hexo**: Add `skip_render: admin/**` to `_config.yml` so the theme layout is not applied to the admin page.
- **Lume**: Add `site.copy('admin')` to `_config.ts`.
- **Middleman**: Add `page '/admin/*', layout: false` to `config.rb` so the site layout is not applied to the admin page.
- **Pelican**: Add `'admin'` to `STATIC_PATHS`, and to `ARTICLE_EXCLUDES` and `PAGE_EXCLUDES`, so the admin page is copied instead of being read as an article.
- **Sphinx**: Put the admin folder in a folder listed in the `html_extra_path` option, such as `_extra`, so it’s copied to the root of the output folder.

If you’re unsure about your framework’s static files folder, please refer to its official documentation.

Create a folder named `admin` (or any name you prefer) inside your site’s static files folder. Then, under the folder, create an `index.html` file and a `config.yml` file with the following content:

```html [index.html]
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

```yaml [config.yml]
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

The structure should look like this, if the static files folder is named `public`:

```
.
└─ public/           # Static files folder
   └─ admin/         # Admin folder
      ├─ index.html  # CMS interface
      └─ config.yml  # CMS configuration
```

**How It Works**

Sveltia CMS is a single-page application (SPA) distributed as a small JavaScript bundle via a content delivery network (CDN). It’s a unique approach that allows you to quickly set up the CMS without installing any dependencies or build tools. See the [Architecture Overview](https://sveltiacms.app/en/docs/architecture) for more details.

**Common Mistakes**

Some AI agents, namely Claude, include a stylesheet `<link>` tag in Sveltia CMS setups, apparently due to confusion with [Static CMS](https://staticjscms.netlify.app/docs/add-to-your-site-cdn), a now-discontinued fork of Netlify CMS. However, Sveltia CMS does not require any additional CSS files, as all the necessary styles are bundled within the JavaScript file. The link is invalid and can be safely omitted.

```diff
-<link rel="stylesheet" href="https://unpkg.com/@sveltia/cms/dist/sveltia-cms.css" />
```

Similarly, some agents and templates add a `type="module"` attribute to the `<script>` tag, but this is unnecessary for the current version of Sveltia CMS because it’s not distributed as an ES module. Adding the attribute may lead to unexpected behavior when using the [JavaScript API](https://sveltiacms.app/en/docs/api), so it’s best to leave it out.

```diff
-<script src="https://unpkg.com/@sveltia/cms/dist/sveltia-cms.js" type="module"></script>
+<script src="https://unpkg.com/@sveltia/cms/dist/sveltia-cms.js"></script>
```

**Advanced Setup: Using a Package Manager**

You can install Sveltia CMS using a package manager like npm, pnpm, or yarn, instead of using the CDN version, and [manually initialize](https://sveltiacms.app/en/docs/api/initialization) the CMS in your JavaScript code with a custom configuration provided directly. See the [API documentation](https://sveltiacms.app/en/docs/api) for more details.

#### Install YAML Extension for VS Code (Optional)

If you use VS Code as your code editor, it’s recommended to install the [YAML extension](https://marketplace.visualstudio.com/items?itemName=redhat.vscode-yaml). This extension provides syntax highlighting, validation, and autocompletion for YAML files, including the Sveltia CMS configuration file. The `config.yml` file includes a schema reference that the extension can use to provide better support.

#### Set Up AI Tools (Optional)

If you use an AI coding assistant like Claude, GitHub Copilot, Cursor or ChatGPT, we provide an official Agent Skill and `llms.txt` files to help it understand Sveltia CMS. The skill also includes a script that validates your configuration file. See [Working with AI](https://sveltiacms.app/en/docs/working-with-ai) for details.

### 2. Configure

Once you have the basic setup ready, you can customize the configuration file to suit your needs. It allows you to set up various aspects of Sveltia CMS, including backend, media storage, collections, and internationalization.

#### Backend

Choose one of the following Git-based backends for Sveltia CMS:

- [GitHub](https://sveltiacms.app/en/docs/backends/github)
- [GitLab](https://sveltiacms.app/en/docs/backends/gitlab)
- [Gitea/Forgejo](https://sveltiacms.app/en/docs/backends/gitea-forgejo)

In most cases, you will need to register an application with the service provider (e.g. GitHub, GitLab) to obtain OAuth credentials. Follow the instructions in your chosen backend’s guide for more details.

#### Media Storage

You should configure at least one [media storage provider](https://sveltiacms.app/en/docs/media), either internal or external, to manage your media assets such as images and files. Follow the instructions in your chosen storage provider’s guide for more details.

#### Collections

You need to define at least one collection in the configuration file to manage your content. Collections represent different types of content, such as blog posts, pages, or products. Each collection can have its own folder, fields, and settings.

Before defining collections, you need to think about your content model and how you want to organize your content in the repository. Check out the [Content Modeling Guide](https://sveltiacms.app/en/docs/content-modeling) for tips on how to design your content model.

Also, consider how your framework or static site generator handles content files. Refer to the documentation of your framework for best practices on organizing content files. Some frameworks may have specific requirements or recommendations for content structure and file formats.

Now, you can define collections in the configuration file. Refer to the [Collections Guide](https://sveltiacms.app/en/docs/collections) for more information on how to set up collections.

If you already have an existing content structure in your repository, you can set up collections to match that structure. This way, you can manage your existing content through Sveltia CMS without needing to reorganize it.

#### Internationalization (I18n)

If you build a multilingual site, you can configure Sveltia CMS to support multiple languages. Even if your site is monolingual at this moment, setting up i18n from the beginning can make it easier to add more languages in the future. Refer to the [Internationalization Guide](https://sveltiacms.app/en/docs/i18n) for instructions on how to set up i18n in Sveltia CMS.

Some frameworks and static site generators have built-in support for i18n, while others may require additional plugins or libraries. Check the documentation of your framework for guidance on how to implement i18n.

### 3. Develop

Before deploying Sveltia CMS to production, it’s a good idea to test it locally to ensure everything is working as expected.

#### Test Locally

Use the [local development workflow](https://sveltiacms.app/en/docs/workflows/local) to test Sveltia CMS on your local machine before deploying it to production. You can update the configuration file, add contents and assets, see if the output is as expected, and troubleshoot any issues that arise.

#### Update Your Site Code

Depending on your framework, you may need to update your site to properly load and display the content managed by Sveltia CMS. Refer to your framework’s documentation for instructions on how to develop your site. We also provide some [framework-specific guides](https://sveltiacms.app/en/docs/frameworks) to help you get started.

#### Set Up Content Security Policy

If your site uses a Content Security Policy (CSP), you need to update it to allow Sveltia CMS to function properly. See the [CSP Guide](https://sveltiacms.app/en/docs/security#setting-up-content-security-policy) for the required directives and values.

### 4. Deploy

Once you’re satisfied with your local setup, you can deploy your site along with Sveltia CMS to your preferred hosting provider.

#### Deploy to Production

Follow the deployment instructions for your chosen framework or static site generator to deploy your site to production. Ensure that the static files folder containing Sveltia CMS is included in the deployment process.

#### Access the Admin Interface

Access the Sveltia CMS [admin user interface](https://sveltiacms.app/en/docs/ui) and log in using the authentication method provided by your chosen backend (e.g. GitHub, GitLab). You should now be able to manage your content through Sveltia CMS.

#### Invite Team Members

To collaborate with others, you need to invite them to your repository on the backend service you are using (e.g. GitHub, GitLab). Ensure that they have write permission to manage content through Sveltia CMS.

Then, share the admin interface URL with them so they can access Sveltia CMS.

Several people can edit content at the same time. Sveltia CMS notices when someone else has changed an entry that is open and asks before letting the user save over their change. See [Conflict Resolution](https://sveltiacms.app/en/docs/ui/content-editor#conflict-resolution).

#### Iterate and Improve

As you continue to develop your site, you can update the CMS configuration as needed. Use the [local development workflow](https://sveltiacms.app/en/docs/workflows/local) to test changes before deploying them to production, so you can ensure a smooth content management experience for your team.

Source: https://sveltiacms.app/en/docs/start

---

## Architecture

Sveltia CMS inherits a unique architecture from Netlify CMS (now Decap CMS) that sets it apart from traditional content management systems and even other headless CMSs. Netlify itself touted it as “a different kind of CMS”, and Sveltia CMS follows that philosophy closely while introducing its own innovations.

This document explores the architecture of headless CMSs in general, highlighting key distinctions among them, and then delves into the specific architecture of Sveltia CMS to illustrate how it works and what makes it special.

### What Is a Headless CMS?

As a quick refresher, a headless CMS is a content management system without a built-in presentation layer. It provides pure content management decoupled from how that content is displayed, enabling separation of concerns between content and presentation. This architecture offers several key benefits:

- **Flexibility**: Use any frontend framework, static site generator, or platform to consume and display your content
- **Scalability**: Scale your content distribution independently from your presentation layer
- **Performance**: Deliver content through fast, distributed networks without the overhead of traditional CMS presentation layers
- **Security**: Reduce the attack surface by keeping your content API separate from your public-facing application
- **Future-proof**: Change your frontend technology without affecting your content infrastructure

### Types of Headless CMSs

The [headless CMS directory](https://jamstack.org/headless-cms/) on Jamstack.org showcases a wide variety of headless CMSs, each with its own architecture and features. Here are some common architectural distinctions among them:

#### API-Driven vs. Git-Based

Most headless CMSs are API-driven, providing REST or GraphQL APIs to fetch and manage content with a backend server for storage. Git-based CMSs use a Git repository as the primary data store, enabling version control, collaboration, and easy change tracking. While API-driven CMSs are scalable for large applications, they require more complex infrastructure.

Git-based CMSs like **Sveltia CMS** are simpler to set up and maintain, avoid vendor lock-in, and are better suited to smaller projects or teams.

#### Framework-Agnostic vs. Framework-Specific vs. Built-in SSG

Headless CMSs vary in framework support. Some integrate with specific frameworks for optimized workflows and features, while most are framework-agnostic and work with any generator or framework. A few provide built-in static site generators for direct deployment.

**Sveltia CMS** is [framework-agnostic](https://sveltiacms.app/en/docs/frameworks), supporting Astro, Eleventy, Hugo, Jekyll, Next.js, and more.

#### Cloud vs. Self-Hosted

CMSs are offered as SaaS solutions with provider-managed hosting and subscription pricing, or as self-hosted options for greater control but requiring more expertise.

**Sveltia CMS** is semi-self-hosted: the CMS is served from a CDN (no maintenance needed), but each project has its own instance with content stored in the project’s Git repository for full control.

#### Web vs. Desktop

Most headless CMSs are web applications accessible from any device with an internet connection. Some desktop alternatives offer offline capabilities but require installation and updates.

**Sveltia CMS** is the best of both worlds: a web app that runs in the browser while supporting [local file access](https://sveltiacms.app/en/docs/workflows/local) via a modern web API.

### How Sveltia CMS Works

Now let’s take a closer look at how Sveltia CMS is architected and what makes it unique among headless CMSs.

#### CDN-Served JavaScript

In the [start guide](https://sveltiacms.app/en/docs/start), we showed you how to set up Sveltia CMS with just two files:

```html [index.html]
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

```yaml [config.yml]
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

Sveltia CMS is distributed as an [npm package](https://www.npmjs.com/package/@sveltia/cms) but is easiest to use via [UNPKG](https://unpkg.com/), a [content delivery network](https://developer.mozilla.org/en-US/docs/Glossary/CDN) (CDN) that serves npm packages. The HTML file is simply a container that loads the Sveltia CMS JavaScript file from there.

Since the CDN always serves the latest version, you never need to manually update the CMS. Just include the script tag and you’re ready to go. The entire CMS — all features and UI — runs within that single JavaScript file. No build step is required.

#### Single-Page Application

When the HTML file is opened in a browser, Sveltia CMS initializes completely client-side as a [single-page application](https://developer.mozilla.org/en-US/docs/Glossary/SPA) (SPA) using [hash routing](https://developer.mozilla.org/en-US/docs/Glossary/Hash_routing) for navigation. All content processing and user interface rendering happen in the browser without needing a backend server (authentication with GitHub is the only exception).

#### YAML Configuration

On startup, Sveltia CMS automatically reads `config.yml` from the same directory as the HTML file — no path specification needed. This configuration file defines your backend, media folders, and content collections.

#### Git Backend

Once a user authenticates with the Git service provider, they can access and manage content through a user-friendly interface. End-users never need to interact with Git directly; all operations are handled through the provider’s API behind the scenes.

#### All Files in One Place

The `index.html` and `config.yml` files live alongside your other project files in your repository, allowing your code, content, assets, CMS instance, and configuration to coexist seamlessly. This simplifies deployment and maintenance, and eliminates the need for a database.

#### SSG-Friendly

Sveltia CMS focuses solely on content management without building your site, making it compatible with [any framework](https://sveltiacms.app/en/docs/frameworks). It’s particularly well-suited for [static site generators](https://developer.mozilla.org/en-US/docs/Glossary/SSG) (SSGs), which pair naturally with Git-based workflows.

#### Local Development Workflow

Sveltia CMS allows developers to [work with local repositories](https://sveltiacms.app/en/docs/workflows/local) directly from the browser, making it easy to update your configuration, content, and media assets without pushing changes to a remote repository first. This also enables offline editing capabilities.

#### JavaScript API

Advanced users can leverage the [JavaScript API](https://sveltiacms.app/en/docs/api) to customize and extend Sveltia CMS functionality, such as manual initialization, registering custom preview styles, and adding editor components.

### Differences from Netlify/Decap CMS

While Sveltia CMS is heavily inspired by Netlify CMS, we’re committed to building a modern platform with unique features. Key differences include:

- **Built with Svelte**: Smaller bundle sizes, faster performance, fewer crashes, and simpler reactivity compared to React, thanks to efficient compile-time optimizations.
- **Lean codebase**: Provides only the core CMS with no extra packages, reducing complexity and maintenance overhead while enabling frequent releases.
- **Modular dependencies**: Dynamically loads additional dependencies from UNPKG rather than bundling everything into one large file, reducing initial download size.
- **Seamless local workflow**: First CMS to leverage the [File System Access API](https://developer.chrome.com/docs/capabilities/web-apis/file-system-access) for direct browser access to local files, eliminating the need for an insecure proxy server.
- **Modern web application**: Uses [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) for caching, [Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) for lazy loading, [View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API) for smooth visual transitions, and more.
- **Startup content fetching**: Enables instant full text search, advanced [relation fields](https://sveltiacms.app/en/docs/fields/relation), entry-asset linking, and better performance by fetching all entries in one go.
- **Unified type definitions**: TypeScript types and JSON schema are generated from a single source of truth, ensuring consistency between the codebase and editor support.

### Choosing a Headless CMS

In addition to the architectural differences explained above, here are other factors to consider when choosing a headless CMS:

- **License & Pricing**: open source, commercial, freemium, or enterprise models
- **Activity & Roadmap**: update frequency, new features, bug fixes, and future plans
- **Backend Support**: Git providers, databases, file storage, and API capabilities
- **Content Modeling**: flexible schemas, custom fields, relationships, validations and i18n
- **User Experience**: intuitive UI, personalization, accessibility, performance, and mobile support
- **Security & Access Control**: roles, permissions, SSO, encryption, and vulnerability management
- **Documentation & Support**: tutorials, API reference, examples, FAQs, forums, and professional support
- **Extensibility**: plugins, integrations, APIs, SDKs, and customization options
- **Media Management**: image handling, file uploads, optimization, and gallery features
- **Collaboration Features**: editorial workflow, versioning, comments, and notifications

Sveltia CMS aims to excel in many of these areas while maintaining a simple, developer-friendly experience. We encourage you to [explore its features](https://sveltiacms.app/en/docs/features) and see how well it fits your project’s needs!

Source: https://sveltiacms.app/en/docs/architecture

---

## Framework Guides

Sveltia CMS is designed to be framework-agnostic, allowing you to integrate it with a wide range of frameworks and [static site generators](https://jamstack.org/generators/) (SSGs). Whether you’re using Astro, Eleventy, Hugo, Jekyll, Next.js, or another framework — or even vanilla JavaScript — Sveltia CMS can fit seamlessly into your development workflow.

### Getting Started

Here are some resources to help you get started with Sveltia CMS in various frameworks:

- [Astro](https://sveltiacms.app/en/docs/frameworks/astro)
- [Docusaurus](https://sveltiacms.app/en/docs/frameworks/docusaurus)
- [Eleventy](https://sveltiacms.app/en/docs/frameworks/eleventy)
- [Hugo](https://sveltiacms.app/en/docs/frameworks/hugo)
- [Jekyll](https://sveltiacms.app/en/docs/frameworks/jekyll)
- [Middleman](https://sveltiacms.app/en/docs/frameworks/middleman)
- [Next.js](https://sveltiacms.app/en/docs/frameworks/next)
- [Nuxt](https://sveltiacms.app/en/docs/frameworks/nuxt)
- [Starlight](https://sveltiacms.app/en/docs/frameworks/starlight)
- [SvelteKit](https://sveltiacms.app/en/docs/frameworks/sveltekit)
- [VitePress](https://sveltiacms.app/en/docs/frameworks/vitepress)
- [Zola](https://sveltiacms.app/en/docs/frameworks/zola)

More framework guides will be added over time.

Our [Showcase](https://sveltiacms.app/en/showcase) section features real-world examples of Sveltia CMS integrated with various frameworks, including links to their source code repositories. This can be a valuable resource for providing inspiration and practical insights for your own projects.

Using no framework? No problem! Check out our [Vanilla JavaScript Integration Guide](https://sveltiacms.app/en/docs/frameworks/none) for tips on how to use Sveltia CMS with plain JavaScript projects. It’s actually a popular choice among Sveltia CMS users, as the chart below shows.

### Popular Frameworks

The chart below shows the distribution of frameworks used by sites in our [Showcase](https://sveltiacms.app/en/showcase). This data reflects real-world adoption patterns and can help you understand which frameworks are currently popular in the Sveltia CMS community and, by extension, the broader Jamstack ecosystem.

Framework distribution across 627 sites in the showcase, sorted by popularity:

| Framework | Sites | Share |
| --- | ---: | ---: |
| Astro | 234 | 37.3% |
| Vanilla JavaScript | 96 | 15.3% |
| Eleventy | 82 | 13.1% |
| Hugo | 57 | 9.1% |
| Custom Tooling | 40 | 6.4% |
| Jekyll | 32 | 5.1% |
| Next.js | 31 | 4.9% |
| SvelteKit | 14 | 2.2% |
| React | 10 | 1.6% |
| React Router | 7 | 1.1% |
| Nuxt | 4 | 0.6% |
| MkDocs | 3 | 0.5% |
| Zola | 3 | 0.5% |
| VitePress | 3 | 0.5% |
| Vue | 2 | 0.3% |
| Middleman | 1 | 0.2% |
| Docusaurus | 1 | 0.2% |
| Sphinx | 1 | 0.2% |
| Gatsby | 1 | 0.2% |
| SolidStart | 1 | 0.2% |
| TanStack Start | 1 | 0.2% |
| Pelican | 1 | 0.2% |
| Blume | 1 | 0.2% |
| Antora | 1 | 0.2% |

Source: https://sveltiacms.app/en/docs/frameworks

---

## Vanilla JavaScript Integration Guide

Sveltia CMS works seamlessly with vanilla JavaScript projects — no framework required. This guide shows you how to manage content through Sveltia CMS and consume it directly in your JavaScript applications.

### Overview

Sveltia CMS operates as a [CDN-served single-page application](https://sveltiacms.app/en/docs/architecture#how-sveltia-cms-works), so you can load it directly in your project without any build tools or server-side rendering. Simply include an HTML file with the CMS script and start managing your content.

Once configured, the CMS generates static JSON or Markdown files that you consume on the client side. This approach works well for lightweight projects that need dynamic content management without framework overhead — perfect for event listings, announcements, portfolios, or any site where you want managed content instead of hardcoded data.

### Implementation

The implementation is straightforward, leveraging native browser APIs and simple libraries:

#### JSON Files

Fetch the JSON files generated by Sveltia CMS and parse them using the native [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch). This allows you to dynamically render content on your pages without any additional dependencies.

#### Markdown Files

Use a library like [Marked](https://marked.js.org/) to parse Markdown files. The CDN version can be included directly in your HTML, allowing you to render Markdown content without any build step. Simply fetch the Markdown file, parse it with Marked, and insert the resulting HTML into your page.

### Examples

Check out [real-world examples](https://sveltiacms.app/en/showcase?framework=vanilla) in our Showcase demonstrating vanilla JavaScript setups with Sveltia CMS. These implementations can help you get started with your own project.

Source: https://sveltiacms.app/en/docs/frameworks/none
