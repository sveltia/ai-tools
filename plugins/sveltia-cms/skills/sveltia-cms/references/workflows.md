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

### Differences from Netlify/Decap CMS

- In Simple Workflow, Netlify/Decap CMS builds the link from `site_url` and `preview_path` without asking the backend anything, and always presents it as ready. Sveltia CMS looks up the deploy for the commit your change landed in, so the link reflects whether the build has finished.
- Netlify/Decap CMS reads commit statuses alone, taking the first whose context contains the word `deploy`. Sveltia CMS reads deployments, environments and check runs as well — including the URLs a check run publishes in its output — so providers that report through anything but the oldest API are detected.
- Netlify/Decap CMS takes the first matching status, so a canceled build in a monorepo can win over the preview that was actually built. Sveltia CMS ignores canceled and skipped builds.
- Netlify/Decap CMS shows a **Check for Preview** button that never resolves when a build fails. Sveltia CMS reports the failure, and shows a running build as still building.
- Netlify/Decap CMS polls every five seconds for about two minutes, then stops with the Check for Preview button still showing. Sveltia CMS keeps checking at that rate for ten minutes, then says it has stopped and offers an explicit re-check.
- Netlify/Decap CMS links only the default locale of a multilingual entry. Sveltia CMS offers a link for each locale.

See [Better Workflows](https://sveltiacms.app/en/docs/successor-to-netlify-cms#better-workflows) for the full list.

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
