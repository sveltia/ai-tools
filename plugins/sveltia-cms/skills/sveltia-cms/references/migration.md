# Migration Guides

Migrating from Netlify CMS, Decap CMS or Static CMS, and upgrading from earlier Sveltia CMS versions.

Generated from the Sveltia CMS documentation. Do not edit by hand.

## Migration Guides

This document provides guidance on migrating from other CMS platforms to Sveltia CMS. Specific instructions are provided for Netlify/Decap CMS.

### Migrating from Other Platforms

Migrating from other CMS platforms to Sveltia CMS can vary in complexity depending on the source CMS. Below are guides for some of the more common platforms.

#### Netlify CMS or Decap CMS

Sveltia CMS is designed to be a direct [successor to Netlify CMS](https://sveltiacms.app/en/docs/successor-to-netlify-cms) (now Decap CMS). A migration from Netlify/Decap CMS to Sveltia CMS is intended to be as seamless as possible. This guide will walk you through the necessary steps to migrate your existing setup to Sveltia CMS.

- [Migrating from Netlify CMS or Decap CMS](https://sveltiacms.app/en/docs/migration/netlify-decap-cms)

Our [Showcase](https://sveltiacms.app/en/showcase) also features various sites that have been migrated from Netlify CMS and Decap CMS. Check out these examples to see how other users have successfully transitioned to Sveltia CMS.

- [Examples of sites migrated from Netlify CMS](https://sveltiacms.app/en/showcase?migrated-from=netlify-cms)
- [Examples of sites migrated from Decap CMS](https://sveltiacms.app/en/showcase?migrated-from=decap-cms)

#### Static CMS

Static CMS was a community fork of Netlify CMS that introduced several unique features. While we don’t have a full migration guide for Static CMS, many of the concepts and configurations are similar to those in Netlify CMS. We have documented some of the key differences and considerations when migrating from Static CMS to Sveltia CMS.

- [Migrating from Static CMS](https://sveltiacms.app/en/docs/migration/static-cms)

#### Pages CMS

Pages CMS is also inspired by Netlify CMS and shares similar concepts and configurations. Sveltia CMS has more features and flexibility, while Pages CMS offers a hosted solution with a more limited feature set.

We don’t have a dedicated migration guide for Pages CMS yet, but you can ask your AI assistant to convert your Pages CMS configuration to Sveltia CMS format. Check out the [Start Guide](https://sveltiacms.app/en/docs/start) for more information on how to get started with Sveltia CMS.

- [Examples of sites migrated from Pages CMS](https://sveltiacms.app/en/showcase?migrated-from=pages-cms)

#### Other Headless CMSs

We’ll continue to expand our migration resources to cover popular headless CMS platforms. If you are using a different CMS and are interested in migrating to Sveltia CMS, check back here for future migration guides or just look at the [Start Guide](https://sveltiacms.app/en/docs/start) to get started.

If your current CMS is Git-based, the migration process should be relatively straightforward. Typically, you will need to configure your Sveltia CMS setup to match your existing content structure.

See our [Showcase](https://sveltiacms.app/en/showcase) for examples of sites that have successfully migrated from other headless CMS platforms to Sveltia CMS.

- [Examples of sites migrated from DatoCMS](https://sveltiacms.app/en/showcase?migrated-from=datocms)
- [Examples of sites migrated from Keystatic](https://sveltiacms.app/en/showcase?migrated-from=keystatic)
- [Examples of sites migrated from TinaCMS](https://sveltiacms.app/en/showcase?migrated-from=tinacms)

#### Traditional CMSs

More and more users are choosing to switch from traditional CMS platforms, especially WordPress, to static sites powered by Sveltia CMS. This approach is often preferred by small site owners and developers because of its cost-effectiveness, performance, flexibility and security benefits.

The migration process involves exporting content as static files, typically in Markdown format, and creating a new site from scratch using your preferred framework. Our [Start Guide](https://sveltiacms.app/en/docs/start) can help you get started with Sveltia CMS.

Our [Showcase](https://sveltiacms.app/en/showcase) also features various sites that have been migrated from WordPress and other platforms, demonstrating the possibilities and benefits of using Sveltia CMS.

- [Examples of sites migrated from WordPress](https://sveltiacms.app/en/showcase?migrated-from=wordpress)
- [Examples of sites migrated from Joomla](https://sveltiacms.app/en/showcase?migrated-from=joomla)
- [Examples of sites migrated from Drupal](https://sveltiacms.app/en/showcase?migrated-from=drupal)
- [Examples of sites migrated from Ghost](https://sveltiacms.app/en/showcase?migrated-from=ghost)

#### Website Builders

Users are also migrating from website builders like Wix and Squarespace to Sveltia CMS. The migration process is similar to that of traditional CMS platforms, involving exporting content and creating a new site with Sveltia CMS.

See our [Showcase](https://sveltiacms.app/en/showcase) for examples of sites that have successfully migrated from these website builders to Sveltia CMS.

- [Examples of sites migrated from Wix](https://sveltiacms.app/en/showcase?migrated-from=wix)
- [Examples of sites migrated from Squarespace](https://sveltiacms.app/en/showcase?migrated-from=squarespace)
- [Examples of sites migrated from GoDaddy Website Builder](https://sveltiacms.app/en/showcase?migrated-from=godaddy)
- [Examples of sites migrated from Google Sites](https://sveltiacms.app/en/showcase?migrated-from=google-sites)
- [Examples of sites migrated from Webflow](https://sveltiacms.app/en/showcase?migrated-from=webflow)
- [Examples of sites migrated from Weebly](https://sveltiacms.app/en/showcase?migrated-from=weebly)

### Migrating from Earlier Versions of Sveltia CMS

See the detailed migration instructions here:

- [Migrating from Earlier Versions of Sveltia CMS](https://sveltiacms.app/en/docs/migration/earlier-versions)

Source: https://sveltiacms.app/en/docs/migration

---

## Migrating from Earlier Versions of Sveltia CMS

This page documents the key changes and deprecations when upgrading from earlier versions of Sveltia CMS.

### Breaking Changes

Check the [release notes](https://github.com/sveltia/sveltia-cms/releases?q=breaking+change&expanded=true) for other changes that may affect your project when upgrading to the latest version of Sveltia CMS.

### Version 0.x to 1.0

We’ll update this section with specific migration steps when we release version 1.0. For now, please refer to the deprecations listed below.

### Deprecations

These options were added to Sveltia CMS 0.x but are now deprecated and will be removed in version 1.0:

- The `automatic_deployments` backend option: Use the new [`skip_ci` option](https://sveltiacms.app/en/docs/deployments#disabling-automatic-deployments) instead, which is more intuitive. `automatic_deployments: false` is equivalent to `skip_ci: true`, and `automatic_deployments: true` is equivalent to `skip_ci: false`.
- The `save_all_locales` i18n option: Use the [`initial_locales` option](https://sveltiacms.app/en/docs/i18n#disabling-non-default-locale-content) instead, which provides more flexibility. `save_all_locales: false` is equivalent to `initial_locales: all`.
- The `omit_default_locale_from_filename` i18n option: Use the new `omit_default_locale_from_file_path` i18n option instead, which applies to all multiple files/folders structures, not just `multiple_files`.
- The `multiple_folders_i18n_root` i18n structure: Use the new `multiple_root_folders` i18n structure instead, which has a more intuitive name and the same file structure.
- The `slug_length` collection option: Use the `maxlength` option in the [global slug options](https://sveltiacms.app/en/docs/collections/entries#global-slug-options) instead.
- The `yaml_quote` collection option: `yaml_quote: true` is equivalent to `quote: double` in the [new YAML format options](https://sveltiacms.app/en/docs/data-output#controlling-data-output).
- The `read_only` [UUID field](https://sveltiacms.app/en/docs/fields/uuid) option: Use the [`readonly` common field option](https://sveltiacms.app/en/docs/fields#readonly) instead (which defaults to `true` for UUID fields).

The deprecated `logo_url` option will be removed in the future. Use the [new `logo.src` option](https://sveltiacms.app/en/docs/customization#custom-logo) instead.

Source: https://sveltiacms.app/en/docs/migration/earlier-versions

---

## Migrating from Netlify CMS or Decap CMS

Sveltia CMS is designed as a modern [successor to Netlify CMS](https://sveltiacms.app/en/docs/successor-to-netlify-cms) (now Decap CMS). If you are currently using Netlify/Decap CMS, you can migrate to Sveltia CMS to take advantage of its hundreds of improvements across the board, including better performance, a more intuitive user interface, enhanced asset management, improved i18n support, and more.

**Stable Version Not Yet Available**

Sveltia CMS is still in beta. Although it’s already being used in production by [many users](https://sveltiacms.app/en/showcase), there might still be breaking changes before the stable 1.0 release. We recommend keeping an eye on the [release information](https://sveltiacms.app/en/docs/releases#release-information) for any updates.

### Examples

Still not sure if Sveltia CMS is the right choice for you? Check out the following examples of sites that have been migrated from Netlify CMS and Decap CMS to see how other users have successfully transitioned to Sveltia CMS.

- [Examples of sites migrated from Netlify CMS](https://sveltiacms.app/en/showcase?migrated-from=netlify-cms)
- [Examples of sites migrated from Decap CMS](https://sveltiacms.app/en/showcase?migrated-from=decap-cms)

### Compatibility

We are making Sveltia CMS compatible with Netlify/Decap CMS wherever possible so that more users can seamlessly switch to our modern successor. In some casual use cases, Sveltia CMS can be used as a drop-in replacement for Netlify/Decap CMS with just a one-line code update.

However, 100% feature parity is never planned, and some features are still missing or will not be added due to deprecation and other factors. Look at the compatibility info below to see if you can migrate now or in the near future.

#### Current Limitations

- [Nested collections](https://decapcms.org/docs/collection-nested/) are not implemented yet.
- Type validation for CMS configuration is missing.
- Some [UI languages](https://sveltiacms.app/en/docs/ui#localization) are not yet available.

#### Features Not To Be Implemented

The following features will not be implemented in Sveltia CMS due to deprecation and other factors. If you rely on any of these features, you may need to find a workaround or wait until we develop an alternative solution.

##### Deprecated Features

Other than the recently deprecated [`logo_url` option](https://sveltiacms.app/en/docs/customization#custom-logo), we will not support any deprecated features in Netlify/Decap CMS:

- **Git Gateway backend**: Git Gateway has been [deprecated](https://docs.netlify.com/manage/security/secure-access-to-sites/git-gateway/) by Netlify. Due to its performance limitations, we don’t plan to support it anyway. However, we plan to develop a GraphQL-based high-performance alternative [in the future](https://sveltiacms.app/en/docs/roadmap) to provide a migration path for existing Git Gateway users.
- The deprecated client-side implicit grant for the GitLab backend: It has already been [removed from GitLab 15.0](https://gitlab.com/gitlab-org/gitlab/-/issues/344609). Use the [client-side PKCE authorization](https://sveltiacms.app/en/docs/backends/gitlab#pkce-authorization) instead.
- The deprecated Netlify Large Media service: Consider other [media storage providers](https://sveltiacms.app/en/docs/media).
- Deprecated camel case configuration options: Use snake case instead, according to the current Decap CMS document.
  - [Entry Collection](https://sveltiacms.app/en/docs/collections/entries): `sortableFields`
  - [DateTime](https://sveltiacms.app/en/docs/fields/datetime) field: `dateFormat`, `timeFormat`, `pickerUtc`
  - [Markdown](https://sveltiacms.app/en/docs/fields/markdown) field: `editorComponents`
  - [Number](https://sveltiacms.app/en/docs/fields/number) field: `valueType`
  - [Relation](https://sveltiacms.app/en/docs/fields/relation) field: `displayFields`, `searchFields`, `valueField`
  - Note: Some other camel case options, including Color field options, are not deprecated and will continue to work.
- The deprecated Date widget: It was removed from Decap CMS 3.0 and Sveltia CMS 0.10. Use the DateTime field type with the [`type: date` option](https://sveltiacms.app/en/docs/fields/datetime#date-only) instead.
- The deprecated [Uploadcare jQuery File Uploader](https://uploadcare.com/docs/uploads/file-uploader/): Sveltia CMS uses the API for [Uploadcare integration](https://sveltiacms.app/en/docs/media/uploadcare) to solve some issues. Users are prompted to enter their secret key to use the integration. This means the features found in the pre-built widget are currently unavailable. We plan to support some third-party upload sources, camera access and image editing in the future.

##### Other Features

The following features will not be implemented in Sveltia CMS due to various reasons:

- **Netlify Identity Widget**: It’s not useful without Git Gateway. We plan to develop an alternative solution with role support [in the future](https://sveltiacms.app/en/docs/roadmap).
  - [Netlify Identity](https://docs.netlify.com/manage/security/secure-access-to-sites/identity/overview/) was [deprecated](https://github.com/sveltia/sveltia-cms/discussions/284) in February 2025, but it has since been revived by Netlify. However, we still don’t plan to support it in Sveltia CMS.
- **Azure DevOps and Bitbucket backends**: For performance reasons. We’ll support these platforms if their APIs improve to allow the CMS to fetch multiple entries at once. Consider migrating to GitHub, GitLab, Gitea or Forgejo if you’d like to use Sveltia CMS now.
- [Gatsby plugin](https://github.com/decaporg/gatsby-plugin-decap-cms): In light of Gatsby’s [uncertainty](https://github.com/gatsbyjs/gatsby/discussions/39062), we won’t be investing time in developing a plugin for it. Gatsby users can still create `index.html` themselves. Note: We don’t support Netlify Identity Widget; the favicon can be specified with the `logo.src` option.
- Performance-related options: Sveltia CMS has [drastically improved performance](https://sveltiacms.app/en/docs/successor-to-netlify-cms#better-performance) with GraphQL enabled by default, so these are no longer relevant:
  - Global: [`search`](https://decapcms.org/docs/configuration-options/#search)
  - Backend: [`use_graphql`](https://decapcms.org/reference/config/backends/github/#graphql-api)
  - Relation field: `options_length`
- An absolute URL in the [`public_folder`](https://decapcms.org/docs/configuration-options/#public-folder) option: Such configuration is not recommended, as stated in the Netlify/Decap CMS document.
- The theme and keymap inline settings for the Code field, along with support for some languages. Instead of [CodeMirror](https://codemirror.net/), we use Lexical’s code block functionality powered by [Shiki](https://shiki.style/).
- The `allow_multiple` option for the File and Image fields: It’s a confusing option that defaults to `true`, and there is a separate option called `media_library.config.multiple`. We have added the new [`multiple`](https://sveltiacms.app/en/docs/fields/file#multiple) option instead, which is more intuitive and works with all media storage providers.
- Remark plugins for the Markdown field: Not compatible with our Lexical-based rich text editor. The `CMS.registerRemarkPlugin` method is a noop in Sveltia CMS.
- The `use_secure_url` option for the [Cloudinary media storage](https://sveltiacms.app/en/docs/media/cloudinary): Insecure URLs should never be used.
- Local proxy server: Our [local development workflow](https://sveltiacms.app/en/docs/workflows/local) eliminates the need for a proxy server. For security and performance reasons, we don’t support `netlify-cms-proxy-server` or `decap-server`. The `local_backend` option is ignored.
- The global [`locale`](https://decapcms.org/docs/configuration-options/#locale) option and `CMS.registerLocale` method: Sveltia CMS automatically detects the user’s preferred language and changes the [UI locale](https://sveltiacms.app/en/docs/ui#localization).
- The undocumented `getAsset` and `fields` parameters for the `toPreview` function of [custom editor components](https://sveltiacms.app/en/docs/api/editor-components): Sveltia CMS does not support these parameters because it automatically replaces image paths with blob URLs in the preview.
- [Undocumented methods](https://github.com/sveltia/sveltia-cms/blob/caf4a7e3030241ed1c964620af0f64b6e8606cab/src/lib/main.js#L41-L61) exposed on the `CMS` object: This includes custom backends and custom media storage providers, if any. We may support these features in the future, but our implementation would likely be incompatible with Netlify/Decap CMS.
- Any other undocumented features and options. Exceptions apply.

#### Other Breaking Changes

There are some differences in behavior between Sveltia CMS and Netlify/Decap CMS that may affect your existing configuration or content.

- [Decap CMS 3.1.1](https://github.com/decaporg/decap-cms/releases/tag/decap-cms%403.1.1) replaced Moment.js with Day.js for date handling, and In Sveltia CMS followed suit. Since [Day.js tokens](https://day.js.org/docs/en/display/format) are not 100% compatible with [Moment.js tokens](https://momentjs.com/docs/#/displaying/format/), this could be a breaking change in certain cases. Check your `format`, `date_format` and `time_format` options for DateTime fields, as well as any date formatting in [string transformations](https://sveltiacms.app/en/docs/string-transformations#date).
- By default, Sveltia CMS does not slugify uploaded filenames, as mentioned in the [asset management](https://sveltiacms.app/en/docs/successor-to-netlify-cms#better-asset-management) section. If your site generator expects hyphenated filenames, you can enable the `slugify_filename` [internal media storage option](https://sveltiacms.app/en/docs/media/internal#slugification-of-filenames).
- In some cases, the [data output](https://sveltiacms.app/en/docs/data-output) of Sveltia CMS may differ from that of Netlify/Decap CMS. Notably, Sveltia CMS does not omit empty optional fields by default. If you have data validation in your site generator, this could cause issues. Use the `omit_empty_optional_fields` [output option](https://sveltiacms.app/en/docs/data-output#controlling-data-output) if needed.
- Sveltia CMS requires a [secure context](https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts), meaning it only works with HTTPS, `localhost` or `127.0.0.1` URLs. If you’re running your own remote server and serving content over HTTP, the CMS will not work. We recommend obtaining a TLS certificate from [Let’s Encrypt](https://letsencrypt.org/).
- In Sveltia CMS, the `sanitize_preview` option for the [Markdown](https://sveltiacms.app/en/docs/fields/markdown) field type is set to `true` by default to prevent potential XSS attacks via entry previews. We recommend keeping this option enabled unless disabling it fixes a broken preview and you fully trust all users of your CMS.
- In Sveltia CMS, the `create` option for [entry collections](https://sveltiacms.app/en/docs/collections/entries) defaults to `true` because, in 99.99% of cases, users want to create new entries and adding `create: true` to every collection is redundant. To disable entry creation, set `create: false` explicitly.
- We provide only one npm package, `@sveltia/cms`, which includes all necessary code, while Netlify/Decap CMS provides [many packages](https://github.com/decaporg/decap-cms/tree/main/packages). This means `import` statement migration is not always straightforward. See the [migration steps](#migration-steps) below for details.

There may be other minor differences in behavior that are not listed here.

Sveltia CMS is also adding various config validation checks to help users identify potential issues, so you may see errors that were not present in Netlify/Decap CMS before. For example, Sveltia CMS raises an error if the `slug` collection option contains slashes (`/`), which is supposed to be invalid.

[Let us know](https://github.com/sveltia/sveltia-cms/issues/new?type=bug) if you have encounter any compatibility issues not mentioned above. We want to make the migration process as smooth as possible for our users.

### Migration Steps

#### Preparation

Check the [compatibility info](https://sveltiacms.app/en/docs/migration/netlify-decap-cms#compatibility) above to see if your site can be migrated now or in the near future. If there are no blockers, let’s move on to the migration steps.

##### Updating Configuration

Make necessary changes if needed, such as updating your configuration file.

##### Dealing with Unsupported Features

If you’re using any features listed in the [current limitations](#current-limitations) section, you’ll need to wait until they are implemented in Sveltia CMS. We’re working hard to add these features in the coming months.

If you’re using any [features that are not going to be implemented](#features-not-to-be-implemented), you’ll need to find a workaround. For example, if you’re on Azure DevOps or Bitbucket, consider migrating to GitHub, GitLab, Gitea or Forgejo. See the next section if you’re a Git Gateway user.

##### Migrating from Git Gateway Backend

Sveltia CMS does not support the deprecated Git Gateway backend. If you don’t care about user management with Netlify Identity, you can use the [GitHub](https://sveltiacms.app/en/docs/backends/github) or [GitLab](https://sveltiacms.app/en/docs/backends/gitlab) backend instead.

To allow other people to edit content, simply invite them to your GitHub repository with the write role assigned. Please note, however, that Sveltia CMS hasn’t implemented any mechanisms to prevent conflicts in multi-user scenarios.

Once you have migrated from the Git Gateway and Netlify Identity combo, you can remove the Netlify Identity Widget script tag from your HTML:

```diff
-<script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
```

If you want to stay with Git Gateway and Netlify Identity, unfortunately you can’t migrate to Sveltia CMS right now. We plan to develop an alternative solution [in the future](https://sveltiacms.app/en/docs/roadmap).

#### Switching to Sveltia CMS

Now, it’s time to switch to Sveltia CMS. Depending on how you included Netlify/Decap CMS in your project, follow the appropriate instructions below.

##### Using CDN

Replace the script tag that includes Netlify/Decap CMS with the following Sveltia CMS script tag:

```html
<script src="https://unpkg.com/@sveltia/cms/dist/sveltia-cms.js"></script>
```

From Netlify CMS:

```diff
-<script src="https://unpkg.com/netlify-cms@^2.0.0/dist/netlify-cms.js"></script>
+<script src="https://unpkg.com/@sveltia/cms/dist/sveltia-cms.js"></script>
```

From Decap CMS:

```diff
-<script src="https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js"></script>
+<script src="https://unpkg.com/@sveltia/cms/dist/sveltia-cms.js"></script>
```

Next, let’s [test Sveltia CMS on your local machine](https://sveltiacms.app/en/docs/workflows/local). If everything looks good, push the change to your repository.

You can now open `https://[hostname]/admin/` as usual to start editing. There is even no authentication process if you’re already signed in with a backend on Netlify/Decap CMS because Sveltia CMS uses your auth token stored in the browser. Simple enough!

##### Using Package Manager

Install Sveltia CMS:

```bash [npm]
npm install @sveltia/cms
```

```bash [yarn]
yarn add @sveltia/cms
```

```bash [pnpm]
pnpm add @sveltia/cms
```

```bash [bun]
bun add @sveltia/cms
```

Then, update your import statements accordingly.

From Netlify CMS:

```diff
-import CMS from 'netlify-cms-app'; // or 'netlify-cms'
+import CMS from '@sveltia/cms';
```

From Decap CMS:

```diff
-import CMS from 'decap-cms-app'; // or 'decap-cms'
+import CMS from '@sveltia/cms';
```

That’s it! You have successfully migrated to Sveltia CMS. Enjoy the improved performance and features.

#### Cleaning Up

You can uninstall the old Netlify/Decap CMS packages from your project to keep it clean. The packages vary depending on your setup, so uninstall all relevant ones.

A few notable changes to be aware of:

- The `netlify-cms-locales`/`decap-cms-locales` package and the `CMS.registerLocale` method are no longer needed, as Sveltia CMS automatically detects the user’s preferred language and changes the [UI locale](https://sveltiacms.app/en/docs/ui#localization) accordingly.
- If you were using `netlify-cms-proxy-server`/`decap-server`, you can stop using it and remove it from your setup. Sveltia CMS’s [local workflow](https://sveltiacms.app/en/docs/workflows/local) eliminates the need for a proxy server for improved security, performance and productivity. The `local_backend` option in your configuration file is no longer needed and can be removed. If you had configured a custom port number with the `.env` file, you can remove it as well.
- Sveltia CMS only publishes a single package called `@sveltia/cms`, which includes all necessary code, while Netlify/Decap CMS provides [many packages](https://github.com/decaporg/decap-cms/tree/main/packages). If you were using any other Netlify/Decap CMS packages, you may need to find alternatives or implement the functionality yourself.

#### JSON Schema Setup

For a better DX, we recommend [setting up the JSON schema](https://sveltiacms.app/en/docs/config-basics#validation-and-autocomplete) for the CMS configuration file in your code editor. If you have the YAML extension installed, VS Code may automatically apply the outdated Netlify CMS config schema to `config.yml`. To use the latest Sveltia CMS config schema instead, you need to specify its URL.

#### AI Tools

This documentation site provides an official Agent Skill and `llms.txt` files that you can use with AI agents like GitHub Copilot, Claude and ChatGPT to help them understand Sveltia CMS better. See [Working with AI](https://sveltiacms.app/en/docs/working-with-ai) for details.

#### Authentication

No changes are needed for authentication if you are using the GitHub, GitLab or Gitea/Forgejo backend. Sveltia CMS will use the existing auth tokens stored in the browser.

If you have set up an OAuth application for Netlify/Decap CMS, you can continue using it with Sveltia CMS. There is no need to create a new OAuth app.

**Note for Netlify Customers**

If you currently use Netlify to sign in with GitHub or GitLab and stay on Netlify, no changes are needed. Sveltia CMS works seamlessly with Netlify’s authentication system. However, if you’re moving to a different hosting service, you will need to use a different authentication method. See the [GitHub backend](https://sveltiacms.app/en/docs/backends/github#authentication) or [GitLab backend](https://sveltiacms.app/en/docs/backends/gitlab#authentication) documentation for more details.

#### Content Security Policy (CSP)

Unlike Netlify/Decap CMS, Sveltia CMS does not require the `unsafe-eval` and `unsafe-inline` keywords in the `script-src` CSP directive. However, new CSP rules may be needed depending on your configuration, such as the media storage providers you use. See [setting up Content Security Policy](https://sveltiacms.app/en/docs/security#setting-up-content-security-policy) for more information.

### Other Notable Differences

Some differences between Sveltia CMS and Netlify/Decap CMS may affect your existing configuration or content. Here are some notable ones to be aware of:

#### Terminology

Some features have different names in Sveltia CMS compared to Netlify/Decap CMS. These differences are mostly cosmetic, and the underlying concepts remain the same. There are no changes in functionality.

| Netlify/Decap CMS | Sveltia CMS |
| --- | --- |
| [Media library](https://decapcms.org/docs/configuration-options/#media-library) | [Media storage provider](https://sveltiacms.app/en/docs/media) |
| [Folder collection](https://decapcms.org/docs/collection-folder/) | [Entry collection](https://sveltiacms.app/en/docs/collections/entries) |
| [Widget](https://decapcms.org/docs/widgets/) | [Field type](https://sveltiacms.app/en/docs/fields) |
| [Summary string transformation](https://decapcms.org/docs/summary-strings/) | [String transformation](https://sveltiacms.app/en/docs/string-transformations) |

#### Content Editing Experience

Sveltia CMS marks required fields for efficient data entry. This is the opposite of Netlify/Decap CMS, which marks optional fields. This change aims to reduce visual clutter and help users focus on the essential fields that must be filled out.

When [i18n support](https://sveltiacms.app/en/docs/i18n) is enabled, Sveltia CMS requires all locales to have values for required fields. In contrast, Netlify/Decap CMS only enforces this for the default locale. This change ensures that content is complete across all locales. If you rely on the previous behavior, you can set the `required` [field-level configuration](https://sveltiacms.app/en/docs/i18n#field-level-configuration) to include only specific locales.

#### Data Output

The data output conventions of Sveltia CMS may differ from that of Netlify/Decap CMS in some cases. See the [data output](https://sveltiacms.app/en/docs/data-output#data-output-conventions) documentation for details.

You don’t need to manually update your existing content — the CMS automatically handles these differences when loading existing content. However, there are two notable differences to be aware of:

- Sveltia CMS does not omit empty optional fields by default. If you have data validation in your framework, this could cause issues. Use the `omit_empty_optional_fields` [output option](https://sveltiacms.app/en/docs/data-output#controlling-data-output) if needed.
- Markdown uses soft line breaks (single line breaks) instead of hard line breaks (escaped line breaks `\`). In your framework, you may need to [enable the appropriate option](https://sveltiacms.app/en/docs/how-tos#rendering-soft-line-breaks-as-hard-line-breaks-in-markdown) to render soft line breaks as hard line breaks.

#### Preview Styles

Sveltia CMS comes with a minimum default preview style to ensure better readability. If you have [custom preview styles](https://sveltiacms.app/en/docs/api/preview-styles) for Netlify/Decap CMS, you could remove them or adapt them to Sveltia CMS, which shows field labels in the preview by default.

Source: https://sveltiacms.app/en/docs/migration/netlify-decap-cms

---

## Migrating from Static CMS

Sveltia CMS provides partial compatibility with [Static CMS](https://github.com/StaticJsCMS/static-cms), an archived fork of Netlify CMS. Since Static CMS was archived over a year ago, we don’t plan to implement additional compatibility beyond what’s listed below. However, we may still adopt some of their features that we find useful.

### Compatibility

Static CMS made [some breaking changes](https://staticjscms.netlify.app/docs/decap-migration-guide) while Sveltia CMS mostly follows Netlify/Decap CMS, so you should review your configuration carefully.

#### Configuration Options

- Sveltia CMS supports the [`sortable_fields`](https://sveltiacms.app/en/docs/collections/entries#sorting), [`view_filters`](https://sveltiacms.app/en/docs/collections/entries#filtering) and [`view_groups`](https://sveltiacms.app/en/docs/collections/entries#grouping) options with the new `default` option. We still support the legacy Netlify/Decap CMS format as well, so you can use either format for these options.
- Directory navigation in the Asset Library is partially supported in Sveltia CMS. If you define [collection-specific `media_folder`s](https://sveltiacms.app/en/docs/media/internal#collection-level-configuration), these folders will be displayed in the Asset Library and Select File/Image dialog. We plan to implement the display of subfolders within a configured folder in Sveltia CMS 2.0. We don’t plan to support the `folder_support` and `display_in_navigation` options for `media_library`; subfolders will be displayed with no configuration. ([#301](https://github.com/sveltia/sveltia-cms/issues/301))
- The `logo_link` global option will not be supported. Use `display_url` or `site_url` instead.
- The `yaml` global option will not be supported, as Sveltia CMS does not expose underlying `yaml` library options for forward compatibility reasons. However, we do have some [data output options](https://sveltiacms.app/en/docs/data-output#controlling-data-output), including YAML indentation and quotes.

#### I18n Support

- The `enforce_required_non_default` i18n option will not be supported. Sveltia CMS enforces required fields in all locales by default. However, the `initial_locales` i18n option allows users to [disable non-default locales](https://sveltiacms.app/en/docs/i18n#disabling-non-default-locale-content) if needed. Developers can also specify a subset of locales with the `required` field option, e.g. `required: [en]`.

#### Widgets

- The date/time format options for the DateTime widget are **not compatible** since Static CMS [switched to date-fns](https://staticjscms.netlify.app/docs/decap-migration-guide#dates) while Decap CMS and Sveltia CMS have replaced Moment.js with Day.js. Update your formats accordingly.
- The [KeyValue widget](https://sveltiacms.app/en/docs/fields/keyvalue) is implemented in Sveltia CMS with the same options.
- The [UUID widget](https://sveltiacms.app/en/docs/fields/uuid) is also implemented, but with different options.
- The `prefix` and `suffix` options for the Boolean, Number and String widgets are implemented as `before_input` and `after_input` in Sveltia CMS, respectively. Our `prefix` and `suffix` options for the String widget are literally a prefix and suffix to the value.
- The `multiple` option for the File and Image widgets is supported in Sveltia CMS, along with the `min` and `max` options.
- The [breaking change to the List widget](https://staticjscms.netlify.app/docs/decap-migration-guide#list-widget) doesn’t apply to Sveltia CMS. You must use the `field` (singular) option to produce a single subfield with [no `name` output](https://sveltiacms.app/en/docs/data-output#understanding-exceptions).

#### Customization

- `CMS.registerIcon()` will not be supported, as Sveltia CMS includes the Material Symbols font for [custom collection icons](https://sveltiacms.app/en/docs/collections#icons) that doesn’t require manual registration.

Source: https://sveltiacms.app/en/docs/migration/static-cms
