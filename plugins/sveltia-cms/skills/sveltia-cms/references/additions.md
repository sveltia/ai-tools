# Sveltia CMS Additions

Sveltia CMS Additions, the free, self-hosted Cloudflare Worker that adds team features: deploying and connecting it, users and roles with sign-in without GitHub, entry locks, comments, shared credentials and the Administration page. For regular Git backend authentication, see `backends.md`.

Generated from the Sveltia CMS documentation. Do not edit by hand.

## Sveltia CMS Additions

Sveltia CMS Additions is a free, open-source service that adds the features a team needs to Sveltia CMS. You deploy it to your own Cloudflare account, on the Workers Free plan, and connect it to your site’s GitHub repository.

It provides:

- [user management](https://sveltiacms.app/en/docs/additions/users) with admin, editor and viewer roles, and sign-in with a username and password, so people don’t need a GitHub account
- [entry locks](https://sveltiacms.app/en/docs/additions/collaboration#entry-locks), so two people don’t edit the same entry at once by accident, and a list of [who else has an entry open](https://sveltiacms.app/en/docs/additions/collaboration#who-else-has-an-entry-open), both updated in real time
- a [Conversation panel](https://sveltiacms.app/en/docs/additions/collaboration#conversation-panel) for comments on each entry, which appear in everyone’s open tabs as they’re posted
- [shared credentials](https://sveltiacms.app/en/docs/additions/administration#credentials): API keys and a deploy hook that an admin enters once for everyone
- an [Administration page](https://sveltiacms.app/en/docs/additions/administration) in the CMS to manage all of it
- [multi-tenancy](https://sveltiacms.app/en/docs/additions/setup#several-sites-on-one-worker): several sites on one deployment, each with its own users and data — useful for agencies

To get started, follow the [setup guide](https://sveltiacms.app/en/docs/additions/setup).

### How It Works

Sveltia CMS Additions runs as a [Cloudflare Worker](https://www.cloudflare.com/products/workers/), with a [Durable Object](https://developers.cloudflare.com/durable-objects/) that stores its data. It connects to your repository through a GitHub App of its own, which the setup wizard creates for you.

- **Signing in:** people sign in to the service rather than to GitHub. It checks their account and role, then gives the browser a short-lived GitHub token limited to your site’s repository and to what their role allows.
- **Editing:** the CMS uses that token to talk to GitHub directly. Content never passes through the service, so loading, editing and saving are just as fast as with any other GitHub sign-in.
- **Staying signed in:** the CMS gets a new GitHub token from the service about once an hour.
- **Collaborating:** each CMS tab keeps a WebSocket connection to the service, which pushes entry locks, comments and who has an entry open to every tab in real time, without a reload. Idle connections hibernate, so they cost nothing.

If the service goes down, people who are already signed in keep working until their GitHub token expires, which takes an hour at most. Entry locks show a notice that they’re unavailable, and saving still works.

#### Cost

Sveltia CMS Additions is designed to run on the [Workers Free plan](https://developers.cloudflare.com/workers/platform/pricing/). It only handles sign-in, the hourly token refresh, user management, comments and small WebSocket messages, so a typical team stays well within the free allowances. The service is MIT-licensed, with no subscription and no usage fees of its own.

#### Security

- **Passwords:** they never leave the browser. The CMS derives a hash from the password with PBKDF2 (600,000 iterations) before sending it, and the service hashes that again before storing it.
- **Secrets:** sensitive data, such as the GitHub App’s private key, is stored encrypted, under a key protected by the admin secret you choose when deploying.
- **Revocation:** demoting, disabling or signing out a user revokes their GitHub tokens on GitHub’s side right away, rather than waiting for them to expire.
- **Allowed domains:** only the sites you list can use the service. An empty list allows none.

The [setup guide](https://sveltiacms.app/en/docs/additions/setup#security-checklist) ends with a checklist for securing your accounts and repository.

### Requirements

- Sveltia CMS v0.271.0 or later.
- The [GitHub backend](https://sveltiacms.app/en/docs/backends/github). GitHub Enterprise isn’t supported yet.
- A Cloudflare account. The Free plan is enough.
- A GitHub account that can create a GitHub App and install it on the site’s repository.

### Limitations

- GitHub tokens can’t be limited to certain files or branches, so roles apply to the whole repository.
- A GitHub collaborator who also has a CMS account keeps their own GitHub access. Giving them the viewer role only makes the CMS read-only for them.
- For now, people can only sign in with a username and password, or with GitHub. Other identity providers are planned.

### Planned Features

- Support for other backends: GitLab, Gitea and Forgejo
- Support for other serverless platforms, such as Vercel and Netlify
- More sign-in methods, including Google, OpenID Connect providers and Cloudflare Access
- Passkeys and two-factor authentication
- Granular access control for users and roles, including the ability to restrict access to specific collections and locales[^4]
- Scheduled posts[^1]
- [Private configuration](https://github.com/sveltia/sveltia-cms/discussions/576)[^2]
- Proxy for services that don’t support [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS), such as [Cloudflare Images](https://github.com/sveltia/sveltia-cms/discussions/1055), [DeepL Translate](https://github.com/sveltia/sveltia-cms/issues/437) and [Git LFS support for GitHub](https://github.com/sveltia/sveltia-cms/discussions/353)[^3]

<!-- prettier-ignore-start -->

[^1]: Netlify/Decap CMS [#263](https://github.com/decaporg/decap-cms/issues/263), [#2034](https://github.com/decaporg/decap-cms/issues/2034)

[^2]: Netlify/Decap CMS [#7874](https://github.com/decaporg/decap-cms/discussions/7874)

[^3]: Netlify/Decap CMS [#1206](https://github.com/decaporg/decap-cms/issues/1206)

[^4]: Netlify/Decap CMS [#7303](https://github.com/decaporg/decap-cms/issues/7303)

Source: https://sveltiacms.app/en/docs/additions

---

## Administration Page

Admins manage [Sveltia CMS Additions](https://sveltiacms.app/en/docs/additions) from the CMS itself. Select **Administration** in the toolbar, after the other pages, or on the Menu page on a small screen. The page has a section for each topic, listed in its sidebar.

Every setting lives in the service’s database, not in the CMS configuration or in Cloudflare. Secret values, such as the GitHub App’s private key, are write-only: the CMS can replace them, but never reads them back.

When a new version of Sveltia CMS Additions is out, the page shows a notice with a link to the release notes. See [Updating](https://sveltiacms.app/en/docs/additions/setup#updating).

**CMS Configuration**

With [developer mode](https://sveltiacms.app/en/docs/ui#developer-mode) turned on, the Administration page also has a **CMS Configuration** section, which shows the configuration the CMS has loaded. It’s there for everyone in developer mode, with or without Sveltia CMS Additions.

### Users

Lists the people who can sign in, and lets you add them, change their roles, reset their passwords, sign them out, and disable or delete their accounts. See [Users and Roles](https://sveltiacms.app/en/docs/additions/users) for details.

### Sign-In

- **Allow signing in with GitHub:** shows a **Sign In with GitHub** button on the sign-in page. See [Signing In with GitHub](https://sveltiacms.app/en/docs/additions/users#signing-in-with-github).
- **Sign-Up Rules:** lets the members of a GitHub organization sign in without being added first. See [Sign-Up Rules](https://sveltiacms.app/en/docs/additions/users#sign-up-rules).

Signing in with a username and password is always available.

### Domains

Lists the sites that can use the service, one host name per line. The service refuses requests from any other site, and after someone signs in with GitHub, it only sends them back to one of these sites.

- A wildcard (`*`) matches any subdomain: `*.example.com` matches `www.example.com`, but not `example.com`. It’s only accepted at the start of a host name, followed by at least two parts, so `example.*` and `*.com` are refused.
- Sites must use HTTPS, except `localhost` and `127.0.0.1`, which work over HTTP when you list them.
- The site you’re using can’t be removed, so you can’t lock yourself out.

The setup wizard adds your site for you. Prefer exact host names to wildcards: a wildcard trusts every subdomain, including one someone else might take over, such as a forgotten preview deployment. Never use one for a domain where anyone can get a subdomain, as in `*.pages.dev` or `*.netlify.app`: the list also decides where sign-ins are sent back to, so a site someone else controls could receive a sign-in meant for yours.

Changes take effect within a minute.

### GitHub

Shows the GitHub App, the repository it’s installed on and whether it works. If something is wrong, e.g. the app has been uninstalled or suspended, it says what to do. Select **Check Again** after fixing it.

#### Branch Protection

The section warns you until a [ruleset](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets) protects the default branch from force pushes and deletion, without the app on its bypass list. Otherwise, anyone with the editor role could rewrite the branch’s history or delete it, since the app’s tokens can write to it. **Open Repository Rules** takes you to the settings on GitHub.

#### Private Key

The service signs its requests to GitHub with the app’s private key. When the key has been lost, e.g. because the admin secret was replaced, or GitHub no longer accepts it, the page says so and shows the steps below. To replace a key that still works, e.g. because it may have been exposed, select **Replace Private Key** first.

1. Select **Open App Settings** and generate a new private key on GitHub.
1. Select **Upload Private Key**, and choose the `.pem` file GitHub downloaded.
1. Delete the old key on GitHub.

#### Commit Author

Chooses who appears as the author of changes saved by people who don’t [sign in with GitHub](https://sveltiacms.app/en/docs/additions/users#signing-in-with-github):

- **The person who made the change** (default): commits carry the person’s name and email. GitHub links them to the person’s profile when the email belongs to a GitHub account. Without an email, the address is made from the username, such as `jane@users.noreply.example.com`, so it can’t match anyone’s GitHub account.
- **The GitHub App, with the person as co-author**: commits are made by the app, with a `Co-authored-by` trailer naming the person.

GitHub only signs commits that the app authors. If a ruleset requires [signed commits](https://docs.github.com/en/authentication/managing-commit-signature-verification/about-commit-signature-verification), choose the app; otherwise GitHub refuses the commits.

Either way, pushes, pull requests and merges made through the [Editorial Workflow](https://sveltiacms.app/en/docs/workflows/editorial) show the app on GitHub, because GitHub records who made the request.

People who sign in with GitHub always commit as themselves, with their own account.

### Credentials

Holds API keys and the deploy hook for everyone who signs in, so nobody has to enter them separately. Keys can be shared for every service that takes one:

- [translation services](https://sveltiacms.app/en/docs/integrations/translations) and other upcoming AI integrations
- [cloud storage](https://sveltiacms.app/en/docs/media#external-storage) providers
- [stock photo](https://sveltiacms.app/en/docs/integrations/stock-photos) providers

The groups appear when the CMS configuration turns the services on. The deploy hook works like one entered in the [settings](https://sveltiacms.app/en/docs/deployments#other-ci-cd-providers).

A key someone enters in their own settings takes precedence over the shared one. Their settings show a shared key as “Provided by your administrator”, without revealing it, and the shared keys are forgotten when they sign out.

**Shared keys aren’t secret from your team**

The CMS calls these services from the browser, so anyone who can sign in can read the shared keys, viewers included. Only share keys you’re happy for the whole team to have, and prefer keys limited to the services and quotas the CMS needs.

Source: https://sveltiacms.app/en/docs/additions/administration

---

## Collaboration

[Sveltia CMS Additions](https://sveltiacms.app/en/docs/additions) helps a team work on the same site without getting in each other’s way.

Everything on this page happens in real time. Each CMS tab keeps a connection to the service, which pushes every change to all the open tabs as it happens, whether a lock is taken or released, someone opens or closes an entry, or a comment is posted, edited or deleted. Nobody needs to reload the page.

### Entry Locks

When an editor or an admin opens an entry, the CMS takes a lock on it. Anyone else who opens the entry meanwhile can only view it, with a notice at the top of the editor saying who has been editing it and since when.

- **Taking over:** the notice has a **Take Over** button, e.g. for when someone has left an entry open and gone home. The previous holder is told, and their editor becomes read-only. Their unsaved changes stay in their local draft backup.
- **Your other tabs:** if you open an entry you’re already editing in another tab, it’s read-only in the new tab, so the two don’t overwrite each other.
- **Releasing:** the lock is released when the editor is closed. If the tab is closed or loses its connection, the lock is kept for 30 seconds, so reloading the page doesn’t lose it.
- **Entry list:** an editing icon marks entries someone else is editing, with their name on hover.

A lock covers one entry on one branch. All the files of an [i18n entry](https://sveltiacms.app/en/docs/i18n) share one lock. Under the [Editorial Workflow](https://sveltiacms.app/en/docs/workflows/editorial), the same entry can be edited on its workflow branch and on the configured branch at the same time.

Viewers never take locks, because they can’t edit. Each user can hold up to 50 locks at a time.

If the CMS can’t reach the service, the editor shows a notice that locks are unavailable, and someone else may be editing the entry at the same time. Saving still works.

**Locks don’t replace conflict detection**

Locks keep people from editing the same entry by accident, but they’re handled by the CMS, not by GitHub. Sveltia CMS still checks the repository before saving, so a change made outside the CMS, or by someone who took over a lock, is never overwritten without asking. See [Conflict Resolution](https://sveltiacms.app/en/docs/ui/content-editor#conflict-resolution) for details.

### Who Else Has an Entry Open

Everyone sees who else has an entry open, viewers included:

- **In the Content Editor:** the initials of the other people appear next to the entry title, up to three, then a count of the rest. Hover over them to see their names.
- **In the entry list:** an eye icon shows how many other people have the entry open, besides whoever holds its lock. Hover over it to see their names.

You never see yourself. Closing the editor or the tab takes you off the list at once, unlike a lock, which is kept for 30 seconds.

### Conversation Panel

The Conversation panel in the [Content Editor sidebar](https://sveltiacms.app/en/docs/ui/content-editor#sidebar) holds comments about the entry, e.g. a note for the next person or feedback before publishing. Its tab shows how many comments the entry has.

- **Who can comment:** everyone who can sign in, viewers included.
- **Formatting:** comments are written in Markdown, up to 10,000 characters each. Links open in a new tab. Images from other sites are shown as links instead, so they don’t load for everyone who reads the comment.
- **Editing and deleting:** you can edit and delete your own comments. Admins can delete anyone’s.
- **Privacy:** comments are stored by the service, not in the repository, so they never appear on your site. Only people who can sign in to the CMS see them.

Comments belong to the entry, whichever branch it’s edited on. They follow the entry when its slug or path changes in the CMS, and are deleted along with it. A new entry can have comments once it has been saved for the first time.

An entry renamed outside the CMS, e.g. with `git mv` or on GitHub, leaves its comments under its earlier path. The Conversation panel still shows them if the entry redirects from its earlier URL with a [redirect property](https://sveltiacms.app/en/docs/collections/entries/previews#redirects), e.g. `aliases`, which the CMS fills in when it renames an entry. This works when the collection has the `preview_path` option with `{{slug}}` in it, and the comments are shown along with the entry’s own until an entry is created at the earlier path again. The History panel follows the redirects the same way.

New comments appear in every open tab, and the panel has a refresh button too. An entry can have up to 1,000 comments. The panel shows the latest 500, with a button to show older ones.

Source: https://sveltiacms.app/en/docs/additions/collaboration

---

## Setting Up Sveltia CMS Additions

Setting up [Sveltia CMS Additions](https://sveltiacms.app/en/docs/additions) takes four steps:

1. [Deploy the Worker](#deploying-the-worker) to Cloudflare and [turn on its URL](#turning-on-the-worker-s-url).
1. [Point the CMS at it](#configuring-the-cms) in your CMS configuration.
1. [Run the setup wizard](#running-the-setup-wizard) to create the first admin and connect GitHub.
1. [Go through the security checklist](#security-checklist).

With the Deploy button, you won’t need the command line.

### Deploying the Worker

Click the button below:

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/sveltia/sveltia-cms-additions/tree/main/templates/cloudflare)

It copies a small repository into your GitHub account, creates the Durable Object that stores the data, and deploys the Worker with [Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/). The repository only holds configuration: the code comes from the `@sveltia/cms-additions` npm package.

The button asks for one value, `ADMIN_SECRET`. Generate a random one with:

```sh
openssl rand -base64 32
```

Keep the admin secret in a password manager. It unlocks the setup wizard, and the data the service stores is encrypted with a key that it protects. It must be at least 32 characters long.

**Deploying from your computer**

Copy the [`templates/cloudflare`](https://github.com/sveltia/sveltia-cms-additions/tree/main/templates/cloudflare) folder of the Sveltia CMS Additions repository, then run:

```sh
pnpm install
pnpm exec wrangler secret put ADMIN_SECRET
pnpm run deploy
```

#### Turning On the Worker’s URL

The Deploy button deploys the Worker, but Cloudflare may leave its `workers.dev` URL turned off, so nothing can reach it yet. In the [Cloudflare dashboard](https://dash.cloudflare.com/), open **Workers & Pages**, select the Worker, go to **Domains**, and turn on the **Production** URL. The **Preview** URL isn’t needed and can stay off.

Note the Worker’s URL, e.g. `https://sveltia-cms-additions.example.workers.dev`. You can also add a [custom domain](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/) on the same page and use that instead.

### Configuring the CMS

In your CMS configuration, use the [GitHub backend](https://sveltiacms.app/en/docs/backends/github) with `auth_type: additions`, and set `base_url` to the Worker’s URL:

```yaml [YAML]{5-6}
backend:
  name: github
  repo: owner/repo
  branch: main
  auth_type: additions
  base_url: https://sveltia-cms-additions.example.workers.dev
```

```toml [TOML]{5-6}
[backend]
name = "github"
repo = "owner/repo"
branch = "main"
auth_type = "additions"
base_url = "https://sveltia-cms-additions.example.workers.dev"
```

```json [JSON]{6-7}
{
  "backend": {
    "name": "github",
    "repo": "owner/repo",
    "branch": "main",
    "auth_type": "additions",
    "base_url": "https://sveltia-cms-additions.example.workers.dev"
  }
}
```

```js [JavaScript]{6-7}
{
  backend: {
    name: "github",
    repo: "owner/repo",
    branch: "main",
    auth_type: "additions",
    base_url: "https://sveltia-cms-additions.example.workers.dev",
  },
}
```

`base_url` is required with `auth_type: additions`.

The CMS loads the code for Sveltia CMS Additions only when `auth_type` is `additions`, so sites that don’t use it don’t download it.

**Content Security Policy**

If the CMS page has a [Content Security Policy](https://sveltiacms.app/en/docs/security#setting-up-content-security-policy), allow the Worker’s origin in `connect-src` twice: with `https:` for requests, and with `wss:` for the connection that keeps locks and comments up to date. For example:

```http
Content-Security-Policy: connect-src 'self' https://sveltia-cms-additions.example.workers.dev wss://sveltia-cms-additions.example.workers.dev …
```

Keep the other origins the policy already allows, such as `https://api.github.com`. Without the Worker’s origins, the browser blocks the CMS from reaching the service, and signing in fails. The [CSP builder](https://sveltiacms.app/en/docs/security#setting-up-content-security-policy) adds them for you: select **GitHub with Sveltia CMS Additions** and enter your Worker URL.

### Running the Setup Wizard

Open the CMS and select **Use Admin Secret** on the sign-in page, then enter the admin secret. The wizard has two steps:

1. It creates the first admin account, and adds the site’s domain to the [allowed domains](https://sveltiacms.app/en/docs/additions/administration#domains).
1. It creates a GitHub App for the site, and asks you to install it. Install it on **Only select repositories**, with just the site’s repository.

It shows one step at a time. Once both are done, opening it again with the admin secret shows a summary instead, where **Reset Admin Password** sets a new password for an admin who can’t sign in.

GitHub then sends you back to the CMS. Sign in with the admin account you’ve just created, and open **Administration** in the toolbar to [add people](https://sveltiacms.app/en/docs/additions/users#adding-users).

**Tip**

To try the CMS on your computer as well, add `localhost` to the [allowed domains](https://sveltiacms.app/en/docs/additions/administration#domains). Without it, the service refuses requests from a local development server.

#### Getting Back In

The same wizard gets you back in when no admin can sign in:

- **Forgotten admin password:** open the wizard with the admin secret, and reset the password of an admin or create a new admin.
- **Lost admin secret:** set a new one in the Cloudflare dashboard, open the wizard with it, and select **Start Over**. Passwords are kept, but everyone is signed out, and you need to [upload the GitHub App’s private key](https://sveltiacms.app/en/docs/additions/administration#github) again, as the stored secrets can’t be read without the old admin secret.
- **Changed admin secret:** if you replace the admin secret but still know the old one, the wizard asks for it and keeps everything as it is. Nobody is signed out.

Wrong admin secrets are rate limited, for each visitor and for everyone together, so repeated guesses can lock the wizard for up to 10 minutes, even for the right secret. Try again later.

### Security Checklist

Sveltia CMS Additions hands out tokens that can write to your repository, so take a few minutes to secure the accounts and the repository around it:

1. Turn on two-factor authentication for your Cloudflare and GitHub accounts. Give Cloudflare members the smallest role that works, and scope API tokens.
1. Keep `ADMIN_SECRET` in a password manager, and nowhere else.
1. Make sure the GitHub App is installed on the site’s repository only.
1. Add a [ruleset](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets) to the repository that blocks force pushes and restricts deletions on the default branch and on tags, without the app on its bypass list. The [GitHub section](https://sveltiacms.app/en/docs/additions/administration#github) of the Administration page warns you until there is one.
1. Move deployment secrets to environment secrets limited to protected branches, so a change pushed through the CMS can’t reach them.
1. Check the [allowed domains](https://sveltiacms.app/en/docs/additions/administration#domains). List only sites you control, prefer exact host names to wildcards, and never use a wildcard on a domain where anyone can get a subdomain.
1. Pin the version of Sveltia CMS your site loads, and add a [Content Security Policy](https://sveltiacms.app/en/docs/security#setting-up-content-security-policy) to the CMS page.
1. Watch the [Sveltia CMS Additions releases](https://github.com/sveltia/sveltia-cms-additions/releases), and [update](#updating) when the Administration page says a new version is out.

### Updating

Dependabot opens a pull request in your copy of the repository when a new version is released. Merge it, and Workers Builds deploys the update. You can also change the version of `@sveltia/cms-additions` in its `package.json` yourself.

Don’t change `wrangler.jsonc` unless the release notes ask you to. The service applies its own database changes after an update, so there’s nothing else to run.

When a new version is out, admins see a notice with a link to the release notes on the [Administration page](https://sveltiacms.app/en/docs/additions/administration).

### Renaming or Moving the Repository

Renaming the repository doesn’t break anything: the service knows it by its ID and picks up the new name, which the [GitHub section](https://sveltiacms.app/en/docs/additions/administration#github) of the Administration page then shows. Change `repo` in the CMS configuration to the new name as well, because GitHub redirects the old name only until another repository takes it.

Moving the repository to another owner takes it out of the GitHub App’s installation. Install the app for the new owner, with the repository selected, then run the setup wizard again to record the installation.

### Several Sites on One Worker

A single Worker can serve several sites, e.g. an agency’s clients. Each site is a _tenant_ with its own users, sessions, settings, GitHub App and data, kept in storage no other tenant can reach. The site you set up above is the _default_ tenant, served at the root of the Worker. Other tenants are served under `/t/<ID>`.

#### Adding a Site

Manage the tenants in the setup wizard of the default tenant’s CMS: select **Use Admin Secret** on its sign-in page, enter the admin secret, and select **Manage Other Sites**. It lists the other tenants, and lets you add one with an ID and an optional name. The ID has 1 to 32 lowercase letters, digits and hyphens, and becomes part of the tenant’s URL, so it can’t be changed later.

It shows each tenant’s URL, with a button to copy it. The URL becomes the `base_url` in that site’s CMS configuration:

```yaml [YAML]{5}
backend:
  name: github
  repo: acme/website
  auth_type: additions
  base_url: https://sveltia-cms-additions.example.workers.dev/t/acme
```

```toml [TOML]{5}
[backend]
name = "github"
repo = "acme/website"
auth_type = "additions"
base_url = "https://sveltia-cms-additions.example.workers.dev/t/acme"
```

```json [JSON]{6}
{
  "backend": {
    "name": "github",
    "repo": "acme/website",
    "auth_type": "additions",
    "base_url": "https://sveltia-cms-additions.example.workers.dev/t/acme"
  }
}
```

```js [JavaScript]{6}
{
  backend: {
    name: "github",
    repo: "acme/website",
    auth_type: "additions",
    base_url: "https://sveltia-cms-additions.example.workers.dev/t/acme",
  },
}
```

Then run the [setup wizard](#running-the-setup-wizard) in that site’s CMS. It creates the site’s first admin and its own GitHub App.

#### Managing Users of Each Site

Each tenant’s admins manage its users on the [Administration page](https://sveltiacms.app/en/docs/additions/administration) of that site’s CMS, as on a single site. An admin of one tenant can’t see or manage the others, so to manage several sites yourself, add yourself as an admin to each. If nobody can sign in to a tenant any more, its setup wizard gets you back in with the admin secret, as described in [Getting Back In](#getting-back-in).

#### Deleting a Site

To delete a tenant, select the delete button next to it under **Manage Other Sites**, and type its ID to confirm. Its users, settings and comments are deleted, which can’t be undone. Its GitHub App stays on GitHub, where you can delete it in the app’s settings.

#### Limits and Alternatives

The tenants share the admin secret and the Free plan’s allowances. If you change `ADMIN_SECRET`, open the setup wizard of every tenant with the new secret, so each one keeps its data.

To keep clients apart at the Cloudflare account level as well, deploy a separate Worker for each instead, giving each its own Worker name. The Deploy button asks for it; from your computer, change `name` in `wrangler.jsonc` before the first deploy.

Source: https://sveltiacms.app/en/docs/additions/setup

---

## Users and Roles

With [Sveltia CMS Additions](https://sveltiacms.app/en/docs/additions), people sign in to the CMS with an account the service manages, rather than with their own GitHub account. Admins add people in the **Users** section of the [Administration page](https://sveltiacms.app/en/docs/additions/administration) and give each a role.

### Roles

Each user has one of three roles:

| Role   | What they can do                                                                    |
| ------ | ----------------------------------------------------------------------------------- |
| Admin  | Everything an editor can, plus manage users and settings on the Administration page |
| Editor | Create, edit, delete and publish content and assets, and trigger deployments        |
| Viewer | Browse content and assets, and comment on entries, without changing anything        |

For a viewer, the whole CMS is read-only, as if the global [`readonly` option](https://sveltiacms.app/en/docs/collections/entries/operations#making-content-read-only) were set, with a message saying they have view-only access. They can’t trigger deployments, and they never take [entry locks](https://sveltiacms.app/en/docs/additions/collaboration#entry-locks), but they can still use the [Conversation panel](https://sveltiacms.app/en/docs/additions/collaboration#conversation-panel).

The role is enforced by GitHub as well as by the CMS: the token a viewer gets can only read the repository, while an editor’s or an admin’s can write to it. Either way, the token is limited to the site’s repository.

There must always be at least one admin, and admins can’t disable or delete their own account.

#### Changing a Role

Select **Edit User** in the options menu of the user’s row, and choose a new role. Demoting someone takes effect at once: their GitHub tokens are revoked on GitHub, and their open CMS tabs switch to the new role the next time the CMS calls GitHub. Unsaved changes stay in the local draft backup.

A promotion takes effect when the CMS next renews its GitHub token, which happens within an hour, or straight away if the user signs in again.

### Adding Users

In the **Users** section, select **Add User** and enter:

- **Username:** 3 to 30 lowercase letters, digits, dots, hyphens or underscores, used to sign in. It can’t be changed later.
- **Name:** shown in the CMS, e.g. on [entry locks](https://sveltiacms.app/en/docs/additions/collaboration#entry-locks) and comments, and used as the [commit author](https://sveltiacms.app/en/docs/additions/administration#commit-author).
- **Email:** optional. It’s used as the commit author’s email, so GitHub can link commits to the person’s GitHub profile.
- **Role:** admin, editor or viewer.
- **GitHub username:** optional. With one, the person [signs in with that GitHub account](#signing-in-with-github) instead of a password.

Without a GitHub username, the CMS shows the username and a temporary password once, each with a button to copy it. Give them to the person, who chooses their own password the first time they sign in. Passwords must have at least 12 characters.

If the person has an email address, **Email to** opens your email app with a message ready to send: their username, the temporary password and a link that opens the CMS with both filled in on the sign-in form. The details are taken out of the address as soon as the CMS reads them, and the person still signs in and chooses their own password. **Reset Password** offers the same button, with a message saying the password has been reset.

Sveltia CMS Additions never sends email itself, so there are no automatic invitations or password reset emails: admins hand out temporary passwords, from their own email app or otherwise.

#### Managing Users

The users list shows each person’s role, how they sign in, when they last signed in and their status:

- **Active:** can sign in.
- **Temporary password:** hasn’t chosen their own password yet.
- **Waiting for first sign-in:** was added with a GitHub username, and hasn’t signed in yet.
- **Disabled:** can’t sign in.

The options menu in each row lets you:

- **Edit User:** changes the user’s name, email, role and, when GitHub sign-in is on, GitHub username. The username can’t be changed. The GitHub username of someone who can only sign in with GitHub can’t be removed until they have a password, which **Reset Password** gives them.
- **Reset Password:** gives the user a new temporary password and signs them out everywhere.
- **Sign Out Everywhere:** ends all their sessions.
- **Disable User** and **Enable User:** turns sign-in off or on for the account. Disabling signs them out and revokes their GitHub tokens.
- **Delete User:** removes the account. This can’t be undone. Their comments stay, attributed to a deleted user.

To remove someone who could sign up again through a [sign-up rule](#sign-up-rules), disable their account rather than delete it: a deleted account would be created again the next time they sign in.

### Signing In

The sign-in page shows a username and password form, and a **Sign In with GitHub** button when GitHub sign-in is turned on.

Sessions end after a day without use, and after 7 days in any case. The CMS renews the GitHub token in the background while the session lasts, so nobody has to sign in again in the middle of their work. Repeated failed sign-ins are rate limited.

#### Your Account

Open **Settings** from the account menu, at the top right, or from the **Menu** page on a small screen, and select the **Account** tab. There you can change your name, which is also used as the author of your commits. Your username can’t be changed, and only an admin can change your email address, so nobody can make their commits look like someone else’s.

To change your password, enter your current password and a new one in the **Password** section. You stay signed in on that device, and are signed out everywhere else.

Passwords never leave the browser: the CMS derives a hash from the password before sending it, so the service never sees it.

#### Signing In with GitHub

An admin can turn on GitHub sign-in in the [**Sign-In**](https://sveltiacms.app/en/docs/additions/administration#sign-in) section of the Administration page. People who sign in with GitHub get a token for their own GitHub account, so their changes are committed as them, and their access to the repository is what GitHub allows them.

GitHub sign-in never creates an account by itself. Someone can only sign in with GitHub if an admin has added them with their GitHub username, or if a [sign-up rule](#sign-up-rules) covers them. The account is tied to the GitHub user ID, so it keeps working if the person renames their GitHub account.

People with a password account can also select **Link GitHub Account** in the account menu to sign in with GitHub from then on.

#### Sign-Up Rules

By default, only admins add people. A sign-up rule lets the members of a GitHub organization sign in with GitHub without being added first. Add rules in the [**Sign-In**](https://sveltiacms.app/en/docs/additions/administration#sign-in) section of the Administration page. How they work:

- The GitHub App must be installed on that organization.
- A rule gives new accounts the editor or viewer role, never admin. Promote people by hand when needed.
- The person is checked against the rule every time they sign in with GitHub, and at least once an hour while they keep using the CMS. Someone who has left the organization is turned away or signed out, and their account is disabled.
- If GitHub can’t tell, e.g. while it’s down or after the organization has been renamed, the sign-in fails, but the account stays as it is.

An account created by a rule shows an **Adopt Account** option. Adopting it turns it into an ordinary account, which no longer depends on the rule. Promoting someone to admin adopts their account too.

### Commits

People who sign in with GitHub, or have linked their GitHub account, commit as themselves.

Everyone else saves through the site’s GitHub App, which can either commit in the person’s name, or as the app with the person as co-author. Admins choose in the [Commit Author](https://sveltiacms.app/en/docs/additions/administration#commit-author) setting.

Source: https://sveltiacms.app/en/docs/additions/users
