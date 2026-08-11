# External Media Storage Providers

Cloudinary, Uploadcare and S3-compatible object storage: Amazon S3, Cloudflare R2, Backblaze B2, DigitalOcean Spaces, Scaleway and Supabase.

Generated from the Sveltia CMS documentation. Do not edit by hand.

## Amazon S3 Integration

[Amazon S3](https://aws.amazon.com/s3/) (Simple Storage Service) is a scalable object storage service provided by AWS. Sveltia CMS supports S3 as a media storage backend with direct browser-to-S3 uploads using AWS Signature Version 4 — no backend proxy is required.

### Requirements

- An AWS account with an S3 bucket created.
- An IAM user with an access key and the minimum required permissions (see [Credentials](#credentials) below).

#### CSP

If your site uses a Content Security Policy (CSP), you need to allow the S3 endpoint. See [Content Security Policy](#content-security-policy) below for details.

### Setup

#### Credentials

Create an IAM user with programmatic access and attach a policy granting the minimum required permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:ListBucket", "s3:GetObject", "s3:PutObject"],
      "Resource": ["arn:aws:s3:::my-bucket", "arn:aws:s3:::my-bucket/*"]
    }
  ]
}
```

The resulting **Access Key ID** goes in `access_key_id` in your config. The **Secret Access Key** is entered by users in the CMS UI when they access the media library for the first time — it is never stored in config.

#### Public Read Access

Asset preview and download URLs are unsigned direct storage URLs, so objects must be publicly readable:

1. In the S3 console, open the bucket’s **Permissions** tab.
2. Under **Block Public Access**, disable `BlockPublicPolicy` and `RestrictPublicBuckets`.
3. Add a bucket policy granting `s3:GetObject` to `"Principal": "*"` for the objects path:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::my-bucket/cms-uploads/*"
    }
  ]
}
```

#### CORS

Configure cross-origin resource sharing in the S3 console under **Bucket > Permissions > Cross-origin resource sharing (CORS)**. CORS is required because Sveltia CMS sends custom AWS Signature v4 headers that trigger a preflight request.

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "HEAD"],
    "AllowedOrigins": ["https://your-cms-domain.com"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

#### Bucket Naming

For virtual-hosted-style URLs (the default), the bucket name must be DNS-compatible: lowercase letters, numbers, and hyphens only. If your bucket name contains underscores, use `force_path_style: true` in your config.

### Configuration

Here’s an example configuration for Amazon S3:

<!-- cSpell:disable -->

```yaml [YAML]
media_libraries:
  aws_s3:
    access_key_id: AKIAIOSFODNN7EXAMPLE
    bucket: my-website-assets
    region: us-east-1
    prefix: cms-uploads/ # Optional
    force_path_style: false # Optional, see Bucket Naming above
    public_url: https://media.example.com # Optional, see Custom Domain below
```

```toml [TOML]
[media_libraries.aws_s3]
access_key_id = "AKIAIOSFODNN7EXAMPLE"
bucket = "my-website-assets"
region = "us-east-1"
prefix = "cms-uploads/"
force_path_style = false
public_url = "https://media.example.com"
```

```json [JSON]
{
  "media_libraries": {
    "aws_s3": {
      "access_key_id": "AKIAIOSFODNN7EXAMPLE",
      "bucket": "my-website-assets",
      "region": "us-east-1",
      "prefix": "cms-uploads/",
      "force_path_style": false,
      "public_url": "https://media.example.com"
    }
  }
}
```

```js [JavaScript]
{
  media_libraries: {
    aws_s3: {
      access_key_id: 'AKIAIOSFODNN7EXAMPLE',
      bucket: 'my-website-assets',
      region: 'us-east-1',
      prefix: 'cms-uploads/', // Optional
      force_path_style: false, // Optional
      public_url: 'https://media.example.com', // Optional
    },
  },
}
```

<!-- cSpell:enable -->

**Warning**

Do not write your Secret Access Key in the configuration file, as it should be kept confidential and not exposed in client-side code. Users will be prompted to enter the key when they use the storage first time, which will be stored securely in the browser’s local storage.

#### Configuration Properties

| Property | Required | Description |
| --- | --- | --- |
| `access_key_id` | Yes | AWS Access Key ID (safe to store in config). |
| `bucket` | Yes | The S3 bucket name. |
| `region` | Yes | AWS region, e.g. `us-east-1`, `eu-west-1`. |
| `prefix` | No | Path prefix within the bucket, e.g. `uploads/`. |
| `force_path_style` | No | Use path-style URLs (`s3.region.amazonaws.com/bucket`) instead of virtual-hosted-style (`bucket.s3.region.amazonaws.com`). Defaults to `false`. |
| `public_url` | No | Custom domain for asset URLs (e.g. a CloudFront distribution). See [Custom Domain](#custom-domain) below. |

### Custom Domain

If you serve assets through a CloudFront distribution or a Route 53 custom domain pointing to your S3 bucket, set `public_url` to that URL. Asset preview and download URLs in the CMS will use the custom domain instead of the S3 endpoint:

```yaml
public_url: 'https://media.example.com'
```

The S3 API endpoint is still used for listing and uploading — only the asset URLs shown in the CMS change. See the [Route 53 getting-started guide](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/getting-started-s3.html) for setting up a custom domain with S3.

### Content Security Policy

The URL pattern depends on whether `force_path_style` is enabled.

**Virtual-hosted-style (default)** — `https://{bucket}.s3.{region}.amazonaws.com`:

```
connect-src https://*.s3.us-east-1.amazonaws.com;
img-src     https://*.s3.us-east-1.amazonaws.com;
```

**Path-style (`force_path_style: true`)** — `https://s3.{region}.amazonaws.com/{bucket}`:

```
connect-src https://s3.us-east-1.amazonaws.com;
img-src     https://s3.us-east-1.amazonaws.com;
```

Replace `us-east-1` with your actual bucket region.

If using a custom domain via `public_url`, add it to `img-src` as well:

```
connect-src https://*.s3.us-east-1.amazonaws.com;
img-src     https://*.s3.us-east-1.amazonaws.com
            https://media.example.com;
```

See the [CSP documentation](https://sveltiacms.app/en/docs/security#setting-up-content-security-policy) for more details.

### Accessing the Storage

The Amazon S3 media storage can be accessed through the File and Image fields in Sveltia CMS. Enter your Secret Access Key in the CMS UI when prompted, and you’ll be able to upload new media directly to S3 or select existing media from your bucket.

When uploading media, files will be stored in your S3 bucket, and you can take advantage of S3’s capabilities directly from the CMS. You can also select existing media from your S3 storage.

**Future Plans**

You’ll be able to manage your S3 files directly from the [Asset Library](https://sveltiacms.app/en/docs/ui/asset-library) in future releases.

Source: https://sveltiacms.app/en/docs/media/amazon-s3

---

## Backblaze B2 Integration

[Backblaze B2](https://www.backblaze.com/cloud-storage) is an S3-compatible object storage service with zero egress fees and low-cost storage. Sveltia CMS supports B2 as a media storage backend with direct browser-to-B2 uploads using AWS Signature Version 4 — no backend proxy is required.

### Requirements

- A Backblaze account with a B2 bucket created.
- A B2 Application Key (see [Credentials](#credentials) below).
- **CORS configuration via CLI** (see [CORS](#cors) below) — the web console doesn’t support the required S3 operations.

#### CSP

If your site uses a Content Security Policy (CSP), you need to allow the B2 endpoint. See [Content Security Policy](#content-security-policy) below for details.

### Setup

#### Credentials

B2 uses Application Keys for authentication. You can create keys via **Backblaze Console > Account > Application Keys**.

For production use, create a **bucket-scoped Application Key** with the following capabilities:

- `listFiles`
- `readFiles`
- `writeFiles`
- `deleteFiles`

Using the B2 CLI:

```sh
b2 key create --bucket my-bucket sveltia-cms listFiles,readFiles,writeFiles,deleteFiles
```

The resulting **keyID** goes in `access_key_id` in your config. The **applicationKey** (shown only once) is entered by users in the CMS UI when they access the media library for the first time — it is never stored in config.

#### Public Read Access

For asset previews and downloads to work, objects must be publicly readable. When creating a bucket, set its visibility to **Public**:

```sh
b2 bucket create my-bucket allPublic
```

**Info**

Making a bucket public requires a payment method on your Backblaze account. Alternatively, you can use a private bucket with a custom `public_url` pointing to a CDN that provides public access.

With a public bucket, B2’s S3 endpoint serves objects anonymously, so no separate `public_url` configuration is needed — asset URLs use the virtual-hosted storage endpoint directly (`https://{bucket}.s3.{region}.backblazeb2.com/{key}`).

#### CORS

**Important**

The CORS configuration required by Sveltia CMS **cannot be set via the B2 web console**. The console only offers four basic presets that don’t include the S3 operations needed for uploads and listings. You must use the **B2 CLI**, native API, or AWS CLI to configure CORS.

This is documented, by-design behavior — see [Enable and Manage CORS Rules in the Enterprise Web Console](https://www.backblaze.com/docs/cloud-storage-enable-and-manage-cors-rules).

CORS is required because Sveltia CMS sends custom AWS Signature v4 headers that trigger a preflight request.

##### Setting CORS via B2 CLI

**1. Install and authorize the B2 CLI** (use a key with `writeBuckets` capability):

See the [official documentation](https://www.backblaze.com/docs/cloud-storage-command-line-tools) for installation instructions.

```sh
b2 account authorize <adminKeyId> <adminKey>
```

**2. Set the CORS rule with S3 operations:**

```sh
b2 bucket update --cors-rules '[{
  "corsRuleName": "sveltia-cms",
  "allowedOrigins": ["https://your-cms-domain.com"],
  "allowedOperations": ["s3_get", "s3_head", "s3_put", "s3_delete", "s3_post"],
  "allowedHeaders": ["*"],
  "exposeHeaders": ["ETag", "x-amz-request-id"],
  "maxAgeSeconds": 3600
}]' my-bucket allPublic
```

Replace `https://your-cms-domain.com` with your actual CMS origin and `my-bucket` with your bucket name. A wildcard `*` is allowed for `allowedOrigins` if you want to allow all origins.

**Tip**

You can also pass `--cors-rules` to `b2 bucket create` to set CORS when creating the bucket.

See the [official documentation](https://www.backblaze.com/docs/cloud-storage-enable-cors-with-the-cli) for more details on CORS configuration.

**3. Verify the configuration** (optional):

```sh
b2 bucket get my-bucket
```

##### Required CORS Operations

The S3 operations Sveltia CMS requires are:

- `s3_get` — for `ListObjectsV2` (listing) and `GetObject` (preview/download)
- `s3_head` — for `HeadObject` (metadata checks)
- `s3_put` — for `PutObject` (uploads)
- `s3_delete` — for `DeleteObject` (deletions)
- `s3_post` — for multipart uploads

B2 maps these native operations to the standard S3 HTTP methods (`GET`, `HEAD`, `PUT`, `DELETE`, `POST`).

### Configuration

Here’s an example configuration for Backblaze B2:

<!-- cSpell:disable -->

```yaml [YAML]
media_libraries:
  backblaze_b2:
    access_key_id: 0123456789abcdef0123456789ab
    bucket: my-bucket
    region: us-east-005
    prefix: cms-uploads/ # Optional
    public_url: https://cdn.example.com # Optional, only for private buckets
```

```toml [TOML]
[media_libraries.backblaze_b2]
access_key_id = "0123456789abcdef0123456789ab"
bucket = "my-bucket"
region = "us-east-005"
prefix = "cms-uploads/"
public_url = "https://cdn.example.com"
```

```json [JSON]
{
  "media_libraries": {
    "backblaze_b2": {
      "access_key_id": "0123456789abcdef0123456789ab",
      "bucket": "my-bucket",
      "region": "us-east-005",
      "prefix": "cms-uploads/",
      "public_url": "https://cdn.example.com"
    }
  }
}
```

```js [JavaScript]
{
  media_libraries: {
    backblaze_b2: {
      access_key_id: '0123456789abcdef0123456789ab',
      bucket: 'my-bucket',
      region: 'us-east-005',
      prefix: 'cms-uploads/', // Optional
      public_url: 'https://cdn.example.com', // Optional
    },
  },
}
```

<!-- cSpell:enable -->

**Warning**

Do not write your Application Key (secret) in the configuration file, as it should be kept confidential and not exposed in client-side code. Users will be prompted to enter the key when they use the storage for the first time, which will be stored securely in the browser’s local storage.

#### Configuration Properties

| Property | Required | Description |
| --- | --- | --- |
| `access_key_id` | Yes | B2 Application Key ID (keyID). Safe to store in config. |
| `bucket` | Yes | The B2 bucket name. |
| `region` | Yes | B2 region, e.g. `us-west-001`, `us-east-005`, `eu-central-003`. See [B2 regions list](https://www.backblaze.com/docs/cloud-storage-regions-and-endpoints). |
| `prefix` | No | Path prefix within the bucket, e.g. `uploads/`. |
| `public_url` | No | CDN or custom domain URL for asset previews. Only required for **private buckets**. Public buckets serve objects directly via the S3 endpoint. |

### Public Buckets vs. Private Buckets

#### Public Buckets (Recommended for Simplicity)

When a bucket is set to **Public** (`allPublic`), B2’s S3 endpoint serves objects anonymously without authentication. Asset URLs use the virtual-hosted storage endpoint:

```
https://{bucket}.s3.{region}.backblazeb2.com/{key}
```

No `public_url` configuration is needed — previews and downloads work automatically.

#### Private Buckets (Requires CDN)

For private buckets, you must configure a `public_url` pointing to a CDN or proxy that provides public access to the objects. B2’s S3 API always requires authentication, so direct storage URLs won’t work for previews in the CMS.

```yaml
public_url: 'https://cdn.example.com'
```

**Warning**

The storage endpoint is always used for listing and uploading operations regardless of the `public_url` setting. Only the asset preview/download URLs shown in the CMS change.

### Content Security Policy

API calls (list, upload) go to `https://s3.{region}.backblazeb2.com`. For public buckets, asset URLs use `https://{bucket}.s3.{region}.backblazeb2.com`:

```
connect-src https://s3.us-east-005.backblazeb2.com;
img-src     https://my-bucket.s3.us-east-005.backblazeb2.com;
```

If using a private bucket with a CDN via `public_url`:

```
connect-src https://s3.us-east-005.backblazeb2.com;
img-src     https://cdn.example.com;
```

Replace `us-east-005` and `my-bucket` with your actual region and bucket name.

See the [CSP documentation](https://sveltiacms.app/en/docs/security#setting-up-content-security-policy) for more details.

### B2-Specific Notes

#### No Per-Object ACLs

B2’s S3 API does not support the `x-amz-acl` header for per-object access control. Visibility is controlled at the bucket level (public or private). Sveltia CMS automatically omits the `x-amz-acl: public-read` header when uploading to B2, so uploads work correctly regardless of bucket visibility.

#### Region Endpoint

B2 uses a region-specific endpoint for the S3 API (`https://s3.{region}.backblazeb2.com`), and asset URLs use virtual-hosted-style addressing (`https://{bucket}.s3.{region}.backblazeb2.com/{key}`) for public buckets. This is handled automatically by Sveltia CMS.

### Accessing the Storage

The Backblaze B2 media storage can be accessed through the File and Image fields in Sveltia CMS. Enter your Application Key (secret) in the CMS UI when prompted, and you’ll be able to upload new media directly to B2 or select existing media from your bucket.

When uploading media, files will be stored in your B2 bucket with zero egress fees for downloads. You can also select existing media from your B2 storage.

**Future Plans**

You’ll be able to manage your B2 files directly from the [Asset Library](https://sveltiacms.app/en/docs/ui/asset-library) in future releases.

Source: https://sveltiacms.app/en/docs/media/backblaze-b2

---

## Cloudflare R2 Integration

[Cloudflare R2](https://www.cloudflare.com/products/r2/) is an S3-compatible object storage service with zero egress fees. Sveltia CMS supports R2 as a media storage backend with direct browser-to-R2 uploads using AWS Signature Version 4 — no backend proxy is required.

### Requirements

- A Cloudflare account with an R2 bucket created.
- An R2 API token with Object Read & Write permissions (see [Credentials](#credentials) below).
- A `public_url` configured for asset previews (see [Public Read Access](#public-read-access) below).

#### CSP

If your site uses a Content Security Policy (CSP), you need to allow the R2 endpoint and your public URL. See [Content Security Policy](#content-security-policy) below for details.

### Setup

#### Credentials

R2 uses its own API token system, separate from the Cloudflare global API key. Create a token via **Cloudflare Dashboard > Account Home > R2 > Manage R2 API Tokens**:

- **Permission**: Object Read & Write
- **Scope**: Restrict to the specific bucket (recommended)

The resulting **Access Key ID** (64 hex characters) goes in `access_key_id` in your config. The **Secret Access Key** is entered by users in the CMS UI when they access the media library for the first time — it is never stored in config.

#### Public Read Access

R2’s S3 API endpoint always requires authentication, so a separate `public_url` must be configured for asset previews and downloads in the CMS. Without it, preview images will fail to load.

Two options are available:

**Option A — Public development URL (non-production):**

1. In **R2 Dashboard > [bucket] > Settings**, under **Public Development URL**, click **Enable** and confirm.
2. Copy the assigned `pub-{hash}.r2.dev` URL and set it as `public_url` in your config:

   ```yaml
   public_url: 'https://pub-abcdef1234567890abcdef1234567890.r2.dev'
   ```

Note: the `r2.dev` subdomain is rate limited and intended for development use only.

**Option B — Custom domain (recommended for production):**

1. In **R2 Dashboard > [bucket] > Settings > Custom Domains**, click **Add** and follow the prompts to connect your domain.
2. Set that domain as `public_url` in your config:

   ```yaml
   public_url: 'https://media.example.com'
   ```

In both cases, asset URLs are constructed as `{public_url}/{key}` (using the full object key, including any `prefix`).

#### CORS

Configure via **R2 Dashboard > Bucket > Settings > CORS Policy**. CORS is required because Sveltia CMS sends custom AWS Signature v4 headers that trigger a preflight request.

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "HEAD"],
    "AllowedOrigins": ["https://your-cms-domain.com"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

### Configuration

Here’s an example configuration for Cloudflare R2:

```yaml [YAML]
media_libraries:
  cloudflare_r2:
    access_key_id: abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890
    bucket: my-r2-bucket
    account_id: abcdef1234567890abcdef1234567890
    public_url: https://pub-abcdef1234567890abcdef1234567890.r2.dev
    prefix: cms-uploads/ # Optional
    jurisdiction: eu # Optional; 'default' | 'eu' | 'fedramp'
```

```toml [TOML]
[media_libraries.cloudflare_r2]
access_key_id = "abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890"
bucket = "my-r2-bucket"
account_id = "abcdef1234567890abcdef1234567890"
public_url = "https://pub-abcdef1234567890abcdef1234567890.r2.dev"
prefix = "cms-uploads/" # Optional
jurisdiction = "eu" # Optional; 'default' | 'eu' | 'fedramp'
```

```json [JSON]
{
  "media_libraries": {
    "cloudflare_r2": {
      "access_key_id": "abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
      "bucket": "my-r2-bucket",
      "account_id": "abcdef1234567890abcdef1234567890",
      "public_url": "https://pub-abcdef1234567890abcdef1234567890.r2.dev",
      "prefix": "cms-uploads/",
      "jurisdiction": "eu"
    }
  }
}
```

```js [JavaScript]
{
  media_libraries: {
    cloudflare_r2: {
      access_key_id: 'abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
      bucket: 'my-r2-bucket',
      account_id: 'abcdef1234567890abcdef1234567890',
      public_url: 'https://pub-abcdef1234567890abcdef1234567890.r2.dev',
      prefix: 'cms-uploads/', // Optional
      jurisdiction: 'eu', // Optional; 'default' | 'eu' | 'fedramp'
    },
  },
}
```

**Warning**

Do not write your Secret Access Key in the configuration file, as it should be kept confidential and not exposed in client-side code. Users will be prompted to enter the key when they use the storage first time, which will be stored securely in the browser’s local storage.

#### Configuration Properties

| Property | Required | Description |
| --- | --- | --- |
| `access_key_id` | Yes | R2 Access Key ID (64 hex characters). Safe to store in config. |
| `bucket` | Yes | The R2 bucket name. |
| `account_id` | Yes | Your Cloudflare account ID. Used to construct the S3 API endpoint. |
| `public_url` | Yes | Public URL for asset previews and downloads. Required because the R2 S3 API always requires authentication. |
| `prefix` | No | Path prefix within the bucket, e.g. `uploads/`. |
| `jurisdiction` | No | Cloudflare R2 [jurisdictional restriction](#jurisdictional-restrictions) for the bucket. One of `'default'`, `'eu'`, `'fedramp'`. Defaults to `'default'`. |

#### Jurisdictional Restrictions

Cloudflare R2 supports two jurisdictional locations — EU and FedRAMP — for data residency compliance. Buckets created in one of these jurisdictions use a dedicated endpoint and will return an error if accessed via the global endpoint.

If your bucket was created in the EU or FedRAMP jurisdiction, set `jurisdiction` accordingly:

```yaml
media_libraries:
  cloudflare_r2:
    # ...
    jurisdiction: eu # 'eu' for EU buckets, 'fedramp' for FedRAMP buckets
```

The jurisdiction also determines the S3 API endpoint hostname used for uploads and listings:

| Jurisdiction           | S3 API endpoint                                 |
| ---------------------- | ----------------------------------------------- |
| `default` (or omitted) | `<account_id>.r2.cloudflarestorage.com`         |
| `eu`                   | `<account_id>.eu.r2.cloudflarestorage.com`      |
| `fedramp`              | `<account_id>.fedramp.r2.cloudflarestorage.com` |

Remember to update your [Content Security Policy](#content-security-policy) to allow the correct endpoint if you use a non-default jurisdiction.

### Content Security Policy

The hosts to allow depend on your `public_url` setting and `jurisdiction`.

**r2.dev subdomain** — allow the exact `pub-{hash}.r2.dev` host:

```
connect-src https://abcdef1234567890abcdef1234567890.r2.cloudflarestorage.com;
img-src     https://pub-abcdef1234567890abcdef1234567890.r2.dev;
```

**Custom domain** — allow your custom domain, plus the S3 API endpoint for listing and uploading:

```
connect-src https://abcdef1234567890abcdef1234567890.r2.cloudflarestorage.com;
img-src     https://media.example.com;
```

**Non-default jurisdiction** — replace the `connect-src` hostname with the jurisdiction-specific endpoint. For example, with `jurisdiction: eu`:

```
connect-src https://abcdef1234567890abcdef1234567890.eu.r2.cloudflarestorage.com;
img-src     https://pub-abcdef1234567890abcdef1234567890.r2.dev;
```

See the [CSP documentation](https://sveltiacms.app/en/docs/security#setting-up-content-security-policy) for more details.

### Accessing the Storage

The Cloudflare R2 media storage can be accessed through the File and Image fields in Sveltia CMS. Enter your Secret Access Key in the CMS UI when prompted, and you’ll be able to upload new media directly to R2 or select existing media from your bucket.

When uploading media, files will be stored in your R2 bucket, and you can take advantage of R2’s capabilities directly from the CMS. You can also select existing media from your R2 storage.

**Future Plans**

You’ll be able to manage your R2 files directly from the [Asset Library](https://sveltiacms.app/en/docs/ui/asset-library) in future releases.

Source: https://sveltiacms.app/en/docs/media/cloudflare-r2

---

## Cloudinary Integration

[Cloudinary](https://cloudinary.com/) is a leading cloud-based media management service that offers comprehensive solutions for image and video upload, storage, manipulation, and delivery. The Cloudinary integration enables users to efficiently manage media assets within Sveltia CMS by leveraging Cloudinary’s powerful features.

### Requirements

- A Cloudinary account. You can sign up for a free account at [cloudinary.com](https://cloudinary.com/).
- Your Cloudinary cloud name and API key. These can be found in your Cloudinary dashboard under the “Account Details” section.

#### CSP

If your site uses a Content Security Policy (CSP), You may need to update it to allow requests to Cloudinary. See the [CSP documentation](https://sveltiacms.app/en/docs/security#setting-up-content-security-policy) for more details.

### Configuration

#### Top-Level Configuration

To configure the Cloudinary media storage in Sveltia CMS, add the following configuration to the top level of your CMS configuration file:

```yaml [YAML]
media_libraries:
  cloudinary:
    config:
      cloud_name: YOUR_CLOUD_NAME
      api_key: YOUR_API_KEY
```

```toml [TOML]
[media_libraries.cloudinary]
[media_libraries.cloudinary.config]
cloud_name = "YOUR_CLOUD_NAME"
api_key = "YOUR_API_KEY"
```

```json [JSON]
{
  "media_libraries": {
    "cloudinary": {
      "config": {
        "cloud_name": "YOUR_CLOUD_NAME",
        "api_key": "YOUR_API_KEY"
      }
    }
  }
}
```

```js [JavaScript]
{
  media_libraries: {
    cloudinary: {
      config: {
        cloud_name: "YOUR_CLOUD_NAME",
        api_key: "YOUR_API_KEY",
      },
    },
  },
}
```

**Legacy `media_library` Option**

Sveltia CMS supports the legacy `media_library` option for backward compatibility with Netlify/Decap CMS, but it is recommended to use the `media_libraries` option for new configurations. With the legacy option, only a single media storage provider can be configured. Here is an example of configuring Cloudinary using the legacy option:

```yaml
media_library:
  name: cloudinary
  config:
    cloud_name: YOUR_CLOUD_NAME
    api_key: YOUR_API_KEY
```

The `config` object includes the Cloudinary [Media Library widget options](https://cloudinary.com/documentation/media_library_widget#2_set_the_configuration_options). Here are some important notes regarding the configuration options:

- The following parameters are required:
  - `cloud_name`: Your Cloudinary cloud name.
  - `api_key`: Your Cloudinary API key.
- `default_transformations`: Transformations to apply to all uploaded images. Only the first transformation in the array will be applied to uploaded media in Sveltia CMS. See the [Image transformations](#image-transformations) section below for more details on defining transformations.
- Some options are not applicable in Sveltia CMS and will be ignored if provided, such as `button_caption` and `inline_container`.

**Warning**

Do not write your Cloudinary API secret in the configuration file, as it should be kept confidential and not exposed in client-side code. The API key can be used safely for public operations, and Sveltia CMS does not require the API secret for its functionality.

There are two Sveltia CMS-specific configuration options that can be added alongside the `config` object. Both are optional:

- `output_filename_only`: When set to `true`, only the filename will be stored in the CMS instead of the full URL. Defaults to `false`.
- `use_transformations`: Whether to use derived transformation URLs for uploaded media. Defaults to `true`. No effect if `output_filename_only` is `true`.

**Breaking change from Netlify/Decap CMS**

The `use_secure_url` option has been removed in Sveltia CMS. All URLs generated by the Cloudinary media storage will use HTTPS by default to ensure secure delivery of media assets.

The complete configuration with these additional options looks like this:

```yaml [YAML]{6-7}
media_libraries:
  cloudinary:
    config:
      cloud_name: YOUR_CLOUD_NAME
      api_key: YOUR_API_KEY
    output_filename_only: false
    use_transformations: true
```

```toml [TOML]{5-6}
[media_libraries.cloudinary]
[media_libraries.cloudinary.config]
cloud_name = "YOUR_CLOUD_NAME"
api_key = "YOUR_API_KEY"
output_filename_only = false
use_transformations = true
```

```json [JSON]{7-8}
{
  "media_libraries": {
    "cloudinary": {
      "config": {
        "cloud_name": "YOUR_CLOUD_NAME",
        "api_key": "YOUR_API_KEY"
      },
      "output_filename_only": false,
      "use_transformations": true
    }
  }
}
```

```js [JavaScript]{7-8}
{
  media_libraries: {
    cloudinary: {
      config: {
        cloud_name: "YOUR_CLOUD_NAME",
        api_key: "YOUR_API_KEY",
      },
      output_filename_only: false,
      use_transformations: true,
    },
  },
}
```

#### Field-Level Configuration

The `media_libraries` configuration can also be specified at the field level for File and Image fields. This allows you to override the top-level configuration for specific fields. Here is an example of configuring a File field to use the Cloudinary media storage with custom default transformations and storing only the filename:

```yaml [YAML]{5-11}
fields:
  - name: cover_image
    label: Cover Image
    widget: image
    media_libraries:
      cloudinary:
        config:
          default_transformations:
            - - quality: auto
                fetch_format: auto
        output_filename_only: true
```

```toml [TOML]{5-8}
[[fields]]
name = "cover_image"
label = "Cover Image"
widget = "image"
[fields.media_libraries.cloudinary]
[fields.media_libraries.cloudinary.config]
output_filename_only = true
default_transformations = [[{quality = "auto", fetch_format = "auto"}]]
```

```json [JSON]{7-21}
{
  "fields": [
    {
      "name": "cover_image",
      "label": "Cover Image",
      "widget": "image",
      "media_libraries": {
        "cloudinary": {
          "config": {
            "default_transformations": [
              [
                {
                  "quality": "auto",
                  "fetch_format": "auto"
                }
              ]
            ]
          },
          "output_filename_only": true
        }
      }
    }
  ]
}
```

```js [JavaScript]{7-21}
{
  fields: [
    {
      name: "cover_image",
      label: "Cover Image",
      widget: "image",
      media_libraries: {
        cloudinary: {
          config: {
            default_transformations: [
              [
                {
                  quality: "auto",
                  fetch_format: "auto",
                },
              ],
            ],
          },
          output_filename_only: true,
        },
      },
    },
  ],
}
```

**Legacy `media_library` Option**

As with the top-level configuration, Sveltia CMS supports the legacy `media_library` option at the field level for backward compatibility. Here is an example of configuring a File field to use the Cloudinary media storage with the legacy option:

```yaml
media_library:
  config:
    default_transformations:
      - - quality: auto
          fetch_format: auto
  output_filename_only: true
```

### Image Transformations

You can define default image transformations that will be applied to all uploaded images by specifying the `default_transformations` option in the Cloudinary media storage configuration. This option accepts an array of transformation objects, where each object defines a set of transformation parameters. Only the first transformation in the array will be applied to uploaded media in Sveltia CMS.

For example, to resize all uploaded images to a width of 800 pixels and a height of 600 pixels with cropping and automatic gravity, you can configure the `default_transformations` option as follows:

```yaml [YAML]
media_libraries:
  cloudinary:
    config:
      default_transformations:
        - - width: 800
            height: 600
            crop: fill
            gravity: auto
```

```toml [TOML]
[media_libraries.cloudinary]
[media_libraries.cloudinary.config]
default_transformations = [[{width = 800, height = 600, crop = "fill", gravity = "auto"}]]
```

```json [JSON]
{
  "media_libraries": {
    "cloudinary": {
      "config": {
        "default_transformations": [
          [
            {
              "width": 800,
              "height": 600,
              "crop": "fill",
              "gravity": "auto"
            }
          ]
        ]
      }
    }
  }
}
```

```js [JavaScript]
{
  media_libraries: {
    cloudinary: {
      config: {
        default_transformations: [
          [
            {
              width: 800,
              height: 600,
              crop: "fill",
              gravity: "auto",
            },
          ],
        ],
      },
    },
  },
}
```

See the [Transformation URL API reference](https://cloudinary.com/documentation/transformation_reference) for a complete list of available transformation parameters and their options.

### Accessing the Storage

The Cloudinary media storage can be accessed through the File and Image fields in Sveltia CMS. When uploading media, files will be stored in your Cloudinary account, and you can take advantage of Cloudinary’s transformation capabilities directly from the CMS. You can also select existing media from your Cloudinary storage.

Users are required to authenticate with Cloudinary using their username and password when accessing the media storage provider. The authentication process is handled automatically by Sveltia CMS using the provided API key.

### Using Transformations in Page Templates

When the `output_filename_only` option is set to `true`, only the filename is stored in your entry data files. To generate the full URL with transformations in your site’s page templates, you can use the [JavaScript SDK](https://cloudinary.com/documentation/javascript_integration) or hardcode [transformed URLs](https://cloudinary.com/documentation/image_transformations) based on your Cloudinary account details. Check the Cloudinary documentation for more information on how to construct URLs with transformations.

Source: https://sveltiacms.app/en/docs/media/cloudinary

---

## DigitalOcean Spaces Integration

[DigitalOcean Spaces](https://www.digitalocean.com/products/spaces) is an S3-compatible object storage service with a built-in CDN. Sveltia CMS supports Spaces as a media storage backend with direct browser-to-Spaces uploads using AWS Signature Version 4 — no backend proxy is required.

### Requirements

- A DigitalOcean account with a Space created.
- A Spaces Access Key (see [Credentials](#credentials) below).

#### CSP

If your site uses a Content Security Policy (CSP), you need to allow the Spaces endpoint. See [Content Security Policy](#content-security-policy) below for details.

### Setup

#### Credentials

Spaces uses its own key pair, separate from DigitalOcean personal access tokens. Generate one via **DigitalOcean Control Panel > API > Spaces Keys**.

Note: each key pair covers all Spaces in your account — there is no per-bucket scoping.

The resulting **Access Key** goes in `access_key_id` in your config. The **Secret Key** is entered by users in the CMS UI when they access the media library for the first time — it is never stored in config.

#### Public Read Access

Asset preview and download URLs are unsigned direct storage URLs, so objects must be publicly readable. Set the Space’s file listing to **Public** in **Spaces > Settings**, which makes objects publicly readable by default. Alternatively, configure individual object ACLs.

#### CORS

Configure via **DigitalOcean Control Panel > Spaces > Select bucket > Settings > CORS**. CORS is required because Sveltia CMS sends custom AWS Signature v4 headers that trigger a preflight request.

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "HEAD"],
    "AllowedOrigins": ["https://your-cms-domain.com"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

### Configuration

Here’s an example configuration for DigitalOcean Spaces:

<!-- cSpell:disable -->

```yaml [YAML]
media_libraries:
  digitalocean_spaces:
    access_key_id: ABCD1234EFGH5678IJKL
    bucket: my-space
    region: nyc3
    prefix: cms-uploads/ # Optional
    public_url: https://my-space.nyc3.cdn.digitaloceanspaces.com # Optional, see CDN Endpoint below
```

```toml [TOML]
[media_libraries.digitalocean_spaces]
access_key_id = "ABCD1234EFGH5678IJKL"
bucket = "my-space"
region = "nyc3"
prefix = "cms-uploads/"
public_url = "https://my-space.nyc3.cdn.digitaloceanspaces.com"
```

```json [JSON]
{
  "media_libraries": {
    "digitalocean_spaces": {
      "access_key_id": "ABCD1234EFGH5678IJKL",
      "bucket": "my-space",
      "region": "nyc3",
      "prefix": "cms-uploads/",
      "public_url": "https://my-space.nyc3.cdn.digitaloceanspaces.com"
    }
  }
}
```

```js [JavaScript]
{
  media_libraries: {
    digitalocean_spaces: {
      access_key_id: 'ABCD1234EFGH5678IJKL',
      bucket: 'my-space',
      region: 'nyc3',
      prefix: 'cms-uploads/', // Optional
      public_url: 'https://my-space.nyc3.cdn.digitaloceanspaces.com', // Optional
    },
  },
}
```

<!-- cSpell:enable -->

**Warning**

Do not write your Secret Access Key in the configuration file, as it should be kept confidential and not exposed in client-side code. Users will be prompted to enter the key when they use the storage first time, which will be stored securely in the browser’s local storage.

#### Configuration Properties

| Property | Required | Description |
| --- | --- | --- |
| `access_key_id` | Yes | Spaces Access Key. Safe to store in config. |
| `bucket` | Yes | The Space name. |
| `region` | Yes | Spaces region, e.g. `nyc3`, `sfo2`, `ams3`, `sgp1`, `fra1`. |
| `prefix` | No | Path prefix within the bucket, e.g. `uploads/`. |
| `public_url` | No | CDN or custom subdomain URL for asset previews. See [CDN Endpoint](#cdn-endpoint) below. |

### CDN Endpoint

DigitalOcean Spaces has an optional built-in CDN. Once enabled, the default CDN endpoint is `https://{bucket}.{region}.cdn.digitaloceanspaces.com`. You can also configure a custom subdomain — see the [Spaces CDN custom endpoint guide](https://docs.digitalocean.com/products/spaces/how-to/customize-cdn-endpoint/).

By default, asset URLs use the virtual-hosted storage endpoint (`https://{bucket}.{region}.digitaloceanspaces.com/{key}`). To use the CDN instead, set `public_url` to the CDN or custom subdomain URL:

```yaml
public_url: 'https://my-space.nyc3.cdn.digitaloceanspaces.com'
# or with a custom subdomain:
public_url: 'https://images.example.com'
```

**Warning**

Do **not** set `public_url` to the CDN URL and rely on it for API operations. The CDN endpoint does not support the S3 ListObjects API, so browsing the asset library would stop working. The storage endpoint is always used for listing and uploading; only the asset URLs shown in the CMS change.

### Content Security Policy

API calls (list, upload) go to `https://{region}.digitaloceanspaces.com`. Asset URLs use `https://{bucket}.{region}.digitaloceanspaces.com` by default:

```
connect-src https://nyc3.digitaloceanspaces.com;
img-src     https://my-space.nyc3.digitaloceanspaces.com;
```

If using the CDN or a custom subdomain via `public_url`:

```
connect-src https://nyc3.digitaloceanspaces.com;
img-src     https://my-space.nyc3.cdn.digitaloceanspaces.com; # or a custom subdomain:
```

Replace `nyc3` and `my-space` with your actual region and bucket name.

See the [CSP documentation](https://sveltiacms.app/en/docs/security#setting-up-content-security-policy) for more details.

### Accessing the Storage

The DigitalOcean Spaces media storage can be accessed through the File and Image fields in Sveltia CMS. Enter your Secret Access Key in the CMS UI when prompted, and you’ll be able to upload new media directly to Spaces or select existing media from your bucket.

When uploading media, files will be stored in your Spaces bucket, and you can take advantage of Spaces’ capabilities directly from the CMS. You can also select existing media from your Spaces storage.

**Future Plans**

You’ll be able to manage your Spaces files directly from the [Asset Library](https://sveltiacms.app/en/docs/ui/asset-library) in future releases.

Source: https://sveltiacms.app/en/docs/media/digitalocean-spaces

---

## Scaleway Object Storage Integration

[Scaleway Object Storage](https://www.scaleway.com/en/object-storage/) is an S3-compatible object storage service with multi-region availability. Sveltia CMS supports Scaleway Object Storage as a media storage backend with direct browser-to-storage uploads using AWS Signature Version 4 — no backend proxy is required.

### Requirements

- A Scaleway account with a bucket created.
- A Scaleway API key pair (see [Credentials](#credentials) below).

#### CSP

If your site uses a Content Security Policy (CSP), you need to allow the Scaleway endpoint. See [Content Security Policy](#content-security-policy) below for details.

### Setup

#### Credentials

Scaleway uses IAM API keys for authentication. Generate a key pair via **Scaleway Console > IAM > API Keys**.

The resulting **Access Key ID** goes in `access_key_id` in your config. The **Secret Access Key** is entered by users in the CMS UI when they access the media library for the first time — it is never stored in config.

#### Public Read Access

Asset preview and download URLs are unsigned direct storage URLs, so objects must be publicly readable. When creating or configuring a bucket, set its **Visibility** to **Public** in **Scaleway Console > Object Storage > [bucket] > Bucket settings**.

#### CORS

Configure CORS via AWS CLI. See the [documentation](https://www.scaleway.com/en/docs/object-storage/api-cli/setting-cors-rules/) for details. CORS is required because Sveltia CMS sends custom AWS Signature v4 headers that trigger a preflight request. Make sure to allow the necessary HTTP methods (e.g. GET, PUT) and headers (e.g. Authorization).

### Configuration

Here’s an example configuration for Scaleway Object Storage:

<!-- cSpell:disable -->

```yaml [YAML]
media_libraries:
  scaleway_object_storage:
    access_key_id: SCWXXXXXXXXXXXXXXXXXX
    bucket: my-bucket
    region: fr-par
    prefix: cms-uploads/ # Optional
    public_url: https://my-cdn.example.com # Optional, see CDN / Custom Domain below
```

```toml [TOML]
[media_libraries.scaleway_object_storage]
access_key_id = "SCWXXXXXXXXXXXXXXXXXX"
bucket = "my-bucket"
region = "fr-par"
prefix = "cms-uploads/"
public_url = "https://my-cdn.example.com"
```

```json [JSON]
{
  "media_libraries": {
    "scaleway_object_storage": {
      "access_key_id": "SCWXXXXXXXXXXXXXXXXXX",
      "bucket": "my-bucket",
      "region": "fr-par",
      "prefix": "cms-uploads/",
      "public_url": "https://my-cdn.example.com"
    }
  }
}
```

```js [JavaScript]
{
  media_libraries: {
    scaleway_object_storage: {
      access_key_id: 'SCWXXXXXXXXXXXXXXXXXX',
      bucket: 'my-bucket',
      region: 'fr-par',
      prefix: 'cms-uploads/', // Optional
      public_url: 'https://my-cdn.example.com', // Optional
    },
  },
}
```

<!-- cSpell:enable -->

**Warning**

Do not write your Secret Access Key in the configuration file, as it should be kept confidential and not exposed in client-side code. Users will be prompted to enter the key when they use the storage first time, which will be stored securely in the browser’s local storage.

#### Configuration Properties

| Property | Required | Description |
| --- | --- | --- |
| `access_key_id` | Yes | Scaleway IAM Access Key ID. Safe to store in config. |
| `bucket` | Yes | The bucket name. |
| `region` | Yes | Scaleway region: `fr-par`, `nl-ams`, `pl-waw`, or `it-mil`. |
| `prefix` | No | Path prefix within the bucket, e.g. `uploads/`. |
| `public_url` | No | CDN or custom domain URL for asset previews. See [CDN / Custom Domain](#cdn--custom-domain) below. |

### CDN / Custom Domain

By default, asset URLs use the virtual-hosted storage endpoint (`https://{bucket}.s3.{region}.scw.cloud/{key}`). To serve assets via a CDN or custom domain, set `public_url` to the base URL of your CDN or domain:

```yaml
public_url: 'https://my-cdn.example.com'
```

**Warning**

Do **not** set `public_url` to a CDN URL and rely on it for API operations. The CDN endpoint does not support the S3 ListObjects API, so browsing the asset library would stop working. The storage endpoint is always used for listing and uploading; only the asset URLs shown in the CMS change.

### Content Security Policy

API calls (list, upload) go to `https://s3.{region}.scw.cloud`. Asset URLs use `https://{bucket}.s3.{region}.scw.cloud` by default:

```
connect-src https://s3.fr-par.scw.cloud;
img-src     https://my-bucket.s3.fr-par.scw.cloud;
```

If using a CDN or custom domain via `public_url`:

```
connect-src https://s3.fr-par.scw.cloud;
img-src     https://my-cdn.example.com;
```

Replace `fr-par` and `my-bucket` with your actual region and bucket name.

See the [CSP documentation](https://sveltiacms.app/en/docs/security#setting-up-content-security-policy) for more details.

### Accessing the Storage

The Scaleway Object Storage media storage can be accessed through the File and Image fields in Sveltia CMS. Enter your Secret Access Key in the CMS UI when prompted, and you’ll be able to upload new media directly to your bucket or select existing media.

**Future Plans**

You’ll be able to manage your Scaleway Object Storage files directly from the [Asset Library](https://sveltiacms.app/en/docs/ui/asset-library) in future releases.

Source: https://sveltiacms.app/en/docs/media/scaleway-object-storage

---

## Supabase Storage Integration

[Supabase Storage](https://supabase.com/storage) is an S3-compatible object storage service built on top of Supabase’s open-source platform. Sveltia CMS supports Supabase Storage as a media storage backend with direct browser-to-storage uploads using AWS Signature Version 4 — no backend proxy is required.

### Requirements

- A Supabase project with a storage bucket created.
- An S3 access key pair generated from your project’s storage settings (see [Credentials](#credentials) below).

#### CSP

If your site uses a Content Security Policy (CSP), you need to allow the Supabase Storage endpoint. See [Content Security Policy](#content-security-policy) below for details.

### Setup

#### Credentials

Supabase Storage supports S3-compatible authentication using project-scoped credentials. Generate an access key pair via **Supabase Dashboard > [project] > Storage > S3 Configuration**.

**Warning**

S3 access keys provide full access to all S3 operations across all buckets and bypass Row Level Security (RLS) policies. They are intended for server-side use. Never commit the Secret Access Key to your repository.

The resulting **Access Key ID** goes in `access_key_id` in your config. The **Secret Access Key** is entered by users in the CMS UI when they access the media library for the first time — it is never stored in config.

#### Project ID and Region

The **Project ID** (shown in **Project Settings > General**) goes in `project_id`. The **Region** is also shown on the Storage S3 configuration page and follows the format used on that page (e.g. `us-east-1`, `eu-west-2`).

#### Public Read Access

Asset preview and download URLs point directly to the Supabase public storage URL (`https://{project_id}.supabase.co/storage/v1/object/public/{bucket}/{key}`), so the bucket must be set to **Public**. You can do this in the bucket settings.

#### CORS

Supabase Storage’s S3 endpoint allows cross-origin requests by default for authenticated operations. If you encounter CORS issues, check your project’s network restrictions under **Supabase Dashboard > Settings > Network**.

### Configuration

Here’s an example configuration for Supabase Storage:

<!-- cSpell:disable -->

```yaml [YAML]
media_libraries:
  supabase_storage:
    access_key_id: your_access_key_id
    project_id: abcdefghijklmnopqrst
    bucket: my-bucket
    region: us-east-1
    prefix: cms-uploads/ # Optional
    public_url: https://my-cdn.example.com # Optional, see Custom Domain below
```

```toml [TOML]
[media_libraries.supabase_storage]
access_key_id = "your_access_key_id"
project_id = "abcdefghijklmnopqrst"
bucket = "my-bucket"
region = "us-east-1"
prefix = "cms-uploads/"
public_url = "https://my-cdn.example.com"
```

```json [JSON]
{
  "media_libraries": {
    "supabase_storage": {
      "access_key_id": "your_access_key_id",
      "project_id": "abcdefghijklmnopqrst",
      "bucket": "my-bucket",
      "region": "us-east-1",
      "prefix": "cms-uploads/",
      "public_url": "https://my-cdn.example.com"
    }
  }
}
```

```js [JavaScript]
{
  media_libraries: {
    supabase_storage: {
      access_key_id: 'your_access_key_id',
      project_id: 'abcdefghijklmnopqrst',
      bucket: 'my-bucket',
      region: 'us-east-1',
      prefix: 'cms-uploads/', // Optional
      public_url: 'https://my-cdn.example.com', // Optional
    },
  },
}
```

<!-- cSpell:enable -->

**Warning**

Do not write your Secret Access Key in the configuration file, as it should be kept confidential and not exposed in client-side code. Users will be prompted to enter the key when they use the storage first time, which will be stored securely in the browser’s local storage.

#### Configuration Properties

| Property | Required | Description |
| --- | --- | --- |
| `access_key_id` | Yes | Supabase S3 Access Key ID. Safe to store in config. |
| `project_id` | Yes | Supabase Project ID. Used to construct the S3 API endpoint and public URL. |
| `bucket` | Yes | The storage bucket name. |
| `region` | Yes | The project region shown on the Storage S3 configuration page, e.g. `us-east-1`. |
| `prefix` | No | Path prefix within the bucket, e.g. `uploads/`. |
| `public_url` | No | Custom domain URL for asset previews. See [Custom Domain](#custom-domain) below. |

### Custom Domain

By default, asset URLs use the Supabase public storage URL (`https://{project_id}.supabase.co/storage/v1/object/public/{bucket}/{key}`). To serve assets via a custom domain, set `public_url` to your domain’s base URL:

```yaml
public_url: 'https://media.example.com'
```

### Content Security Policy

API calls (list, upload) go to `https://{project_id}.storage.supabase.co`. Asset URLs use `https://{project_id}.supabase.co` by default:

```
connect-src https://abcdefghijklmnopqrst.storage.supabase.co;
img-src     https://abcdefghijklmnopqrst.supabase.co;
```

If using a custom domain via `public_url`:

```
connect-src https://abcdefghijklmnopqrst.storage.supabase.co;
img-src     https://media.example.com;
```

Replace `abcdefghijklmnopqrst` with your actual Project ID.

See the [CSP documentation](https://sveltiacms.app/en/docs/security#setting-up-content-security-policy) for more details.

### Accessing the Storage

The Supabase Storage media storage can be accessed through the File and Image fields in Sveltia CMS. Enter your Secret Access Key in the CMS UI when prompted, and you’ll be able to upload new media directly to your bucket or select existing media.

**Future Plans**

You’ll be able to manage your Supabase Storage files directly from the [Asset Library](https://sveltiacms.app/en/docs/ui/asset-library) in future releases.

Source: https://sveltiacms.app/en/docs/media/supabase-storage

---

## Uploadcare Integration

[Uploadcare](https://uploadcare.com/) is a powerful media management service that provides robust file uploading, storage, and delivery capabilities. The Uploadcare integration allows users to seamlessly upload and manage media files within Sveltia CMS using Uploadcare’s infrastructure.

**Breaking change from Netlify/Decap CMS**

Sveltia CMS uses the Uploadcare API to integrate the service instead of the deprecated [jQuery File Uploader](https://uploadcare.com/docs/uploads/file-uploader/). This change resolves several issues present in Netlify/Decap CMS, including the ability to select existing files from Uploadcare storage and support for signed uploads.

However, some features available in the previous integration, such as image editing, camera capture and external sources, are not currently supported in Sveltia CMS. We’ll consider adding these features in future releases.

Also, in the `config` object, only `publicKey` and `multiple` options are supported at this time. Please refer to the [Configuration](#configuration) section for more details.

### Requirements

- An Uploadcare account. You can sign up for a free account at [uploadcare.com](https://uploadcare.com/).
- Your Uploadcare public and secret API keys. These can be found in your Uploadcare dashboard under the API Keys section. The public key is required for configuration, while the secret key will be manually entered by users in the CMS UI when they use the storage for the first time.

#### CSP

If your site uses a Content Security Policy (CSP), You may need to update it to allow requests to Uploadcare. See the [CSP documentation](https://sveltiacms.app/en/docs/security#setting-up-content-security-policy) for more details.

### Configuration

#### Top-Level Configuration

To configure the Uploadcare media storage in Sveltia CMS, add the following configuration to the top level of your CMS configuration file:

```yaml [YAML]
media_libraries:
  uploadcare:
    config:
      publicKey: YOUR_PUBLIC_KEY
```

```toml [TOML]
[media_libraries.uploadcare]
[media_libraries.uploadcare.config]
publicKey = "YOUR_PUBLIC_KEY"
```

```json [JSON]
{
  "media_libraries": {
    "uploadcare": {
      "config": {
        "publicKey": "YOUR_PUBLIC_KEY"
      }
    }
  }
}
```

```js [JavaScript]
{
  media_libraries: {
    uploadcare: {
      config: {
        publicKey: "YOUR_PUBLIC_KEY",
      },
    },
  },
}
```

**Legacy `media_library` Option**

Sveltia CMS supports the legacy `media_library` option for backward compatibility with Netlify/Decap CMS, but it is recommended to use the `media_libraries` option for new configurations. With the legacy option, only a single media storage provider can be configured. Here is an example of configuring Uploadcare using the legacy option:

```yaml
media_library:
  name: uploadcare
  config:
    publicKey: YOUR_PUBLIC_KEY
```

The `config` object includes the Uploadcare [jQuery File Uploader options](https://uploadcare.com/docs/uploads/file-uploader-options/). However, only `publicKey` and `multiple` are supported in Sveltia CMS at this time, as we don’t actually use the pre-built uploader.

- `publicKey` (string, required): Your Uploadcare public API key.
- `multiple` (boolean, optional): If set to `true`, allows selecting multiple files at once. Default is `false`. This option is available for backward compatibility; use the `multiple` option in the File or Image field configuration instead.

**Warning**

Do not write your Uploadcare secret key in the configuration file, as it should be kept confidential and not exposed in client-side code. Users will be prompted to enter the secret key when they use the storage first time, which will be stored securely in the browser’s local storage.

There are two Sveltia CMS-specific configuration options you can include under the `settings` object:

- `autoFilename` (boolean): If set to `true`, a filename will be added at the end of the file URL when selecting files, e.g. `https://ucarecdn.com/UUID/filename.jpg`. Default is `false`.
- `defaultOperations` (string): A string of default image transformation operations to be applied to images when they are selected. For example, `/resize/800x600/` will resize images to fit within 800x600 pixels by default. See the [Uploadcare documentation](https://uploadcare.com/docs/transformations/image/) for available operations.

**Tip**

Unlike most of other config options, the setting keys are camelCased. (Not `auto_filename` but `autoFilename`.)

The complete configuration with these additional options looks like this:

```yaml [YAML]
media_libraries:
  uploadcare:
    config:
      publicKey: YOUR_PUBLIC_KEY
    settings:
      autoFilename: true
      defaultOperations: '/resize/800x600/'
```

```toml [TOML]
[media_libraries.uploadcare]
[media_libraries.uploadcare.config]
publicKey = "YOUR_PUBLIC_KEY"

[media_libraries.uploadcare.settings]
autoFilename = true
defaultOperations = "/resize/800x600/"
```

```json [JSON]
{
  "media_libraries": {
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
  media_libraries: {
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

#### Field-Level Configuration

The `media_libraries` configuration can also be specified at the field level for File and Image fields. This allows you to override the top-level configuration for specific fields. Here is an example of configuring a File field to use the Uploadcare media storage with custom default operations:

```yaml [YAML]
- name: my_image
  label: My Image
  widget: image
  media_libraries:
    uploadcare:
      settings:
        defaultOperations: '/crop/200x200/'
```

```toml [TOML]
[[fields]]
name = "my_image"
label = "My Image"
widget = "image"
[[fields.media_libraries.uploadcare.settings]]
defaultOperations = "/crop/200x200/"
```

```json [JSON]
{
  "name": "my_image",
  "label": "My Image",
  "widget": "image",
  "media_libraries": {
    "uploadcare": {
      "settings": {
        "defaultOperations": "/crop/200x200/"
      }
    }
  }
}
```

```js [JavaScript]
{
  name: "my_image",
  label: "My Image",
  widget: "image",
  media_libraries: {
    uploadcare: {
      settings: {
        defaultOperations: "/crop/200x200/",
      },
    },
  },
}
```

**Legacy `media_library` Option**

As with the top-level configuration, Sveltia CMS supports the legacy `media_library` option at the field level for backward compatibility. Here is an example of configuring a File field to use the Uploadcare media storage with the legacy option:

```yaml
media_library:
  settings:
    defaultOperations: '/crop/200x200/'
```

### Signed Uploads

To enhance security, Uploadcare supports [signed uploads](https://uploadcare.com/docs/security/secure-uploads/), which require a secret key to generate upload signatures. Sveltia CMS prompts users to enter the secret key when they use the Uploadcare storage for the first time, and the key is securely stored in the browser’s local storage. After that, all uploads will be automatically signed using the provided secret key. No configuration is needed in the CMS config file.

### Accessing the Storage

The Uploadcare media storage can be accessed through the File and Image fields in Sveltia CMS. When uploading media, files will be stored in your Uploadcare account, and you can take advantage of Uploadcare’s transformation capabilities directly from the CMS. You can also select existing media from your Uploadcare storage.

**Future Plans**

You’ll be able to manage your Uploadcare files directly from the [Asset Library](https://sveltiacms.app/en/docs/ui/asset-library) in future releases.

Source: https://sveltiacms.app/en/docs/media/uploadcare

---

## Stock Photos

Sveltia CMS includes built-in support for integrating free stock photo services directly into the media storage. This allows content creators to easily search for and insert high-quality images into their content without leaving the CMS interface.

### Supported Services

Currently, Sveltia CMS supports the following free stock photo providers:

- [Lorem Picsum](https://picsum.photos/)
- [Pexels](https://www.pexels.com/)
- [Pixabay](https://pixabay.com/)
- [Unsplash](https://unsplash.com/)

**Future Plans**

More providers, including paid stock photo services, will be added in future releases.

#### Note on Lorem Picsum

- You don’t need an API key to use Lorem Picsum, so it’s the easiest option to get started with stock photos in Sveltia CMS.
- Their pictures are mainly for placeholder use, so they may not be suitable for all types of content. However, they can be a great option for testing or when you need generic images without specific themes.
- Their pictures are [CC0 licensed](https://github.com/DMarby/picsum-photos/issues/81#issuecomment-1340068800), which means they are free to use without giving credit to the creator.
- You can access 300 random pictures quickly, but you cannot search for specific images using keywords because the images do not have tags or captions due to the nature of the service.
- Unfortunately, there is no alternative text for the images because they do not have tags or captions. This makes them inaccessible to some users.

#### Non-hotlinking Providers

Due to the non-hotlinking policies, Pexels and Pixabay are disabled if the [internal media storage](https://sveltiacms.app/en/docs/media/internal) is disabled due to the lack of the [`media_folder` option](https://sveltiacms.app/en/docs/media/internal#media-folder) in the configuration.

### Requirements

Except for Lorem Picsum, which does not require an API key, you must obtain API keys for each stock photo service you wish to use. Register for developer accounts at the following links to get your API keys:

- [Pexels API](https://www.pexels.com/api/)
- [Pixabay API](https://pixabay.com/service/about/api/)
- [Unsplash API](https://unsplash.com/developers)

#### CSP

If your site uses a Content Security Policy (CSP), you may need to update it to allow requests to stock photo providers. See the [CSP documentation](https://sveltiacms.app/en/docs/security#setting-up-content-security-policy) for more details.

### Configuration

No additional configuration is required to enable stock photo providers, as they are included by default. However, developers can customize which providers are available or disable them entirely.

To enable or disable specific stock photo providers, you can modify the `providers` array in the `media_libraries` section of your `config.yml` file. For example, to enable only Unsplash, you would configure it as follows:

```yaml [YAML]
media_libraries:
  stock_assets:
    providers:
      - unsplash
```

```toml [TOML]
[media_libraries.stock_assets]
providers = ["unsplash"]
```

```json [JSON]
{
  "media_libraries": {
    "stock_assets": {
      "providers": ["unsplash"]
    }
  }
}
```

```js [JavaScript]
{
  media_libraries: {
    stock_assets: {
      providers: ["unsplash"],
    },
  },
}
```

To disable stock photo providers, you can set the `providers` array to be empty in the `media_libraries` section of your `config.yml` file, as shown below:

```yaml [YAML]
media_libraries:
  stock_assets:
    providers: []
```

```toml [TOML]
[media_libraries.stock_assets]
providers = []
```

```json [JSON]
{
  "media_libraries": {
    "stock_assets": {
      "providers": []
    }
  }
}
```

```js [JavaScript]
{
  media_libraries: {
    stock_assets: {
      providers: [],
    },
  },
}
```

### Using Stock Photos

Stock photos can be accessed directly from the [Image](https://sveltiacms.app/en/docs/fields/image) field in the Sveltia CMS interface. When opening the Select Images dialog, you will see stock photo options alongside your existing media storage.

Select the desired stock photo provider and provide your API key to enable the service. API keys are stored securely in the browser’s local storage, so you don’t need to enter them every time. Lorem Picsum doesn’t require an API key, so it will be available immediately without any configuration.

By default, curated images from each provider are available for quick access. You can also use the search functionality to find specific images based on keywords. Lorem Picsum doesn’t support searching as mentioned earlier, so it will only show random images.

When you find an image you want to use, simply select it, and it will be inserted into your content just like any other media asset. The CMS may show a dialog where you can copy the image credit information to comply with attribution requirements.

Note that some providers require hotlinking to the image’s original URL, while others rather disallow hotlinking. Sveltia CMS handles this automatically based on the provider’s policies, and downloads the image to your media storage if necessary.

**Multi-user setups**

If your CMS instance is used by multiple users, you as an administrator need to distribute your API key to all users to let them use the stock photo feature.

Alternatively, each user can provide their own API key. However, this is not recommended for instances with non-technical end-users because generating and managing API keys may be challenging for them.

Source: https://sveltiacms.app/en/docs/integrations/stock-photos
