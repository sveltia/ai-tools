# Backends and Authentication

Git backend configuration and OAuth setup for GitHub, GitLab and Gitea/Forgejo.

Generated from the Sveltia CMS documentation. Do not edit by hand.

## Backends

A backend defines where your content is stored and how Sveltia CMS interacts with it. Sveltia CMS primarily supports Git-based backends, allowing seamless integration with popular Git hosting services.

### Supported Backends

Sveltia CMS supports the following Git-based backends:

- [GitHub](https://sveltiacms.app/en/docs/backends/github)
- [GitLab](https://sveltiacms.app/en/docs/backends/gitlab)
- [Gitea/Forgejo](https://sveltiacms.app/en/docs/backends/gitea-forgejo)

For testing purposes, you can also use the [Test Backend](https://sveltiacms.app/en/docs/backends/test).

Some features only work with specific backends. For example, [Editorial Workflow](https://sveltiacms.app/en/docs/workflows/editorial) currently only works with the GitHub and GitLab backends.

**Breaking changes from Netlify/Decap CMS**

For performance reasons, Sveltia CMS does not support the **Azure DevOps**, **Bitbucket** and **Git Gateway** backends. Please note that [Git Gateway](https://docs.netlify.com/manage/security/secure-access-to-sites/git-gateway/) has officially been deprecated by Netlify. If you’re using one of these backends with Netlify/Decap CMS, consider switching to GitHub, GitLab, Gitea or Forgejo before migrating to Sveltia CMS.

Also, Sveltia CMS does not support the undocumented custom backend API. The `CMS.registerBackend` method is a noop in Sveltia CMS. We may add support for custom backends in future releases, though compatibility with existing Netlify/Decap CMS custom backends is not guaranteed.

### Configuration

All the configuration options for backends can be set in the `backend` option of your CMS configuration file. Here is a basic example of configuring the GitHub backend:

```yaml [YAML]
backend:
  name: github
  repo: user/repo
```

```toml [TOML]
[backend]
name = "github"
repo = "user/repo"
```

```json [JSON]
{
  "backend": {
    "name": "github",
    "repo": "user/repo"
  }
}
```

```js [JavaScript]
{
  backend: {
    name: "github",
    repo: "user/repo",
  },
}
```

See the specific backend guides for detailed configuration instructions.

The following sections describe some common configuration options available for all Git-based backends.

#### Branch Selection

By default, Sveltia CMS interacts with the repository’s default branch (usually `main` or `master`). You can specify a different branch using the `branch` option in the backend configuration:

```yaml [YAML]{4}
backend:
  name: github
  repo: user/repo
  branch: develop
```

```toml [TOML]{4}
[backend]
name = "github"
repo = "user/repo"
branch = "develop"
```

```json [JSON]{5}
{
  "backend": {
    "name": "github",
    "repo": "user/repo",
    "branch": "develop"
  }
}
```

```js [JavaScript]{5}
{
  backend: {
    name: "github",
    repo: "user/repo",
    branch: "develop",
  },
}
```

#### Authentication Methods

By default, Sveltia CMS allows users to sign in using either OAuth or an access token. You can restrict the available sign-in methods by setting the `auth_methods` option to an array containing only the methods you want to allow:

| Value   | Description                                |
| ------- | ------------------------------------------ |
| `oauth` | OAuth sign-in (e.g. “Sign In with GitHub”) |
| `token` | Access token sign-in                       |

For example, to allow only OAuth sign-in and disable access token authentication:

```yaml [YAML]{4}
backend:
  name: github
  repo: user/repo
  auth_methods: [oauth]
```

```toml [TOML]{4}
[backend]
name = "github"
repo = "user/repo"
auth_methods = ["oauth"]
```

```json [JSON]{5}
{
  "backend": {
    "name": "github",
    "repo": "user/repo",
    "auth_methods": ["oauth"]
  }
}
```

```js [JavaScript]{5}
{
  backend: {
    name: "github",
    repo: "user/repo",
    auth_methods: ["oauth"],
  },
}
```

To allow only access token sign-in and disable OAuth:

```yaml [YAML]{4}
backend:
  name: github
  repo: user/repo
  auth_methods: [token]
```

```toml [TOML]{4}
[backend]
name = "github"
repo = "user/repo"
auth_methods = ["token"]
```

```json [JSON]{5}
{
  "backend": {
    "name": "github",
    "repo": "user/repo",
    "auth_methods": ["token"]
  }
}
```

```js [JavaScript]{5}
{
  backend: {
    name: "github",
    repo: "user/repo",
    auth_methods: ["token"],
  },
}
```

The `auth_methods` array must contain at least one method. An empty array will result in a configuration error.

#### Commit Messages

You can customize the Git commit messages used when saving content. The `commit_messages` option allows you to define templates for various actions. Here’s the default configuration:

```yaml [YAML]
backend:
  commit_messages:
    create: 'Create {{collection}} "{{slug}}"'
    update: 'Update {{collection}} "{{slug}}"'
    delete: 'Delete {{collection}} "{{slug}}"'
    uploadMedia: 'Upload "{{path}}"'
    deleteMedia: 'Delete "{{path}}"'
    openAuthoring: '{{message}}'
```

```toml [TOML]
[backend.commit_messages]
create = "Create {{collection}} \"{{slug}}\""
update = "Update {{collection}} \"{{slug}}\""
delete = "Delete {{collection}} \"{{slug}}\""
uploadMedia = "Upload \"{{path}}\""
deleteMedia = "Delete \"{{path}}\""
openAuthoring = "{{message}}"
```

```json [JSON]
{
  "backend": {
    "commit_messages": {
      "create": "Create {{collection}} \"{{slug}}\"",
      "update": "Update {{collection}} \"{{slug}}\"",
      "delete": "Delete {{collection}} \"{{slug}}\"",
      "uploadMedia": "Upload \"{{path}}\"",
      "deleteMedia": "Delete \"{{path}}\"",
      "openAuthoring": "{{message}}"
    }
  }
}
```

```js [JavaScript]
{
  backend: {
    commit_messages: {
      create: 'Create {{collection}} "{{slug}}"',
      update: 'Update {{collection}} "{{slug}}"',
      delete: 'Delete {{collection}} "{{slug}}"',
      uploadMedia: 'Upload "{{path}}"',
      deleteMedia: 'Delete "{{path}}"',
      openAuthoring: '{{message}}',
    },
  },
}
```

The available commit types are:

- `create`, `update`, `delete`: Used when creating, updating, or deleting entries in collections.
- `uploadMedia`, `deleteMedia`: Used when uploading or deleting media assets.
- `openAuthoring`: Wraps the message generated by one of the types above when the commit is made by an [Open Authoring](https://sveltiacms.app/en/docs/workflows/open) contributor, so you can record who wrote it. `{{message}}` is that generated message. The default template is `{{message}}` on its own, which changes nothing.

**Tip**

Unlike most of other config options, the commit message keys are camelCased.

##### Available Template Tags

You can use the following template tags in commit messages:

- `{{collection}}`: The `label_singular` or `label` of the collection.
- `{{slug}}`: The slug of the entry.
- `{{path}}`: The file path of the media asset.
- `{{message}}`: The commit message generated for the change, wrapped by the `openAuthoring` template.
- `{{author-email}}`: The email of the signed-in user, if available.
- `{{author-login}}`: The login name of the signed-in user, if available.
- `{{author-name}}`: The display name of the signed-in user, if available.

The following table summarizes which tags are supported for each commit type:

| Commit Type | Supported Tags |
| --- | --- |
| `create`, `update`, `delete` | `collection`, `slug`, `path`, `author-email`, `author-login`, `author-name` |
| `uploadMedia`, `deleteMedia` | `path`, `author-email`, `author-login`, `author-name` |
| `openAuthoring` | `message`, `author-email`, `author-login`, `author-name` |

##### Skipping CI/CD

It’s also possible to add the `[skip ci]` prefix to commit messages to prevent triggering CI/CD pipelines. See the [deployments guide](https://sveltiacms.app/en/docs/deployments) for more details.

**Future Plans**

We plan to add an option that prompts users to enter custom commit messages in the UI before saving changes.

#### Including Credentials in API Requests

By default, Sveltia CMS does not include cookies in API requests to the Git hosting service. If your self-hosted Git service instance requires authentication via cookies, you can set the `include_credentials` option to `true`:

```yaml [YAML]{4}
backend:
  name: gitea
  repo: user/repo
  include_credentials: true
```

```toml [TOML]{4}
[backend]
name = "gitea"
repo = "user/repo"
include_credentials = true
```

```json [JSON]{5}
{
  "backend": {
    "name": "gitea",
    "repo": "user/repo",
    "include_credentials": true
  }
}
```

```js [JavaScript]{5}
{
  backend: {
    name: "gitea",
    repo: "user/repo",
    include_credentials: true,
  },
}
```

Your server must also set the [`Access-Control-Allow-Credentials`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Access-Control-Allow-Credentials) header in API responses for this to work.

Source: https://sveltiacms.app/en/docs/backends

---

## Gitea/Forgejo Backend

Gitea and its fork Forgejo are lightweight, self-hosted Git services that are easy to set up and use. Sveltia CMS offers comprehensive support for Gitea/Forgejo repositories, enabling efficient content management.

### Requirements

- Gitea 1.24, Forgejo 12.0 or later.
- A Gitea or Forgejo account.
- A Gitea or Forgejo repository to store your content.
- Sveltia CMS installed in your project.

**Breaking change from Netlify/Decap CMS**

Sveltia CMS requires newer versions of Gitea/Forgejo than Netlify/Decap CMS did to leverage enhanced, high-performance API capabilities. For security reasons, it’s recommended to use the latest stable versions of Gitea/Forgejo.

#### CSP

If your site uses a Content Security Policy (CSP), You may need to update it to allow requests to Gitea or Forgejo. See the [CSP documentation](https://sveltiacms.app/en/docs/security#setting-up-content-security-policy) for more details.

#### CORS

In your Gitea or Forgejo instance, you may need to enable Cross-Origin Resource Sharing (CORS) to allow your Sveltia CMS admin interface to communicate with the backend API. Refer to the [Gitea](https://docs.gitea.com/administration/config-cheat-sheet#cors-cors) or [Forgejo](https://forgejo.org/docs/latest/admin/config-cheat-sheet/#cors-cors) documentation for instructions on how to configure CORS.

### Configuration

The base configuration for the Gitea/Forgejo backend is straightforward. You need to specify the `name` of the backend as `gitea` and provide the `repo` option with the format `owner/repo`, where `owner` is your Gitea/Forgejo username or organization name, and `repo` is the repository name.

```yaml [YAML]
backend:
  name: gitea
  repo: user/repo
```

```toml [TOML]
[backend]
name = "gitea"
repo = "user/repo"
```

```json [JSON]
{
  "backend": {
    "name": "gitea",
    "repo": "user/repo"
  }
}
```

```js [JavaScript]
{
  backend: {
    name: "gitea",
    repo: "user/repo",
  },
}
```

#### Instance URL

By default, Sveltia CMS uses the public Gitea instance at `https://gitea.com`. If you use a self-hosted Gitea or Forgejo instance or a hosting service like [Codeberg](https://codeberg.org/), you need to set the `base_url` and `api_root` options in your backend configuration to point to your server URL.

```yaml [YAML]{4-5}
backend:
  name: gitea
  repo: owner/repo
  base_url: https://gitea.example.com
  api_root: https://gitea.example.com/api/v1
```

```toml [TOML]{4-5}
[backend]
name = "gitea"
repo = "owner/repo"
base_url = "https://gitea.example.com"
api_root = "https://gitea.example.com/api/v1"
```

```json [JSON]{5-6}
{
  "backend": {
    "name": "gitea",
    "repo": "owner/repo",
    "base_url": "https://gitea.example.com",
    "api_root": "https://gitea.example.com/api/v1"
  }
}
```

```js [JavaScript]{5-6}
{
  backend: {
    name: "gitea",
    repo: "owner/repo",
    base_url: "https://gitea.example.com",
    api_root: "https://gitea.example.com/api/v1",
  },
}
```

For Codeberg, use the following settings:

```yaml [YAML]{4-5}
backend:
  name: gitea
  repo: owner/repo
  base_url: https://codeberg.org
  api_root: https://codeberg.org/api/v1
```

```toml [TOML]{4-5}
[backend]
name = "gitea"
repo = "owner/repo"
base_url = "https://codeberg.org"
api_root = "https://codeberg.org/api/v1"
```

```json [JSON]{5-6}
{
  "backend": {
    "name": "gitea",
    "repo": "owner/repo",
    "base_url": "https://codeberg.org",
    "api_root": "https://codeberg.org/api/v1"
  }
}
```

```js [JavaScript]{5-6}
{
  backend: {
    name: "gitea",
    repo: "owner/repo",
    base_url: "https://codeberg.org",
    api_root: "https://codeberg.org/api/v1",
  },
}
```

The API version for Gitea/Forgejo is `v1`, so make sure to include `/api/v1` in the `api_root` option.

**Breaking change from Netlify/Decap CMS**

In Netlify/Decap CMS, the default origin of the `base_url` and `api_root` backend options is set to `https://try.gitea.io` (test instance). In Sveltia CMS, we changed it to `https://gitea.com` (public free service). In most cases, anyway, you need to set these options explicitly to point to your own Gitea/Forgejo instance.

### Authentication

**Tip**

If you plan to only [work with your local repository](https://sveltiacms.app/en/docs/workflows/local), you don’t need to set up authentication.

#### Access Token (Quick Start) {#access-token}

If you or a small team of developers are the only users of your CMS instance, you can use an access token for authentication. This method is straightforward and doesn’t require setting up an OAuth app or updating the CMS configuration.

Just click the “Sign In with Token” button on the login screen. The prompt dialog will provide a link to the token generation page on Gitea/Forgejo with the required scopes pre-selected. Generate a new token and copy it to the clipboard, then paste it into the prompt dialog to log in. The token will be stored in the browser’s local storage and used for subsequent API requests.

You can [disable token authentication](https://sveltiacms.app/en/docs/backends#token-authentication) if needed.

#### PKCE Authorization (Recommended) {#pkce-authorization}

To use PKCE authorization with Sveltia CMS, you need to register a new OAuth app on Gitea/Forgejo and update your Sveltia CMS configuration file accordingly. Here’s how:

1. Follow the instructions in the [Gitea](https://docs.gitea.com/development/oauth2-provider) or [Forgejo](https://forgejo.org/docs/latest/user/oauth2-provider/) documentation to create a new OAuth application.
1. Set the **Redirect URI** to your CMS admin URL, e.g., `https://your-domain.com/admin/`.
1. Uncheck the **Confidential** option.
1. Copy the Client ID of your registered OAuth app.

Then, update your Sveltia CMS configuration file to include the `app_id` option with your Client ID:

```yaml [YAML]{4}
backend:
  name: gitea
  repo: owner/repo
  app_id: YOUR_CLIENT_ID
```

```toml [TOML]{4}
[backend]
name = "gitea"
repo = "owner/repo"
app_id = "YOUR_CLIENT_ID"
```

```json [JSON]{5}
{
  "backend": {
    "name": "gitea",
    "repo": "owner/repo",
    "app_id": "YOUR_CLIENT_ID"
  }
}
```

```js [JavaScript]{5}
{
  backend: {
    name: "gitea",
    repo: "owner/repo",
    app_id: "YOUR_CLIENT_ID",
  },
}
```

Users’ OAuth tokens will be automatically renewed as needed, so there’s no need to worry about token expiration.

### Features

#### Git LFS

Git Large File Storage (LFS) is supported out of the box in the Gitea/Forgejo backend. Just make sure to enable LFS in your repository settings. For more information, refer to the official documentation for [Gitea](https://docs.gitea.com/administration/git-lfs-setup) or [Forgejo](https://forgejo.org/docs/latest/admin/setup/storage/).

#### GraphQL

GraphQL support is not available for Gitea/Forgejo repositories. Sveltia CMS uses the REST API to interact with Gitea/Forgejo.

#### Commit Signing

Commit signing is supported in Gitea/Forgejo repositories, but you may need to configure it on your server. Please refer to the [Gitea](https://docs.gitea.com/administration/signing) or [Forgejo](https://forgejo.org/docs/latest/admin/advanced/signing/) documentation for more details on setting up commit signing.

#### Service Status Checking

Service status checking is not available for Gitea/Forgejo repositories. If you are experiencing issues connecting to your Gitea/Forgejo instance, please verify the server status manually.

### Workflows

The following [content management workflows](https://sveltiacms.app/en/docs/workflows) are supported with the Gitea/Forgejo backend:

- [Local Development Workflow](https://sveltiacms.app/en/docs/workflows/local)
- [Simple Workflow](https://sveltiacms.app/en/docs/workflows/simple)

**Future Plans**

Support for the [Editorial Workflow](https://sveltiacms.app/en/docs/workflows/editorial) may be added in the future.

### Deployment

Both Gitea and Forgejo support CI/CD pipelines that can be used to automate the deployment of your site whenever content is updated through Sveltia CMS. You can set up workflows to build and deploy your static site generator (SSG) whenever changes are pushed to the repository.

- [Gitea Actions](https://docs.gitea.com/usage/actions/overview)
- [Forgejo Actions](https://forgejo.org/docs/latest/user/actions/reference/)

Source: https://sveltiacms.app/en/docs/backends/gitea-forgejo

---

## GitHub Backend

GitHub is one of the most popular Git hosting services, and Sveltia CMS provides first-class support for it. With the GitHub backend, you can easily manage your content stored in GitHub repositories.

### Requirements

- A GitHub account.
- A GitHub repository to store your content.
- Sveltia CMS installed in your project.

#### CSP

If your site uses a Content Security Policy (CSP), You may need to update it to allow requests to GitHub. See the [CSP documentation](https://sveltiacms.app/en/docs/security#setting-up-content-security-policy) for more details.

### Configuration

The base configuration for the GitHub backend is straightforward. You need to specify the `name` of the backend as `github` and provide the `repo` option with the format `owner/repo`, where `owner` is your GitHub username or organization name, and `repo` is the repository name.

```yaml [YAML]
backend:
  name: github
  repo: user/repo
```

```toml [TOML]
[backend]
name = "github"
repo = "user/repo"
```

```json [JSON]
{
  "backend": {
    "name": "github",
    "repo": "user/repo"
  }
}
```

```js [JavaScript]
{
  backend: {
    name: "github",
    repo: "user/repo",
  },
}
```

#### GitHub Enterprise

By default, Sveltia CMS uses the public GitHub instance at `https://github.com`. If you use a self-hosted GitHub Enterprise instance, you need to set the `base_url` and `api_root` options in your backend configuration to point to your GitHub Enterprise server URL.

```yaml [YAML]{4-5}
backend:
  name: github
  repo: owner/repo
  base_url: https://github.example.com
  api_root: https://github.example.com/api/v3
```

```toml [TOML]{4-5}
[backend]
name = "github"
repo = "owner/repo"
base_url = "https://github.example.com"
api_root = "https://github.example.com/api/v3"
```

```json [JSON]{5-6}
{
  "backend": {
    "name": "github",
    "repo": "owner/repo",
    "base_url": "https://github.example.com",
    "api_root": "https://github.example.com/api/v3"
  }
}
```

```js [JavaScript]{5-6}
{
  backend: {
    name: "github",
    repo: "owner/repo",
    base_url: "https://github.example.com",
    api_root: "https://github.example.com/api/v3",
  },
}
```

The API version for GitHub Enterprise is `v3`, so make sure to include `/api/v3` in the `api_root` option.

### Authentication

<!-- There are multiple ways to authenticate with GitHub when using Sveltia CMS. You can choose the method that best fits your needs. Using an access token is the simplest way to get started, but PKCE authorization is recommended if your CMS instance is used by multiple users or non-technical users because it’s more user-friendly and secure. -->

There are multiple ways to authenticate with GitHub when using Sveltia CMS. You can choose the method that best fits your needs. Using an access token is the simplest way to get started, but authorization code flow is recommended if your CMS instance is used by multiple users or non-technical users because it’s more user-friendly and secure.

**Tip**

If you plan to only [work with your local repository](https://sveltiacms.app/en/docs/workflows/local), you don’t need to set up authentication.

#### Access Token (Quick Start) {#access-token}

If you or a small team of developers are the only users of your CMS instance, you can use a [personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens) (PAT) for authentication. This method is straightforward and doesn’t require setting up an OAuth app or updating the CMS configuration.

Just click the “Sign In with Token” button on the login screen. The prompt dialog will provide a link to the token generation page on GitHub with the required scopes pre-selected. Generate a new token and copy it to the clipboard, then paste it into the prompt dialog to log in. The token will be stored in the browser’s local storage and used for subsequent API requests.

You can [disable token authentication](https://sveltiacms.app/en/docs/backends#token-authentication) if needed.

<!-- ### PKCE Authorization (Recommended) {#pkce-authorization} -->

#### PKCE Authorization

**Unimplemented**

We’re waiting for GitHub to support client-side PKCE authentication for single-page apps. It was [planned for Q4 2025](https://github.com/github/roadmap/issues/1153), but GitHub has [put the project on hold](https://github.com/orgs/community/discussions/15752). We can’t release this feature until GitHub provides this support. In the meantime, please use the other authentication methods described in this document.

Note that some AI agents, namely Claude, claim that PKCE support is already available, but that’s not the case. Since [GitLab](https://sveltiacms.app/en/docs/backends/gitlab) supports PKCE, some may have confused GitHub with GitLab. We will update this section with detailed instructions once the feature is available.

<!--

GitHub added [client-side PKCE support](https://github.com/github/roadmap/issues/1153) in January 2026, so you no longer have to rely on the [authorization code flow](#authorization-code-flow) explained below, which requires a backend server to keep the client secret safe.

To use PKCE authorization with Sveltia CMS, you need to register a new app on GitHub and update your Sveltia CMS configuration file accordingly. Here’s how:

1. Open the [Register new GitHub App page](https://github.com/settings/apps/new?name=Sveltia+CMS+Authenticator+for+YOUR_SITE&url=https://github.com/sveltia/sveltia-cms&webhook_active=false&contents=write) on GitHub. This link pre-fills some fields for you.
1. Change the **App name** to include your site name or any name you like.
1. Fill in the **Callback URL** with your actual admin page URL: `https://YOUR_DOMAIN/admin/`
1. Under **Where can this GitHub App be installed?**, select **Any account** if you want to allow both personal and organization accounts to install the app.
1. Click **Create GitHub App**.
1. Copy the **Client ID**. We will need it later.

Move on to the next step to install the app:

1. Click **Install App** on the left sidebar.
1. Choose a user or organization to install the app.
1. Choose the repositories you want to manage with Sveltia CMS. You can select all repositories or just a specific one.
1. Click **Install**.

Next, update your Sveltia CMS configuration file to add the `auth_type` and `app_id` options under the backend configuration. If you have previously added `base_url`, you can remove it as it’s no longer needed.

```yaml [YAML]{4-5}
backend:
  name: github
  repo: owner/repo
  auth_type: pkce # Required for PKCE auth
  app_id: YOUR_CLIENT_ID # Client ID you copied earlier
```

```toml [TOML]{4-5}
[backend]
name = "github"
repo = "owner/repo"
auth_type = "pkce"
app_id = "YOUR_CLIENT_ID"
```

```json [JSON]{5-6}
{
  "backend": {
    "name": "github",
    "repo": "owner/repo",
    "auth_type": "pkce",
    "app_id": "YOUR_CLIENT_ID"
  }
}
```

```js [JavaScript]{5-6}
{
  backend: {
    name: "github",
    repo: "owner/repo",
    auth_type: "pkce",
    app_id: "YOUR_CLIENT_ID",
  },
}
```

Save the configuration file, deploy it to your site, and reload the CMS. You should now be able to sign in with GitHub using the PKCE authorization flow!

Users’ OAuth tokens will be automatically renewed as needed, so there’s no need to worry about token expiration.

**Tip**

If you have installed Sveltia CMS Authenticator or any other third party client, you can remove it as it’s no longer needed for GitHub authentication. Sveltia CMS will handle the PKCE flow directly in the browser.

#### Authorization Code Flow (Legacy) {#authorization-code-flow}

PKCE authorization is the recommended way to authenticate with GitHub. However, if you need to use the authorization code flow for some reason, you can follow the instructions below. This method requires a backend server to keep the client secret safe.

-->

#### Authorization Code Flow

The authorization code flow requires you to set up an OAuth app on GitHub and deploy an OAuth client server to handle the authentication process.

There are multiple options for the OAuth client, including our own Sveltia CMS Authenticator, third-party OAuth clients made for Netlify/Decap CMS, or using Netlify as an OAuth provider.

##### Using Sveltia CMS Authenticator

We provide our own OAuth client called [Sveltia CMS Authenticator](https://github.com/sveltia/sveltia-cms-auth) that you can deploy on Cloudflare Workers. Follow the instructions in the repository to deploy the authenticator and update your CMS configuration file to include the `base_url` option pointing to your authenticator URL:

```yaml [YAML]{4}
backend:
  name: github
  repo: owner/repo
  base_url: YOUR_CLIENT_URL # URL of your OAuth client
```

```toml [TOML]{4}
[backend]
name = "github"
repo = "owner/repo"
base_url = "YOUR_CLIENT_URL"
```

```json [JSON]{5}
{
  "backend": {
    "name": "github",
    "repo": "owner/repo",
    "base_url": "YOUR_CLIENT_URL"
  }
}
```

```js [JavaScript]{5}
{
  backend: {
    name: "github",
    repo: "owner/repo",
    base_url: "YOUR_CLIENT_URL",
  },
}
```

##### Using Third-Party OAuth Client

You can also use [third-party OAuth clients](https://decapcms.org/docs/external-oauth-clients/) made for Netlify/Decap CMS. These clients support various languages and hosting services, and they should work with Sveltia CMS as well without any modifications.

The setup process is similar to using Sveltia CMS Authenticator. You need to register a new OAuth app on GitHub and configure the third-party client with the app credentials. Then, update your CMS configuration to include the `base_url` option pointing to your OAuth client URL, like in the example above.

**Disclaimer**

Third-party clients are not reviewed or maintained by the Sveltia CMS team. Use them at your own risk. Some clients may not be compatible with Sveltia CMS.

##### Using Netlify

For backward compatibility with Netlify CMS, Sveltia CMS supports the authorization code flow using Netlify as an OAuth client. It’s the default authentication method if you don’t configure authentication explicitly, and you don’t need to set up a backend server yourself.

If you’re a Netlify customer, follow the [official guide](https://docs.netlify.com/manage/security/secure-access-to-sites/oauth-provider-tokens/) to register a new OAuth app on GitHub and link it to your Netlify site. No configuration changes are needed in Sveltia CMS.

**Disclaimer**

We are not affiliated with Netlify and do not endorse or maintain this authentication method. We only provide it to ensure backward compatibility with Netlify CMS.

### Features

#### Git LFS

Git Large File Storage (LFS) is not supported in the GitHub backend at this time due to the API limitations. We plan to explore possible solutions in the future.

#### GraphQL

GraphQL support is enabled for GitHub repositories. Sveltia CMS uses the GitHub GraphQL API to interact with the repository, which provides better performance and flexibility compared to the REST API. No additional configuration is needed to enable GraphQL support.

#### Commit Signing

When you commit changes to your GitHub repository through Sveltia CMS, the commits are automatically GPG-signed and [marked as verified](https://docs.github.com/en/authentication/managing-commit-signature-verification/about-commit-signature-verification). This ensures the authenticity and integrity of your commits, providing an additional layer of security for your content management workflow. No additional configuration is needed to enable commit signing.

#### Service Status Checking

Service status checking is available for GitHub repositories, unless you’re using a GitHub Enterprise instance. Sveltia CMS periodically checks the [status of the GitHub service](https://www.githubstatus.com/) to ensure that it is operational. If any incidents are detected, a notification banner will be displayed in the CMS UI to inform users of potential issues that may affect their workflow.

### Workflows

The following [content management workflows](https://sveltiacms.app/en/docs/workflows) are supported with the GitHub backend:

- [Local Development Workflow](https://sveltiacms.app/en/docs/workflows/local)
- [Simple Workflow](https://sveltiacms.app/en/docs/workflows/simple)
- [Editorial Workflow](https://sveltiacms.app/en/docs/workflows/editorial)
- [Open Authoring](https://sveltiacms.app/en/docs/workflows/open)

### Deployment

[GitHub Actions](https://github.com/features/actions) is a great choice for deploying Sveltia CMS sites hosted on GitHub. [GitHub Pages](https://docs.github.com/en/pages) is free for public repositories and easy to set up.

There are also other deployment options, including [Cloudflare Pages](https://developers.cloudflare.com/pages/configuration/git-integration/github-integration/), [Netlify](https://www.netlify.com/integrations/github/), and [Vercel](https://vercel.com/docs/git/vercel-for-github). They provide seamless integration with GitHub repositories and support automatic deployments on push, with additional benefits like serverless functions, storage and AI integrations.

Choose the deployment platform that best fits your needs and follow their documentation to set up continuous deployment for your Sveltia CMS site.

Source: https://sveltiacms.app/en/docs/backends/github

---

## GitLab Backend

GitLab is a popular Git hosting service that offers a wide range of features for developers and teams. Sveltia CMS provides robust support for GitLab repositories, allowing you to manage your content seamlessly.

### Requirements

- GitLab 16.3 or later.
- A GitLab account.
- A GitLab repository to store your content.
- Sveltia CMS installed in your project.

#### CSP

If your site uses a Content Security Policy (CSP), You may need to update it to allow requests to GitLab. See the [CSP documentation](https://sveltiacms.app/en/docs/security#setting-up-content-security-policy) for more details.

### Configuration

The base configuration for the GitLab backend is straightforward. You need to specify the `name` of the backend as `gitlab` and provide the `repo` option with the format `owner/repo`, where `owner` is your GitLab username or organization name, and `repo` is the repository name.

```yaml [YAML]
backend:
  name: gitlab
  repo: user/repo
```

```toml [TOML]
[backend]
name = "gitlab"
repo = "user/repo"
```

```json [JSON]
{
  "backend": {
    "name": "gitlab",
    "repo": "user/repo"
  }
}
```

```js [JavaScript]
{
  backend: {
    name: "gitlab",
    repo: "user/repo",
  },
}
```

If you use subgroups, include them in the `owner` part, e.g., `group/subgroup/repo`.

#### Self-Hosted GitLab Instances

By default, Sveltia CMS uses the public GitLab instance at `https://gitlab.com`. If you use a self-hosted GitLab instance, you need to set the `base_url` and `api_root` options in your backend configuration to point to your GitLab server URL.

```yaml [YAML]{4-5}
backend:
  name: gitlab
  repo: owner/repo
  base_url: https://gitlab.example.com
  api_root: https://gitlab.example.com/api/v4
```

```toml [TOML]{4-5}
[backend]
name = "gitlab"
repo = "owner/repo"
base_url = "https://gitlab.example.com"
api_root = "https://gitlab.example.com/api/v4"
```

```json [JSON]{5-6}
{
  "backend": {
    "name": "gitlab",
    "repo": "owner/repo",
    "base_url": "https://gitlab.example.com",
    "api_root": "https://gitlab.example.com/api/v4"
  }
}
```

```js [JavaScript]{5-6}
{
  backend: {
    name: "gitlab",
    repo: "owner/repo",
    base_url: "https://gitlab.example.com",
    api_root: "https://gitlab.example.com/api/v4",
  },
}
```

The API version for GitLab is `v4`, so make sure to include `/api/v4` in the `api_root` option.

### Authentication

There are multiple ways to authenticate with GitLab when using Sveltia CMS. You can choose the method that best fits your needs. Using an access token is the simplest way to get started, but PKCE authorization is recommended if your CMS instance is used by multiple users or non-technical users because it’s more user-friendly and secure.

**Tip**

If you plan to only [work with your local repository](https://sveltiacms.app/en/docs/workflows/local), you don’t need to set up authentication.

**Breaking change from Netlify/Decap CMS**

The deprecated client-side implicit grant flow for the GitLab backend is not supported in Sveltia CMS. It was [removed from GitLab 15.0](https://gitlab.com/gitlab-org/gitlab/-/issues/344609) in May 2022. Use the PKCE authorization instead.

#### Access Token (Quick Start) {#access-token}

If you or a small team of developers are the only users of your CMS instance, you can use a [personal access token](https://docs.gitlab.com/user/profile/personal_access_tokens/) (PAT) for authentication. This method is straightforward and doesn’t require setting up an OAuth app or updating the CMS configuration.

Just click the “Sign In with Token” button on the login screen. The prompt dialog will provide a link to the token generation page on GitLab with the required scopes pre-selected. Generate a new token and copy it to the clipboard, then paste it into the prompt dialog to log in. The token will be stored in the browser’s local storage and used for subsequent API requests.

You can [disable token authentication](https://sveltiacms.app/en/docs/backends#token-authentication) if needed.

#### PKCE Authorization (Recommended) {#pkce-authorization}

To use PKCE authorization with Sveltia CMS, you need to register a new OAuth app on GitLab and update your Sveltia CMS configuration file accordingly. Here’s how:

1. Follow the instructions in the [GitLab documentation](https://docs.gitlab.com/integration/oauth_provider/) to create a new OAuth application.
1. Set the **Redirect URI** to your CMS admin URL, e.g., `https://your-domain.com/admin/`.
1. Uncheck the **Confidential** option.
1. Select the `api` scope.
1. Copy the Client ID of your registered OAuth app.

Then, update your Sveltia CMS configuration file to include the `auth_type` and `app_id` options:

```yaml [YAML]{4-5}
backend:
  name: gitlab
  repo: owner/repo
  auth_type: pkce
  app_id: YOUR_CLIENT_ID
```

```toml [TOML]{4-5}
[backend]
name = "gitlab"
repo = "owner/repo"
auth_type = "pkce"
app_id = "YOUR_CLIENT_ID"
```

```json [JSON]{5-6}
{
  "backend": {
    "name": "gitlab",
    "repo": "owner/repo",
    "auth_type": "pkce",
    "app_id": "YOUR_CLIENT_ID"
  }
}
```

```js [JavaScript]{5-6}
{
  backend: {
    name: "gitlab",
    repo: "owner/repo",
    auth_type: "pkce",
    app_id: "YOUR_CLIENT_ID",
  },
}
```

Users’ OAuth tokens will be automatically renewed as needed, so there’s no need to worry about token expiration.

#### Authorization Code Flow (Legacy) {#authorization-code-flow}

PKCE authorization is the recommended way to authenticate with GitLab. However, if you need to use the authorization code flow for some reason, you can follow the instructions below. This method requires a backend server to keep the client secret safe.

There are multiple options for the OAuth client, including our own Sveltia CMS Authenticator, third-party OAuth clients made for Netlify/Decap CMS, or using Netlify as an OAuth provider.

##### Using Sveltia CMS Authenticator

We provide our own OAuth client called [Sveltia CMS Authenticator](https://github.com/sveltia/sveltia-cms-auth) that you can deploy on Cloudflare Workers. Follow the instructions in the repository to deploy the authenticator and update your CMS configuration file to include the `base_url` option pointing to your authenticator URL:

```yaml [YAML]{4}
backend:
  name: gitlab
  repo: owner/repo
  base_url: YOUR_CLIENT_URL
```

```toml [TOML]{4}
[backend]
name = "gitlab"
repo = "owner/repo"
base_url = "YOUR_CLIENT_URL"
```

```json [JSON]{5}
{
  "backend": {
    "name": "gitlab",
    "repo": "owner/repo",
    "base_url": "YOUR_CLIENT_URL"
  }
}
```

```js [JavaScript]{5}
{
  backend: {
    name: "gitlab",
    repo: "owner/repo",
    base_url: "YOUR_CLIENT_URL",
  },
}
```

##### Using Third-Party OAuth Client

You can also use [third-party OAuth clients](https://decapcms.org/docs/external-oauth-clients/) made for Netlify/Decap CMS. These clients support various languages and hosting services, and they should work with Sveltia CMS as well without any modifications.

The setup process is similar to using Sveltia CMS Authenticator. You need to register a new OAuth app on GitLab and configure the third-party client with the app credentials. Then, update your CMS configuration to include the `base_url` option pointing to your OAuth client URL, like in the example above.

**Disclaimer**

Third-party clients are not reviewed or maintained by the Sveltia CMS team. Use them at your own risk. Some clients may not be compatible with Sveltia CMS.

##### Using Netlify

For backward compatibility with Netlify CMS, Sveltia CMS supports the authorization code flow using Netlify as an OAuth client. It’s the default authentication method if you don’t configure authentication explicitly, and you don’t need to set up a backend server yourself.

To set it up, you need to register a new OAuth app on GitLab and update your Sveltia CMS configuration file accordingly. Here’s how:

1. Follow the instructions in the [GitLab documentation](https://docs.gitlab.com/integration/oauth_provider/) to create a new OAuth application.
1. Set the **Redirect URI** to `https://api.netlify.com/auth/done`.
1. Select the `api` scope.
1. Open the Netlify site dashboard and [provide the Client ID and Client Secret](https://docs.netlify.com/manage/security/secure-access-to-sites/oauth-provider-tokens/#netlify-ui-settings) of your registered OAuth app.

No configuration changes are needed in Sveltia CMS.

**Disclaimer**

We are not affiliated with Netlify and do not endorse or maintain this authentication method. We only provide it to ensure backward compatibility with Netlify CMS.

### Features

#### Git LFS

Git Large File Storage (LFS) is supported out of the box in the GitLab backend. Just make sure to [enable LFS](https://docs.gitlab.com/topics/git/lfs/) in your GitLab repository settings.

#### GraphQL

GraphQL support is enabled for GitLab repositories. Sveltia CMS uses the GitLab GraphQL API to interact with the repository, which provides better performance and flexibility compared to the REST API. No additional configuration is needed to enable GraphQL support.

#### Commit Signing

Signed commits are supported in self-hosted GitLab instances but disabled by default. See the [GitLab documentation](https://docs.gitlab.com/user/project/repository/signed_commits/web_commits/) for more details on setting up commit signing.

Signed commits are not supported in the public GitLab instance at `gitlab.com` at this time.

#### Service Status Checking

Service status checking is available for GitLab repositories, unless you’re using a self-hosted GitLab instance. Sveltia CMS periodically checks the [status of the GitLab service](https://status.gitlab.com/) to ensure that it is operational. If any incidents are detected, a notification banner will be displayed in the CMS UI to inform users of potential issues that may affect their workflow.

### Workflows

The following [content management workflows](https://sveltiacms.app/en/docs/workflows) are supported with the GitLab backend:

- [Local Development Workflow](https://sveltiacms.app/en/docs/workflows/local)
- [Simple Workflow](https://sveltiacms.app/en/docs/workflows/simple)
- [Editorial Workflow](https://sveltiacms.app/en/docs/workflows/editorial)

### Deployment

[GitLab CI/CD](https://docs.gitlab.com/ci/) is a great choice for deploying Sveltia CMS sites hosted on GitLab. [GitLab Pages](https://docs.gitlab.com/user/project/pages/) can be used to host static sites for free.

There are also other deployment options, including [Cloudflare Pages](https://developers.cloudflare.com/pages/configuration/git-integration/gitlab-integration/), [Netlify](https://www.netlify.com/integrations/gitlab/), and [Vercel](https://vercel.com/docs/git/vercel-for-gitlab). They provide seamless integration with GitLab repositories and support automatic deployments on push, with additional benefits like serverless functions, storage and AI integrations.

Choose the deployment platform that best fits your needs and follow their documentation to set up continuous deployment for your Sveltia CMS site.

Source: https://sveltiacms.app/en/docs/backends/gitlab

---

## Test Backend

The Test backend is a simple backend for testing and local development. It stores entries and assets in a virtual file system in the browser, allowing you to test your Sveltia CMS setup without needing a repository.

### Configuration

The configuration for the Test backend is straightforward. You only need to specify the backend name in your Sveltia CMS configuration file. No repository name or authentication details are required.

```yaml [YAML]
backend:
  name: test-repo
```

```toml [TOML]
[backend]
name = "test-repo"
```

```json [JSON]
{
  "backend": {
    "name": "test-repo"
  }
}
```

```js [JavaScript]
{
  backend: {
    name: "test-repo",
  },
}
```

### How It Works

The Test backend saves entries and assets in the browser’s [origin private file system](https://web.dev/articles/origin-private-file-system) (OPFS) so that changes are not discarded when the browser tab is closed or reloaded. The persistent storage support works with [all modern browsers](https://developer.mozilla.org/en-US/docs/Web/API/FileSystemFileHandle/createWritable#browser_compatibility). Safari requires version 26 or later.

Since it’s not connected to any remote or local repository, the Test backend does not read existing content on initialization. Instead, it starts with an empty state, allowing you to create new entries and assets from scratch.

If you want to test the CMS with a local Git repository, you can use the [Local Development Workflow](https://sveltiacms.app/en/docs/workflows/local) instead. It lets you make changes to local files with Sveltia CMS while it’s running on a local development server.

### Workflows

Only the [Simple Workflow](https://sveltiacms.app/en/docs/workflows/simple) is supported with the Test backend.

Source: https://sveltiacms.app/en/docs/backends/test
