# Publishing Workflows

Local development, the simple and editorial publishing workflows, open authoring and deploy previews.

Generated from the Sveltia CMS documentation. Do not edit by hand.

## Content Management Workflows

Sveltia CMS supports several workflows to accommodate different content management needs. Below are the available workflows:

### Development

[Local Development Workflow](https://sveltiacms.app/en/docs/workflows/local) is available for development and testing purposes. It allows you to run Sveltia CMS without needing to connect to a remote repository or authentication service.

### Production

There are two main workflows for production use:

- [Simple Workflow](https://sveltiacms.app/en/docs/workflows/simple): no review process, editors can directly commit changes to the main branch.
- [Editorial Workflow](https://sveltiacms.app/en/docs/workflows/editorial): includes a review and approval process before changes are merged into the main branch.

Additionally, the following features enhance the content management experience:

- [Open Authoring](https://sveltiacms.app/en/docs/workflows/open): allows external contributors to submit changes via pull requests.
- [Deploy Previews](https://sveltiacms.app/en/docs/workflows/deploy-previews): links each entry to the build made for it, and shows whether that build has finished.

These production workflows can be used locally or remotely. Not all workflows are supported by every backend; refer to the specific workflow documentation for details.

**Future Plans**

We’re planning to introduce **Preview Workflow** in the future, which will allow editors to preview their changes before publishing them live. It would be a simplified version of Editorial Workflow, enabling content previews by creating a preview branch (pull/merge request) without a formal review process. Major hosting services like [Vercel](https://vercel.com/docs/deployments/environments#preview-environment-pre-production) and [Cloudflare Pages](https://developers.cloudflare.com/pages/configuration/preview-deployments/) support preview deployments from pull/merge requests, making this workflow feasible.

Source: https://sveltiacms.app/en/docs/workflows

---

## Deploy Previews

Most hosting services build your site again whenever a commit lands, and many build a separate copy for each pull request. Sveltia CMS asks your Git backend where those builds ended up, so an editor can open the page they just worked on without hunting for the URL — and can tell whether the build has finished yet.

This works in both production workflows, with a different meaning in each:

- In [Editorial Workflow](https://sveltiacms.app/en/docs/workflows/editorial), an unpublished entry links to the **deploy preview** built for its pull request, so you can see a draft before it goes live.
- In [Simple Workflow](https://sveltiacms.app/en/docs/workflows/simple), where changes are committed straight to the [configured branch](https://sveltiacms.app/en/docs/backends#branch-selection), an entry links to the **live site**, and the CMS reports whether the build for your latest change has finished.

### Requirements

- A [GitHub](https://sveltiacms.app/en/docs/backends/github) or [GitLab](https://sveltiacms.app/en/docs/backends/gitlab) backend.
- A CI/CD provider connected to your repository. See [CI/CD Integration](https://sveltiacms.app/en/docs/deployments#ci-cd-integration).
- A [`preview_path`](https://sveltiacms.app/en/docs/collections/entries#managing-preview-paths) on each collection you want links for. Without it there’s nothing to point at, so no link is shown.

**Date tags need a date field**

When `preview_path` uses `{{year}}`, `{{month}}` or another date tag, the CMS reads it from the collection’s DateTime field — or the one named by `preview_path_date_field`. If no such field exists, a configuration warning says so, because the preview link would otherwise go missing with no explanation. A field that exists but is left empty on an entry has the same effect, and can only be spotted on the entry itself.

**Future Plans**

Support for the [Gitea/Forgejo](https://sveltiacms.app/en/docs/backends/gitea-forgejo) backend may be added in the future. Until then, entries on that backend link to the live site as before, with no build state reported.

### Configuration

There’s nothing to turn on. As long as the requirements above are met, deploy preview links appear on their own.

The options below shape what the links do:

| Option | Where | What it does |
| --- | --- | --- |
| [`preview_path`](https://sveltiacms.app/en/docs/collections/entries#managing-preview-paths) | Collection | Path template appended to the site or preview URL. **Required.** |
| [`preview_path_date_field`](https://sveltiacms.app/en/docs/collections/entries#managing-preview-paths) | Collection | Which date field the `{{year}}`, `{{month}}` and similar tags read |
| [`site_url`](https://sveltiacms.app/en/docs/customization#site-url) | Top level | Base URL of your live site |
| `show_preview_links` | Top level | Set to `false` to hide every preview link. Default: `true` |
| [`preview_context`](#specifying-a-status-context) | `backend` | Names the exact commit status or environment that carries the preview URL |

If `site_url` isn’t set, the CMS falls back to the URL reported by your production deployment, so links can still work without it. When `site_url` _is_ set, it always wins.

### How It Works

Every entry belongs to a commit: the head of its pull request in Editorial Workflow, or the head of the configured branch otherwise. The CMS asks the backend what your CI/CD provider reported for that commit, takes the URL from the answer, and appends the collection’s `preview_path`.

So an entry whose `preview_path` is `/blog/{{slug}}` links to `https://example.com/blog/my-post` on the live site, and to `https://cms-posts-hello.example.pages.dev/blog/my-post` on a deploy preview built by Cloudflare Pages.

#### Where the URL Comes From

Providers report a deployment in one of three ways, and Sveltia CMS reads all of them:

| Source | Known to use it |
| --- | --- |
| **Deployments** (GitHub) and **environments** (GitLab) | Vercel, GitHub Pages, GitLab Review Apps |
| **Commit statuses** | Vercel, and CI services that post a build status |
| **Check runs** (GitHub only) | Cloudflare Pages, AWS Amplify |

All three are read whichever provider you use, so one that isn’t listed still works as long as it reports through any of them. Equally, a provider that reports nowhere the Git host can see — several publish only to their own dashboard, or to a pull request comment — can’t be detected at all. If you’re unsure which applies, open a recent commit on your Git host and see whether anything is attached to it.

When more than one reports on the same commit, the CMS prefers a finished build with a page to open, then the source whose URL is most reliable — a deployment’s environment URL is always the site, while a commit status URL is sometimes a build log. It then prefers an environment whose name matches what it’s looking for, so a `production` environment isn’t passed over for a `preview` one on your live branch. Ties go to the newest.

An address is only taken from a finished build. Several providers hand out a placeholder while they work — Cloudflare Pages reports its own dashboard until the build succeeds, then replaces it with the preview address — so nothing is offered until there’s a page behind it. A URL leading back to your Git host is ignored for the same reason: that’s a job log, which every GitLab CI job reports.

A build that was canceled or skipped is ignored, even when the provider reports it as successful. This happens in a monorepo, where a site that the commit didn’t touch still reports a result, and its URL leads to the build log rather than a page.

**How check runs are read**

A check run’s own link usually leads to a build log rather than a site, so it takes more care than the other two sources.

Every run reports its build state, so a provider these rules have never heard of still tells you that a build on the commit is running or has failed. Offering an address is another matter: only a run whose name suggests a deployment does that, and one that doesn’t is ranked below every one that does — so a green test suite can’t stand in for a build that hasn’t finished. For a run that does look like a deployment, the address is taken in this order:

1. **A URL published in the run’s output.** Cloudflare Pages writes a table of preview URLs into its check summary while linking the check itself at the Cloudflare dashboard, so that table is read and dashboard links in it are passed over.
2. **The run’s own link, but only if the name says “preview”.** AWS Amplify reports “AWS Amplify Console Web Preview” and links straight to the site.
3. **Neither.** The build state is still reported — so you see that a build is running or has failed — but no address is offered.

If your provider’s naming defeats this, name the check explicitly with [`preview_context`](#specifying-a-status-context).

#### Build States

What the control does depends on whether a preview is still on its way.

**While a preview is being built for an unpublished entry**, the button reads **Checking for Preview**, is disabled, and shows a turning icon. The live site isn’t where that entry can be seen — it holds the published version, or nothing at all when the entry is new — so offering that link would send you somewhere else.

**Otherwise the button is a link**, reading **View Preview** when it points at a deploy preview and **View on Live Site** when it points at the live site. A build that’s still running or has failed is described on the control for screen readers, and shown as a badge on the [Editorial Workflow page](https://sveltiacms.app/en/docs/workflows/editorial#editorial-workflow-page):

| Build state                                  | Badge on the workflow card |
| -------------------------------------------- | -------------------------- |
| Building                                     | **Building…**              |
| Failed                                       | **Build Failed**           |
| Being queried, finished, or nothing reported | none                       |

A published entry is never made to wait, whatever its build is doing: the live site genuinely holds that page, so the link stays available.

When no CI/CD provider reports anything — because none is connected, or because it reports in a way the backend doesn’t expose — nothing is lost. You get the same live-site link you always had.

While a build is running, the CMS checks again every 5 seconds, so a preview is offered as soon as it exists. On GitHub each check is a single request; on GitLab it costs one shared call plus one per commit being watched. It gives up after 10 minutes: the icon stops turning, the link comes back, and a **Check for Preview** action appears in the entry editor’s options menu. Reopening the entry starts a fresh round of checks, so a build longer than that isn’t lost.

#### Checking Whether the Page Is Live

A finished build isn’t quite the same as a page you can open: a CDN may not have caught up, and a brand-new entry can 404 for a moment after publishing. Where it can, the CMS requests the page itself and keeps treating the build as unfinished until it answers.

This check only runs when the page is on the same origin as the CMS — the usual case where the CMS is served from `/admin` on the site it edits. A browser can’t read a cross-origin response without permission from that server, and no major static host grants it, so the request is skipped rather than sent to learn nothing. Deploy previews are almost always on another origin, so their state comes from the provider alone.

#### Where Links Appear

- In the entry editor toolbar, for the default locale.
- In each locale pane’s options menu, so a multilingual entry links to the right translation. See [Managing Preview Paths with I18n](https://sveltiacms.app/en/docs/i18n#managing-preview-paths-with-i18n).
- On the cards of the [Editorial Workflow page](https://sveltiacms.app/en/docs/workflows/editorial#editorial-workflow-page), as an icon button, with a badge when a build is running or has failed.

### Specifying a Status Context

If several providers report on the same commit, or the CMS picks the wrong one, name the one you want with `preview_context` in the `backend` section. Only that commit status, check run or environment is then considered.

```yaml [YAML]
backend:
  name: github
  repo: user/repo
  preview_context: Cloudflare Pages
```

```toml [TOML]
[backend]
name = "github"
repo = "user/repo"
preview_context = "Cloudflare Pages"
```

```json [JSON]
{
  "backend": {
    "name": "github",
    "repo": "user/repo",
    "preview_context": "Cloudflare Pages"
  }
}
```

```js [JavaScript]
{
  backend: {
    name: 'github',
    repo: 'user/repo',
    preview_context: 'Cloudflare Pages',
  },
}
```

The name is matched exactly first, and as a partial match if nothing matches exactly — so `cloudflare` finds `Cloudflare Pages` too. Matching is case-insensitive.

Setting this option narrows the search deliberately, so if nothing matches, the CMS reports no preview rather than falling back to a provider you didn’t ask for. Check the name against the status or environment as it appears on your repository if a link stops showing up.

### Limitations

- On GitHub, a workflow that deploys your site but reports no deployment, no commit status and no check run can’t be detected. Publishing to GitHub Pages with the official actions creates a deployment, so it works; a hand-rolled workflow that only uploads files may not.
- [Cloudflare Workers](https://developers.cloudflare.com/workers/ci-cd/builds/git-integration/github-integration/) publishes its preview URL in a pull request comment, which no API surfaces alongside the commit. Its check run still reports whether the build succeeded, so you get the build state without a preview link. Cloudflare Pages, which writes the address into its check output, works fully.
- Reading a preview URL out of a check run’s output means reading what that provider chose to write. If the format changes, the address is no longer found and the entry falls back to its live-site link — degraded rather than broken.
- On GitLab, deployments can’t be filtered by commit through the API, so the CMS scans the most recent 100 from the past week and matches them to your branch. A project that deploys more often than that may push a Review App out of range, in which case its commit status still covers it.
- A preview behind access control, such as Vercel’s Deployment Protection, answers the liveness check with an authentication error rather than a page. The CMS treats that as “can’t tell” and leaves the link alone, since it works for anyone signed in.

Source: https://sveltiacms.app/en/docs/workflows/deploy-previews

---

## Editorial Workflow

This is an advanced remote workflow designed for teams that require a review process before changes are merged into the [configured branch](https://sveltiacms.app/en/docs/backends#branch-selection). Editors can submit changes for review, and designated reviewers can approve or request modifications.

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

### How It Works

Nothing an editor does in the CMS touches your configured branch until the change is published. Each entry with unsaved work lives on its own branch with an open pull request, so making a change and releasing it are two separate steps.

| Editor action | What happens in Git |
| --- | --- |
| Save a new entry | A branch named `cms/[COLLECTION_NAME]/[SLUG]` is created off the configured branch, the entry files are committed to it, and a pull request is opened |
| Save an existing draft | Another commit is added to the same branch |
| Change the status | The pull request’s label is updated |
| Delete a published entry | A pull request is opened that removes the entry files |
| Publish | The pull request is merged and its branch is deleted |
| Discard | The pull request is closed without merging and its branch is deleted |

On GitLab the same applies, with merge requests in place of pull requests.

#### Saving and Sending for Review

Saving an entry doesn’t hand it to anyone — it stays a draft until someone moves it on. So when you save an entry that’s still in the Draft status, the CMS asks what you want to do next:

- **Send for Review** moves the entry to In Review straight away, ready for someone to look at.
- **Later** leaves it as a draft. You can send it whenever you like, using the status button in the entry editor or by dragging its card between columns on the Editorial Workflow page.

The prompt only appears while an entry is still a draft. Saving one that’s already In Review or Ready leaves its status alone.

#### Statuses

An unpublished entry moves through three stages, shown as columns on the Editorial Workflow page and as a status button in the entry editor:

| Status    | Label                         | Meaning                         |
| --------- | ----------------------------- | ------------------------------- |
| Draft     | `sveltia-cms/draft`           | Work in progress                |
| In Review | `sveltia-cms/pending_review`  | Ready for someone to look at    |
| Ready     | `sveltia-cms/pending_publish` | Approved and ready to be merged |

A pending deletion carries a fourth label, `sveltia-cms/pending_deletion`. It isn’t a stage — there’s no review to move it through, only the deletion itself to carry out or call off — so it doesn’t appear as a column. See [Deleting Entries](#deleting-entries).

An entry in the Draft status is kept as a [draft pull request](https://docs.github.com/en/pull-requests/how-tos/create-pull-requests/changing-the-stage-of-a-pull-request) or [draft merge request](https://docs.gitlab.com/user/project/merge_requests/drafts/), so it can’t be merged by accident. Moving the entry to In Review or Ready marks it ready for review.

GitHub and GitLab record this differently: GitHub has a dedicated draft flag, while GitLab marks a draft with a `Draft:` prefix on the merge request title. Sveltia CMS adds and removes that prefix for you, so if you edit a merge request title by hand, keep the prefix intact while the entry is in the Draft status.

#### Custom Label Prefix

Labels are written with the `sveltia-cms/` prefix by default. You can change it with the `cms_label_prefix` option in the `backend` section:

```yaml [YAML]
backend:
  name: github
  repo: user/repo
  cms_label_prefix: my-cms/
```

```toml [TOML]
[backend]
name = "github"
repo = "user/repo"
cms_label_prefix = "my-cms/"
```

```json [JSON]
{
  "backend": {
    "name": "github",
    "repo": "user/repo",
    "cms_label_prefix": "my-cms/"
  }
}
```

```js [JavaScript]
{
  backend: {
    name: 'github',
    repo: 'user/repo',
    cms_label_prefix: 'my-cms/',
  },
}
```

**Migrating from Netlify/Decap CMS**

Sveltia CMS reads the `netlify-cms/` and `decap-cms/` prefixes as well as your configured one, so pull requests created by Netlify CMS or Decap CMS show up straight away. Labels are always written with your configured prefix, so an imported pull request is migrated the first time its status changes.

#### Squash Merges

You can squash all the commits in a pull/merge request into a single commit when it’s merged by adding the `squash_merges` option to the `backend` section. Otherwise, a merge commit is created. This is supported with both the GitHub and GitLab backends.

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

### Editorial Workflow Page

A board with a column for each status is available from the top navigation. Drag a card from one column to another to change an entry’s status, or use the status button in the entry editor. Each card also offers the actions available at that stage, and clicking the card opens the entry in the editor.

### Entry List

Unpublished entries appear in the entry list alongside published ones, each with a badge showing its status:

- An entry that updates a published one **replaces** it in the list, so you see the pending version rather than what’s currently live.
- An entry that has never been published is listed separately under an **Unpublished Entries** heading, above the published entries.

### Deleting Entries

Deletion goes through review like any other change, so removing an entry from the configured branch is a two-step process. What the Delete button does depends on whether the entry has ever been published.

#### Deleting a Published Entry

Deleting a published entry opens a pull request that removes its files. **The entry stays in the configured branch until that pull request is published.** Until then it appears in the entry list and on the Editorial Workflow page with a **Pending Deletion** badge.

Because there’s nothing to review or edit, a pending deletion doesn’t move through the three stages. It carries the `sveltia-cms/pending_deletion` label rather than one of the stage labels, so it’s never mistaken for content waiting to go live — including by another CMS reading the same repository. It’s listed in its own section below the board, and its card offers two actions:

- **Cancel** closes the pull request and leaves the entry in place.
- **Delete** merges the pull request, which removes the entry.

Opening a pending deletion in the entry editor shows its content for reference only. The fields are read-only and there’s no Save button, because the only things left to do are carrying the deletion out or calling it off.

**Different from Decap CMS**

Decap CMS has a separate Unpublish action, and its Delete button removes the entry from the configured branch immediately. Sveltia CMS has no Unpublish action: deleting a published entry _is_ the unpublish process, so making the change and releasing it stay separate, the same as with any edit. See [issue #770](https://github.com/sveltia/sveltia-cms/issues/770).

#### Deleting an Unpublished Entry

- If the entry has **never been published**, deleting it closes its pull request. Nothing is left behind, because nothing was ever merged into the configured branch.
- If the entry **updates a published one**, the button is labelled **Discard** instead. Discarding closes the pull request and restores the published version, which stays in the configured branch. The entry itself isn’t deleted.

### Restricting Publishing and Deletion

Two collection options let you limit what editors can do. Both are set on the collection, not on the backend:

- `publish: false` hides the publishing controls, so editors can move an entry through the review stages but someone else has to publish it.
- `delete: false` prevents entries from being deleted. Discarding unpublished changes is still allowed, because that leaves the published version untouched.

```yaml [YAML]
collections:
  - name: posts
    folder: content/posts
    publish: false
    delete: false
```

```toml [TOML]
[[collections]]
name = "posts"
folder = "content/posts"
publish = false
delete = false
```

```json [JSON]
{
  "collections": [
    {
      "name": "posts",
      "folder": "content/posts",
      "publish": false,
      "delete": false
    }
  ]
}
```

```js [JavaScript]
{
  collections: [
    {
      name: 'posts',
      folder: 'content/posts',
      publish: false,
      delete: false,
    },
  ],
}
```

### Event Hooks

Editorial Workflow adds four [event types](https://sveltiacms.app/en/docs/api/events) on top of `preSave` and `postSave`:

| Event           | When it fires                                                       |
| --------------- | ------------------------------------------------------------------- |
| `prePublish`    | Before a pull request is merged                                     |
| `postPublish`   | After a pull request has been merged                                |
| `preUnpublish`  | Before a published entry is removed from the configured branch      |
| `postUnpublish` | After a published entry has been removed from the configured branch |

The `preUnpublish` and `postUnpublish` hooks fire when a deletion is **published**, not when it’s requested — that’s the point at which the entry actually leaves the configured branch. Publishing a deletion fires these instead of `prePublish` and `postPublish`, because nothing is being published.

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

It builds on top of [Editorial Workflow](https://sveltiacms.app/en/docs/workflows/editorial). Everything an editor does there — drafts, review stages, the workflow board — works the same way for a contributor, except that their changes live in their own fork of the repository and only a maintainer can publish them.

### Use Cases

- Open source projects that welcome contributions from the community.
- Projects that require a formal review process for external contributions.
- Situations where contributors may not have direct access to the main repository.
- Workflows that involve multiple stages of review and approval for external contributions.

### Requirements

- The [GitHub](https://sveltiacms.app/en/docs/backends/github) backend must be used.
- The [`editorial_workflow` publish mode](https://sveltiacms.app/en/docs/workflows/editorial#configuration) must be enabled. Without it, the CMS reports a configuration error, because there would be nowhere for a contribution to go.
- For a private repository, contributors must have `read` access, the repository must be owned by an **organization** (see below), and the [authentication scope](#authentication-scope) must be `repo`.

**A private repository has to belong to an organization**

GitHub doesn’t offer read-only collaborators on repositories owned by a personal account: [“In a private repository, repository owners can only grant write access to collaborators. Collaborators can’t have read-only access to repositories owned by a personal account.”](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/repository-access-and-collaboration/permission-levels-for-a-personal-account-repository#collaborator-access-for-a-repository-owned-by-a-personal-account)

That leaves nobody for Open Authoring to serve on a private personal repository: everyone you invite can write to it and keeps working on it directly, and everyone else can’t read it at all. Transfer the repository to an organization, where the **Read** role exists, and invite contributors with that role.

A **public** repository owned by a personal account is fine. Contributors there aren’t collaborators at all — anyone with a GitHub account can read it, and Open Authoring takes over from there.

**Future Plans**

Support for other Git backends may be added in the future.

#### Allowing Forks of a Private Repository

Contributors work in a fork of your repository, so it has to allow forks. A public repository already does. A **private** one owned by an organization doesn’t: forking is off by default, and turning it on takes two steps, in this order.

**1. Allow it for the organization.** Go to your organization’s **Settings** → **Access** → **Member privileges**, find **Repository forking**, tick **Allow forking of private repositories**, and save.

**2. Allow it for the repository.** Go to the repository’s **Settings**, and under **Features**, tick **Allow forking**.

Until both are on, a contributor’s sign-in stops with a message saying the repository doesn’t allow forks, rather than failing part-way through creating one.

### Configuration

Add the `open_authoring` option to your CMS configuration’s `backend` settings, along with the `editorial_workflow` publish mode:

```yaml [YAML]
backend:
  name: github
  repo: user/repo
  open_authoring: true

publish_mode: editorial_workflow
```

```toml [TOML]
publish_mode = "editorial_workflow"

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
  },
  "publish_mode": "editorial_workflow"
}
```

```js [JavaScript]
{
  backend: {
    name: 'github',
    repo: 'user/repo',
    open_authoring: true,
  },
  publish_mode: 'editorial_workflow',
}
```

#### Authentication Scope

By default, Sveltia CMS requests the `repo` OAuth scope, which grants access to **every repository the contributor owns, including their private ones**. That’s a lot to ask of someone who just wants to fix a typo, and a public repository doesn’t need it — the narrower `public_repo` scope is enough. Set the scope explicitly with the `auth_scope` option:

```yaml [YAML]
backend:
  name: github
  repo: user/repo
  open_authoring: true
  auth_scope: public_repo
```

```toml [TOML]
[backend]
name = "github"
repo = "user/repo"
open_authoring = true
auth_scope = "public_repo"
```

```json [JSON]
{
  "backend": {
    "name": "github",
    "repo": "user/repo",
    "open_authoring": true,
    "auth_scope": "public_repo"
  }
}
```

```js [JavaScript]
{
  backend: {
    name: 'github',
    repo: 'user/repo',
    open_authoring: true,
    auth_scope: 'public_repo',
  },
}
```

A private repository always needs the full `repo` scope, so set `auth_scope: repo` in that case.

Because the CMS can’t tell whether your repository is public until someone signs in, it can’t choose for you. It logs a configuration warning when `open_authoring` is enabled and `auth_scope` is left unset, so the broader scope is never requested by accident — setting either value silences it.

**Your OAuth client has to honour the option**

The CMS passes `auth_scope` to your OAuth client, and the client decides what it actually asks GitHub for. [Sveltia CMS Authenticator](https://github.com/sveltia/sveltia-cms-auth) honours it, falling back to the default if it doesn’t recognize the value. A third-party client written for Netlify/Decap CMS may ignore it altogether, so check yours before relying on the narrower scope.

The option only applies to the [OAuth sign-in flow](https://sveltiacms.app/en/docs/backends/github#authorization-code-flow); it has no effect on access token sign-in.

**Access tokens and private repositories**

A contributor can sign in with a [personal access token](https://sveltiacms.app/en/docs/backends/github#access-token) instead of OAuth, but it has to be a **classic** token with the `repo` scope, because the CMS creates the fork of the repository on their behalf.

A fine-grained token won’t work for a private repository owned by someone else. Fine-grained tokens are limited to resources owned by a single account, and GitHub [doesn’t support](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens) using them as an outside or repository collaborator. Reading the repository fails with a “not found” error, exactly as though the repository didn’t exist. OAuth is the smoother option for community contributors.

### How It Works

#### Maintainers Are Unaffected

When someone who can push to the configured repository signs in, nothing changes: they work on the repository directly and get the full [Editorial Workflow](https://sveltiacms.app/en/docs/workflows/editorial) experience, including the Ready stage and the publishing controls. Open Authoring only kicks in for users without write access.

#### Contributors Work in a Fork

The first time a contributor signs in, Sveltia CMS asks for permission to create a [fork](https://docs.github.com/en/pull-requests/reference/forks) — their own copy — of the repository on their account. Nothing is created until they agree, and declining stops the sign-in. If they already have a fork from an earlier visit, it’s reused and brought up to date with the configured branch instead.

**A fork that has drifted**

A contributor’s fork can fall behind, or gain commits of its own, and Sveltia CMS can’t always fast-forward it. That doesn’t affect what they submit: a workflow branch starts from the head of your configured repository rather than from their fork’s copy of it, so their pull requests only ever contain the entry they edited. If you’d like their fork tidy anyway, they can [sync it](https://docs.github.com/en/pull-requests/how-tos/work-with-forks/syncing-a-fork) on GitHub.

From then on, a banner at the top of the CMS names the fork their work is saved to, with a link to it. It’s a one-off notice — once dismissed, it stays dismissed.

The content they see is always read from the configured repository, so they’re editing what’s currently on the site. Their changes go to their fork:

| Contributor action | What happens in Git |
| --- | --- |
| Save a new entry | A branch named `cms/[FORK_OWNER]/[FORK_NAME]/[COLLECTION_NAME]/[SLUG]` is created in their fork and the entry files are committed to it. No pull request is opened yet |
| Save an existing draft | Another commit is added to the same branch |
| Move an entry to In Review | A pull request is opened from that branch to your configured branch |
| Move an entry back to Draft | The pull request is converted to a [draft pull request](https://docs.github.com/en/pull-requests/how-tos/create-pull-requests/changing-the-stage-of-a-pull-request), which keeps it — and any discussion on it — out of your review queue |
| Discard | The pull request, if there is one, is closed and the branch is deleted |

A draft deliberately stays a branch with no pull request, so you aren’t notified about work that isn’t ready for you yet.

**Why the branch name includes the fork**

A contributor can have one fork per project they contribute to, and Netlify/Decap CMS names its branches the same way. Including the fork’s path keeps the branches of different projects apart, and means a contributor who has used another CMS on the same fork keeps their work in progress.

#### Saving and Sending for Review

Because a draft has no pull request, saving alone leaves a contributor’s work in their own fork with nothing for you to see. So when they save an entry that’s still a draft, the CMS asks what they want to do next:

- **Send for Review** opens the pull request there and then, which is the point at which the contribution reaches you.
- **Later** leaves the work on the branch in their fork. They can send it whenever they like, using the status button in the entry editor or by dragging its card between columns on the Editorial Workflow page.

The prompt only appears while an entry is still a draft. Saving one that’s already In Review adds a commit to the open pull request and leaves its status alone.

#### Statuses

A contributor moves an entry through two stages rather than three:

| Status | Meaning | How it’s recorded |
| --- | --- | --- |
| Draft | Work in progress | A branch whose pull request is still a draft, was closed, or hasn’t been opened yet |
| In Review | Handed over for a maintainer to look at | An open pull request |

There’s no Ready stage, because marking an entry ready to publish is only meaningful for someone who can publish it. The Editorial Workflow board shows two columns for a contributor, and the status button in the entry editor offers the same two options.

**Different from Editorial Workflow**

Editorial Workflow records the status in a [pull request label](https://sveltiacms.app/en/docs/workflows/editorial#statuses). Labelling requires write access to the repository, which a contributor doesn’t have, so their status is read from the pull request itself instead. Nothing has to be configured for this — the CMS picks the right approach based on the signed-in user.

A contributor’s pull request carries no CMS label, so it doesn’t appear on your own Editorial Workflow board. Review and merge it on GitHub, the same as any other community contribution. See [Reviewing Contributions](#reviewing-contributions) below.

#### Assets

An image or file attached to an entry is committed to the same branch as the entry, so it travels with the contribution and can be previewed in the CMS before it’s published.

The [Asset Library](https://sveltiacms.app/en/docs/ui/asset-library) itself is read-only for a contributor: uploading, deleting, renaming and replacing files there would commit straight to your configured branch without review, so those controls are disabled — including the ones outside the Asset Library, such as the Quick Add menu and the asset panel beside the entry list. [Reordering entries](https://sveltiacms.app/en/docs/collections/entries#managing-entry-order) is disabled for the same reason.

#### Commit Messages

You can mark commits made by contributors with the `openAuthoring` [commit message template](https://sveltiacms.app/en/docs/backends#commit-messages). It wraps the message that would normally be generated, so you can add attribution without repeating the rest:

```yaml [YAML]
backend:
  name: github
  repo: user/repo
  commit_messages:
    openAuthoring: '{{message}} (by {{author-login}})'
```

```toml [TOML]
[backend]
name = "github"
repo = "user/repo"
[backend.commit_messages]
openAuthoring = "{{message}} (by {{author-login}})"
```

```json [JSON]
{
  "backend": {
    "name": "github",
    "repo": "user/repo",
    "commit_messages": {
      "openAuthoring": "{{message}} (by {{author-login}})"
    }
  }
}
```

```js [JavaScript]
{
  backend: {
    name: 'github',
    repo: 'user/repo',
    commit_messages: {
      openAuthoring: '{{message}} (by {{author-login}})',
    },
  },
}
```

The default is `{{message}}`, which leaves the message unchanged. Along with `{{message}}`, the `{{author-login}}`, `{{author-name}}` and `{{author-email}}` tags are available. The template only applies to commits made by a contributor; a maintainer’s commits are unaffected.

### Linking to Entries

To point a contributor straight at the entry you’d like them to edit, link to the Content Editor:

```
https://YOUR_DOMAIN/admin/#/collections/COLLECTION_NAME/entries/ENTRY_ID
```

See [Linking to Content Editor](https://sveltiacms.app/en/docs/ui/content-editor#linking-to-content-editor) for the details, including the shorthand Netlify/Decap CMS uses and how to pre-fill fields for a new entry. An “Edit this page” link in your site’s footer is a common way to put this in front of readers.

### Reviewing Contributions

A contribution reaches you as an ordinary pull request from a fork, so everything GitHub offers applies: reviews, comments, required checks, deploy previews from your CI/CD provider, and protected branches.

- **While the pull request is a draft**, the contributor is still working on it. It’s in the Draft column of their board.
- **Once it’s marked ready for review**, the contributor has handed it over. It’s in their In Review column.
- **Merging it publishes the change.** The contributor’s card disappears from their board the next time they load the CMS, and the entry shows up as published.
- **Closing it without merging** puts the entry back in their Draft column, so they can keep working on it or discard it.

Deleting the branch after merging is optional. If you leave it, the CMS deletes it from the contributor’s fork the next time they load the board, so their fork doesn’t collect a branch per published entry. And if they edit the same entry again before that happens, the CMS commits onto whatever branch is still there and opens a fresh pull request, so either way it takes care of itself.

### Deleting Entries

A contributor can delete their own unpublished work: the Delete button closes their pull request, if there is one, and deletes the branch from their fork. Nothing was ever merged, so nothing is left behind. If the entry updates one that’s already live, the button is labelled **Discard** instead and the published version is untouched.

Taking a published entry off the site is a maintainer’s job, so contributors aren’t offered it. The Delete control is hidden for them in the entry editor, and in the entry list a selection that includes a published entry can’t be deleted. Deleting a published entry yourself works as it does in [Editorial Workflow](https://sveltiacms.app/en/docs/workflows/editorial#deleting-a-published-entry).

### Security Considerations

Open Authoring opens your CMS to a wider audience. On a public repository, **anyone with a GitHub account can sign in** and read every entry the CMS is configured to show — the same content the repository already makes public. On a private repository, only the people you’ve granted `read` access to can get in. In neither case can a contributor change anything on your site without your review.

Keep the [`sanitize_preview` option](https://sveltiacms.app/en/docs/fields/richtext#sanitize-preview) at its default of `true`. Turning it off lets a contributor inject scripts into the preview pane, which then run in the browser of anyone who opens that entry — including yours while you review it.

See the [security guide](https://sveltiacms.app/en/docs/security) for more on hardening a Sveltia CMS deployment.

### Trying It Out

To see what contributors see, sign in with a GitHub account that has no write access to the repository — a second account of your own works well. A maintainer account always takes the regular path, so signing in as yourself won’t show the contributor experience.

How you arrange that depends on who owns the repository:

- **Public repository:** simply sign in with an account that isn’t a collaborator. Nothing to set up.
- **Organization repository:** invite the account with the **Read** role.
- **Private repository owned by a personal account:** not possible, for the reason given under [Requirements](#requirements). Inviting the account grants it write access, so the CMS treats it as a maintainer and never offers to make a fork.

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
