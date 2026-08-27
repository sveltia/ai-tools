# Admin User Interface

The content library, content editor and asset library that editors work in, plus UI customization and localization.

Generated from the Sveltia CMS documentation. Do not edit by hand.

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
- [Editorial Workflow](https://sveltiacms.app/en/docs/workflows/editorial#editorial-workflow-page): Manage entries before they are published or deleted. This page only appears when the advanced workflow is enabled.

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

You can switch between light and dark themes in the CMS interface. The theme setting is **Automatic** by default, meaning the CMS follows your system’s light or dark appearance and switches with it right away. You can pick Dark or Light at any time in the application settings.

More appearance options will be added in future releases. Stay tuned!

#### Localization

The CMS interface is available in various languages. The language setting is **Automatic** by default, meaning the CMS follows the language set in your browser — and switches as soon as you change it, without a page reload. You can pick a specific language at any time in the application settings, and the CMS will remember your choice for future sessions.

Currently, the following languages are supported:

<div class="lang-list">

- Arabic
- Bulgarian
- Catalan
- Chinese (China)
- Croatian
- Czech
- Danish
- Dutch
- English (Canada)
- English (UK)
- English (US)
- Finnish
- French
- German
- Greek
- Japanese
- Korean
- Polish
- Portuguese (Brazil)
- Portuguese (Portugal)
- Russian
- Spanish (Colombia)
- Swedish
- Turkish
- Ukrainian
- Vietnamese

</div>

If you have picked a specific language and your browser’s language later becomes available, the CMS will prompt you to switch to it. The prompt doesn’t appear on the Automatic setting, which already follows your browser. If you dismiss it, you can still change the language in the application settings.

**Compatibility Note**

The following languages are supported in Decap CMS but not yet available in Sveltia CMS:

<div class="lang-list">

- Chinese (Taiwan)
- [Hebrew](https://github.com/sveltia/sveltia-cms/issues/870)
- [Hungarian](https://github.com/sveltia/sveltia-cms/issues/315)
- [Italian](https://github.com/sveltia/sveltia-cms/issues/70)
- Lithuanian
- Macedonian
- Norwegian Bokmål
- Norwegian Nynorsk
- [Persian](https://github.com/sveltia/sveltia-cms/issues/531)
- [Romanian](https://github.com/sveltia/sveltia-cms/issues/711)
- Serbian (Cyrillic)
- Slovak
- Slovenian
- [Spanish (Spain)](https://github.com/sveltia/sveltia-cms/issues/281)
- Thai

</div>

Unlike Netlify CMS and Decap CMS, Sveltia CMS does not require you to configure the app UI locale. The CMS automatically detects and applies your preferred language based on your browser settings. The `CMS.registerLocale` API method is a noop and the `locale` configuration option is ignored in Sveltia CMS.

**CSP Consideration**

If you’re using a strict Content Security Policy (CSP), you may need to add the `connect-src` directive with the value `https://unpkg.com` to your CSP header to allow the CMS to retrieve locale files for the admin interface other than English (US). See the [Setting up Content Security Policy](https://sveltiacms.app/en/docs/security#setting-up-content-security-policy) section for more details.

**Localizers Wanted**

Interested in contributing to Sveltia CMS localization? We welcome contributions from the community! You can help translate the CMS interface into your preferred language. Check out the [localization guide](https://github.com/sveltia/sveltia-cms/blob/main/src/lib/locales/README.md) for instructions on how to get started.

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

If you have the [Preview Pane](#preview-pane) or [i18n support](#i18n-support) enabled, the Content Editor interface will split into two panes. By default, the Edit Pane is displayed on the left side, while the Preview Pane is on the right. This layout allows you to see a live preview of your content while editing. If the UI language is set to a right-to-left (RTL) language, the arrangement will be reversed. For that reason, the CMS UI calls them the first and second panes rather than the left and right panes.

The two-pane interface includes the following features:

- **Resizable Panes**: You can adjust the width of each pane by dragging the divider between them, allowing you to customize your workspace according to your preferences.
- **Scroll Synchronization**: When editing long entries, Sveltia CMS synchronizes the scroll position between the Edit Pane and the Preview Pane. This helps you see how your content will look as you write, without having to manually scroll both sections.
- **Click-to-Highlight**: Clicking on a field in the Preview Pane highlights the corresponding field in the Edit Pane. If the field is collapsed in the Edit Pane, it will automatically expand when clicked in the Preview Pane. This feature makes it easy to locate and edit specific fields based on their appearance in the preview.
- **Optional Second Pane**: If you’d rather edit at full width, you can hide the second pane with the Show Second Pane option in the editor menu. Your pane layout is remembered and restored when you bring it back. See [User Settings](#user-settings) for details.

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

#### Slug Editor

An entry’s slug is the identifier that appears in its file name and, in most setups, in its URL on your live site. A slug is set once, when the entry is created — usually [generated from a template](https://sveltiacms.app/en/docs/collections/entries#managing-entry-slugs) — and is not among the fields in the Edit Pane afterwards. To rename a saved entry, use the Edit Slug option in the 3-dot menu.

The dialog shows the entry’s current slug in a text field. If entry slugs are localized, there’s one field per locale. A slug cannot be empty, cannot contain slashes or whitespace, and cannot already be in use by another entry in the same collection, including entries awaiting review under the [Editorial Workflow](https://sveltiacms.app/en/docs/workflows/editorial). Whatever you type is normalized with your site’s [global slug options](https://sveltiacms.app/en/docs/collections/entries#global-slug-options) when you confirm.

The new slug takes effect when you save the entry, and saving does three things in a single commit:

- **Renames the file.** The entry moves to the file path matching its new slug. Git records this as a rename, so the file’s history is preserved.
- **Adds a redirect.** If the collection has a [`preview_path`](https://sveltiacms.app/en/docs/collections/entries#managing-preview-paths) option, the entry’s previous URL is recorded in its data so your framework can redirect visitors from the old URL to the new one. See [Managing Redirects](https://sveltiacms.app/en/docs/collections/entries#managing-redirects).
- **Updates references.** Every entry that points at this one through a [Relation field](https://sveltiacms.app/en/docs/fields/relation) is rewritten to reference the new slug, so no links between entries are left dangling. You can see which entries will be updated in the Backlinks panel of the [sidebar](#sidebar) before you save.

The Edit Slug option is unavailable where a slug can’t meaningfully change: on an entry you haven’t saved yet, on entries in [file and singleton collections](https://sveltiacms.app/en/docs/collections/files), on [Hugo’s special index file](https://sveltiacms.app/en/docs/collections/entries#managing-hugo-s-special-index-file), and in collections where [entry deletion is disabled](https://sveltiacms.app/en/docs/collections/entries#disabling-creation-and-deletion), because renaming an entry removes its old file.

To let users type the slug themselves when they create an entry, instead of having it generated from a template, see [Making Slugs Editable](https://sveltiacms.app/en/docs/collections/entries#making-slugs-editable). That option applies to entry creation only; renaming a saved entry always goes through this dialog.

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

Where `ENTRY_ID` is the entry’s file path within the collection folder, without the file extension. The same format works for a [file/singleton collection](https://sveltiacms.app/en/docs/collections/files), where `ENTRY_ID` is the file’s `name` in your configuration.

**Migrating from Netlify/Decap CMS**

Netlify/Decap CMS also accepts a shorthand for the same link, which it documents alongside its Open Authoring feature:

```
https://YOUR_DOMAIN/admin/#/edit/COLLECTION_NAME/ENTRY_ID
```

Sveltia CMS accepts it too and redirects to the URL above, so any link you’ve already shared keeps working. Use the full format for new links.

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

End-users can control the editor layout in the CMS UI using the menu located at the top-right corner of the editor interface. These preferences are saved in the browser, allowing users to maintain their preferred layout across sessions.

- **Show Second Pane**: Shows or hides the [second pane](#two-pane-interface), giving the Edit Pane the full width of the editor when it’s off. The option is unavailable when there’s nothing to put in the second pane, that is, when the entry has neither a preview nor a second locale. The pane layout, including any width you’ve set by dragging the divider, is remembered and restored when you turn the option back on.
- **Show Preview**: Chooses whether the second pane shows the preview. When [i18n support](#i18n-support) is enabled, turning it off puts another locale’s Edit Pane in the second pane instead.
- **Sync Scrolling**: Turns scroll synchronization between the two panes on or off. This is enabled by default.

Show Preview and Sync Scrolling only take effect while the second pane is visible, so both are unavailable when Show Second Pane is turned off.

These are display preferences only. To disable previews for everyone, use the configuration options described under [Disabling Previews](#disabling-previews).

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
