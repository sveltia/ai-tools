# Publishing Workflows: Editorial Workflow and Open Authoring

The editorial workflow that saves drafts as pull requests and moves them through review, and open authoring, which extends it to contributors without write access. For local development, the simple workflow and deploy previews, see `workflows.md`.

Generated from the Sveltia CMS documentation. Do not edit by hand.

## Editorial Workflow

This is an advanced remote workflow designed for teams that require a review process before changes are merged into the [configured branch](https://sveltiacms.app/en/docs/backends#branch-selection). Editors can submit changes for review, and designated reviewers can approve or request modifications.

### Use Cases

- Teams of content creators and editors working on collaborative projects.
- Projects that require a formal review and approval process for content changes.
- Situations where content quality and consistency are critical, necessitating oversight.
- Workflows that involve multiple stages of review, such as draft, review, and publish.

### Requirements

The [GitHub](https://sveltiacms.app/en/docs/backends/github), [GitLab](https://sveltiacms.app/en/docs/backends/gitlab) or [Gitea/Forgejo](https://sveltiacms.app/en/docs/backends/gitea-forgejo) backend must be used.

The workflow opens, labels, merges and closes a pull request for each entry, so a sign-in has to cover more than the repository contents:

- Anyone signing in with a [GitHub fine-grained personal access token](https://sveltiacms.app/en/docs/backends/github#access-token) needs the Pull requests permission on it as well as Contents. OAuth sign-in with the default `repo` scope already covers this.
- On GitLab, a token with the `api` scope covers it.
- On [Gitea/Forgejo](https://sveltiacms.app/en/docs/backends/gitea-forgejo#access-token), the CMS asks for the `read:issue` and `write:issue` scopes on top of the repository ones, because labels live under the issue scope there. A token generated before the workflow was enabled doesn’t have them, so generate a new one.

### Configuration

Add the `publish_mode` option to the top level of the CMS configuration file:

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

The option accepts `editorial_workflow` or `simple`, the default. An empty string is treated as `simple`.

#### Enabling the Workflow per Collection

The `publish_mode` option can also be set on a collection, where it overrides the top-level setting. That lets you enable Editorial Workflow for the collections that need a review process and leave the rest in the `simple` mode, where a save is committed straight to the configured branch. The [Editorial Workflow page](#editorial-workflow-page) is available as soon as one collection uses the workflow.

A typical case is a site whose blog posts are reviewed while the site settings are edited directly:

```yaml [YAML]
collections:
  - name: posts
    folder: content/posts
    publish_mode: editorial_workflow
  - name: settings
    folder: content/settings
    publish_mode: simple
```

```toml [TOML]
[[collections]]
name = "posts"
folder = "content/posts"
publish_mode = "editorial_workflow"

[[collections]]
name = "settings"
folder = "content/settings"
publish_mode = "simple"
```

```json [JSON]
{
  "collections": [
    {
      "name": "posts",
      "folder": "content/posts",
      "publish_mode": "editorial_workflow"
    },
    {
      "name": "settings",
      "folder": "content/settings",
      "publish_mode": "simple"
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
      publish_mode: 'editorial_workflow',
    },
    {
      name: 'settings',
      folder: 'content/settings',
      publish_mode: 'simple',
    },
  ],
}
```

Either option can be omitted: a collection without its own `publish_mode` follows the top-level setting, which defaults to `simple`. So you can either enable the workflow site-wide and opt individual collections out, or leave the top level alone and opt individual collections in. [Singletons](https://sveltiacms.app/en/docs/collections/singletons) always follow the top-level setting.

**Notes**

- An entry that already has a pull request stays in the workflow until it’s published or discarded, even if its collection has since been switched to the `simple` mode. Saving it commits to the pull request rather than to the configured branch, so nothing that hasn’t been reviewed slips through.
- With [Open Authoring](https://sveltiacms.app/en/docs/workflows/open), the collection-level option only applies to maintainers who have write access to the repository. A contributor working on a fork always goes through a pull request, whatever the collection says.

### How It Works

Nothing an editor does in the CMS touches the configured branch until the change is published. Each entry with unsaved work lives on its own branch with an open pull request, so making a change and releasing it are two separate steps.

| Editor action | What happens in Git |
| --- | --- |
| Save a new entry | A branch named `cms/[COLLECTION_NAME]/[SLUG]` is created off the configured branch, the entry files are committed to it, and a pull request is opened |
| Save an existing draft | Another commit is added to the same branch |
| Change the status | The pull request’s label is updated |
| Delete a published entry | A pull request is opened that removes the entry files |
| Publish | The pull request is merged and its branch is deleted |
| Discard | The pull request is closed without merging and its branch is deleted |

On GitLab the same applies, with merge requests in place of pull requests. Gitea and Forgejo call them pull requests, like GitHub.

With the [`root_dir`](https://sveltiacms.app/en/docs/backends#monorepos) option, the directory comes after `cms/` in the branch name, e.g. `cms/apps/blog/posts/hello-world`, so the sites of a monorepo keep their branches apart.

**Pull CMS Changes to Your Local Repository**

Sveltia CMS commits changes to the remote repository, not to the copy on your computer. To see content published in the CMS on your local development server, run `git pull` first. Pulling before you make your own changes also helps avoid merge conflicts when you push. This doesn’t apply to the [local development workflow](https://sveltiacms.app/en/docs/workflows/local), where the CMS writes to your local files instead.

#### Sharing a Branch

A workflow branch is named after the entry, not after the editor, so two people working on the same entry work on the same branch, and anyone with push access can commit to it.

- **Saving** compares the branch with the draft first. If the entry has been changed on the branch since it was opened, a dialog says who changed it and when, and nothing is written until the user chooses Save Anyway. On GitHub, the commit also names the commit the entry was loaded or saved at, so a push that lands in the last moment makes GitHub refuse the save rather than have it built on top of something the user hasn’t seen. Gitea and Forgejo can’t be told which commit to build on, so the CMS checks that the branch still points at that commit right before saving, and refuses the save otherwise; trying again reads the entry back first. Each file the save changes is also checked against its version as of that commit, so a last-moment push that changes the same files is refused likewise. See [Conflict Resolution](https://sveltiacms.app/en/docs/ui/content-editor#conflict-resolution).
- **Saving an entry that has no pull request yet** onto a branch that already exists starts the branch over from the configured branch, so whatever an earlier pull request left on it — one merged without deleting the branch, or closed on GitHub, GitLab, Gitea or Forgejo rather than discarded in the CMS — isn’t carried into the new one. If a pull request is still open from that branch, though, the save is refused, with a message giving the pull request’s number. That’s a pull request the board doesn’t show: one that has lost its status label, one that goes to another branch, or one the CMS didn’t open. The CMS won’t commit onto it, because whatever else it holds would then be published along with the entry. Close it there, or, if it’s one the CMS opened, add its status label back to put it on the board again.
- **Publishing** checks the pull request first; see [Checks Before Publishing](#checks-before-publishing).

Only a pull request that goes from a branch of the repository to the configured branch is taken for an entry’s own, and only if it holds one of the entry’s files, or a file the entry had before it was renamed. If its base branch is changed to something else, the CMS stops treating it as the entry’s and leaves it alone, rather than relabeling or merging it in the entry’s name; the entry is then listed as it was before the pull request existed. Likewise, a pull request from the entry’s branch that holds a different entry isn’t offered in the entry’s editor.

#### Checks Before Publishing

The board and the editor show an entry, but publishing merges the whole pull request, with everything on its branch. So right before merging, the CMS reads the pull request again and publishes the entry only if:

- the pull request still goes from a branch of the repository to the configured branch;
- its branch still points at the commit the entry was loaded or saved at, so what is merged is what the user saw;
- every file it changes is one the CMS accounts for: the entry’s own files, and those of its published version that a rename removes; assets added or replaced along with it, which are only removed when the entry is moved or deleted; the entries whose [Relation](https://sveltiacms.app/en/docs/fields/relation) references a rename or deletion rewrites; and the entries below a [nested](https://sveltiacms.app/en/docs/collections/entries/nested) entry that move along with it. A file the merge would leave exactly as the configured branch already has it passes as well;
- every file it leaves behind is a regular file, rather than a symbolic link or a Git submodule;
- no file in an `admin` or `cms` folder is among its assets, as the CMS itself is usually served from there; see [Read-Only Folders](https://sveltiacms.app/en/docs/ui/asset-library#read-only-folders);
- the list of files it changes is complete, rather than cut short by the Git service on a very large pull request.

Gitea and Forgejo work out the files a pull request changes in the background after each push, so publishing right after a save can take a few seconds while the CMS waits for the list to catch up with the latest commit. If the list still lags behind the branch when the board loads — on a busy instance with a backlog of work, say — the entry is shown as of the commit the list describes, so the board never mixes the files of one commit with the content of another. Publishing or saving it is then refused until the instance has caught up and the page is reloaded.

Otherwise the publish is refused, saying why. If the branch has moved on, the message asks the user to reload the page and review the latest version. If the pull request holds anything else — a change to the site’s code, a CI workflow, configuration, another entry — the message says it comes with changes the CMS can’t show, and it has to be reviewed and merged on GitHub, GitLab, Gitea or Forgejo instead, where every change it holds is visible.

Once the checks pass, the merge is pinned to the commit that was checked, so a push made in the meantime makes the merge fail rather than go along with it.

#### Saving and Sending for Review

Saving an entry doesn’t hand it to anyone — it stays a draft until someone moves it on. So when a user saves an entry that’s still in the Draft status, the CMS asks what to do next:

- **Send for Review** moves the entry to In Review straight away, ready for someone to look at.
- **Later** leaves it as a draft. It can be sent whenever the user likes, using the status button in the entry editor or by dragging its card between columns on the Editorial Workflow page.

The prompt only appears while an entry is still a draft. Saving one that’s already In Review or Ready leaves its status alone, and it’s withheld while the entry still has required fields to fill in, because there’s nothing worth handing over yet.

#### Required Fields

A draft is work in progress, so an entry in the Draft status can be saved with its [required fields](https://sveltiacms.app/en/docs/fields#required) left empty. Nothing is marked as an error, and the entry keeps its pull request like any other draft.

Required fields are enforced as soon as the entry leaves the drafting stage. Moving it to In Review or Ready and publishing it are all refused while a required field is empty, in the entry editor and on the Editorial Workflow page alike, and the fields that need attention are marked so that they are easy to find.

Every other validation rule applies to a draft save as it always has: a value that breaks a `pattern`, `minlength`, `min` or `max` option is still rejected. Only being empty is excused, and only while the entry is a draft.

**A draft can break your build**

Saving a draft commits it to the workflow branch, so whatever builds that branch has to cope with the missing values. A framework that validates content against a schema — [Astro content collections](https://docs.astro.build/en/guides/content-collections/) with Zod, for example — will fail on a field its schema requires, and the deploy preview for the pull request goes red until the entry is filled in. Nothing reaches the configured branch until the entry is published, so the production build is unaffected.

If that gets in the way, make the schema tolerant of drafts — `.optional()` or `.nullable()` on the fields in question — or keep those fields required in the CMS and fill them in before saving.

#### Statuses

An unpublished entry moves through three stages, shown as columns on the Editorial Workflow page and as a status button in the entry editor:

| Status    | Label                         | Meaning                         |
| --------- | ----------------------------- | ------------------------------- |
| Draft     | `sveltia-cms/draft`           | Work in progress                |
| In Review | `sveltia-cms/pending_review`  | Ready for someone to look at    |
| Ready     | `sveltia-cms/pending_publish` | Approved and ready to be merged |

A pending deletion carries a fourth label, `sveltia-cms/pending_deletion`. It isn’t a stage — there’s no review to move it through, only the deletion itself to carry out or call off — so it doesn’t appear as a column. See [Deleting Entries](#deleting-entries).

GitHub and GitLab create a label the first time it’s used. Gitea and Forgejo don’t, so the CMS creates each status label on the repository the first time an entry needs it. A label of the same name defined by the organization that owns the repository doesn’t count, because the CMS can only find pull requests by the repository’s own labels, so the repository gets its own label as well.

An entry in the Draft status is kept as a [draft pull request](https://docs.github.com/en/pull-requests/how-tos/create-pull-requests/changing-the-stage-of-a-pull-request) or [draft merge request](https://docs.gitlab.com/user/project/merge_requests/drafts/), so it can’t be merged by accident. Moving the entry to In Review or Ready marks it ready for review.

The three backends record this differently:

| Backend | How a draft is marked |
| --- | --- |
| GitHub | A dedicated draft flag on the pull request |
| GitLab | A [`Draft:` prefix](https://docs.gitlab.com/user/project/merge_requests/drafts/) on the merge request title |
| Gitea/Forgejo | A [`WIP:` prefix](https://docs.gitea.com/usage/pull-request#work-in-progress-pull-requests) on the pull request title |

Sveltia CMS adds and removes the prefix automatically, so if you edit such a title by hand, keep the prefix intact while the entry is in the Draft status. Gitea and Forgejo refuse to merge a pull request whose title still carries the prefix, which is what keeps a draft from being published by accident there.

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

Sveltia CMS reads the `netlify-cms/` and `decap-cms/` prefixes as well as the configured one, so pull requests created by Netlify CMS or Decap CMS show up straight away. Labels are always written with the configured prefix, so an imported pull request is migrated the first time its status changes.

#### Squash Merges

You can squash all the commits in a pull/merge request into a single commit when it’s merged by adding the `squash_merges` option to the `backend` section. Otherwise, a merge commit is created. This is supported with all three backends.

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

See the [GitHub](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/incorporating-changes-from-a-pull-request/about-pull-request-merges#squash-and-merge-your-commits) or [GitLab](https://docs.gitlab.com/user/project/merge_requests/squash_and_merge/) documentation for more information about squash merging. On Gitea and Forgejo, the repository has to allow the Squash merge style, which is one of the merge styles in its pull request settings.

### Editorial Workflow Page

A board with a column for each status is available from the top navigation. Drag a card from one column to another to change an entry’s status, or use the status button in the entry editor. Each card also offers the actions available at that stage, and clicking the card opens the entry in the editor.

### Entry List

Unpublished entries appear in the entry list alongside published ones, each with a badge showing its status:

- An entry that updates a published one **replaces** it in the list, so the user sees the pending version rather than what’s currently live.
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
- If the entry **updates a published one**, the button is labeled **Discard** instead. Discarding closes the pull request and restores the published version, which stays in the configured branch. The entry itself isn’t deleted.

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

## Open Authoring

Open Authoring is a workflow that allows contributors to propose changes to a project without requiring direct write access to the repository. This is typically done through fork-and-pull request mechanisms, enabling a wider range of contributors to participate in content creation and editing.

It builds on top of [Editorial Workflow](https://sveltiacms.app/en/docs/workflows/editorial). Everything an editor does there — drafts, review stages, the workflow board — works the same way for a contributor, except that their changes live in their own fork of the repository and only a maintainer can publish them.

### Use Cases

- Open source projects that welcome contributions from the community.
- Projects that require a formal review process for external contributions.
- Situations where contributors may not have direct access to the main repository.
- Workflows that involve multiple stages of review and approval for external contributions.

### Requirements

- The [GitHub](https://sveltiacms.app/en/docs/backends/github), [GitLab](https://sveltiacms.app/en/docs/backends/gitlab) or [Gitea/Forgejo](https://sveltiacms.app/en/docs/backends/gitea-forgejo) backend must be used.
- The [`editorial_workflow` publish mode](https://sveltiacms.app/en/docs/workflows/editorial#configuration) must be enabled. Without it, the CMS reports a configuration error, because there would be nowhere for a contribution to go.
- The repository must allow forks, and contributors must be able to read it. A public repository needs nothing set up; a private one has requirements that differ between the backends, described below.

#### GitHub

For a private repository, contributors must have `read` access, the repository must be owned by an **organization** (see below), and the [authentication scope](#authentication-scope) must be `repo`.

**A private repository has to belong to an organization**

GitHub doesn’t offer read-only collaborators on repositories owned by a personal account: [“In a private repository, repository owners can only grant write access to collaborators. Collaborators can’t have read-only access to repositories owned by a personal account.”](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/repository-access-and-collaboration/permission-levels-for-a-personal-account-repository#collaborator-access-for-a-repository-owned-by-a-personal-account)

That leaves nobody for Open Authoring to serve on a private personal repository: everyone you invite can write to it and keeps working on it directly, and everyone else can’t read it at all. Transfer the repository to an organization, where the **Read** role exists, and invite contributors with that role.

A **public** repository owned by a personal account is fine. Contributors there aren’t collaborators at all — anyone with a GitHub account can read it, and Open Authoring takes over from there.

##### Allowing Forks of a Private Repository

Contributors work in a fork of your repository, so it has to allow forks. A public repository already does. A **private** one owned by an organization doesn’t: forking is off by default, and turning it on takes two steps, in this order.

**1. Allow it for the organization.** Go to your organization’s **Settings** → **Access** → **Member privileges**, find **Repository forking**, tick **Allow forking of private repositories**, and save.

**2. Allow it for the repository.** Go to the repository’s **Settings**, and under **Features**, tick **Allow forking**.

Until both are on, a contributor’s sign-in stops with a message saying the repository doesn’t allow forks, rather than failing part-way through creating one.

#### GitLab

For a private project, contributors must be members with the **Reporter** role. The role matters in both directions:

- A **Guest** can’t read a private project’s repository at all, so the CMS has nothing to show them.
- A **Developer** and above can push branches, so the CMS treats them as a maintainer and they keep working on the project directly.

That leaves Reporter as the role for a contributor. On a **public** project no membership is needed: anyone with a GitLab account can read it, and Open Authoring takes over from there.

Unlike GitHub, GitLab has no organization-level restriction on forking a private project, and a project owned by a personal namespace is fine either way — GitLab’s Reporter role works there too.

##### Allowing Forks of a Private Project

Contributors work in a fork of your project, so it has to allow forks. Go to the project’s **Settings** → **General**, expand **Visibility, project features, permissions**, and make sure **Forks** is turned on. If it isn’t, a contributor’s sign-in stops with a message saying the project doesn’t allow forks, rather than failing part-way through creating one.

Contributors also need permission to create projects in their own namespace, which is the default on GitLab.com and on a stock self-hosted instance.

#### Gitea/Forgejo

For a private repository, contributors must be collaborators with the **Read** permission. As on the other backends, the level matters in both directions: someone without access can’t read the repository at all, and someone with **Write** can push to it, so the CMS treats them as a maintainer and they keep working on it directly. On a **public** repository no collaborator entry is needed — anyone with an account on the instance can read it, and Open Authoring takes over from there.

Unlike GitHub, Gitea and Forgejo have no organization-level restriction on forking a private repository, and a repository owned by a personal account is fine either way, because the **Read** permission exists there too.

##### Allowing Forks

Contributors work in a fork of your repository. Unlike GitHub and GitLab, Gitea and Forgejo have no per-repository switch for this, so there’s nothing to turn on: anyone who can read a repository can fork it. Forgejo can turn forking off for the whole instance with [`DISABLE_FORKS`](https://forgejo.org/docs/latest/admin/config-cheat-sheet/#repository-repository), in which case the CMS says so rather than asking the contributor whether to fork. Otherwise, what can get in the way is the instance’s own limits — an administrator can cap how many repositories a user may create with [`MAX_CREATION_LIMIT`](https://docs.gitea.com/administration/config-cheat-sheet#repository-repository), though forks are exempt from the cap unless `FORK_WITHOUT_MAXIMUM_LIMIT` has been turned off — and a user account whose repository creation has been disabled by an administrator.

If a contributor already has an unrelated repository of the same name, the instance refuses the fork rather than picking another name the way GitHub does. Sveltia CMS retries with `[REPOSITORY_OWNER]-[REPOSITORY_NAME]`, so the fork is created regardless.

Gitea and Forgejo don’t say why a fork couldn’t be created, so the CMS can only report that it failed. If a contributor’s sign-in stops there, check those limits first.

### Configuration

Add the `open_authoring` option to your CMS configuration’s `backend` settings, along with the `editorial_workflow` publish mode at the top level. A [collection-level `publish_mode`](https://sveltiacms.app/en/docs/workflows/editorial#enabling-the-workflow-per-collection) doesn’t count here: it only affects maintainers who write to the repository directly, while a contributor’s fork always goes through a pull request.

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

The GitLab backend takes the same option, with the project’s full path as the `repo` value:

```yaml
backend:
  name: gitlab
  repo: group/project
  open_authoring: true

publish_mode: editorial_workflow
```

So does the Gitea/Forgejo backend, alongside the [options your instance needs](https://sveltiacms.app/en/docs/backends/gitea-forgejo#configuration):

```yaml
backend:
  name: gitea
  repo: owner/repo
  base_url: https://code.example.com
  api_root: https://code.example.com/api/v1
  open_authoring: true

publish_mode: editorial_workflow
```

#### Authentication Scope

**GitHub only**

This section applies to the GitHub backend. The GitLab backend always requests GitLab’s single `api` scope, and the Gitea/Forgejo backend asks for the repository, issue and user scopes it actually uses. Neither leaves anything to choose.

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

**Your OAuth client has to honor the option**

The CMS passes `auth_scope` to your OAuth client, and the client decides what it actually asks GitHub for. [Sveltia CMS Authenticator](https://github.com/sveltia/sveltia-cms-auth) honors it, falling back to the default if it doesn’t recognize the value. A third-party client written for Netlify/Decap CMS may ignore it altogether, so check yours before relying on the narrower scope.

The option only applies to the [OAuth sign-in flow](https://sveltiacms.app/en/docs/backends/github#authorization-code-flow); it has no effect on access token sign-in.

**Access tokens and private repositories**

A contributor can sign in with a [personal access token](https://sveltiacms.app/en/docs/backends/github#access-token) instead of OAuth, but it has to be a **classic** token with the `repo` scope, because the CMS creates the fork of the repository on their behalf.

A fine-grained token won’t work for a private repository owned by someone else. Fine-grained tokens are limited to resources owned by a single account, and GitHub [doesn’t support](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens) using them as an outside or repository collaborator. Reading the repository fails with a “not found” error, exactly as though the repository didn’t exist. OAuth is the smoother option for community contributors.

### How It Works

**Pull requests and merge requests**

The rest of this page says “pull request”, the name GitHub, Gitea and Forgejo use. GitLab calls the same thing a **merge request**, and everything below applies to it unchanged — only the name differs. Where the backends genuinely behave differently, it’s called out.

#### Maintainers Are Unaffected

When someone who can push to the configured repository signs in, nothing changes: they work on the repository directly and get the full [Editorial Workflow](https://sveltiacms.app/en/docs/workflows/editorial) experience, including the Ready stage and the publishing controls. Open Authoring only kicks in for users without write access — on GitLab, that means anyone below the **Developer** role, and on Gitea/Forgejo anyone without the **Write** permission.

#### Contributors Work in a Fork

The first time a contributor signs in, Sveltia CMS asks for permission to create a fork — their own copy — of the repository on their account. Nothing is created until they agree, and declining stops the sign-in. If they already have a fork from an earlier visit, it’s reused.

**A fork that has drifted**

A contributor’s fork can fall behind, or gain commits of its own. What that means for their pull requests depends on the backend:

- **GitHub and GitLab** create the workflow branch at the head of your configured repository rather than at the fork’s copy of it, so a fork that has drifted passes nothing on: the pull request only ever contains the entry they edited. On GitHub, Sveltia CMS also tries to fast-forward the fork’s copy of your branch on sign-in, and a contributor can [sync it](https://docs.github.com/en/pull-requests/how-tos/work-with-forks/syncing-a-fork) themselves if that fails. On GitLab, the CMS leaves the fork as it is; a contributor can bring theirs up to date with **Update fork** on the fork’s overview page if they’d like it tidy.
- **Gitea and Forgejo** can’t create a branch in a fork from a commit that isn’t in it, so the workflow branch starts from the fork’s own copy of your branch. Keeping that copy current matters as a result, and the CMS brings it up to date on sign-in — using [`merge-upstream`](https://docs.gitea.com/api/next/#tag/repository/operation/repoMergeUpstream) on Gitea and [`sync_fork`](https://codeberg.org/api/swagger#/repository/repoSyncForkBranch) on Forgejo, which are each service’s own API for it. Gitea merges your branch in when it can’t fast-forward; Forgejo only fast-forwards and declines once the fork has commits of its own. When the sync is declined the branch starts from the fork as it is, so the pull request carries whatever the fork was already ahead by. Merging your branch into the fork clears that.

From then on, a banner at the top of the CMS names the fork their work is saved to, with a link to it. It’s a one-off notice — once dismissed, it stays dismissed.

The content they see is always read from the configured repository, so they’re editing what’s currently on the site. Their changes go to their fork:

| Contributor action | What happens in Git |
| --- | --- |
| Save a new entry | A branch named `cms/[FORK_OWNER]/[FORK_NAME]/[COLLECTION_NAME]/[SLUG]` is created in their fork and the entry files are committed to it, with the [`root_dir`](https://sveltiacms.app/en/docs/backends#monorepos) directory after the fork name if it’s set. No pull request is opened yet |
| Save an existing draft | Another commit is added to the same branch |
| Move an entry to In Review | A pull request is opened from that branch to your configured branch |
| Move an entry back to Draft | The pull request is marked as a draft, which keeps it — and any discussion on it — out of your review queue. GitHub uses a [draft pull request](https://docs.github.com/en/pull-requests/how-tos/create-pull-requests/changing-the-stage-of-a-pull-request); GitLab and Gitea/Forgejo have no separate state, so the CMS adds the title prefix each recognizes — [`Draft:`](https://docs.gitlab.com/user/project/merge_requests/drafts/) and [`WIP:`](https://docs.gitea.com/usage/pull-request#work-in-progress-pull-requests) respectively |
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
| Draft | Work in progress | A branch whose pull request is still a draft or work in progress, was closed, or hasn’t been opened yet |
| In Review | Handed over for a maintainer to look at | An open pull request |

There’s no Ready stage, because marking an entry ready to publish is only meaningful for someone who can publish it. The Editorial Workflow board shows two columns for a contributor, and the status button in the entry editor offers the same two options.

**Different from Editorial Workflow**

Editorial Workflow records the status in a [pull request label](https://sveltiacms.app/en/docs/workflows/editorial#statuses). Labeling requires write access to the repository, which a contributor doesn’t have, so their status is read from the pull request itself instead. Nothing has to be configured for this — the CMS picks the right approach based on the signed-in user.

Only a pull request the contributor opened themselves counts. One that someone else opened from the contributor’s branch is ignored, so its title doesn’t end up on their entry.

A contributor’s pull request carries no CMS label, so it doesn’t appear on your own Editorial Workflow board. Review and merge it on GitHub, GitLab, Gitea or Forgejo, the same as any other community contribution. See [Reviewing Contributions](#reviewing-contributions) below.

#### Collections That Skip the Workflow

A collection that opts out of the workflow with its own [`publish_mode: simple`](https://sveltiacms.app/en/docs/workflows/editorial#enabling-the-workflow-per-collection) still goes through it for a contributor. They can’t write to your configured branch at all, so their changes to such a collection are saved to their fork and sent for review like those to any other entry.

A maintainer writes to the configured repository, so a collection with the simple publish mode works for them as it always has: their changes are committed straight to your configured branch.

#### Assets

An image or file attached to an entry is committed to the same branch as the entry, so it travels with the contribution and can be previewed in the CMS before it’s published.

The [Asset Library](https://sveltiacms.app/en/docs/ui/asset-library) itself is read-only for a contributor: uploading, deleting, renaming and replacing files there would commit straight to your configured branch without review, so those controls are disabled — including the ones outside the Asset Library, such as the Quick Add menu and the asset panel beside the entry list. [Reordering entries](https://sveltiacms.app/en/docs/collections/entries/operations#reordering-entries) is disabled for the same reason.

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

A contribution reaches you as an ordinary pull request from a fork, so everything your Git service offers applies: reviews, comments, required checks or pipelines, deploy previews from your CI/CD provider, and protected branches.

- **While the pull request is a draft**, the contributor is still working on it. It’s in the Draft column of their board.
- **Once it’s marked ready for review**, the contributor has handed it over. It’s in their In Review column.
- **Merging it publishes the change.** The contributor’s card disappears from their board the next time they load the CMS, and the entry shows up as published.
- **Closing it without merging** puts the entry back in their Draft column, so they can keep working on it or discard it.
- **Changing its target branch** takes it off the contributor’s board, as it no longer goes to your configured branch. If they move the entry to In Review again, the CMS opens a fresh pull request rather than reopening that one.

You can also push commits to a contributor’s branch: GitHub lets maintainers edit a pull request from a fork by default, and the CMS opens a GitLab merge request with **Allow commits from members who can merge to the target branch** turned on. If the contributor has the entry open when you push, the CMS warns them before they save over your commit.

Deleting the branch after merging is optional. On GitLab, the CMS opens the merge request with **Delete source branch when merge request is accepted** selected, so merging it normally removes the branch for you. If you leave it, the CMS deletes it from the contributor’s fork the next time they load the board, so their fork doesn’t collect a branch per published entry. And if they edit the same entry again before that happens, the CMS commits onto whatever branch is still there and opens a fresh pull request, so either way it takes care of itself.

**Pull CMS Changes to Your Local Repository**

Sveltia CMS commits changes to the remote repository, not to the copy on your computer. To see content published in the CMS on your local development server, run `git pull` first. Pulling before you make your own changes also helps avoid merge conflicts when you push. This doesn’t apply to the [local development workflow](https://sveltiacms.app/en/docs/workflows/local), where the CMS writes to your local files instead.

### Deleting Entries

A contributor can delete their own unpublished work: the Delete button closes their pull request, if there is one, and deletes the branch from their fork. Nothing was ever merged, so nothing is left behind. If the entry updates one that’s already live, the button is labeled **Discard** instead and the published version is untouched.

Taking a published entry off the site is a maintainer’s job, so contributors aren’t offered it. The Delete control is hidden for them in the entry editor, and in the entry list a selection that includes a published entry can’t be deleted. Deleting a published entry yourself works as it does in [Editorial Workflow](https://sveltiacms.app/en/docs/workflows/editorial#deleting-a-published-entry).

### Security Considerations

Open Authoring opens your CMS to a wider audience. On a public repository, **anyone with an account on your Git service can sign in** and read every entry the CMS is configured to show — the same content the repository already makes public. On a private repository, only the people you’ve granted read access to can get in — GitHub’s `read` permission, GitLab’s **Reporter** role, or the **Read** permission on Gitea/Forgejo. In neither case can a contributor change anything on your site without your review.

Keep the [`sanitize_preview` option](https://sveltiacms.app/en/docs/fields/richtext#sanitize-preview) at its default of `true`. Turning it off lets a contributor inject scripts into the preview pane, which then run in the browser of anyone who opens that entry — including yours while you review it.

See the [security guide](https://sveltiacms.app/en/docs/security) for more on hardening a Sveltia CMS deployment.

### Trying It Out

To see what contributors see, sign in with an account that has no write access to the repository — a second account of your own works well. A maintainer account always takes the regular path, so signing in as yourself won’t show the contributor experience.

How you arrange that depends on the backend and on who owns the repository:

- **Public repository, any backend:** simply sign in with an account that isn’t a collaborator or member. Nothing to set up.
- **Private GitHub repository owned by an organization:** invite the account with the **Read** role.
- **Private GitHub repository owned by a personal account:** not possible, for the reason given under [Requirements](#requirements). Inviting the account grants it write access, so the CMS treats it as a maintainer and never offers to make a fork.
- **Private GitLab project:** invite the account with the **Reporter** role. Developer and above are treated as maintainers, and a Guest can’t read the repository at all.
- **Private Gitea/Forgejo repository:** add the account as a collaborator with the **Read** permission. **Write** and above are treated as maintainers.

### Differences from Netlify/Decap CMS

- Netlify/Decap CMS closes a contributor’s pull request when they move an entry back to Draft. Sveltia CMS marks it as a draft instead, which preserves the review discussion.
- Netlify/Decap CMS supports Open Authoring on GitHub only. Sveltia CMS supports it on GitLab and Gitea/Forgejo as well.
- Git Gateway is [not supported](https://sveltiacms.app/en/docs/migration/netlify-decap-cms#features-not-to-be-implemented) in Sveltia CMS, so the Git Gateway alternative for external contributors described in the Decap CMS documentation doesn’t apply.

Source: https://sveltiacms.app/en/docs/workflows/open
