# Installation and Framework Setup

How to install Sveltia CMS, how it loads, how to check and update the installed version, the list of framework guides, and setup without a framework, using vanilla JavaScript or custom tooling such as Vite or a hand-written build script. For a specific framework, see `frameworks-js.md` or `frameworks-other.md`.

Generated from the Sveltia CMS documentation. Do not edit by hand.

## Getting Started

This guide will help you get Sveltia CMS up and running in your project. Follow the steps below to install, configure, test and deploy Sveltia CMS.

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
- [Nebulix](https://nebulix.unfolding.io/) by [Unfolding.io](https://github.com/unfolding-io)
- [StarFunnel](https://starfunnel.unfolding.io/) by [Unfolding.io](https://github.com/unfolding-io)

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

Sveltia CMS requires a static files folder to serve the admin interface, configuration file and media assets. First, you need to identify or create your static files folder. This folder is typically named `public` or `static`, depending on your framework or static site generator. If the static folder does not exist, create it in the root of your project.

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

Some AI agents include a stylesheet `<link>` tag in Sveltia CMS setups, apparently due to confusion with [Static CMS](https://staticjscms.netlify.app/docs/add-to-your-site-cdn), a now-discontinued fork of Netlify CMS. However, Sveltia CMS does not require any additional CSS files, as all the necessary styles are bundled within the JavaScript file. The link is invalid and can be safely omitted.

```diff
-<link rel="stylesheet" href="https://unpkg.com/@sveltia/cms/dist/sveltia-cms.css" />
```

Similarly, some agents and templates add a `type="module"` attribute to the `<script>` tag, but this is unnecessary for the current version of Sveltia CMS because it’s not distributed as an ES module. Adding the attribute may lead to unexpected behavior when using the [JavaScript API](https://sveltiacms.app/en/docs/api), so it’s best to leave it out.

```diff
-<script src="https://unpkg.com/@sveltia/cms/dist/sveltia-cms.js" type="module"></script>
+<script src="https://unpkg.com/@sveltia/cms/dist/sveltia-cms.js"></script>
```

Pinning to a specific version is [discouraged](https://sveltiacms.app/en/docs/releases#cdn-usage), as this increases maintenance burden and security risks. Use the unversioned script URL to ensure you always get the latest version.

```diff
-<script src="https://unpkg.com/@sveltia/cms@1.2.3/dist/sveltia-cms.js"></script>
+<script src="https://unpkg.com/@sveltia/cms/dist/sveltia-cms.js"></script>
```

The CMS script should be included in a static `index.html` file. Having it in a page managed by a front-end framework, such as `admin.astro`, `admin.njk` or `+page.svelte`, may cause the [UI](https://sveltiacms.app/en/docs/troubleshooting#resolving-broken-ui-caused-by-css-conflicts) and [local workflow](https://sveltiacms.app/en/docs/workflows/local#troubleshooting) to break.

**Advanced Setup: Using a Package Manager**

You can install Sveltia CMS using a package manager like npm, pnpm or yarn, instead of using the CDN version, and [manually initialize](https://sveltiacms.app/en/docs/api/initialization) the CMS in your JavaScript code with a custom configuration provided directly. See the [API documentation](https://sveltiacms.app/en/docs/api) for more details.

#### Install YAML Extension for VS Code (Optional)

If you use VS Code as your code editor, it’s recommended to install the [YAML extension](https://marketplace.visualstudio.com/items?itemName=redhat.vscode-yaml). This extension provides syntax highlighting, validation and autocompletion for YAML files, including the Sveltia CMS configuration file. The `config.yml` file includes a schema reference that the extension can use to provide better support.

#### Set Up AI Tools (Optional)

If you use an AI coding assistant like Claude, GitHub Copilot, Cursor or ChatGPT, we provide an official Agent Skill and `llms.txt` files to help it understand Sveltia CMS. The skill also includes a script that validates your configuration file. See [Working with AI](https://sveltiacms.app/en/docs/working-with-ai) for details.

### 2. Configure

Once you have the basic setup ready, you can customize the configuration file to suit your needs. It allows you to set up various aspects of Sveltia CMS, including backend, media storage, collections and internationalization.

#### Backend

Choose one of the following Git-based backends for Sveltia CMS:

- [GitHub](https://sveltiacms.app/en/docs/backends/github)
- [GitLab](https://sveltiacms.app/en/docs/backends/gitlab)
- [Gitea/Forgejo](https://sveltiacms.app/en/docs/backends/gitea-forgejo)

In most cases, you will need to register an application with the service provider (e.g. GitHub, GitLab) to obtain OAuth credentials. Follow the instructions in your chosen backend’s guide for more details.

#### Media Storage

You should configure at least one [media storage provider](https://sveltiacms.app/en/docs/media), either internal or external, to manage your media assets such as images and files. Follow the instructions in your chosen storage provider’s guide for more details.

#### Collections

You need to define at least one collection in the configuration file to manage your content. Collections represent different types of content, such as blog posts, pages or products. Each collection can have its own folder, fields and settings.

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

Use the [local development workflow](https://sveltiacms.app/en/docs/workflows/local) to test Sveltia CMS on your local machine before deploying it to production. You can update the configuration file, add content and assets, see if the output is as expected, and troubleshoot any issues that arise.

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

- **Flexibility**: Use any frontend framework, static site generator or platform to consume and display your content
- **Scalability**: Scale your content distribution independently from your presentation layer
- **Performance**: Deliver content through fast, distributed networks without the overhead of traditional CMS presentation layers
- **Security**: Reduce the attack surface by keeping your content API separate from your public-facing application
- **Future-proof**: Change your frontend technology without affecting your content infrastructure

### Types of Headless CMSs

The [headless CMS directory](https://jamstack.org/headless-cms/) on Jamstack.org showcases a wide variety of headless CMSs, each with its own architecture and features. Here are some common architectural distinctions among them:

#### API-Driven vs. Git-Based

Most headless CMSs are API-driven, providing REST or GraphQL APIs to fetch and manage content with a backend server for storage. Git-based CMSs use a Git repository as the primary data store, enabling version control, collaboration and easy change tracking. While API-driven CMSs are scalable for large applications, they require more complex infrastructure.

Git-based CMSs like **Sveltia CMS** are simpler to set up and maintain, avoid vendor lock-in, and are better suited to smaller projects or teams.

#### Framework-Agnostic vs. Framework-Specific vs. Built-in SSG

Headless CMSs vary in framework support. Some integrate with specific frameworks for optimized workflows and features, while most are framework-agnostic and work with any generator or framework. A few provide built-in static site generators for direct deployment.

**Sveltia CMS** is [framework-agnostic](https://sveltiacms.app/en/docs/frameworks), supporting Astro, Eleventy, Hugo, Jekyll, Next.js and more.

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

Since the CDN always serves the latest version, you never need to manually update the CMS. Just include the script tag, and you’re ready to go. The entire CMS — all features and UI — runs within that single JavaScript file. No build step is required.

#### Single-Page Application

When the HTML file is opened in a browser, Sveltia CMS initializes completely client-side as a [single-page application](https://developer.mozilla.org/en-US/docs/Glossary/SPA) (SPA) using [hash routing](https://developer.mozilla.org/en-US/docs/Glossary/Hash_routing) for navigation. All content processing and user interface rendering happen in the browser without needing a backend server (the [authorization code flow](https://sveltiacms.app/en/docs/backends/github#authorization-code-flow) for GitHub is the only exception).

#### YAML Configuration

On startup, Sveltia CMS automatically reads `config.yml` from the same directory as the HTML file — no path specification needed. This [configuration file](https://sveltiacms.app/en/docs/config-basics) defines your [backend](https://sveltiacms.app/en/docs/backends), [media folders](https://sveltiacms.app/en/docs/media) and [content collections](https://sveltiacms.app/en/docs/collections).

#### Git Backend

Once a user authenticates with the Git service provider, they can access and manage content through a user-friendly interface. End users never need to interact with Git directly; all operations are handled through the provider’s API behind the scenes.

#### All Files in One Place

The `index.html` and `config.yml` files live alongside your other project files in your repository, allowing your code, content, assets, CMS instance and configuration to coexist seamlessly. This simplifies deployment and maintenance, and eliminates the need for a database.

#### SSG-Friendly

Sveltia CMS focuses solely on content management without building your site, making it compatible with [any framework](https://sveltiacms.app/en/docs/frameworks). It’s particularly well-suited for [static site generators](https://developer.mozilla.org/en-US/docs/Glossary/SSG) (SSGs), which pair naturally with Git-based workflows.

#### Local Development Workflow

Sveltia CMS allows developers to [work with local repositories](https://sveltiacms.app/en/docs/workflows/local) directly from the browser, making it easy to update your configuration, content and media assets without pushing changes to a remote repository first. This also enables offline editing capabilities.

#### JavaScript API

Advanced users can leverage the [JavaScript API](https://sveltiacms.app/en/docs/api) to customize and extend Sveltia CMS functionality, such as manual initialization, registering custom preview styles and adding editor components.

### Differences from Netlify/Decap CMS

While Sveltia CMS is heavily inspired by Netlify CMS, we’re committed to building a modern platform with unique features. Key differences include:

- **Built with Svelte**: Smaller bundle sizes, faster performance, fewer crashes and simpler reactivity compared to React, thanks to efficient compile-time optimizations.
- **Lean codebase**: Provides only the core CMS with no extra packages, reducing complexity and maintenance overhead while enabling frequent releases.
- **Modular dependencies**: Dynamically loads additional dependencies from UNPKG rather than bundling everything into one large file, reducing initial download size.
- **Seamless local workflow**: First CMS to leverage the [File System Access API](https://developer.chrome.com/docs/capabilities/web-apis/file-system-access) for direct browser access to local files, eliminating the need for an insecure proxy server.
- **Modern web application**: Uses [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) for caching, [Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) for lazy loading, [View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API) for smooth visual transitions and more.
- **Startup content fetching**: Enables instant full-text search, advanced [relation fields](https://sveltiacms.app/en/docs/fields/relation), entry-asset linking and better performance by fetching all entries in one go.
- **Unified type definitions**: TypeScript types and JSON schema are generated from a single source of truth, ensuring consistency between the codebase and editor support.

### Choosing a Headless CMS

In addition to the architectural differences explained above, here are other factors to consider when choosing a headless CMS:

- **License & Pricing**: open source, commercial, freemium or enterprise models
- **Activity & Roadmap**: update frequency, new features, bug fixes and future plans
- **Backend Support**: Git providers, databases, file storage and API capabilities
- **Content Modeling**: flexible schemas, custom fields, relationships, validations and i18n
- **User Experience**: intuitive UI, personalization, accessibility, performance and mobile support
- **Security & Access Control**: roles, permissions, SSO, encryption and vulnerability management
- **Documentation & Support**: tutorials, API reference, examples, FAQs, forums and professional support
- **Extensibility**: plugins, integrations, APIs, SDKs and customization options
- **Media Management**: image handling, file uploads, optimization and gallery features
- **Collaboration Features**: editorial workflow, versioning, comments and notifications

Sveltia CMS aims to excel in many of these areas while maintaining a simple, developer-friendly experience. We encourage you to [explore its features](https://sveltiacms.app/en/features) and see how well it fits your project’s needs!

Source: https://sveltiacms.app/en/docs/architecture

---

## Releases

This document provides information about Sveltia CMS releases, including how to find release notes, versioning practices and update instructions.

### Release Frequency

Sveltia CMS ships new versions quite frequently, usually several times a week or even multiple times a day. Instead of following a strict release schedule, we prioritize releasing updates as soon as they are ready. This approach allows us to deliver new features, improvements and bug fixes to users more rapidly.

And this approach works because our product is a [CDN-served SPA](https://sveltiacms.app/en/docs/architecture#how-sveltia-cms-works). As long as you use the CDN script without pinning to a specific version, there is no maintenance overhead for users to update their installations. End users can always access the latest version of Sveltia CMS without needing to manually update their software.

### Release Information

Here are some ways to stay informed about new releases:

- Our [release notes](https://github.com/sveltia/sveltia-cms/releases) are available on GitHub. There are a couple of ways to receive notifications about new releases:
  - [Watch the repository](https://docs.github.com/en/subscriptions-and-notifications/get-started/configuring-notifications#configuring-your-watch-settings-for-an-individual-repository) (select Watch → Custom → Releases on the [repository homepage](https://github.com/sveltia/sveltia-cms)) and you’ll get release notifications in:
    - The [Notifications](https://github.com/notifications) and [Feed](https://github.com/feed) pages on the web
    - The Inbox and Explore tabs in the [GitHub Mobile](https://github.com/mobile) app
  - Join the #cms-announcements channel on our [Discord server](https://discord.com/invite/5hwCGqup5b).
  - Subscribe to the Atom feed in your feed reader:
    ```
    https://github.com/sveltia/sveltia-cms/releases.atom
    ```
- Major, minor and security releases are also announced on our [Bluesky account](https://bsky.app/profile/sveltiacms.app). Follow us there for the latest updates!
- Interested in what’s coming next? Check out our [roadmap](https://sveltiacms.app/en/docs/roadmap). We have a lot of exciting ideas to make Sveltia CMS the best Git-based CMS out there.
- Deprecated features and breaking changes are documented in the [migration guide](https://sveltiacms.app/en/docs/migration/earlier-versions).

### Versioning Policy

We follow [semantic versioning](https://semver.org/) for our releases. We don’t typically maintain multiple release lines, but we may do so for critical security fixes if necessary. We don’t offer long-term support (LTS) versions.

Breaking changes are only introduced in major version updates (e.g. from 1.x.x to 2.0.0). Minor and patch releases (e.g. from 1.0.0 to 1.1.0 or 1.0.1) are backward-compatible, though unintended issues may occasionally arise.

**Stable Version Not Yet Available**

At this point, Sveltia CMS has not reached 1.0.0, so breaking changes may still occur in minor version updates. We’ll announce breaking changes clearly in the release notes.

### CDN or npm Package

Sveltia CMS is published as the [`@sveltia/cms`](https://www.npmjs.com/package/@sveltia/cms) package, which contains three builds of the app. See the [API documentation](https://sveltiacms.app/en/docs/api#accessing-the-cms-object) for how to load each one.

|  | CDN script | CDN module | npm package |
| --- | --- | --- | --- |
| File | `dist/sveltia-cms.js` | `dist/sveltia-cms.mjs` | `npm/index.js` |
| How to load | `script` tag | `script` tag with `type="module"` | `import` from `@sveltia/cms` |
| Format | Classic script, single file | JavaScript module, single file | JavaScript modules, split into files |
| Build tool | Not needed | Not needed | Required |
| Updates | Automatic | Automatic | With your package manager |
| Files loaded from CDNs | Yes | Yes | No |

The CDN builds are self-contained scripts that work on any site. To keep them small, they load some files from public CDNs as needed: fonts from jsDelivr, and admin interface translations, additional libraries, image decoders and syntax highlighting definitions from UNPKG. This is still the case if you copy the script to your own site. Parts of the app that only some sites need, such as the GitLab and Gitea/Forgejo backends, are loaded from the `chunks` folder next to the script, so copy `dist/chunks` along with it, or they’re loaded from UNPKG as well. See the [privacy notes](https://sveltiacms.app/en/docs/privacy#content-delivery-networks) and the [Content Security Policy](https://sveltiacms.app/en/docs/security#setting-up-content-security-policy) guide for details.

The npm package includes all of these files instead, so the CMS contacts no CDN. Your build tool processes them along with the rest of your site and loads each one only when it’s needed. This requires a build tool that supports JavaScript modules, workers and assets referenced with `new URL()`, such as [Vite](https://vite.dev/) and [webpack](https://webpack.js.org/) 5.

Some of those files, including libraries like [Leaflet](https://leafletjs.com/) for the Map field and the syntax highlighting definitions, come with packages that your package manager installs as dependencies of Sveltia CMS. If your site uses one of them too, both can share a single copy.

**Security Risk**

Using the npm version means that you will not receive any updates, including important bug fixes and security patches, until you manually update the package. This can lead to potential security risks and increased maintenance costs.

Sveltia CMS is designed to [update automatically](https://sveltiacms.app/en/docs/architecture#how-sveltia-cms-works), and our [security practices](https://sveltiacms.app/en/docs/security#security-practices) include mitigating supply chain attacks. Use the CDN version unless you require advanced framework integration or a strictly privacy-compliant setup.

**No Support for npm Package Setup**

The npm package is aimed at advanced users who are familiar with build tools and JavaScript modules. We do not provide support for using it. If you are not comfortable with build tools, we recommend using the CDN builds instead.

**PDF Thumbnails in the npm Package**

The npm package generates thumbnails for PDF files with [PDF.js](https://github.com/mozilla/pdf.js), like the CDN builds. However, it doesn’t include the hundreds of character maps, standard fonts and color profiles that come with the library. As a result, text in fonts that are not embedded in a PDF file is drawn with a font installed on the user’s system instead. Some text in Chinese, Japanese or Korean may also be left out of the thumbnail. The image decoders for JPEG 2000 and JBIG2 images are included.

### Checking Your Current Version

The current version of Sveltia CMS can be viewed by enabling [Developer Mode](https://sveltiacms.app/en/docs/ui#developer-mode) in the application:

1. Click on the avatar in the top right corner of the application to open the Account menu.
1. Click Settings.
1. Click the Developer tab.
1. Enable Developer Mode.
1. Close the Settings dialog.

A Release Notes link will now appear under the Help menu with the `?` icon, displaying the current application version.

### Updating Your Installation

#### CDN Usage

Updating Sveltia CMS when using the CDN is automatic, unless you have pinned to a specific version. The CDN always serves the latest version, so you don’t need to take any action to receive updates.

To use the latest version of Sveltia CMS via the CDN, include the following script tag in your HTML, as the [start guide](https://sveltiacms.app/en/docs/start) suggests:

```html
<script src="https://unpkg.com/@sveltia/cms/dist/sveltia-cms.js"></script>
```

**Module Version**

Earlier versions of Sveltia CMS were bundled as a [JavaScript module](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules), so you needed `type="module"` in the script. The current version is a classic [IIFE](https://developer.mozilla.org/en-US/docs/Glossary/IIFE) script, so the `type` attribute is no longer necessary. If you still need to use the module version for some reason, you can use this tag instead, which loads the `.mjs` file:

```html
<script src="https://unpkg.com/@sveltia/cms/dist/sveltia-cms.mjs" type="module"></script>
```

You can also explicitly import the script to use the [JavaScript API](https://sveltiacms.app/en/docs/api#using-the-cdn):

```html
<script type="module">
  import CMS from 'https://unpkg.com/@sveltia/cms/dist/sveltia-cms.mjs';
</script>
```

The CMS also periodically checks for updates and notifies users when a new version is available. When the notification appears, simply click the “Update Now” button to refresh the application and load the latest version. This works with both the classic `sveltia-cms.js` script and the `sveltia-cms.mjs` module.

To avoid major version updates that may include breaking changes, you can pin to a specific major version using the caret symbol (`^`) followed by the major version number:

```html
<script src="https://unpkg.com/@sveltia/cms@^1/dist/sveltia-cms.js"></script>
```

With such a version range, the notification appears for a new version within the range, which a reload picks up. A release outside the range, or any release when you pin to an exact version, only logs a warning in the browser console, because reloading wouldn’t load it.

**Stable Version Not Yet Available**

At this point, Sveltia CMS has not reached 1.0.0, so breaking changes may still occur in minor version updates. Pinning to a specific major version is more relevant once we start releasing stable versions (1.0.0 and above).

You can also pin to an exact version, but this is not recommended unless you have a specific reason, like debugging or temporarily avoiding a problematic release:

```html
<script src="https://unpkg.com/@sveltia/cms@1.2.3/dist/sveltia-cms.js"></script>
```

Please [report any regressions](https://sveltiacms.app/en/feedback#bug-reports) you encounter to us. Keep in mind that pinning is only a temporary solution and that unreported bugs may be overlooked forever. Reported bugs are usually solved within 8 hours.

**Security Risk**

If you pin to an exact version, you will not receive any updates, including important bug fixes and security patches, until you manually update the version number in your script tag. This can lead to potential security risks and increased maintenance costs.

Sveltia CMS is designed to [update automatically](https://sveltiacms.app/en/docs/architecture#how-sveltia-cms-works), and our [security practices](https://sveltiacms.app/en/docs/security#security-practices) include mitigating supply chain attacks. It is discouraged to pin to an exact version for long-term use, as the disadvantages outweigh the advantages.

#### npm Package Usage

If you’ve chosen to install the CMS using a package manager, updating the package is your responsibility. The CMS doesn’t notify users of new versions in this case, as updating requires a new build of your site. We strongly recommend using [`ncu`](https://www.npmjs.com/package/npm-check-updates) or a service like [Dependabot](https://github.blog/news-insights/product-news/keep-all-your-packages-up-to-date-with-dependabot/) to keep dependencies up to date. Otherwise, you’ll miss important bug fixes and new features.

**ProTip**

We update our dependencies using `ncu -u && pnpm up` at least once a week.

The pinning methods described in the CDN section above also apply to npm package versions. For example, to pin to a specific major version, you can run:

```bash [npm]
npm install @sveltia/cms@^1
```

```bash [yarn]
yarn add @sveltia/cms@^1
```

```bash [pnpm]
pnpm add @sveltia/cms@^1
```

```bash [bun]
bun add @sveltia/cms@^1
```

See the [npm semantic versioning documentation](https://docs.npmjs.com/about-semantic-versioning) for more details on version ranges.

Source: https://sveltiacms.app/en/docs/releases

---

## Framework Guides

Designed to be framework-agnostic, Sveltia CMS can be integrated with a wide range of frameworks and [static site generators](https://jamstack.org/generators/) (SSGs). Whether you use Astro, Eleventy, Hugo, Jekyll, Next.js or another framework, Sveltia CMS can fit seamlessly into your development workflow.

It also works with framework-less sites built using vanilla JavaScript or custom tooling. It can even be used for non-website projects where content management is required.

### Framework-Specific Guides

Here are some resources to help you get started with Sveltia CMS in various frameworks:

<div class="list-columns">

- [Astro](https://sveltiacms.app/en/docs/frameworks/astro)
- [Docusaurus](https://sveltiacms.app/en/docs/frameworks/docusaurus)
- [Eleventy](https://sveltiacms.app/en/docs/frameworks/eleventy)
- [Hugo](https://sveltiacms.app/en/docs/frameworks/hugo)
- [Jekyll](https://sveltiacms.app/en/docs/frameworks/jekyll)
- [Middleman](https://sveltiacms.app/en/docs/frameworks/middleman)
- [MkDocs](https://sveltiacms.app/en/docs/frameworks/mkdocs)
- [Next.js](https://sveltiacms.app/en/docs/frameworks/next)
- [Nuxt](https://sveltiacms.app/en/docs/frameworks/nuxt)
- [Starlight](https://sveltiacms.app/en/docs/frameworks/starlight)
- [SvelteKit](https://sveltiacms.app/en/docs/frameworks/sveltekit)
- [TanStack Start](https://sveltiacms.app/en/docs/frameworks/tanstack-start)
- [VitePress](https://sveltiacms.app/en/docs/frameworks/vitepress)
- [Zola](https://sveltiacms.app/en/docs/frameworks/zola)

</div>

Our [showcase](https://sveltiacms.app/en/showcase) section features real-world examples of Sveltia CMS integrated with various frameworks, including links to their source code repositories. This can be a valuable resource for providing inspiration and practical insights for your own projects.

### Framework-Less Integration

Using no framework? No problem! Check out our [Vanilla JavaScript Integration Guide](https://sveltiacms.app/en/docs/frameworks/vanilla) for tips on how to use Sveltia CMS with plain JavaScript projects. It’s actually a popular choice among Sveltia CMS users, as the chart below shows.

If you build your site with your own tooling, such as a Vite app or a hand-written build script, see the [Custom Tooling Integration Guide](https://sveltiacms.app/en/docs/frameworks/custom).

### Popular Frameworks

The chart below shows the distribution of frameworks used by sites in our [showcase](https://sveltiacms.app/en/showcase). This data reflects real-world adoption patterns and can help you understand which frameworks are currently popular in the Sveltia CMS community and, by extension, the broader Jamstack ecosystem.

Framework distribution across 780 sites in the showcase, sorted by popularity:

| Framework | Sites | Share |
| --- | ---: | ---: |
| Astro | 291 | 37.3% |
| Vanilla JavaScript | 122 | 15.6% |
| Eleventy | 90 | 11.5% |
| Hugo | 67 | 8.6% |
| Custom Tooling | 65 | 8.3% |
| Jekyll | 39 | 5.0% |
| Next.js | 36 | 4.6% |
| SvelteKit | 19 | 2.4% |
| React Router | 10 | 1.3% |
| React | 10 | 1.3% |
| MkDocs | 4 | 0.5% |
| Nuxt | 4 | 0.5% |
| VitePress | 4 | 0.5% |
| Zola | 3 | 0.4% |
| Docusaurus | 2 | 0.3% |
| Vue | 2 | 0.3% |
| TanStack Start | 2 | 0.3% |
| Unknown | 2 | 0.3% |
| Middleman | 1 | 0.1% |
| Sphinx | 1 | 0.1% |
| Gatsby | 1 | 0.1% |
| SolidStart | 1 | 0.1% |
| Pelican | 1 | 0.1% |
| Blume | 1 | 0.1% |
| Antora | 1 | 0.1% |
| Starlight | 1 | 0.1% |

Source: https://sveltiacms.app/en/docs/frameworks

---

## Vanilla JavaScript Integration Guide

Sveltia CMS works with plain HTML, CSS and JavaScript sites, with no framework or build tools required. It’s a popular choice for small business sites, portfolios and event pages that need editable content without the overhead of a framework.

### How It Works

Your repository holds the HTML pages, scripts and content files, and the hosting service publishes them as is:

1. Editors change content in Sveltia CMS, which commits JSON files to the repository.
2. The hosting service publishes the new commit, with no build step.
3. When a visitor opens a page, its JavaScript fetches the JSON files and renders the content.

Sveltia CMS itself is a [single-page application served from a CDN](https://sveltiacms.app/en/docs/architecture#how-sveltia-cms-works), so the admin page doesn’t need a build step either.

### Examples

See real-world examples of vanilla JavaScript sites in our [showcase](https://sveltiacms.app/en/showcase?framework=vanilla). Most of the listed sites include links to their source code, so you can explore how they implemented Sveltia CMS.

### Setup

#### Adding the Admin Page

Create `admin/index.html` and `admin/config.yml` in the folder your site is published from, usually the repository root, as described in the [Getting Started](https://sveltiacms.app/en/docs/start#manual-installation) guide. The admin page is then available at `/admin/`.

#### Linking to the Admin Page

Link to the admin page with a regular `<a>` element:

```html
<a href="/admin/">Edit content</a>
```

### Configuration

#### Storing Content as JSON

Store content in JSON files, which browsers can parse without a library. The following example manages the home page in one file and a list of team members in another:

```yaml [admin/config.yml]
media_folder: images/uploads
public_folder: /images/uploads
collections:
  - name: pages
    label: Pages
    files:
      - name: home
        label: Home Page
        file: data/home.json
        fields:
          - { name: title, label: Title }
          - { name: body, label: Body, widget: markdown }
  - name: members
    label: Team Members
    label_singular: Team Member
    file: data/members.json
    identifier_field: name
    fields:
      - { name: id, label: ID }
      - { name: name, label: Name }
      - { name: role, label: Role, required: false }
      - { name: photo, label: Photo, widget: image, required: false }
```

The two collections work differently:

- The `pages` collection is a [file collection](https://sveltiacms.app/en/docs/collections/files). Each file holds the content of one page or section, and the format is determined by the `.json` extension.
- The `members` collection is a [single-file collection](https://sveltiacms.app/en/docs/collections/entries/single-file). Editors add, edit, delete and reorder members one by one, and all of them are stored in `data/members.json` as an array of objects.

#### Avoiding One File per Entry

An entry collection with the `folder` option stores each entry in a file of its own. Avoid it on a vanilla JavaScript site. A browser can’t list the files in a folder, so your script can’t find the entries without an index.

Use a single-file collection instead, as in the example above. If you need one file per entry, e.g. for long blog posts, you have to generate an index file at deploy time, such as with a small script in a GitHub Actions workflow. At that point, a build step that renders the pages may be simpler. See the [Custom Tooling Integration Guide](https://sveltiacms.app/en/docs/frameworks/custom).

#### Images

The `media_folder` is where uploaded images are stored in the repository, and the `public_folder` is the URL path written to the content. Start the `public_folder` with a slash, so the image paths work on every page, including pages in subfolders.

If your site is served from a subfolder, e.g. a GitHub Pages project site at `https://username.github.io/repo/`, include the subfolder in the `public_folder`, such as `/repo/images/uploads`.

### Loading Content

#### Fetching JSON Files

Fetch the JSON files with the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch). The following script renders the home page title and the list of team members from the example above:

```js [js/main.js]
const loadJSON = async (path) => {
  const response = await fetch(path, { cache: 'no-cache' });

  if (!response.ok) {
    throw new Error(`Failed to load ${path}: ${response.status}`);
  }

  return response.json();
};

const home = await loadJSON('/data/home.json');

document.querySelector('#title').textContent = home.title;

const members = await loadJSON('/data/members.json');

document.querySelector('#members').replaceChildren(
  ...members.map(({ name, role }) => {
    const item = document.createElement('li');

    item.textContent = role ? `${name} (${role})` : name;

    return item;
  }),
);
```

Load the script as a module, which allows top-level `await`:

```html
<script type="module" src="/js/main.js"></script>
```

The `cache: 'no-cache'` option makes the browser check for a newer version of the file on every visit. Without it, visitors may see outdated content for a while after an update. GitHub Pages, for example, lets browsers cache files for 10 minutes.

#### Rendering Text Safely

Set plain text with the `textContent` property, as in the example above, rather than `innerHTML`. A value like `<b>Jane</b>` is then shown as is instead of being interpreted as HTML. This also protects the page from cross-site scripting (XSS) if the content contains a malicious script.

#### Rendering Markdown

The [RichText field](https://sveltiacms.app/en/docs/fields/richtext), set with `widget: markdown` in the example above, saves Markdown text. Convert it to HTML with a library like [Marked](https://marked.js.org/), and sanitize the HTML with [DOMPurify](https://github.com/cure53/DOMPurify) before inserting it into the page. Add the imports to the top of the script, and render the body after loading the home page data:

```js [js/main.js]
import { marked } from 'https://cdn.jsdelivr.net/npm/marked@18/lib/marked.esm.js';
import DOMPurify from 'https://cdn.jsdelivr.net/npm/dompurify@3/dist/purify.es.mjs';

// ...

document.querySelector('#body').innerHTML = DOMPurify.sanitize(marked.parse(home.body));
```

Both libraries are loaded from a CDN as JavaScript modules, so no installation is needed.

### Publishing Changes

Since there’s no build step, the hosting service only has to publish the files in the repository. GitHub Pages with the “Deploy from a branch” option, as well as Netlify and Cloudflare Pages without a build command, publish every new commit automatically. Content changes made in the CMS usually go live within a minute or two.

### Limitations

Content rendered by JavaScript isn’t part of the HTML that the server sends. Google can render JavaScript, but some search engines and most social media link previews read only the HTML, so they don’t see the content.

If search engine optimization matters for your site, render the pages at build time with a static site generator or your own build script. See the [Framework Guides](https://sveltiacms.app/en/docs/frameworks) and the [Custom Tooling Integration Guide](https://sveltiacms.app/en/docs/frameworks/custom).

### Support for Vanilla JavaScript

We have implemented specific features to enhance the integration of Sveltia CMS with vanilla JavaScript sites:

- [Single-file collections](https://sveltiacms.app/en/docs/collections/entries/single-file): Store all the entries of an entry collection in a single JSON file as an array of objects, which your script can fetch with one request. Editors still add, edit, delete and reorder the entries one by one.
- [Top-level List fields](https://sveltiacms.app/en/docs/fields/list#top-level-list): Edit a JSON file whose root is an array, such as a navigation menu, as a single entry of a file collection, using the `root` option.

Source: https://sveltiacms.app/en/docs/frameworks/vanilla

---

## Custom Tooling Integration Guide

Many sites don’t use a framework or static site generator. Instead, they’re built with their own tooling, usually one of these:

- a [Vite](https://vite.dev/) app, with or without a UI library like React or Vue
- a hand-written build script in Node.js, Python or another language that turns content files into HTML pages

Since every setup is different, this guide gives general advice rather than step-by-step instructions. Sveltia CMS only reads and writes files in your Git repository, so it works with any tooling that can read those files.

### Examples

See real-world examples of custom tooling in our [showcase](https://sveltiacms.app/en/showcase?framework=custom). Many sites listed under [React](https://sveltiacms.app/en/showcase?framework=react) and [Vue](https://sveltiacms.app/en/showcase?framework=vue) are Vite apps as well. Most of the listed sites include links to their source code, so you can explore how they implemented Sveltia CMS.

### Vite

#### Adding the Admin Page

Vite copies the files in the [`public` folder](https://vite.dev/guide/assets#the-public-directory) to the build output unaltered. Create `public/admin/index.html` and `public/admin/config.yml` as described in the [Getting Started](https://sveltiacms.app/en/docs/start#manual-installation) guide. The admin page is then available at `/admin/` on the built site.

The development server started with `vite` is different. Its fallback for single-page apps serves your app’s own `index.html` for `/admin/` and `/admin`, so only `/admin/index.html` shows the admin page. To fix this, add a small plugin to the Vite configuration that rewrites these paths:

```js [vite.config.js]
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    {
      name: 'sveltia-cms-admin',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/admin' || req.url === '/admin/') {
            req.url = '/admin/index.html';
          }
          next();
        });
      },
    },
  ],
});
```

The built site doesn’t have this problem on common hosting services. On Netlify, Vercel and Cloudflare Pages, a rewrite rule that sends every path to `index.html` doesn’t apply to files that exist, so `/admin/` still gets the admin page.

#### Linking to the Admin Page

Link to the admin page with a regular `<a>` element and a trailing slash:

```html
<a href="/admin/">Edit content</a>
```

The trailing slash matters on `vite preview` and some hosting services, which serve your app instead of the admin page at `/admin`. If your app uses a client-side router, avoid its link component, such as React Router’s `<Link>`. The router handles the link itself and shows its own “not found” page.

#### Configuration

Store content files under `src`, e.g. in `src/content`, and import them into your app as described [below](#loading-content). Avoid putting them in `public`, because Vite would publish the raw files as well as bundle them. The following example manages site settings in a single JSON file and blog posts as Markdown files, with images in `public/uploads`:

```yaml [public/admin/config.yml]
media_folder: public/uploads
public_folder: /uploads
collections:
  - name: settings
    label: Settings
    files:
      - name: site
        label: Site Settings
        file: src/content/site.json
        fields:
          - { name: title, label: Site Title }
          - { name: description, label: Description, widget: text }
  - name: posts
    label: Blog Posts
    label_singular: Blog Post
    folder: src/content/posts
    create: true
    fields:
      - { name: title, label: Title }
      - { name: date, label: Date, widget: datetime, type: date }
      - { name: image, label: Cover Image, widget: image, required: false }
      - { name: body, label: Body, widget: markdown }
```

The `media_folder` must be inside `public` so the images are copied to the build output, while the `public_folder` is the URL path written to the content. See [Internal Media Storage](https://sveltiacms.app/en/docs/media/internal) for more options.

If your site is served from a subfolder, e.g. a GitHub Pages project site with the [`base`](https://vite.dev/config/shared-options#base) option set to `/repo/`, image paths like `/uploads/photo.jpg` don’t include the subfolder. Prefix them with `import.meta.env.BASE_URL` when you render them.

#### Loading Content

Vite bundles the content files with your app at build time, so there’s no need to fetch them on the client side.

##### JSON Files

Vite can import JSON files directly. This works well for a file in a [file collection](https://sveltiacms.app/en/docs/collections/files):

```js
import site from './content/site.json';
```

An [entry collection](https://sveltiacms.app/en/docs/collections/entries) stores each entry in its own file. Vite’s [`import.meta.glob`](https://vite.dev/guide/features#glob-import) function imports all the files in a folder. The following example reads products from a collection with the [`format`](https://sveltiacms.app/en/docs/collections/entries/formats#format) option set to `json`:

```ts [src/lib/products.ts]
type Product = { name: string; price: number; image: string };

const files = import.meta.glob<Product>('../content/products/*.json', {
  import: 'default',
  eager: true,
});

export const products = Object.entries(files).map(([path, product]) => ({
  slug: path.match(/([^/]+)\.json$/)![1],
  ...product,
}));
```

##### YAML Files

Vite can’t import YAML files by itself. Add the [`@rollup/plugin-yaml`](https://github.com/rollup/plugins/tree/master/packages/yaml) plugin to the `plugins` option in the Vite configuration, and then import YAML files the same way as JSON files.

##### Markdown Files

Add `query: '?raw'` to the `import.meta.glob` options to import each Markdown file as a string. Then split the front matter from the body and parse it with a YAML library like [yaml](https://eemeli.org/yaml/):

```ts [src/lib/posts.ts]
import { parse } from 'yaml';

const files = import.meta.glob<string>('../content/posts/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});

export const posts = Object.entries(files).map(([path, raw]) => {
  const [, frontMatter = '', body = raw] =
    raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/) ?? [];

  return { slug: path.match(/([^/]+)\.md$/)![1], ...parse(frontMatter), body };
});
```

Render the `body` with a Markdown library like [Marked](https://marked.js.org/). Avoid [gray-matter](https://github.com/jonschlinkert/gray-matter) in browser code, because it relies on the Node.js `Buffer` API and throws an error in the browser.

### Custom Build Scripts

#### Adding the Admin Page

A build script usually copies a folder of static files, like CSS and images, to the output folder. Create `admin/index.html` and `admin/config.yml` in that folder as described in the [Getting Started](https://sveltiacms.app/en/docs/start#manual-installation) guide, or have the script copy the `admin` folder to the output separately.

Make sure the script copies both files unaltered. A template engine or HTML minifier may change the admin page, e.g. by removing the CMS script.

Link to the admin page with `<a href="/admin/">`.

#### Configuration

Set the `media_folder` to a folder that the script copies to the output, and the `public_folder` to the URL path of that folder on the site. Content files can be stored anywhere outside the output folder, because the script reads them.

#### Loading Content

Read the content files with the file system API of your language and parse them with a library for the format:

- JSON files: use the built-in parser, such as `JSON.parse()` in JavaScript or the `json` module in Python.
- YAML files: use a library like [yaml](https://eemeli.org/yaml/) or [js-yaml](https://github.com/nodeca/js-yaml) for Node.js, or [PyYAML](https://pyyaml.org/) for Python.
- Markdown files: split the front matter from the body with [gray-matter](https://github.com/jonschlinkert/gray-matter) for Node.js or [python-frontmatter](https://github.com/eyeseast/python-frontmatter) for Python, then render the body with a Markdown library.

The DateTime field with `type: date` saves an unquoted date like `2026-10-01`. Parsers don’t agree on how to read it:

- gray-matter, PyYAML and js-yaml 4 return a date object.
- yaml and js-yaml 5 return a string.

Check what your parser returns before formatting or sorting dates.

### Publishing Changes

Either way, the content is built into your site, so the site must be rebuilt to reflect content changes made in the CMS. Most hosting services, including Netlify, Vercel and Cloudflare, can run your build command automatically when a commit is pushed to the repository. For GitHub Pages, use a GitHub Actions workflow that runs the build and deploys the output.

If you’d rather skip the build step for content, place the files in a published folder, such as `public` in a Vite app, and fetch them on the client side, as described in the [Vanilla JavaScript Integration Guide](https://sveltiacms.app/en/docs/frameworks/vanilla).

Source: https://sveltiacms.app/en/docs/frameworks/custom
