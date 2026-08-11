# Media Storage

Media folder configuration and internal Git-based storage. For third-party services, see `media-external.md`.

Generated from the Sveltia CMS documentation. Do not edit by hand.

## Media Storage

Sveltia CMS supports multiple media storage providers for managing media assets such as images and files. You can choose from the built-in internal media storage that saves files directly in your Git repository, or integrate with popular cloud-based media storage services for enhanced capabilities.

**Note for Netlify/Decap CMS users**

In Sveltia CMS, the term “media storage provider” is used instead of “media library” to avoid confusion with Sveltia CMS’s [Asset Library feature](https://sveltiacms.app/en/docs/ui/asset-library) that allows you to manage media assets from multiple sources in one place. There is no change in functionality or configuration; it’s simply a terminology update.

### Internal Storage

The [internal media storage](https://sveltiacms.app/en/docs/media/internal) allows you to store media files directly in your Git repository along with your content files. It supports various configuration options for organizing and managing media files effectively.

### External Storage

Sveltia CMS supports integrations with popular cloud-based media storage providers for enhanced capabilities such as automatic image transformations, CDN delivery, and more. Sveltia CMS currently supports the following external media storage providers:

- [Amazon S3](https://sveltiacms.app/en/docs/media/amazon-s3)
- S3-compatible providers:
  - [Backblaze B2](https://sveltiacms.app/en/docs/media/backblaze-b2)
  - [Cloudflare R2](https://sveltiacms.app/en/docs/media/cloudflare-r2)
  - [DigitalOcean Spaces](https://sveltiacms.app/en/docs/media/digitalocean-spaces)
  - [Scaleway Object Storage](https://sveltiacms.app/en/docs/media/scaleway-object-storage)
  - [Supabase Storage](https://sveltiacms.app/en/docs/media/supabase-storage)
- [Cloudinary](https://sveltiacms.app/en/docs/media/cloudinary)
- [Uploadcare](https://sveltiacms.app/en/docs/media/uploadcare)

Unlike backends, you can use multiple storage providers simultaneously in Sveltia CMS. Each media storage provider integration includes its own configuration instructions.

**Breaking changes from Netlify/Decap CMS**

Sveltia CMS does not support the deprecated **Netlify Large Media** service. If you’re using it with Netlify/Decap CMS, you will need to migrate your assets to one of the supported providers mentioned above.

Also, Sveltia CMS does not support the undocumented custom media storage provider API. The `CMS.registerMediaLibrary` method is a noop in Sveltia CMS. We may add support for custom storage providers in future releases, though compatibility with existing Netlify/Decap CMS custom media libraries is not guaranteed.

**Future Plans**

More integration options, such as Cloudflare Images, will be added in the future.

### Configuration

Relevant configuration options can be set in the `media_folder`, `public_folder`, and `media_libraries` options of your CMS configuration file. The `media_library` option from Netlify/Decap CMS is also supported for backward compatibility.

The following example demonstrates how to configure multiple providers in Sveltia CMS:

```yaml [YAML]
# Default media storage paths
media_folder: /public/media
public_folder: /media

# Media provider features
media_libraries:
  default:
    config:
      max_file_size: 1024000 # default: Infinity
      slugify_filename: true # default: false
      transformations: # See the documentation for details
  cloudinary:
    config:
      cloud_name: YOUR_CLOUD_NAME
      api_key: YOUR_API_KEY
    output_filename_only: true
  uploadcare:
    config:
      publicKey: YOUR_PUBLIC_KEY
    settings:
      autoFilename: true
      defaultOperations: '/resize/800x600/'
```

```toml [TOML]
# Default media storage paths
media_folder = "/public/media"
public_folder = "/media"

# Media provider features
[media_libraries.default]
[media_libraries.default.config]
max_file_size = 1024000 # default: Infinity
slugify_filename = true # default: false
# transformations: See the documentation for details

[media_libraries.cloudinary]
[media_libraries.cloudinary.config]
cloud_name = "YOUR_CLOUD_NAME"
api_key = "YOUR_API_KEY"
output_filename_only = true

[media_libraries.uploadcare]
[media_libraries.uploadcare.config]
publicKey = "YOUR_PUBLIC_KEY"

[media_libraries.uploadcare.settings]
autoFilename = true
defaultOperations = "/resize/800x600/"
```

```json [JSON]
{
  "media_folder": "/public/media",
  "public_folder": "/media",
  "media_libraries": {
    "default": {
      "config": {
        "max_file_size": 1024000,
        "slugify_filename": true
      }
    },
    "cloudinary": {
      "config": {
        "cloud_name": "YOUR_CLOUD_NAME",
        "api_key": "YOUR_API_KEY"
      },
      "output_filename_only": true
    },
    "uploadcare": {
      "config": {
        "publicKey": "YOUR_PUBLIC_KEY"
      },
      "settings": {
        "autoFilename": true,
        "defaultOperations": "/resize/800x600/"
      }
    }
  }
}
```

```js [JavaScript]
{
  media_folder: "/public/media",
  public_folder: "/media",
  media_libraries: {
    default: {
      config: {
        max_file_size: 1024000,
        slugify_filename: true,
      },
    },
    cloudinary: {
      config: {
        cloud_name: "YOUR_CLOUD_NAME",
        api_key: "YOUR_API_KEY",
      },
      output_filename_only: true,
    },
    uploadcare: {
      config: {
        publicKey: "YOUR_PUBLIC_KEY",
      },
      settings: {
        autoFilename: true,
        defaultOperations: "/resize/800x600/",
      },
    },
  },
}
```

See the individual media storage provider documentation for specific configuration options and details.

**Legacy `media_library` Option**

Sveltia CMS supports the legacy `media_library` option for backward compatibility with Netlify/Decap CMS, but it is recommended to use the `media_libraries` option for new configurations. With the legacy option, only a single media storage provider can be configured. Here is an example of configuring Cloudinary using the legacy option:

```yaml
media_library:
  name: cloudinary
  config:
    cloud_name: YOUR_CLOUD_NAME
    api_key: YOUR_API_KEY
  output_filename_only: true
```

### Additional Features

A couple of additional features are available to enhance your media management experience. These features can be applied to both internal and external storage providers, except for Cloudinary, which uses its own media library widget.

The configuration goes in the `media_libraries` option, under the `all` key, which applies to all media storage providers.

#### Image Optimization

You can enable automatic image optimization by configuring the `transformations` option in the `media_libraries` configuration. This allows you to specify how uploaded images should be processed and optimized before being stored.

For example, you can convert raster images to WebP format, resize them to a maximum dimension, and optimize SVG files.

```yaml [YAML]{3-10}
media_libraries:
  all:
    transformations:
      raster_image: # original format
        format: webp # new format, only `webp` is supported
        quality: 85 # default: 85
        width: 2048 # default: original size
        height: 2048 # default: original size
      svg:
        optimize: true
```

```toml [TOML]{2-9}
[media_libraries.all]
[media_libraries.all.transformations]
[media_libraries.all.transformations.raster_image]
format = "webp"
quality = 85
width = 2048
height = 2048
[media_libraries.all.transformations.svg]
optimize = true
```

```json [JSON]{4-14}
{
  "media_libraries": {
    "all": {
      "transformations": {
        "raster_image": {
          "format": "webp",
          "quality": 85,
          "width": 2048,
          "height": 2048
        },
        "svg": {
          "optimize": true
        }
      }
    }
  }
}
```

```js [JavaScript]{4-14}
{
  media_libraries: {
    all: {
      transformations: {
        raster_image: {
          format: "webp",
          quality: 85,
          width: 2048,
          height: 2048,
        },
        svg: {
          optimize: true,
        },
      },
    },
  },
}
```

Then, whenever a user selects images to upload, those images are automatically optimized, all within the browser. Raster images such as JPEG and PNG are converted to WebP format and resized if necessary. SVG images are minified using the [SVGO](https://github.com/svg/svgo) library.

In case you’re not aware, [WebP](https://developers.google.com/speed/webp) offers better compression than conventional formats and is now [widely supported](https://caniuse.com/webp) across major browsers. So there is no reason not to use WebP on the web.

- `raster_image` applies to any supported raster image format: `avif`, `bmp`, `gif`, `jpeg`, `png` and `webp`. If you like, you can use a specific format as key instead of `raster_image`.
- The `width` and `height` options are the maximum width and height, respectively. If an image is larger than the specified dimension, it will be scaled down. Smaller images will not be resized.
- File processing is a bit slow on Safari because [native WebP encoding](https://caniuse.com/mdn-api_htmlcanvaselement_toblob_type_parameter_webp) is [not supported](https://bugs.webkit.org/show_bug.cgi?id=183257) and the [jSquash](https://github.com/jamsinclair/jSquash) library is used instead.
- AVIF conversion is not supported because no browser has native AVIF encoding support ([Chromium won’t fix it](https://issues.chromium.org/issues/40848792)) and the third-party library (and AVIF encoding in general) is very slow.
- This feature is not intended for creating image variants in different formats and sizes. It should be done with a framework during the build process. Popular frameworks like [Astro](https://docs.astro.build/en/guides/images/), [Eleventy](https://www.11ty.dev/docs/plugins/image/), [Hugo](https://gohugo.io/content-management/image-processing/), [Next.js](https://nextjs.org/docs/pages/api-reference/components/image) and [SvelteKit](https://svelte.dev/docs/kit/images) have built-in image processing capabilities.
- Exif metadata is stripped from raster images to reduce file size. If you want to keep it, upload the original files without optimization and use the framework to process them later.

**Future Plans**

We may add more transformation options in the future.

#### File Size Limits

If you want to restrict the maximum file size for uploads, you can set the `max_file_size` option (in bytes) in the `media_libraries` configuration at the top level, collection level, or field level. The default value is `Infinity`, meaning there is no limit.

For example, to set a maximum file size of 1 MB for all uploads, add the following to your `config.yml`:

```yaml [YAML]{3}
media_libraries:
  all:
    max_file_size: 1024000
```

```toml [TOML]{2}
[media_libraries.all]
max_file_size = 1024000
```

```json [JSON]{4}
{
  "media_libraries": {
    "all": {
      "max_file_size": 1024000
    }
  }
}
```

```js [JavaScript]{4}
{
  media_libraries: {
    all: {
      max_file_size: 1024000,
    },
  },
}
```

#### Slugification of Filenames

Some frameworks and static site generators have restrictions on filenames, such as not allowing spaces or special characters. To ensure compatibility, you can enable filename slugification by setting the `slugify_filename` option to `true` in the `media_libraries` configuration.

```yaml [YAML]{3}
media_libraries:
  all:
    slugify_filename: true
```

```toml [TOML]{2}
[media_libraries.all]
slugify_filename = true
```

```json [JSON]{4}
{
  "media_libraries": {
    "all": {
      "slugify_filename": true
    }
  }
}
```

```js [JavaScript]{4}
{
  media_libraries: {
    all: {
      slugify_filename: true,
    },
  },
}
```

Once enabled, any uploaded file will have its filename converted to a URL-friendly format, according to the [global slug options](https://sveltiacms.app/en/docs/collections/entries#global-slug-options).

Source: https://sveltiacms.app/en/docs/media

---

## Internal Media Storage

The internal media storage in Sveltia CMS uses the repository’s file system to store and manage media assets such as images and files. It provides a simple and effective way to handle media uploads directly within the CMS interface. Some additional features, such as image optimization and file size limits, are also available to enhance the media management experience.

**Considerations**

The internal storage (Git repository) may not be suitable for a large number of media files or very large files, as it can lead to performance issues with Git operations. It’s particularly true for the [GitHub backend](https://sveltiacms.app/en/docs/backends/github) that does not support Git LFS (Large File Storage) at this time. In such cases, consider using [external storage](https://sveltiacms.app/en/docs/media#external-storage).

### Requirements

No special requirements are needed to use the internal media storage, as it works with any backend supported by Sveltia CMS.

### Configuring Folder Paths

You can configure the folder paths for storing and accessing media files in the internal media storage at three levels: top-level, collection-level, and field-level. The settings at each level override the ones at the previous level.

#### Top-Level Configuration

Define the internal media storage settings in your `config.yml` file using the `media_folder` and `public_folder` options at the root level.

```yaml [YAML]
media_folder: /public/uploads
public_folder: /uploads
```

```toml [TOML]
media_folder = "/public/uploads"
public_folder = "/uploads"
```

```json [JSON]
{
  "media_folder": "/public/uploads",
  "public_folder": "/uploads"
}
```

```js [JavaScript]
{
  media_folder: "/public/uploads",
  public_folder: "/uploads",
}
```

##### Media Folder

The `media_folder` option specifies the folder in the repository where media files will be stored. Check your framework’s static assets handling to choose an appropriate folder.

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

A few notes about this option:

- It must be an absolute path relative to the root of the repository.
- Although the leading slash can be omitted, it is recommended to include it for clarity.
- To use the repository’s root folder, set this option to a slash (`/`), a period (`.`), or an empty string (`''`).

##### Public Folder

The `public_folder` option defines the public URL path that corresponds to the `media_folder`. The leading slash is required in this option. If `public_folder` is not specified, it will default to the value of `media_folder`.

With the above configuration, if a media file is stored in `/public/uploads/image.jpg` and your site is hosted at `https://example.com`, the public URL to access the image would be `https://example.com/uploads/image.jpg`.

**Breaking change from Netlify/Decap CMS**

Sveltia CMS does not support absolute URLs in the `public_folder` option. Use relative paths starting with a slash (`/`) instead.

##### Disabling Internal Media Storage

If you only want to use an [external media storage provider](https://sveltiacms.app/en/docs/media#external-storage) and do not need the internal media storage, you can omit the `media_folder` option to disable it. Otherwise, this option is required.

Note that some of the [stock photo providers](https://sveltiacms.app/en/docs/integrations/stock-photos) may still require a `media_folder` to function properly because they don’t allow direct linking to their CDN URLs, requiring the images to be copied to the local repository instead.

You can also [disable the internal media storage for specific fields](#disabling-internal-media-storage-for-a-field).

#### Collection-Level Configuration

You can override the internal media storage settings for each collection by specifying the `media_folder` and `public_folder` options in the collection configuration.

```yaml [YAML]{5-6}
collections:
  - name: products
    label: Products
    folder: content/products
    media_folder: /public/uploads/products
    public_folder: /uploads/products
```

```toml [TOML]{5-6}
[[collections]]
name = "products"
label = "Products"
folder = "content/products"
media_folder = "/public/uploads/products"
public_folder = "/uploads/products"
```

```json [JSON]{7-8}
{
  "collections": [
    {
      "name": "products",
      "label": "Products",
      "folder": "content/products",
      "media_folder": "/public/uploads/products",
      "public_folder": "/uploads/products"
    }
  ]
}
```

```js [JavaScript]{7-8}
{
  collections: [
    {
      name: "products",
      label: "Products",
      folder: "content/products",
      media_folder: "/public/uploads/products",
      public_folder: "/uploads/products",
    },
  ],
}
```

If `public_folder` is not specified, it will default to the value of the collection-level `media_folder`.

**Absolute vs. Relative Paths**

The collection-level and field-level `media_folder` option must be starting with a slash (`/`) to indicate an absolute path from the root of the repository, while a leading slash can be omitted in the top-level `media_folder` option.

If you use a relative path, Sveltia CMS will treat it as relative to the collection `folder` (and `path`, if defined). See the [Using entry-relative folders](#using-entry-relative-folders) section below for details.

We recommend using absolute paths for better clarity and to avoid confusion, unless you specifically want to organize media files within the content folders.

**Note for Netlify/Decap CMS users**

The absolute path setup is not documented in the official Netlify/Decap CMS documentation, but it has been supported at least since 2020. Sveltia CMS continues to support this behavior for compatibility and better usability.

##### Using Placeholders

The following placeholder variables can be used in the `media_folder` and `public_folder` options, in addition to [slug template tags](https://sveltiacms.app/en/docs/collections/entries#slug-template-tags):

- `{{dirname}}`: The name of the directory containing the entry file, relative to the collection `folder`.
- `{{filename}}`: The entry file name without the extension. (Not the media file name.)
- `{{extension}}`: The entry file extension. (Not the media file extension.)
- `{{media_folder}}`: Refers to the top-level `media_folder` setting.
- `{{public_folder}}`: Refers to the top-level `public_folder` setting.

The following example is the same as the previous one, but using placeholders:

```yaml [YAML]{5-6}
collections:
  - name: products
    label: Products
    folder: content/products
    media_folder: '{{media_folder}}/products'
    public_folder: '{{public_folder}}/products'
```

```toml [TOML]{5-6}
[[collections]]
name = "products"
label = "Products"
folder = "content/products"
media_folder = "{{media_folder}}/products"
public_folder = "{{public_folder}}/products"
```

```json [JSON]{7-8}
{
  "collections": [
    {
      "name": "products",
      "label": "Products",
      "folder": "content/products",
      "media_folder": "{{media_folder}}/products",
      "public_folder": "{{public_folder}}/products"
    }
  ]
}
```

```js [JavaScript]{7-8}
{
  collections: [
    {
      name: "products",
      label: "Products",
      folder: "content/products",
      media_folder: "{{media_folder}}/products",
      public_folder: "{{public_folder}}/products",
    },
  ],
}
```

##### Using Entry-Relative Folders

Some frameworks and static site generators support organizing content and media files together in the same folder. One example is [Hugo’s page bundles](https://gohugo.io/content-management/page-bundles/), where each content entry can have its own folder containing the content file and associated media files.

Assets stored in entry-relative folders are only accessible by the associated entry and not available for other entries. Therefore, Sveltia CMS automatically deletes these assets when the associated entry is deleted. When you’re [working with a local repository](https://sveltiacms.app/en/docs/workflows/local), the empty enclosing folder is also deleted.

To configure Sveltia CMS to use entry-relative paths for media files, set the `media_folder` and `public_folder` options to empty strings (`''`) in your collection configuration. This tells Sveltia CMS to look for media files in the same folder as the content files.

```yaml [YAML]{5-7}
collections:
  - name: posts
    label: Blog Posts
    folder: /content/posts
    path: '{{slug}}/index'
    media_folder: ''
    public_folder: ''
    fields:
      - { name: title, label: Title }
      - { name: cover, label: Cover Image, widget: image }
      - { name: body, label: Body, widget: richtext }
```

```toml [TOML]{5-7}
[[collections]]
name = "posts"
label = "Blog Posts"
folder = "/content/posts"
path = "{{slug}}/index"
media_folder = ""
public_folder = ""

[[collections.fields]]
name = "title"
label = "Title"

[[collections.fields]]
name = "cover"
label = "Cover Image"
widget = "image"

[[collections.fields]]
name = "body"
label = "Body"
widget = "richtext"
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
      "public_folder": "",
      "fields": [
        { "name": "title", "label": "Title" },
        { "name": "cover", "label": "Cover Image", "widget": "image" },
        { "name": "body", "label": "Body", "widget": "richtext" }
      ]
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
      fields: [
        { name: "title", label: "Title" },
        { name: "cover", label: "Cover Image", widget: "image" },
        { name: "body", label: "Body", widget: "richtext" },
      ],
    },
  ],
}
```

This configuration allows you to structure your content and media files like this:

```
.
└─ content/
   └─ posts/
      └─ my-first-post/
         ├─ index.md
         └─ image1.jpg
```

And the `cover` image field in the `index.md` file will omit the folder path when referencing the image:

```yaml
---
title: My First Post
cover: image1.jpg
---
Content goes here...
```

If you want to organize media files in a subfolder within each entry folder, you can specify the subfolder name in the `media_folder` and `public_folder` options.

```yaml [YAML]{5-7}
collections:
  - name: posts
    label: Blog Posts
    folder: /content/posts
    path: '{{slug}}/index'
    media_folder: 'images'
    public_folder: 'images'
```

```toml [TOML]{5-7}
[[collections]]
name = "posts"
label = "Blog Posts"
folder = "/content/posts"
path = "{{slug}}/index"
media_folder = "images"
public_folder = "images"
```

```json [JSON]{7-9}
{
  "collections": [
    {
      "name": "posts",
      "label": "Blog Posts",
      "folder": "/content/posts",
      "path": "{{slug}}/index",
      "media_folder": "images",
      "public_folder": "images"
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
      media_folder: "images",
      public_folder: "images",
    },
  ],
}
```

Then the folder structure would look like this:

```
.
└─ content/
   └─ posts/
      └─ my-first-post/
         ├─ index.md
         └─ images/
            └─ image1.jpg
```

And the `cover` image field in the `index.md` file would reference the image like this:

```yaml
---
title: My First Post
cover: images/image1.jpg
---
Content goes here...
```

#### File-Level Configuration

Each file in a [file collection](https://sveltiacms.app/en/docs/collections/files) can also have its own media folder settings by specifying the `media_folder` and `public_folder` options in the file configuration, which override both the top-level and collection-level settings.

```yaml [YAML]{8-9}
collections:
  - name: pages
    label: Pages
    files:
      - name: about
        label: About Page
        file: content/pages/about.md
        media_folder: /public/uploads/about
        public_folder: /uploads/about
```

```toml [TOML]{9-10}
[[collections]]
name = "pages"
label = "Pages"

[[collections.files]]
name = "about"
label = "About Page"
file = "content/pages/about.md"
media_folder = "/public/uploads/about"
public_folder = "/uploads/about"
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
          "media_folder": "/public/uploads/about",
          "public_folder": "/uploads/about"
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
          media_folder: "/public/uploads/about",
          public_folder: "/uploads/about",
        },
      ],
    },
  ],
}
```

The same [placeholder variables](#using-placeholders) mentioned above can be used in field-level `media_folder` and `public_folder` options.

#### Field-Level Configuration

You can also configure media storage settings for individual File or Image fields within a collection. This allows you to specify different media folders for different fields, overriding both the top-level and collection-level settings.

```yaml [YAML]{5-6}
fields:
  - name: thumbnail
    label: Thumbnail Image
    widget: image
    media_folder: /public/uploads/thumbnails
    public_folder: /uploads/thumbnails
```

```toml [TOML]{5-6}
[[fields]]
name = "thumbnail"
label = "Thumbnail Image"
widget = "image"
media_folder = "/public/uploads/thumbnails"
public_folder = "/uploads/thumbnails"
```

```json [JSON]{7-8}
{
  "fields": [
    {
      "name": "thumbnail",
      "label": "Thumbnail Image",
      "widget": "image",
      "media_folder": "/public/uploads/thumbnails",
      "public_folder": "/uploads/thumbnails"
    }
  ]
}
```

```js [JavaScript]{7-8}
{
  fields: [
    {
      name: "thumbnail",
      label: "Thumbnail Image",
      widget: "image",
      media_folder: "/public/uploads/thumbnails",
      public_folder: "/uploads/thumbnails",
    },
  ],
}
```

The same [placeholder variables](#using-placeholders) mentioned above can be used in field-level `media_folder` and `public_folder` options.

Field-level `media_folder` and `public_folder` options can also be set to empty strings (`''`) or subfolder names to use entry-relative paths, just like in the collection-level configuration.

##### Disabling Internal Media Storage for a Field

If you have enabled an [external media storage provider](https://sveltiacms.app/en/docs/media#external-storage) and want to disable the internal media storage for a specific field, you can add the `media_libraries` option with the `default` library set to `false` in the field configuration. This will prevent the media picker from showing the internal media library and only allow selecting from the external provider.

```yaml [YAML]{5-6}
fields:
  - name: cover
    label: Cover Image
    widget: image
    media_libraries:
      default: false
```

```toml [TOML]{5-6}
[[fields]]
name = "cover"
label = "Cover Image"
widget = "image"
[fields.media_libraries]
default = false
```

```json [JSON]{7-9}
{
  "fields": [
    {
      "name": "cover",
      "label": "Cover Image",
      "widget": "image",
      "media_libraries": {
        "default": false
      }
    }
  ]
}
```

```js [JavaScript]{7-9}
{
  fields: [
    {
      name: "cover",
      label: "Cover Image",
      widget: "image",
      media_libraries: {
        default: false,
      },
    },
  ],
}
```

### Asset Collections

In addition to the [global media folder](#top-level-configuration) and [collection-specific media folders](#collection-level-configuration), Sveltia CMS supports defining separate asset collections that can be used across multiple [content collections](https://sveltiacms.app/en/docs/collections). This allows you to organize your media assets in a more structured way and reuse them in different contexts.

To define an asset collection, add a new entry to the `asset_collections` array in your `config.yml` file. Each asset collection has the following properties:

- `name`: Unique identifier for the asset collection. Required and must be unique across all collections.
- `label`: Human-readable name for the asset collection, displayed in the media picker. If omitted, it defaults to the value of `name`.
- `icon`: Optional icon for the asset collection, which can be a string representing a [Material Symbols](https://fonts.google.com/icons?icon.set=Material+Symbols&icon.platform=web) icon name.
- `media_folder`: The folder in the repository where media files for this collection will be stored. Required and must be an absolute path relative to the root of the repository. A leading slash can be omitted, but it is recommended to include it for clarity.
- `public_folder`: The public URL path that corresponds to the `media_folder`. If omitted, it defaults to the value of `media_folder`.

Configure your asset collections like this:

```yaml [YAML]
asset_collections:
  - name: avatars
    label: Avatars
    icon: image
    media_folder: /public/uploads/avatars
    public_folder: /uploads/avatars
  - name: logos
    label: Logos
    icon: brand_family
    media_folder: /public/uploads/logos
    public_folder: /uploads/logos
  - name: documents
    label: Documents
    icon: description
    media_folder: /public/uploads/documents
    public_folder: /uploads/documents
```

```toml [TOML]
[[asset_collections]]
name = "images"
label = "Images"
icon = "image"
media_folder = "/public/uploads/images"
public_folder = "/uploads/images"

[[asset_collections]]
name = "logos"
label = "Logos"
icon = "brand_family"
media_folder = "/public/uploads/logos"
public_folder = "/uploads/logos"

[[asset_collections]]
name = "documents"
label = "Documents"
icon = "description"
media_folder = "/public/uploads/documents"
public_folder = "/uploads/documents"
```

```json [JSON]
{
  "asset_collections": [
    {
      "name": "images",
      "label": "Images",
      "icon": "image",
      "media_folder": "/public/uploads/images",
      "public_folder": "/uploads/images"
    },
    {
      "name": "logos",
      "label": "Logos",
      "icon": "brand_family",
      "media_folder": "/public/uploads/logos",
      "public_folder": "/uploads/logos"
    },
    {
      "name": "documents",
      "label": "Documents",
      "icon": "description",
      "media_folder": "/public/uploads/documents",
      "public_folder": "/uploads/documents"
    }
  ]
}
```

```js [JavaScript]
{
  asset_collections: [
    {
      name: "images",
      label: "Images",
      icon: "image",
      media_folder: "/public/uploads/images",
      public_folder: "/uploads/images",
    },
    {
      name: "logos",
      label: "Logos",
      icon: "brand_family",
      media_folder: "/public/uploads/logos",
      public_folder: "/uploads/logos",
    },
    {
      name: "documents",
      label: "Documents",
      icon: "description",
      media_folder: "/public/uploads/documents",
      public_folder: "/uploads/documents",
    },
  ],
}
```

### Additional Features

For backward compatibility, the [additional media storage features](https://sveltiacms.app/en/docs/media#additional-features) can be configured specifically for the internal media storage. This configuration goes in the `media_libraries` option, under the `default` → `config` key, which applies only to the internal media storage provider, as opposed to the `all` key that applies to all providers.

```yaml [YAML]{4-11}
media_libraries:
  default:
    config:
      transformations:
        raster_image: # original format
          format: webp # new format, only `webp` is supported
          quality: 85 # default: 85
          width: 2048 # default: original size
          height: 2048 # default: original size
        svg:
          optimize: true
```

```toml [TOML]{3-11}
[media_libraries.default]
[media_libraries.default.config]
[media_libraries.default.config.transformations]
[media_libraries.default.config.transformations.raster_image]
format = "webp"
quality = 85
width = 2048
height = 2048

[media_libraries.default.config.transformations.svg]
optimize = true
```

```json [JSON]{5-15}
{
  "media_libraries": {
    "default": {
      "config": {
        "transformations": {
          "raster_image": {
            "format": "webp",
            "quality": 85,
            "width": 2048,
            "height": 2048
          },
          "svg": {
            "optimize": true
          }
        }
      }
    }
  }
}
```

```js [JavaScript]{5-15}
{
  media_libraries: {
    default: {
      config: {
        transformations: {
          raster_image: {
            format: "webp",
            quality: 85,
            width: 2048,
            height: 2048,
          },
          svg: {
            optimize: true,
          },
        },
      },
    },
  },
}
```

```yaml [YAML]{4}
media_libraries:
  default:
    config:
      max_file_size: 1024000
```

```toml [TOML]{3}
[media_libraries.default]
[media_libraries.default.config]
max_file_size = 1024000
```

```json [JSON]{5}
{
  "media_libraries": {
    "default": {
      "config": {
        "max_file_size": 1024000
      }
    }
  }
}
```

```js [JavaScript]{5}
{
  media_libraries: {
    default: {
      config: {
        max_file_size: 1024000,
      },
    },
  },
}
```

```yaml [YAML]{4}
media_libraries:
  default:
    config:
      slugify_filename: true
```

```toml [TOML]{3}
[media_libraries.default]
[media_libraries.default.config]
slugify_filename = true
```

```json [JSON]{5}
{
  "media_libraries": {
    "default": {
      "config": {
        "slugify_filename": true
      }
    }
  }
}
```

```js [JavaScript]{5}
{
  media_libraries: {
    default: {
      config: {
        slugify_filename: true,
      },
    },
  },
}
```

### Accessing the Storage

There are two main ways to use the internal media storage in Sveltia CMS:

#### File and Image Fields

When editing content entries, you can use [File](https://sveltiacms.app/en/docs/fields/file) and [Image](https://sveltiacms.app/en/docs/fields/image) fields to upload and select media assets directly within the entry editor. Click the Browse button to open the media picker, where you can select existing assets or upload new ones. These fields also support drag-and-drop functionality for easy uploads.

#### Standalone Asset Library

You can access the Asset Library from the main navigation menu in the CMS interface. Here, you can view, upload, and manage all your media assets in one place. You can view assets in a grid or list format, search for specific files, and view asset details such as file size, dimensions and a list of entries using the asset.

Source: https://sveltiacms.app/en/docs/media/internal
