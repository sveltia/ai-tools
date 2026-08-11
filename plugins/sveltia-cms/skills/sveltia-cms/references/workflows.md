# Workflows and Admin UI

Local development, editorial workflow, and the admin user interface.

Generated from the Sveltia CMS documentation. Do not edit by hand.

## Content Management Workflows

Sveltia CMS supports several workflows to accommodate different content management needs. Below are the available workflows:

### Development

[Local Development Workflow](https://sveltiacms.app/en/docs/workflows/local) is available for development and testing purposes. It allows you to run Sveltia CMS without needing to connect to a remote repository or authentication service.

### Production

There are two main workflows for production use:

- [Simple Workflow](https://sveltiacms.app/en/docs/workflows/simple): no review process, editors can directly commit changes to the main branch.
- [Editorial Workflow](https://sveltiacms.app/en/docs/workflows/editorial): includes a review and approval process before changes are merged into the main branch.

Additionally, the following feature enhances the content management experience:

- [Open Authoring](https://sveltiacms.app/en/docs/workflows/open): allows external contributors to submit changes via pull requests.

These production workflows can be used locally or remotely. Not all workflows are supported by every backend; refer to the specific workflow documentation for details.

**Future Plans**

We’re planning to introduce **Preview Workflow** in the future, which will allow editors to preview their changes before publishing them live. It would be a simplified version of Editorial Workflow, enabling content previews by creating a preview branch (pull/merge request) without a formal review process. Major hosting services like [Netlify](https://docs.netlify.com/deploy/deploy-types/deploy-previews/) and [Cloudflare Pages](https://developers.cloudflare.com/pages/configuration/preview-deployments/) support preview deployments from pull/merge requests, making this workflow feasible.

Source: https://sveltiacms.app/en/docs/workflows

---

## Editorial Workflow

This is an advanced remote workflow designed for teams that require a review process before changes are merged into the default branch. Editors can submit changes for review, and designated reviewers can approve or request modifications.

**Unimplemented**

This feature from Netlify/Decap CMS is not yet supported in Sveltia CMS. It will be added before the [1.0 release](https://sveltiacms.app/en/docs/roadmap#v1-0). Check our [release notes](https://sveltiacms.app/en/docs/releases#release-information) for updates.

### Use Cases

- Teams of content creators and editors working on collaborative projects.
- Projects that require a formal review and approval process for content changes.
- Situations where content quality and consistency are critical, necessitating oversight.
- Workflows that involve multiple stages of review, such as draft, review, and publish.

### Requirements

The [GitHub](https://sveltiacms.app/en/docs/backends/github) or [GitLab](https://sveltiacms.app/en/docs/backends/gitlab) backend must be used.

**Future Plans**

Support for the [Gitea/Forgejo](https://sveltiacms.app/en/docs/backends/gitea-forgejo) backend may be added in the future.

### Configuration

Add the `publish_mode` option to the top level of your CMS configuration file:

```yaml [YAML]
publish_mode: editorial_workflow
```

```toml [TOML]
publish_mode = "editorial_workflow"
```

```json [JSON]
{
  "publish_mode": "editorial_workflow"
}
```

```js [JavaScript]
{
  publish_mode: 'editorial_workflow',
}
```

Additionally, you can enable squash merging for pull/merge requests by adding the `squash_merges` option to the `backend` section of your configuration file. If this options is enabled, all commits in a pull/merge request will be squashed into a single commit when merged. Otherwise, a merge commit will be created.

```yaml [YAML]
backend:
  name: github
  repo: user/repo
  squash_merges: true
```

```toml [TOML]
[backend]
name = "github"
repo = "user/repo"
squash_merges = true
```

```json [JSON]
{
  "backend": {
    "name": "github",
    "repo": "user/repo",
    "squash_merges": true
  }
}
```

```js [JavaScript]
{
  backend: {
    name: 'github',
    repo: 'user/repo',
    squash_merges: true,
  },
}
```

See the [GitHub](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/incorporating-changes-from-a-pull-request/about-pull-request-merges#squash-and-merge-your-commits) or [GitLab](https://docs.gitlab.com/user/project/merge_requests/squash_and_merge/) documentation for more information about squash merging.

Source: https://sveltiacms.app/en/docs/workflows/editorial

---

## Local Development Workflow

Developers can smoothly work with local Git repositories using Sveltia CMS while running it on a local development server. This allows you to test and edit your content locally without needing to push changes to a remote repository first.

**Breaking changes from Netlify/Decap CMS**

Our local development workflow eliminates the need for a proxy server. For security and performance reasons, we don’t support `netlify-cms-proxy-server` or `decap-server`. The `local_backend` option is ignored. Read on to learn how to use the new, streamlined workflow.

**Another Option: Test Backend**

If you want to test the CMS but don’t want to modify local files, you can use the [Test backend](https://sveltiacms.app/en/docs/backends/test) instead. It lets you connect to a virtual file system in your browser, so you can test the CMS without affecting your local files.

### Use Cases

- Test Sveltia CMS locally before deploying it to a production environment.
- Edit the CMS configuration and see how it affects the CMS behavior.
- Make bulk changes to content files and assets and commit them at once.
- Work offline without an internet connection.

### Requirements

You must have a Git repository initialized in your project directory. You can create a new repository with [`git init`](https://github.com/git-guides/git-init) or clone an existing one.

You also need to have a local development server running for your frontend framework (e.g., Astro, Eleventy, Hugo, Next.js) and have installed Sveltia CMS in the project.

You need Google Chrome, Microsoft Edge, Brave, or any other Chromium-based browser. The workflow doesn’t work in Firefox, Safari, or other non-Chromium browsers, because this feature relies on the [File System Access API](https://developer.chrome.com/docs/capabilities/web-apis/file-system-access), which is only supported by Chromium-based browsers at this time.

Mozilla plans to [implement the API in Firefox](https://bugzilla.mozilla.org/show_bug.cgi?id=1909237), but it’s not available yet. We track Firefox support in [issue #38](https://github.com/sveltia/sveltia-cms/issues/38).

#### Enabling File System Access API in Brave

In the Brave browser, you must manually enable the File System Access API with an experiment flag to take advantage of the local development workflow.

1. Open `brave://flags/#file-system-access-api` in a new browser tab.
1. Click Default (Disabled) next to File System Access API and select Enabled.
1. Relaunch the browser.

### Configuration

In your CMS configuration, you must configure one of the supported Git backends: [GitHub](https://sveltiacms.app/en/docs/backends/github), [GitLab](https://sveltiacms.app/en/docs/backends/gitlab) or [Gitea/Forgejo](https://sveltiacms.app/en/docs/backends/gitea-forgejo). No other configuration is required.

**Authentication Not Required**

If you plan to only work with your local repository, you don’t need to set up authentication with your Git backend. You can use the CMS as a local-only editor UI and commit changes manually using Git. However, if you want to edit content remotely as well, you must set up authentication as described in the backend documentation.

**Repository Name Can Be Arbitrary**

If you don’t have a remote repository yet, you can use any repository name for the `repo` property in the backend configuration. The CMS doesn’t perform any Git operations, so it doesn’t matter if the repository actually exists or not. However, the backend configuration is still used to store data in the browser’s IndexedDB, which is partitioned by the backend `name` and `repo`. For this purpose, you can use a dummy name, such as `my-name/travel-blog`.

### Workflow

The local workflow consists of four main steps:

#### 1. Start the development server

Launch the local development server for your frontend framework, typically with `npm run dev`, `pnpm dev` or `yarn dev`.

#### 2. Edit content

In any Chromium-based browser:

1. Open `http://localhost:[port]/admin/index.html`. Replace `[port]` with the actual port number used by your development server.
1. Click “Work with Local Repository” and select the project’s root directory once prompted.
1. Edit your content normally using the CMS. All changes are made to local files.

#### 3. Preview changes

Open the dev site at `http://localhost:[port]/` in any browser to preview the rendered pages. To make further edits, return to the CMS.

#### 4. Commit changes

With any Git client (CUI or GUI):

1. See if the produced changes (diff) look good.
1. Commit and push the changes if satisfied, or discard them if you’re just testing.

### Tips & Tricks

- An indicator is displayed in the Account menu when using the local workflow.
- The `localhost` URL:
  - The port number varies by framework. Check the terminal output from the previous step. For example, if you use Vite-based frameworks like SvelteKit or VitePress, the default port is `5173`. Astro uses `4321`, Eleventy uses `8080`, Hugo uses `1313`, and Jekyll uses `4000`.
  - The `127.0.0.1` addresses can also be used instead of `localhost`.
  - If your CMS instance is not located under `/admin/`, use the appropriate path.
  - It’s recommended to use `index.html` in the URL to make sure the framework treats it as a static file. For example, use `http://localhost:5173/admin/index.html` instead of `http://localhost:5173/admin/`.
- Git clients:
  - You can use any Git client of your choice, including command-line tools (CUI) or graphical user interfaces (GUI).
  - For CUI, you can use the standard Git commands like `git diff`, `git commit`, and `git push`.
  - For GUI, popular options include [GitHub Desktop](https://github.com/apps/desktop), [Sourcetree](https://www.sourcetreeapp.com/), [Tower](https://www.git-tower.com/), and [GitKraken](https://www.gitkraken.com/). GitHub Desktop can be used for any repository, not just GitHub-hosted ones. [VS Code](https://code.visualstudio.com/docs/sourcecontrol/overview) also has built-in Git support.
- Depending on your framework, you may need to manually rebuild your site or reload the page to reflect the changes you have made. Check your framework’s documentation for details.
- You can skip the site preview check if your changes don’t involve any pages.

### Troubleshooting

- If you use Astro, don’t include Sveltia CMS in `/src/pages/admin.astro`. If you do, the admin page will be reloaded every time you make a change while working on your local development server. As the [start guide](https://sveltiacms.app/en/docs/start#manual-installation) says, the page has to be a static HTML file at `/public/admin/index.html`, where live reload is not applied.
- If you get an error saying “not a repository root directory”, make sure you’ve turned the folder into a repository with either a CUI ([`git init`](https://github.com/git-guides/git-init)) or GUI, and the hidden `.git` folder exists. While Sveltia CMS doesn’t read/write files inside the `.git` folder, it checks for the presence of the `.git` folder to verify that the selected folder is the project root and make sure changes made in the CMS can be tracked by Git.
- If you’re using Windows Subsystem for Linux (WSL), you may get an error saying “Can’t open this folder because it contains system files.” This is due to a limitation in the browser, and you can try some workarounds mentioned in [this issue](https://github.com/coder/code-server/issues/4646) and [this thread](https://github.com/sveltia/sveltia-cms/discussions/101).

### Limitations

The local repository support in Sveltia CMS doesn’t perform any Git operations. You have to manually fetch, pull, commit and push all changes using a Git client. Additionally, you’ll need to reload the CMS after modifying the configuration file or retrieving remote updates.

**Future Plans**

We will explore possibilities to add built-in Git operations in the CMS itself, possibly by integrating [isomorphic-git](https://isomorphic-git.org/), to enable committing changes directly from the CMS interface. The Netlify/Decap CMS proxy server actually has an experimental, undocumented Git mode that create commits locally. For more details, see discussion [#31](https://github.com/sveltia/sveltia-cms/discussions/31).

We also plan to use the newly available [File System Observer API](https://developer.chrome.com/blog/file-system-observer) to detect changes and eliminate the need for manual reloads.

Source: https://sveltiacms.app/en/docs/workflows/local

---

## Open Authoring

Open Authoring is a workflow that allows contributors to propose changes to a project without requiring direct write access to the repository. This is typically done through fork-and-pull request mechanisms, enabling a wider range of contributors to participate in content creation and editing.

**Unimplemented**

This feature from Netlify/Decap CMS is not yet supported in Sveltia CMS. It will be added before the [1.0 release](https://sveltiacms.app/en/docs/roadmap#v1-0). Check our [release notes](https://sveltiacms.app/en/docs/releases#release-information) for updates.

### Use Cases

- Open source projects that welcome contributions from the community.
- Projects that require a formal review process for external contributions.
- Situations where contributors may not have direct access to the main repository.
- Workflows that involve multiple stages of review and approval for external contributions.

### Requirements

The [GitHub](https://sveltiacms.app/en/docs/backends/github) backend must be used.

**Future Plans**

Support for other Git backends may be added in the future.

### Configuration

Add the `open_authoring` option to your CMS configuration’s `backend` settings:

```yaml [YAML]
backend:
  name: github
  repo: user/repo
  open_authoring: true
```

```toml [TOML]
[backend]
name = "github"
repo = "user/repo"
open_authoring = true
```

```json [JSON]
{
  "backend": {
    "name": "github",
    "repo": "user/repo",
    "open_authoring": true
  }
}
```

```js [JavaScript]
{
  backend: {
    name: 'github',
    repo: 'user/repo',
    open_authoring: true,
  },
}
```

Source: https://sveltiacms.app/en/docs/workflows/open

---

## Simple Workflow

This is the default remote workflow suitable for single users or small projects. There would be no review process, and changes are made directly to the repository.

### Use Cases

- Individual bloggers or content creators managing their own websites.
- Small teams or projects where a formal review process is unnecessary.
- Quick content updates or changes that do not require oversight.

### Requirements

No special requirements are needed to use the simple workflow. Users can start making changes directly after setting up their Sveltia CMS instance.

### Configuration

No specific configuration is required for this workflow.

### Workflow

The simple workflow allows users to create, edit, and delete entries directly in the connected Git repository without any review process. Here’s how it works:

1. Log in to Sveltia CMS using the standard OAuth authentication process or your access token.
2. Navigate to the desired collection from the collection list.
3. Create, edit, or delete entries as needed.
4. Save your changes. Sveltia CMS will automatically commit and push the changes to the connected Git repository.

### Deploying Changes

Changes made through Sveltia CMS are automatically committed and pushed to the connected repository’s default branch (e.g., `main` or `master`, unless the `branch` option is set). If you have set up CI/CD for your site, the changes will be deployed automatically based on your existing deployment process.

See the [deployments guide](https://sveltiacms.app/en/docs/deployments) for more details, including how to disable automatic deployments if needed.

### Multiple Editors

While this workflow is designed for single users, multiple editors can still collaborate by coordinating their changes. However, since there is no review process, it is essential to communicate effectively to avoid conflicts and ensure that everyone is aware of the changes being made.

At this time, Sveltia CMS does not provide built-in features for handling merge conflicts or simultaneous edits. We plan to add such features in future releases to enhance collaboration in the simple workflow.

Source: https://sveltiacms.app/en/docs/workflows/simple

---

## User Interface Overview

This section provides an overview of the application user interface (UI) of Sveltia CMS. It covers the main features and components of the UI, including navigation, content editing, asset management, and customization options.

### Accessing the Admin UI

You can access the Sveltia CMS admin user interface by navigating to the URL where you deployed the `index.html` file in your static files folder. For example, if you deployed your site to `https://example.com` and placed Sveltia CMS in the `admin` folder, you can access it at `https://example.com/admin/`.

### Main Components

#### Login Screen

The login screen allows users to authenticate with the configured backend using the regular OAuth flow or an access token. See each [backend documentation](https://sveltiacms.app/en/docs/backends) for more details on authentication methods.

When working locally, the [local workflow](https://sveltiacms.app/en/docs/workflows/local) option is also available, allowing you to select a local folder for storing content.

Users can sign in using the OAuth flow even locally. The OAuth client should allow `http://localhost` as a valid redirect URI for this to work.

#### Navigation

The Sveltia CMS UI features a global navigation bar at the top of the screen, providing easy access to key sections of the application listed below. It also includes a user menu for account settings and preferences.

There is also the Quick Add button (`+` icon) in the navigation bar, which allows users to quickly create a new entry or upload new assets from anywhere in the CMS.

#### Main Pages

The Sveltia CMS UI consists of several main pages:

- [Content Library](https://sveltiacms.app/en/docs/ui/content-library): Manage and organize your content entries.
- [Content Editor](https://sveltiacms.app/en/docs/ui/content-editor): Create and edit content entries.
- [Asset Library](https://sveltiacms.app/en/docs/ui/asset-library): Manage and upload media assets.

#### Account Menu

The account menu is accessible from the user avatar in the navigation bar. It provides access to:

- A link to the user’s profile page (if supported by the backend).
- A link to the live site. It’s customizable with the [`site_url` configuration option](https://sveltiacms.app/en/docs/customization#site-url).
- User Settings, including appearance, language, Content Editor preferences, and Developer Mode.
- Keyboard shortcuts reference.
- Sign In with Mobile option, which shows a QR code for passwordless sign-in on mobile devices.
- Sign Out option to log out of the CMS.

#### Settings Dialog

Users can personalize the application with various settings, including appearance and language. Developer Mode can also be enabled, which enables certain features and displays the CMS version number.

### General Features

Content editing in Sveltia CMS is designed to be intuitive and efficient. Key features include:

#### Themes

You can switch between light and dark themes in the CMS interface. The theme can be changed in the application settings. By default, it follows your system preference.

More appearance options will be added in future releases. Stay tuned!

#### Localization

The CMS interface is available in multiple languages. By default, it uses the language set in your browser, if supported. You can change the language at any time in the application settings. The CMS will remember your preference for future sessions.

Currently, the following languages are supported:

- Arabic
- Bulgarian
- Catalan
- Chinese (Simplified)
- Croatian
- Dutch
- English (Canada)
- English (UK)
- English (US)
- Finnish
- French
- Greek
- Japanese
- Korean
- Polish
- Portuguese (Brazil)
- Portuguese (Portugal)
- Russian
- Turkish
- Ukrainian

When the user’s language becomes available, the CMS will prompt them to switch to it. If the user dismisses the prompt, they can still change the language in the application settings.

**CSP Consideration**

If you’re using a strict Content Security Policy (CSP), you may need to add the `connect-src` directive with the value `https://unpkg.com` to your CSP header to allow the CMS to retrieve locale files for the admin interface other than English (US). See the [Setting up Content Security Policy](https://sveltiacms.app/en/docs/security#setting-up-content-security-policy) section for more details.

**Localizers Wanted**

Interested in contributing to Sveltia CMS localization? We welcome contributions from the community! You can help translate the CMS interface into your preferred language. Check out the [localization guide](https://github.com/sveltia/sveltia-cms/blob/main/src/lib/locales/README.md) for instructions on how to get started.

**Note for Netlify/Decap CMS users**

Unlike Netlify CMS and Decap CMS, Sveltia CMS does not require you to configure the app UI locale. The CMS automatically detects and applies your preferred language based on your browser settings. The `CMS.registerLocale` API method is a noop and the `locale` configuration option is ignored in Sveltia CMS.

#### Keyboard Shortcuts

The following keyboard shortcuts are available in the Sveltia CMS UI:

- View the Content Library: `Alt+1`
- View the Asset Library: `Alt+2`
- Search for entries and assets: `Ctrl+F` (Windows/Linux) or `Command+F` (macOS)
- Create a new entry: `Ctrl+E` (Windows/Linux) or `Command+E` (macOS)

#### Mobile Support

The Sveltia CMS UI is fully responsive and optimized for mobile devices, providing a seamless experience across different screen sizes, including smartphones and tablets.

When you use the CMS for the first time on desktop, it will show a notification suggesting you to try it on mobile for the best experience. It will show a QR code for passwordless sign-in. Your settings will be automatically copied when you sign via the QR code.

If you dismiss the notification, the mobile login option will still be available in the user menu.

#### Installing as an App

Sveltia CMS is a [progressive web app](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps) (PWA), which means you can [install it](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Installing) on your device and use it like a native application. Offline support is not available yet, but it will be added in a future release.

The application logo and title can be [customized](https://sveltiacms.app/en/docs/customization) with the `logo` and `app_title` configuration options. The default title is “Sveltia CMS”.

**CSP Consideration**

If you’re using a strict Content Security Policy (CSP), you may need to add the `manifest-src` directive with the value `blob:` to your CSP header to allow the CMS to be installed as an app. See the [Setting up Content Security Policy](https://sveltiacms.app/en/docs/security#setting-up-content-security-policy) section for more details.

#### Developer Mode

Developer Mode can be enabled from the Settings panel. When enabled, it provides additional features useful for developers, such as:

- Displays the Help menu in the navigation bar, including a link to the release notes with the current CMS version number.
- Additional debugging information in the browser console.
- The browser’s native context menu.

### Accessibility

Sveltia CMS is built with accessibility as a core principle, ensuring all users can effectively navigate and use the application.

**WCAG Compliance**

We’ll conduct an accessibility self-audit and address any issues before the 1.0 release to make sure Sveltia CMS meets the [WCAG 2.2 standard](https://w3c.github.io/wcag/guidelines/22/). If you encounter any accessibility issues, please report them by [creating an issue](https://github.com/sveltia/sveltia-cms/issues/new?type=bug) on our GitHub repository.

#### Keyboard Navigation

- Navigate through UI elements using the Tab, Space, Enter, and arrow keys.
- Other [keyboard shortcuts](#keyboard-shortcuts) are also available for common actions.
- Features that require mouse interaction, such as drag-and-drop, have alternative keyboard-accessible methods.
- Our [custom UI component library](https://github.com/sveltia/sveltia-ui) is designed for optimal keyboard usability without compromising accessibility.

#### Screen Reader Support

- Full [WAI-ARIA](https://w3c.github.io/aria/) support for screen readers like NVDA and VoiceOver.
- Announcements are read out when you navigate to another page.
- The rich text editor is built with [Lexical](https://lexical.dev/), which follows accessibility best practices and includes [Dragon NaturallySpeaking support](https://lexical.dev/docs/packages/lexical-dragon).

#### Visual Design

- Sufficient contrast between foreground text and background colors.
- Links are underlined by default for easy recognition (configurable in Accessibility Settings).

#### System Preferences

- Honors your operating system’s [reduced motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) and [reduced transparency](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-transparency) settings.
- Support for [high contrast mode](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-contrast) will be added in a future release.

### Supported Browsers

Sveltia CMS works with all modern browsers, but there are a few limitations because it utilizes some new web technologies:

- The [local workflow](https://sveltiacms.app/en/docs/workflows/local) requires a Chromium-based browser, including Chrome, Edge and Brave.
- Safari: The [Test backend](https://sveltiacms.app/en/docs/backends/test) requires version 26 or later; [image optimization](https://sveltiacms.app/en/docs/media/internal#image-optimization) is slower than in other browsers.
- Firefox Extended Support Release (ESR) and its derivatives, including Tor Browser and Mullvad Browser, are not officially supported, although they may still work.

Make sure to use the latest version of your browser for the best experience.

Source: https://sveltiacms.app/en/docs/ui

---

## Asset Library

Sveltia CMS’s Asset Library allows you to efficiently manage and organize your media files, including images, videos, and documents. It serves as a centralized hub for all your digital assets, making it easy to upload, categorize, and retrieve files as needed.

**Future Plans**

Currently, the Asset Library only supports the [internal media storage](https://sveltiacms.app/en/docs/media/internal). Support for external media storage providers, such as Amazon S3 and Uploadcare, will be added in future releases.

### Features

The Asset Library includes the following features:

#### Folder List

Navigate between the global media folder and collection-specific media folders. This allows you to organize assets at both the global level and within individual collections for more granular asset management.

#### Asset List

Thumbnails are displayed for image, video and PDF files for easy identification. You can switch between grid and list views, and sort or filter assets by name and file type.

Thumbnails of entries are also displayed in both grid and list views, making it easier to navigate and identify the assets you need.

#### Asset Upload

Upload multiple assets at once by browsing or dragging and dropping files directly into the library, including files in nested folders. When you delete an entry or asset file, the empty folder that contains it is also automatically deleted, so you don’t have to clean it up manually.

The CMS prevents the same file from being uploaded twice by comparing file hashes and selecting an existing asset instead.

#### Asset Search

Use the search functionality to quickly find specific assets. You can also filter assets by name or file type to narrow down results.

#### Asset Details

Preview image, audio, video, text and PDF files directly in the Asset Library. Check your site’s Content Security Policy (CSP) if the preview doesn’t work as expected.

View comprehensive asset details including:

- File size and dimensions
- Commit author and date information
- A list of entries that use the selected asset
- Exif metadata when available, including creation date and GPS coordinates displayed on a map

#### Asset Management

Manage your assets with a variety of operations:

- **Rename** existing assets. If the asset is used in any entries, the File and Image fields will be automatically updated with the new file path.
- **Replace** existing assets with new versions.
- **Edit** plain text assets, including Markdown, JSON, SVG files and other text-based content using the built-in editor.
- **Copy** the public URL, file path, text data, or image data of a selected asset to your clipboard.
- **Download** one or more selected assets at once.
- **Delete** one or more selected assets at once.

**Future Plans**

Image editing capabilities, such as cropping and resizing, will be added in future releases. Advanced DAM features, such as tagging and metadata management, are also planned for future updates.

Source: https://sveltiacms.app/en/docs/ui/asset-library

---

## Content Editor

Sveltia CMS provides a powerful Content Editor that allows users to create and modify content entries stored in their Git repository. This document outlines the key features and functionalities of the Content Editor.

### Features

The Content Editor includes the following features to enhance the content creation and editing experience:

#### Two-Pane Interface

If you have the [Preview Pane](#preview-pane) or [i18n support](#i18n-support) enabled, the Content Editor interface will split into two panes. By default, the Edit Pane is displayed on the left side, while the Preview Pane is on the right. This layout allows you to see a live preview of your content while editing. If the UI language is set to a right-to-left (RTL) language, the arrangement will be reversed.

The two-pane interface includes the following features:

- **Resizable Panes**: You can adjust the width of each pane by dragging the divider between them, allowing you to customize your workspace according to your preferences.
- **Scroll Synchronization**: When editing long entries, Sveltia CMS synchronizes the scroll position between the Edit Pane and the Preview Pane. This helps you see how your content will look as you write, without having to manually scroll both sections.
- **Click-to-Highlight**: Clicking on a field in the Preview Pane highlights the corresponding field in the Edit Pane. If the field is collapsed in the Edit Pane, it will automatically expand when clicked in the Preview Pane. This feature makes it easy to locate and edit specific fields based on their appearance in the preview.

#### Sidebar

The Content Editor includes a sidebar that provides additional information and tools related to the content you are editing. It’s currently only available on desktop and has three panels:

- **Validation**: Shows any [field validation](https://sveltiacms.app/en/docs/fields#field-validation) errors in the content. When you click on an error, the corresponding field in the editor will be highlighted.
- **History**: Shows the commit history of the current content file. When you click on a commit, you’ll see a diff view of the changes made in that commit on your Git provider. This panel is not available while using the [local development workflow](https://sveltiacms.app/en/docs/workflows/local).
- **Backlinks**: Shows all the content files that reference the current content file via [Relation fields](https://sveltiacms.app/en/docs/fields/relation). When you click on a backlink, you can open the referenced content file in the editor. For example, you can see all blog posts that reference a specific author or tag, which can be useful for quickly navigating between related content.

More panels and mobile support for the sidebar will be added in the future.

#### Auto-Saving Drafts

When creating or editing content, Sveltia CMS automatically saves draft backups in the browser’s local storage. This ensures that your work is not lost in case of accidental navigation away from the page or browser crashes. Drafts are saved periodically as you make changes and can be restored when you return to the editing interface.

Auto-saving draft can be disabled in User Preferences.

#### Revert Changes

The Content Editor includes Revert buttons that allow you to discard all unsaved changes or revert individual fields to their last saved state. This feature is useful if you want to undo changes made during the current editing session.

#### View on Live Site

The 3-dot menu in the Content Editor includes a View on Live Site option. This allows you to quickly open the live version of the entry you are editing, making it easy to check how the current content appears on the actual website.

#### View Source

When Developer Mode is enabled, the 3-dot menu in the Content Editor provides a View Source option. This allows you to quickly open the source file of the entry or asset in your Git repository, making it easy to review or edit the raw content.

#### I18n Support

If [internationalization](https://sveltiacms.app/en/docs/i18n) (i18n) is enabled in your Sveltia CMS configuration, the Content Editor provides support for managing translations of your content. You can switch between different language versions of the content you are editing, making it easy to create and maintain multilingual sites.

- **Language Switcher**: A language switcher is available in the editor interface, allowing you to select the desired language for editing and preview. If there are any errors or missing translations, they will be indicated in the switcher.
- **Translate Button**: A Translate button is provided to translate all or specific text-type fields using a third-party [translation service](https://sveltiacms.app/en/docs/integrations/translations). This feature can help speed up the process of creating translations for your content.
- **Copy Button**: A Copy button is available to copy content from one language version to another, facilitating the translation process.

See also the [Linking to Content Editor](#linking-to-content-editor) section for information on setting the editor pane locale via URL.

#### Keyboard Shortcuts

Sveltia CMS includes several keyboard shortcuts to enhance productivity while editing content.

- Save an entry: `Ctrl+S` (Windows/Linux) or `Command+S` (macOS)
- Cancel entry editing: `Escape`

Standard keyboard shortcuts are also available in the Markdown editor, including `Ctrl+B`/`Command+B` for bold text, `Ctrl+I`/`Command+I` for italics, and `Tab` to indent a list item.

### Linking to Content Editor

Sveltia CMS allows you to link directly to specific states of the Content Editor using URL query parameters. This can be useful for sharing links to specific entries or pre-filling fields when creating new entries.

#### Opening Specific Entries

You can link directly to the Content Editor for a specific entry in an [entry collection](https://sveltiacms.app/en/docs/collections/entries) using the following URL format:

```
https://YOUR_DOMAIN/admin/#/collections/COLLECTION_NAME/entries/ENTRY_ID
```

#### Dynamic Default Values

Sveltia CMS supports dynamic default values passed with URL query parameters. This allows pre-filling certain fields when creating new entries in an [entry collection](https://sveltiacms.app/en/docs/collections/entries).

The URL format for pre-filling fields is as follows:

```
https://YOUR_DOMAIN/admin/#/collections/COLLECTION_NAME/new?field1=value1&field2=value2
```

Where `field1`, `field2`, etc. are the names of the fields you want to pre-fill with `value1`, `value2`, etc. Some notes on using this feature:

- Make sure to [URL-encode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent) the parameter values.
- Use dot notation to target nested fields (e.g. `author.name=John%20Doe`).
- Use a comma-separated list (e.g. `tags=value1,value2`) or multiple query parameters (e.g. `tags=value1&tags=value2`) for multi-select fields.

For example, given the following collection configuration:

```yaml [YAML]
collections:
  - name: posts
    label: Posts
    folder: /content/posts
    fields:
      - name: title
        label: Title
      - name: author
        label: Author
        widget: object
        fields:
          - name: name
            label: Name
      - name: body
        label: Body
        widget: richtext
```

```toml [TOML]
[[collections]]
name = "posts"
label = "Posts"
folder = "/content/posts"
[[collections.fields]]
name = "title"
label = "Title"
[[collections.fields]]
name = "author"
label = "Author"
widget = "object"
[[collections.fields.fields]]
name = "name"
label = "Name"
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
      "label": "Posts",
      "folder": "/content/posts",
      "fields": [
        { "name": "title", "label": "Title" },
        {
          "name": "author",
          "label": "Author",
          "widget": "object",
          "fields": [{ "name": "name", "label": "Name" }]
        },
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
      label: "Posts",
      folder: "/content/posts",
      fields: [
        { name: "title", label: "Title" },
        {
          name: "author",
          label: "Author",
          widget: "object",
          fields: [{ name: "name", label: "Name" }],
        },
        { name: "body", label: "Body", widget: "richtext" },
      ],
    },
  ],
}
```

The following URL will open the new entry editor with the `title`, `author.name` and `body` fields pre-filled:

```
https://example.com/admin/#/collections/posts/new?title=My%20First%20Post&author.name=John%20Doe&body=Hello%2C%20world!
```

#### Editor Pane Locale

By default, Sveltia CMS uses the default locale for the Content Editor pane. However, you can specify a different locale for the editor pane using a URL query parameter when [i18n support](https://sveltiacms.app/en/docs/i18n) is enabled.

To set the editor pane locale, append the `_locale` query parameter to the CMS URL with the desired locale code. For example, to open the editor pane in French (`fr`), you would use the following URL:

```
https://YOUR_DOMAIN/admin/#/collections/COLLECTION_NAME/entries/ENTRY_ID?_locale=fr
```

For a new entry:

```
https://YOUR_DOMAIN/admin/#/collections/COLLECTION_NAME/new?_locale=fr
```

The query parameter can be combined with [dynamic default values](#dynamic-default-values) to pre-fill field values via URL.

### Saving Behavior

#### Save and Publish Options

When the `skip_ci` backend option is enabled, the Save button in the Content Editor has a dropdown menu that allows you to choose between two saving options. See the [Disabling Automatic Deployments](https://sveltiacms.app/en/docs/deployments#disabling-automatic-deployments) section for more details.

#### Auto-Close Editor

When you save your changes, the Content Editor automatically closes the editing interface and returns you to the collection or file list. This streamlines the workflow by reducing the number of clicks needed to return to the main interface after saving. If you prefer to stay in the editor after saving, you can change this behavior in User Preferences.

### Preview Pane

Developers can enhance the content editing experience by providing real-time previews of how the content will appear on the live site. Sveltia CMS offers several options for customizing and controlling the preview feature.

**Info**

Please note that, due to the nature of framework-agnostic design, we don’t plan to support live site previews that fetch data from the actual website. If you need this feature, consider using a framework-specific CMS solution.

#### Disabling Previews

Previews are enabled by default. However, if you want to disable the preview feature entirely, you can do so at different levels:

##### Global

Add the following configuration to the top level of your `config.yml` file:

```yaml [YAML]
editor:
  preview: false
```

```toml [TOML]
[editor]
preview = false
```

```json [JSON]
{
  "editor": {
    "preview": false
  }
}
```

```js [JavaScript]
{
  editor: {
    preview: false,
  },
}
```

##### Collection-Level

Add the same `editor` option to a specific collection in your `config.yml` file:

```yaml [YAML]
collections:
  - name: blog
    label: Blog
    folder: /content/blog
    editor:
      preview: false
```

```toml [TOML]
[[collections]]
name = "blog"
label = "Blog"
folder = "/content/blog"
[collections.editor]
preview = false
```

```json [JSON]
{
  "collections": [
    {
      "name": "blog",
      "label": "Blog",
      "folder": "/content/blog",
      "editor": {
        "preview": false
      }
    }
  ]
}
```

```js [JavaScript]
{
  collections: [
    {
      name: "blog",
      label: "Blog",
      folder: "/content/blog",
      editor: {
        preview: false,
      },
     },
  ],
}
```

##### File-Level

Add the same `editor` option to a specific file in your `config.yml` file:

```yaml
files:
  - name: about
    label: About Page
    file: /content/about.md
    editor:
      preview: false
```

```toml [TOML]
[[files]]
name = "about"
label = "About Page"
file = "/content/about.md"
[files.editor]
preview = false
```

```json [JSON]
{
  "files": [
    {
      "name": "about",
      "label": "About Page",
      "file": "/content/about.md",
      "editor": {
        "preview": false
      }
    }
  ]
}
```

```js [JavaScript]
{
  files: [
    {
      name: "about",
      label: "About Page",
      file: "/content/about.md",
      editor: {
        preview: false,
      },
     },
  ],
}
```

##### Field-Level

Add the `preview` option to a specific field in your `config.yml` file:

```yaml [YAML]
fields:
  - name: body
    label: Body
    widget: richtext
    preview: false
```

```toml [TOML]
[[fields]]
name = "body"
label = "Body"
widget = "richtext"
preview = false
```

```json [JSON]
{
  "fields": [
    {
      "name": "body",
      "label": "Body",
      "widget": "richtext",
      "preview": false
    }
  ]
}
```

```js [JavaScript]
{
  fields: [
    {
      name: "body",
      label: "Body",
      widget: "richtext",
      preview: false,
    },
  ],
}
```

#### Advanced Customization

Sveltia CMS allows developers to create custom preview templates and styles to provide a more accurate representation of how the content will appear on the live site.

- [Custom Preview Styles](https://sveltiacms.app/en/docs/api/preview-styles): Register custom CSS styles for the preview pane, allowing for better visual fidelity with the live site.
- [Custom Preview Templates](https://sveltiacms.app/en/docs/api/preview-templates): Create custom preview templates for specific collections or files, allowing for tailored preview experiences.

#### Live Preview

Sveltia CMS does not plan to support WYSIWYG live site previews that fetch data from the actual website, due to its framework-agnostic design. If you require this feature, consider using a framework-specific CMS solution.

#### User Settings

End-users can enable or disable the preview pane in the CMS UI using the menu located at the top-right corner of the editor interface. This preference is saved in the browser’s local storage, allowing users to maintain their preferred preview state across sessions.

Scroll syncing between the editor and preview panes is enabled by default. Users can toggle this feature on or off using the same editor menu.

Source: https://sveltiacms.app/en/docs/ui/content-editor

---

## Content Library

Manage your entries and files in one place. The Content Library provides a centralized location to organize, search, and manage all your contents efficiently.

### Features

#### Collection List

Displays all [collections](https://sveltiacms.app/en/docs/collections) with entry counts for quick access. [Singletons](https://sveltiacms.app/en/docs/collections/singletons) are marked distinctly to differentiate them from regular collections.

Customization options include:

- Collection labels can be defined using the `label` option in your collection configuration.
- Collection icons can be set using the [`icon` option](https://sveltiacms.app/en/docs/collections#icons) in your collection configuration.
- Dividers can be added between collections using the [`divider` option](https://sveltiacms.app/en/docs/collections#dividers) in your collection configuration.

#### Entry List

To access the Entry List, navigate to the Content Library and select a collection from the Collection List. Entries within a selected collection are displayed in a user-friendly, customizable list.

##### Entry Summaries

To customize the information displayed for each entry in the Entry List, you can define a [summary field](https://sveltiacms.app/en/docs/collections/entries#summaries) in your entry collection configuration. This allows you to highlight specific fields that are most relevant to your workflow. For file collections, the filename is used as the summary.

##### View Modes

Users can switch between list and grid views for better visualization of entries. The grid view is especially useful when entries have associated images. If no Image field is present, only the list view is available.

##### Sorting, Filtering and Grouping

Entry collections can be sorted, filtered, and grouped based on various criteria to help users find specific entries quickly. Users can sort entries by fields such as date created, date modified, title, or any custom field defined in the collection. Filtering options allow users to narrow down entries based on specific field values, while grouping helps organize entries into categories for easier navigation.

See [Managing Entry Views](https://sveltiacms.app/en/docs/collections/entries#managing-entry-views) for how to configure these options.

##### Associated Assets

Assets stored in a [collection media folder](https://sveltiacms.app/en/docs/media/internal#collection-level-configuration) are displayed alongside their respective entries for easy identification.

##### Bulk Actions

Users can select multiple entries to delete them at once, streamlining content management tasks.

#### Content Search

Instant full-text search across all entries and files helps you find content quickly. Search results are ranked by relevance to ensure you get the most pertinent results first.

Source: https://sveltiacms.app/en/docs/ui/content-library
