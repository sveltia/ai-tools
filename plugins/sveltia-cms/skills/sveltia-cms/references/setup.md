# Installation and Framework Setup

How to install Sveltia CMS and wire it into a static site generator.

Generated from the Sveltia CMS documentation. Do not edit by hand.

## Getting Started

This guide will help you get Sveltia CMS up and running in your project. Follow the steps below to install, configure, test, and deploy Sveltia CMS.

Already using **Netlify CMS**, **Decap CMS** or **Static CMS**? Check out the [Migration Guides](https://sveltiacms.app/en/docs/migration) for specific instructions.

**Stable Version Not Yet Available**

Sveltia CMS is still in beta. Although it’s already being used in production by [many users](https://sveltiacms.app/en/showcase), there might still be breaking changes before the stable 1.0 release. We recommend keeping an eye on the [release information](https://sveltiacms.app/en/docs/releases#release-information) for any updates.

**No Free Setup Support**

Sveltia CMS is specifically designed as a [replacement for Netlify/Decap CMS](https://sveltiacms.app/en/docs/successor-to-netlify-cms). We are happy to help you migrate, but **we can’t help you set up Sveltia CMS from scratch** through our free support channels. Questions about installation or initial configuration may go unanswered.

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
- [Build Awesome Starter](https://github.com/anyblades/buildawesome-starters) by [anyblades](https://github.com/anyblades)
- [Huwindty](https://github.com/aloxe/huwindty) by [aloxe](https://github.com/aloxe)
- [Subtle](https://github.com/anyblades/subtle) by [anyblades](https://github.com/anyblades)

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

| Framework / SSG                                  | Static Folder Name  |
| ------------------------------------------------ | ------------------- |
| Eleventy, GitBook, Jekyll                        | `/` (root)          |
| Pelican                                          | `/content`          |
| MkDocs, Docsify                                  | `/docs`             |
| Astro, Next.js, Nuxt, Remix, UmiJS, VitePress    | `/public`           |
| Hexo, Slate                                      | `/source`           |
| mdBook                                           | `/src`              |
| Docusaurus, Fresh, Gatsby, Hugo, SvelteKit, Zola | `/static`           |
| VuePress                                         | `/.vuepress/public` |

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

Please note that Sveltia CMS does not officially support multi-user scenarios yet. Be cautious when multiple users are editing content simultaneously, as it may lead to merge conflicts or unintended overwrites. We recommend coordinating with your team to avoid concurrent edits on the same content.

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

**Sveltia CMS** is semi-self-hosted: the CMS is served from a CDN (no maintenance needed), but each project has its own instance with content stored in your Git repository for full control.

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

When you open the HTML file in your browser, Sveltia CMS initializes completely client-side as a [single-page application](https://developer.mozilla.org/en-US/docs/Glossary/SPA) (SPA) using [hash routing](https://developer.mozilla.org/en-US/docs/Glossary/Hash_routing) for navigation. All content processing and user interface rendering happen in your browser without needing a backend server (authentication with GitHub is the only exception).

#### YAML Configuration

On startup, Sveltia CMS automatically reads `config.yml` from the same directory as your HTML file — no path specification needed. This configuration file defines your backend, media folders, and content collections.

#### Git Backend

Once you authenticate with your Git service provider, you can access and manage content through a user-friendly interface. End-users never need to interact with Git directly; all operations are handled through the provider’s API behind the scenes.

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
- [SvelteKit](https://sveltiacms.app/en/docs/frameworks/sveltekit)
- [VitePress](https://sveltiacms.app/en/docs/frameworks/vitepress)
- [Zola](https://sveltiacms.app/en/docs/frameworks/zola)

More framework guides will be added over time.

Our [Showcase](https://sveltiacms.app/en/showcase) section features real-world examples of Sveltia CMS integrated with various frameworks, including links to their source code repositories. This can be a valuable resource for providing inspiration and practical insights for your own projects.

Using no framework? No problem! Check out our [Vanilla JavaScript Integration Guide](https://sveltiacms.app/en/docs/frameworks/none) for tips on how to use Sveltia CMS with plain JavaScript projects. It’s actually a popular choice among Sveltia CMS users, as the chart below shows.

### Popular Frameworks

The chart below shows the distribution of frameworks used by sites in our [Showcase](https://sveltiacms.app/en/showcase). This data reflects real-world adoption patterns and can help you understand which frameworks are currently popular in the Sveltia CMS community and, by extension, the broader Jamstack ecosystem.

<script setup>
import FrameworkChart from '../../../.vitepress/theme/components/FrameworkChart.vue';
import { data as showcaseLabels } from '../../../data/showcase-labels.data.ts';
</script>

Source: https://sveltiacms.app/en/docs/frameworks

---

## Astro Integration Guide

This guide provides resources and information for integrating Sveltia CMS with [Astro](https://astro.build/), a modern static site builder.

### Starter Templates

Here are some starter templates built by the community using Astro:

- [Astros](https://github.com/majesticooss/astros) by [zanhk](https://github.com/zanhk)
- [Astro i18n Starter](https://github.com/yacosta738/astro-cms) by [yacosta738](https://github.com/yacosta738)
- [astro-sveltia-cms](https://github.com/knolljo/astro-sveltia-cms) by [knolljo](https://github.com/knolljo)

**Disclaimer**

These third-party resources are not necessarily reviewed by the Sveltia CMS team. We are not responsible for their maintenance or support. Please contact the respective authors for any issues or questions.

### Examples

See real-world examples of Astro integrations in our [Showcase](https://sveltiacms.app/en/showcase?framework=astro). Most of the listed sites include links to their source code, so you can explore how they implemented Sveltia CMS with Astro.

### Support for Astro

We have implemented specific features to enhance the integration of Sveltia CMS with Astro:

- The [`value_field`](https://sveltiacms.app/en/docs/fields/relation#value-field) Relation field option can contain a locale prefix like `{{locale}}/{{slug}}`, which will be replaced with the current locale. It’s intended to support i18n in Astro. ([Discussion](https://github.com/sveltia/sveltia-cms/discussions/302))
- [Localizing entry slugs](https://sveltiacms.app/en/docs/i18n#localizing-entry-slugs): generate localized slugs for multilingual Astro sites, notably with the [@astrolicious/i18n](https://github.com/astrolicious/i18n) library. ([Discussion](https://github.com/sveltia/sveltia-cms/issues/137))

### Development Guide

We’ll be adding a detailed development guide for integrating Sveltia CMS with Astro in the near future. In the meantime, feel free to explore the starter templates and showcase examples for guidance.

Source: https://sveltiacms.app/en/docs/frameworks/astro

---

## Docusaurus Integration Guide

This guide provides resources and information for integrating Sveltia CMS with [Docusaurus](https://docusaurus.io/), a popular static site generator focused on documentation websites.

### Examples

See real-world examples of Docusaurus integrations in our [Showcase](https://sveltiacms.app/en/showcase?framework=docusaurus). Most of the listed sites include links to their source code, so you can explore how they implemented Sveltia CMS with Docusaurus.

### Support for Docusaurus

We have implemented specific features to enhance the integration of Sveltia CMS with Docusaurus:

- If an entry collection has only a Markdown `body` field, the [slug](https://sveltiacms.app/en/docs/collections/entries#managing-entry-slugs) and [summary](https://sveltiacms.app/en/docs/collections/entries#summaries) of the entries will be generated from a header in the Markdown content, if exists. ([Discussion](https://github.com/sveltia/sveltia-cms/issues/230))

### Development Guide

We’ll be adding a detailed development guide for integrating Sveltia CMS with Docusaurus in the near future. In the meantime, you can refer to the [Decap CMS documentation](https://decapcms.org/docs/docusaurus/), as the basic concepts are similar.

Source: https://sveltiacms.app/en/docs/frameworks/docusaurus

---

## Eleventy Integration Guide

This guide provides resources and information for integrating Sveltia CMS with [Eleventy](https://www.11ty.dev/) (11ty), a simple and flexible static site generator.

### Starter Templates

Here are some starter templates built by the community using Eleventy:

- [Eleventy starter template](https://github.com/danurbanowicz/eleventy-sveltia-cms-starter) by [danurbanowicz](https://github.com/danurbanowicz)
- [ZeroPoint](https://getzeropoint.com/) by [MWDelaney](https://github.com/MWDelaney)
- [Build Awesome Starter](https://github.com/anyblades/buildawesome-starters) by [anyblades](https://github.com/anyblades)
- [Huwindty](https://github.com/aloxe/huwindty) by [aloxe](https://github.com/aloxe)
- [Subtle](https://github.com/anyblades/subtle) by [anyblades](https://github.com/anyblades)

**Disclaimer**

These third-party resources are not necessarily reviewed by the Sveltia CMS team. We are not responsible for their maintenance or support. Please contact the respective authors for any issues or questions.

### Examples

See real-world examples of Eleventy integrations in our [Showcase](https://sveltiacms.app/en/showcase?framework=eleventy). Most of the listed sites include links to their source code, so you can explore how they implemented Sveltia CMS with Eleventy.

### Development Guide

We’ll be adding a detailed development guide for integrating Sveltia CMS with Eleventy in the near future. In the meantime, feel free to explore the starter templates and showcase examples for guidance.

Source: https://sveltiacms.app/en/docs/frameworks/eleventy

---

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

### Support for Hugo

We have implemented specific features to enhance the integration of Sveltia CMS with Hugo:

- [Entry-relative media folders](https://sveltiacms.app/en/docs/media/internal#using-entry-relative-folders): Store media files in folders relative to their associated entries, which is a common practice in Hugo projects called [page bundles](https://gohugo.io/content-management/page-bundles/).
- [Index file inclusion](https://sveltiacms.app/en/docs/collections/entries#managing-hugo-s-special-index-file): Manage Hugo’s [special `_index.md` files](https://gohugo.io/content-management/organization/#index-pages-_indexmd) for section entries.
- [Localizing entry slugs](https://sveltiacms.app/en/docs/i18n#localizing-entry-slugs): Generate localized slugs for [multilingual Hugo sites](https://gohugo.io/content-management/multilingual/) using the `translationKey` property of entries.
- [Manual entry reordering](https://sveltiacms.app/en/docs/collections/entries#managing-entry-order): Use the `reorder` option to add the [`weight` property](https://gohugo.io/methods/page/weight/) to entries for controlling their order in Hugo.
- [Entry redirects](https://sveltiacms.app/en/docs/collections/entries#managing-redirects): Out-of-the-box support for Hugo’s [`aliases` front matter property](https://gohugo.io/content-management/urls/#aliases), which is updated when the entry slug is changed in Sveltia CMS.

### Development Guide

We’ll be adding a detailed development guide for integrating Sveltia CMS with Hugo in the near future. In the meantime, you can refer to the [Decap CMS documentation](https://decapcms.org/docs/hugo/), as the basic concepts are similar.

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

### Support for Jekyll

We have implemented specific features to enhance the integration of Sveltia CMS with Jekyll:

- [Localizing entry slugs](https://sveltiacms.app/en/docs/i18n#localizing-entry-slugs): generate localized slugs for multilingual Jekyll sites.

### Development Guide

We’ll be adding a detailed development guide for integrating Sveltia CMS with Jekyll in the near future. In the meantime, you can refer to the [Decap CMS documentation](https://decapcms.org/docs/jekyll/), as the basic concepts are similar.

Source: https://sveltiacms.app/en/docs/frameworks/jekyll

---

## Middleman Integration Guide

This guide provides resources and information for integrating Sveltia CMS with [Middleman](https://middlemanapp.com/), a static site generator using Ruby.

### Examples

See real-world examples of Middleman integrations in our [Showcase](https://sveltiacms.app/en/showcase?framework=middleman). Most of the listed sites include links to their source code, so you can explore how they implemented Sveltia CMS with Middleman.

### Development Guide

We’ll be adding a detailed development guide for integrating Sveltia CMS with Middleman in the near future. In the meantime, you can refer to the [Decap CMS documentation](https://decapcms.org/docs/middleman/), as the basic concepts are similar.

Source: https://sveltiacms.app/en/docs/frameworks/middleman

---

## Next.js Integration Guide

This guide provides resources and information for integrating Sveltia CMS with [Next.js](https://nextjs.org/), a popular React framework for building server-side rendered and static websites.

### Examples

See real-world examples of Next.js integrations in our [Showcase](https://sveltiacms.app/en/showcase?framework=next). Most of the listed sites include links to their source code, so you can explore how they implemented Sveltia CMS with Next.js.

### Development Guide

We’ll be adding a detailed development guide for integrating Sveltia CMS with Next.js in the near future. In the meantime, you can refer to the [Decap CMS documentation](https://decapcms.org/docs/nextjs/), as the basic concepts are similar.

Source: https://sveltiacms.app/en/docs/frameworks/next

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

---

## Nuxt Integration Guide

This guide provides resources and information for integrating Sveltia CMS with [Nuxt](https://nuxt.com/), a popular Vue.js framework for building server-side rendered and static websites.

### Examples

See real-world examples of Nuxt integrations in our [Showcase](https://sveltiacms.app/en/showcase?framework=nuxt). Most of the listed sites include links to their source code, so you can explore how they implemented Sveltia CMS with Nuxt.

### Development Guide

We’ll be adding a detailed development guide for integrating Sveltia CMS with Nuxt in the near future. In the meantime, you can refer to the [Decap CMS documentation](https://decapcms.org/docs/nuxt/), as the basic concepts are similar.

Source: https://sveltiacms.app/en/docs/frameworks/nuxt

---

## SvelteKit Integration Guide

This guide provides resources and information for integrating Sveltia CMS with [SvelteKit](https://svelte.dev/docs/kit/introduction), a framework for building web applications using Svelte.

### Examples

See real-world examples of SvelteKit integrations in our [Showcase](https://sveltiacms.app/en/showcase?framework=sveltekit). Most of the listed sites include links to their source code, so you can explore how they implemented Sveltia CMS with SvelteKit.

### Development Guide

We’ll be adding a detailed development guide for integrating Sveltia CMS with SvelteKit in the near future. In the meantime, feel free to explore the showcase examples for guidance.

A key step in integrating Sveltia CMS with SvelteKit is using Vite’s [glob import](https://vite.dev/guide/features#glob-import) to load all your content files at once in [`+layout.js`](https://svelte.dev/docs/kit/load#Layout-data) or somewhere else in your SvelteKit app. Since SvelteKit uses Vite under the hood, you can take advantage of the `import.meta.glob` function without additional configuration. This allows you to easily access and manage your content within the SvelteKit framework.

Source: https://sveltiacms.app/en/docs/frameworks/sveltekit

---

## VitePress Integration Guide

This guide provides resources and information for integrating Sveltia CMS with [VitePress](https://vitepress.dev/), a static site generator powered by Vite and Vue.

### Examples

See real-world examples of VitePress integrations in our [Showcase](https://sveltiacms.app/en/showcase?framework=vitepress). Most of the listed sites include links to their source code, so you can explore how they implemented Sveltia CMS with VitePress.

### Support for VitePress

We have implemented specific features to enhance the integration of Sveltia CMS with VitePress:

- If an entry collection has only a Markdown `body` field, the [slug](https://sveltiacms.app/en/docs/collections/entries#managing-entry-slugs) and [summary](https://sveltiacms.app/en/docs/collections/entries#summaries) of the entries will be generated from a header in the Markdown content, if exists. ([Discussion](https://github.com/sveltia/sveltia-cms/issues/230))
- The [`folder` option](https://sveltiacms.app/en/docs/collections/entries#creating-an-entry-collection) for an entry collection can be an empty string (or `.` or `/`) if you want to store entries in the root folder. ([Discussion](https://github.com/sveltia/sveltia-cms/issues/230))

### Development Guide

We’ll be adding a detailed development guide for integrating Sveltia CMS with VitePress in the near future. In the meantime, you can refer to the [Decap CMS documentation](https://decapcms.org/docs/vitepress/), as the basic concepts are similar.

Source: https://sveltiacms.app/en/docs/frameworks/vitepress

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

### Support for Zola

We have implemented specific features to enhance the integration of Sveltia CMS with Zola:

- The [`omit_default_locale_from_file_path`](https://sveltiacms.app/en/docs/i18n#top-level-configuration) i18n option allows omitting the locale suffix from filenames for entries in the default locale, which is useful for [multilingual Zola sites](https://www.getzola.org/documentation/content/multilingual/). ([Discussion](https://github.com/sveltia/sveltia-cms/discussions/394))
- The [`value_type`](https://sveltiacms.app/en/docs/fields/number#value-type) number field option supports `int/string` and `float/string` value types, which are useful for Zola sites that store numbers as strings in front matter. ([Discussion](https://github.com/sveltia/sveltia-cms/issues/574))
- [Manual entry reordering](https://sveltiacms.app/en/docs/collections/entries#managing-entry-order): Use the `reorder` option to add the [`weight` property](https://www.getzola.org/documentation/content/section/#weight) to entries for controlling their order in Zola.
- [Entry redirects](https://sveltiacms.app/en/docs/collections/entries#managing-redirects): Out-of-the-box support for Zola’s [`aliases` front matter property](https://www.getzola.org/documentation/content/page/#front-matter), which is updated when the entry slug is changed in Sveltia CMS.

### Development Guide

We’ll be adding a detailed development guide for integrating Sveltia CMS with Zola in the near future. In the meantime, feel free to explore the starter templates and showcase examples for guidance.

Source: https://sveltiacms.app/en/docs/frameworks/zola
