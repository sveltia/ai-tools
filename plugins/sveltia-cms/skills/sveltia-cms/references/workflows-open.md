# Publishing Workflows: Open Authoring

Open authoring, which extends the editorial and preview workflows to contributors without write access to the repository by saving their drafts as pull requests from a fork. For the editorial and preview workflows themselves, see `workflows-editorial.md`.

Generated from the Sveltia CMS documentation. Do not edit by hand.

## Open Authoring

Open Authoring is a workflow that allows contributors to propose changes to a project without requiring direct write access to the repository. This is typically done through fork-and-pull request mechanisms, enabling a wider range of contributors to participate in content creation and editing.

It builds on top of [Editorial Workflow](https://sveltiacms.app/docs/workflows/editorial). Everything an editor does there — drafts, review stages, the workflow board — works the same way for a contributor, except that their changes live in their own fork of the repository and only a maintainer can publish them.

### Use Cases

- Open source projects that welcome contributions from the community.
- Projects that require a formal review process for external contributions.
- Situations where contributors may not have direct access to the main repository.
- Workflows that involve multiple stages of review and approval for external contributions.

### Requirements

- The [GitHub](https://sveltiacms.app/docs/backends/github), [GitLab](https://sveltiacms.app/docs/backends/gitlab) or [Gitea/Forgejo](https://sveltiacms.app/docs/backends/gitea-forgejo) backend must be used.
- The [`editorial_workflow`](https://sveltiacms.app/docs/workflows/editorial#configuration) or [`preview`](https://sveltiacms.app/docs/workflows/preview) publish mode must be enabled. Without it, the CMS reports a configuration error, because there would be nowhere for a contribution to go.
- The repository must allow forks, and contributors must be able to read it. A public repository needs nothing set up; a private one has requirements that differ between the backends, described below.

#### GitHub

For a private repository, contributors must have `read` access, the repository must be owned by an **organization** (see below) and the [authentication scope](#authentication-scope) must be `repo`.

**A private repository has to belong to an organization**

GitHub doesn’t offer read-only collaborators on repositories owned by a personal account: [“In a private repository, repository owners can only grant write access to collaborators. Collaborators can’t have read-only access to repositories owned by a personal account.”](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/repository-access-and-collaboration/permission-levels-for-a-personal-account-repository#collaborator-access-for-a-repository-owned-by-a-personal-account)

That leaves nobody for Open Authoring to serve on a private personal repository. Everyone you invite can write to it and keeps working on it directly, and everyone else can’t read it at all. Transfer the repository to an organization, where the **Read** role exists, and invite contributors with that role.

A **public** repository owned by a personal account is fine. Contributors there aren’t collaborators at all — anyone with a GitHub account can read it, and Open Authoring takes over from there.

##### Allowing Forks of a Private Repository

Contributors work in a fork of your repository, so it has to allow forks. A public repository already does. A **private** one owned by an organization doesn’t, because forking is off by default. Turning it on takes two steps, in this order.

**1. Allow it for the organization.** Go to your organization’s **Settings** → **Access** → **Member privileges**, find **Repository forking**, tick **Allow forking of private repositories** and save.

**2. Allow it for the repository.** Go to the repository’s **Settings**, and under **Features**, tick **Allow forking**.

Until both are on, a contributor’s sign-in stops with a message saying the repository doesn’t allow forks, rather than failing part-way through creating one.

#### GitLab

For a private project, contributors must be members with the **Reporter** role. The role matters in both directions:

- A **Guest** can’t read a private project’s repository at all, so the CMS has nothing to show them.
- A **Developer** and above can push branches, so the CMS treats them as a maintainer and they keep working on the project directly.

That leaves Reporter as the role for a contributor. On a **public** project no membership is needed: anyone with a GitLab account can read it, and Open Authoring takes over from there.

Unlike GitHub, GitLab has no organization-level restriction on forking a private project. A project owned by a personal namespace is fine either way, because GitLab’s Reporter role works there too.

##### Allowing Forks of a Private Project

Contributors work in a fork of your project, so it has to allow forks. Go to the project’s **Settings** → **General**, expand **Visibility, project features, permissions**, and make sure **Forks** is turned on. If it isn’t, a contributor’s sign-in stops with a message saying the project doesn’t allow forks, rather than failing part-way through creating one.

Contributors also need permission to create projects in their own namespace, which is the default on GitLab.com and on a stock self-hosted instance.

#### Gitea/Forgejo

For a private repository, contributors must be collaborators with the **Read** permission. As on the other backends, the level matters in both directions:

- Someone without access can’t read the repository at all.
- Someone with **Write** can push to it, so the CMS treats them as a maintainer and they keep working on it directly.

On a **public** repository no collaborator entry is needed. Anyone with an account on the instance can read it, and Open Authoring takes over from there.

Unlike GitHub, Gitea and Forgejo have no organization-level restriction on forking a private repository, and a repository owned by a personal account is fine either way, because the **Read** permission exists there too.

##### Allowing Forks

Contributors work in a fork of your repository. Unlike GitHub and GitLab, Gitea and Forgejo have no per-repository switch for this, so there’s nothing to turn on: anyone who can read a repository can fork it.

Forgejo can turn forking off for the whole instance with [`DISABLE_FORKS`](https://forgejo.org/docs/latest/admin/config-cheat-sheet/#repository-repository). In that case, the CMS says so rather than asking the contributor whether to fork.

Otherwise, the instance’s own limits can get in the way:

- An administrator can cap how many repositories a user may create with [`MAX_CREATION_LIMIT`](https://docs.gitea.com/administration/config-cheat-sheet#repository-repository). Forks are exempt from the cap, though, unless `FORK_WITHOUT_MAXIMUM_LIMIT` has been turned off.
- An administrator may have disabled repository creation for the contributor’s user account.

If a contributor already has an unrelated repository of the same name, the instance refuses the fork rather than picking another name the way GitHub does. Sveltia CMS retries with `[REPOSITORY_OWNER]-[REPOSITORY_NAME]`, so the fork is created regardless.

Gitea and Forgejo don’t say why a fork couldn’t be created, so the CMS can only report that it failed. If a contributor’s sign-in stops there, check those limits first.

### Configuration

Add the `open_authoring` option to your CMS configuration’s `backend` settings, along with the `editorial_workflow` or `preview` publish mode at the top level.

A [collection-level `publish_mode`](https://sveltiacms.app/docs/workflows/editorial#enabling-the-workflow-per-collection) doesn’t count here. It only affects maintainers who write to the repository directly, while a contributor’s fork always goes through a pull request.

```yaml YAML
backend:
  name: github
  repo: user/repo
  open_authoring: true

publish_mode: editorial_workflow
```

```toml TOML
publish_mode = "editorial_workflow"

[backend]
name = "github"
repo = "user/repo"
open_authoring = true
```

```json JSON
{
  "backend": {
    "name": "github",
    "repo": "user/repo",
    "open_authoring": true
  },
  "publish_mode": "editorial_workflow"
}
```

```js JavaScript
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

So does the Gitea/Forgejo backend, alongside the [options your instance needs](https://sveltiacms.app/docs/backends/gitea-forgejo#configuration):

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

By default, Sveltia CMS requests the `repo` OAuth scope, which grants access to **every repository the contributor owns, including their private ones**. That’s a lot to ask of someone who just wants to fix a typo. A public repository doesn’t need it, as the narrower `public_repo` scope is enough. Set the scope explicitly with the `auth_scope` option:

```yaml YAML
backend:
  name: github
  repo: user/repo
  open_authoring: true
  auth_scope: public_repo
```

```toml TOML
[backend]
name = "github"
repo = "user/repo"
open_authoring = true
auth_scope = "public_repo"
```

```json JSON
{
  "backend": {
    "name": "github",
    "repo": "user/repo",
    "open_authoring": true,
    "auth_scope": "public_repo"
  }
}
```

```js JavaScript
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

The CMS can’t tell whether your repository is public until someone signs in, so it can’t choose for you. Instead, it logs a configuration warning when `open_authoring` is enabled and `auth_scope` is left unset, so the broader scope is never requested by accident. Setting either value silences it.

##### Keeping Forks in Sync with Workflow Changes

Without GitHub’s `workflow` scope, a contributor’s sign-in can’t bring changes to your GitHub Actions workflow files into their fork. So once you change a workflow, the CMS can no longer [bring the fork up to date](#contributors-work-in-a-fork) on sign-in. A fork that falls behind can lead to merge conflicts in a contributor’s pull requests.

If your workflows change often, you can add the scope by giving `auth_scope` as a list, which must include `repo` or `public_repo`:

```yaml YAML
backend:
  name: github
  repo: user/repo
  open_authoring: true
  auth_scope: [public_repo, workflow]
```

```toml TOML
[backend]
name = "github"
repo = "user/repo"
open_authoring = true
auth_scope = ["public_repo", "workflow"]
```

```json JSON
{
  "backend": {
    "name": "github",
    "repo": "user/repo",
    "open_authoring": true,
    "auth_scope": ["public_repo", "workflow"]
  }
}
```

```js JavaScript
{
  backend: {
    name: 'github',
    repo: 'user/repo',
    open_authoring: true,
    auth_scope: ['public_repo', 'workflow'],
  },
}
```

**Consider the trade-off**

The `workflow` scope lets the token create and change GitHub Actions workflows in **every repository the contributor can push to**, not only their fork, and workflows can read a repository’s secrets. GitHub shows this on the sign-in page, which may put some contributors off. Leave it out unless keeping forks in sync matters to you: the CMS still saves a contributor’s changes without it.

Whether the scope reaches GitHub depends on your OAuth client:

- Netlify’s OAuth, which the CMS uses when `base_url` isn’t set, passes the scope on to GitHub as is, so the option is all you need there.
- [Sveltia CMS Authenticator](https://github.com/sveltia/sveltia-cms-auth) used with an OAuth app only requests the scope if its `GITHUB_ALLOW_WORKFLOW_SCOPE` environment variable is set to `true`, and leaves it out of the request otherwise. With a GitHub App, which is now recommended, scopes don’t apply, and Open Authoring isn’t supported, as the app would have to be installed on each contributor’s fork.

A contributor who signed in before you added the scope keeps their old token until they sign out and sign in again.

**Your OAuth client has to honor the option**

The CMS passes `auth_scope` to your OAuth client, and the client decides what it actually asks GitHub for. [Sveltia CMS Authenticator](https://github.com/sveltia/sveltia-cms-auth) honors it when used with an OAuth app, falling back to the default if it doesn’t recognize the value. A third-party client written for Netlify/Decap CMS may ignore it altogether, so check yours before relying on the narrower scope.

The option only applies to the [OAuth sign-in flow](https://sveltiacms.app/docs/backends/github#authorization-code-flow); it has no effect on access token sign-in.

**Access tokens and private repositories**

A contributor can sign in with a [personal access token](https://sveltiacms.app/docs/backends/github#access-token) instead of OAuth, but it has to be a **classic** token with the `repo` scope, because the CMS creates the fork of the repository on their behalf.

A fine-grained token won’t work for a private repository owned by someone else. Fine-grained tokens are limited to resources owned by a single account, and GitHub [doesn’t support](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens) using them as an outside or repository collaborator. Reading the repository fails with a “not found” error, exactly as though the repository didn’t exist. OAuth is the smoother option for community contributors.

### How It Works

**Pull requests and merge requests**

The rest of this page says “pull request”, the name GitHub, Gitea and Forgejo use. GitLab calls the same thing a **merge request**, and everything below applies to it unchanged — only the name differs. Where the backends genuinely behave differently, it’s called out.

#### Maintainers Are Unaffected

When someone who can push to the configured repository signs in, they work on the repository directly, as they always have, and get the full [Editorial Workflow](https://sveltiacms.app/docs/workflows/editorial) experience, including the Ready stage and the publishing controls. Their Editorial Workflow board also lists the pull requests contributors have opened, so they can review them there. See [Reviewing in Sveltia CMS](#reviewing-in-sveltia-cms).

Open Authoring only kicks in for users without write access. On GitLab, that means anyone below the **Developer** role, and on Gitea/Forgejo anyone without the **Write** permission.

#### Contributors Work in a Fork

The first time a contributor signs in, Sveltia CMS asks for permission to create a fork — their own copy — of the repository on their account. Nothing is created until they agree, and declining stops the sign-in. If they already have a fork from an earlier visit, it’s reused.

**A fork that has drifted**

A contributor’s fork can fall behind, or gain commits of its own. What that means for their pull requests depends on the backend.

**GitHub and GitLab** create the workflow branch at the head of your configured repository rather than at the fork’s copy of it. So a fork that has drifted passes nothing on: the pull request only ever contains the entry they edited.

- On GitHub, Sveltia CMS also tries to fast-forward the fork’s copy of your branch on sign-in. A contributor can [sync it](https://docs.github.com/en/pull-requests/how-tos/work-with-forks/syncing-a-fork) themselves if that fails.
- On GitLab, the CMS leaves the fork as it is. A contributor can bring theirs up to date with **Update fork** on the fork’s overview page if they’d like it tidy.

There’s one exception on GitHub. A sign-in without the [`workflow` scope](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/scopes-for-oauth-apps#available-scopes) can’t bring changes to your GitHub Actions workflow files into the fork. So once you’ve changed a workflow since the fork was last updated, GitHub refuses both the sync and a branch at your head.

The workflow branch then starts instead from the last commit your branch shares with the fork’s copy of it. If the fork has no copy, such as for a branch you created after the fork was made, it starts from the last commit your branch shares with the fork’s default branch.

The pull request still only contains the entry. But an edit to an entry that has changed in your repository since that commit can show up as a merge conflict. To avoid that, either sync the fork on GitHub, where the contributor’s own sign-in can update workflow files, or [add the `workflow` scope](#keeping-forks-in-sync-with-workflow-changes) to the CMS sign-in.

**Gitea and Forgejo** can’t create a branch in a fork from a commit that isn’t in it, so the workflow branch starts from the fork’s own copy of your branch. That makes keeping the copy current important, so the CMS brings it up to date on sign-in. It uses each service’s own API for this: [`merge-upstream`](https://docs.gitea.com/api/next/#tag/repository/operation/repoMergeUpstream) on Gitea and [`sync_fork`](https://codeberg.org/api/swagger#/repository/repoSyncForkBranch) on Forgejo.

- Gitea merges your branch in when it can’t fast-forward.
- Forgejo only fast-forwards, and declines once the fork has commits of its own.

When the sync is declined, the branch starts from the fork as it is, so the pull request carries whatever the fork was already ahead by. Merging your branch into the fork clears that.

From then on, a banner at the top of the CMS names the fork their work is saved to, with a link to it. It’s a one-off notice — once dismissed, it stays dismissed.

The content they see is always read from the configured repository, so they’re editing what’s currently on the site. Their changes go to their fork:

| Contributor action | What happens in Git |
| --- | --- |
| Save a new entry | A branch named `cms/[FORK_OWNER]/[FORK_NAME]/[COLLECTION_NAME]/[SLUG]` is created in their fork and the entry files are committed to it, with the [`root_dir`](https://sveltiacms.app/docs/backends#monorepos) directory after the fork name if it’s set. No pull request is opened yet |
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

Editorial Workflow records the status in a [pull request label](https://sveltiacms.app/docs/workflows/editorial#statuses). Labeling requires write access to the repository, which a contributor doesn’t have, so their status is read from the pull request itself instead. Nothing has to be configured for this — the CMS picks the right approach based on the signed-in user.

Only a pull request the contributor opened themselves counts. One that someone else opened from the contributor’s branch is ignored, so its title doesn’t end up on their entry.

A contributor’s pull request carries no CMS label, but it still shows up on your own Editorial Workflow board, where you can review and edit the entry. You merge it on your Git service, the same as any other community contribution. See [Reviewing Contributions](#reviewing-contributions) and [Reviewing in Sveltia CMS](#reviewing-in-sveltia-cms) below.

#### Collections That Skip the Workflow

A collection that opts out of the workflow with its own [`publish_mode: simple`](https://sveltiacms.app/docs/workflows/editorial#enabling-the-workflow-per-collection) still goes through it for a contributor. They can’t write to your configured branch at all, so their changes to such a collection are saved to their fork and sent for review like those to any other entry.

A maintainer writes to the configured repository, so a collection with the simple publish mode works for them as it always has: their changes are committed straight to your configured branch.

#### Assets

An image or file attached to an entry is committed to the same branch as the entry, so it travels with the contribution and can be previewed in the CMS before it’s published.

The [Asset Library](https://sveltiacms.app/docs/ui/asset-library) itself is read-only for a contributor. Uploading, deleting, renaming and replacing files there would commit straight to your configured branch without review, so those controls are disabled. That includes the ones outside the Asset Library, such as the Quick Add menu and the asset panel beside the entry list.

[Reordering entries](https://sveltiacms.app/docs/collections/entries/operations#reordering-entries) is disabled for the same reason.

#### Commit Messages

You can mark commits made by contributors with the `openAuthoring` [commit message template](https://sveltiacms.app/docs/backends#commit-messages). It wraps the message that would normally be generated, so you can add attribution without repeating the rest:

```yaml YAML
backend:
  name: github
  repo: user/repo
  commit_messages:
    openAuthoring: '{{message}} (by {{author-login}})'
```

```toml TOML
[backend]
name = "github"
repo = "user/repo"
[backend.commit_messages]
openAuthoring = "{{message}} (by {{author-login}})"
```

```json JSON
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

```js JavaScript
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

See [Linking to Content Editor](https://sveltiacms.app/docs/ui/content-editor#linking-to-content-editor) for the details, including the shorthand Netlify/Decap CMS uses and how to pre-fill fields for a new entry. An “Edit this page” link in your site’s footer is a common way to put this in front of readers.

### Reviewing Contributions

A contribution reaches you as an ordinary pull request from a fork, so everything your Git service offers applies: reviews, comments, required checks or pipelines, deploy previews from your CI/CD provider, and protected branches.

- **While the pull request is a draft**, the contributor is still working on it. It’s in the Draft column of their board.
- **Once it’s marked ready for review**, the contributor has handed it over. It’s in their In Review column.
- **Merging it publishes the change.** The contributor’s card disappears from their board the next time they load the CMS, and the entry shows up as published.
- **Closing it without merging** puts the entry back in their Draft column, so they can keep working on it or discard it.
- **Changing its target branch** takes it off the contributor’s board, as it no longer goes to your configured branch. If they move the entry to In Review again, the CMS opens a fresh pull request rather than reopening that one.

You can also push commits to a contributor’s branch:

- The CMS opens a GitHub pull request with edits from maintainers allowed, as GitHub’s own form does by default. GitHub doesn’t allow that for a fork owned by an organization, so such a pull request is opened without it.
- The CMS opens a GitLab merge request with **Allow commits from members who can merge to the target branch** turned on.
- The CMS opens a Gitea or Forgejo pull request with **Allow edits from maintainers** turned on, rather than leaving it to the fork’s own default.

If the contributor has the entry open when you push, the CMS warns them before they save over your commit.

Deleting the branch after merging is optional. On GitLab, the CMS opens the merge request with **Delete source branch when merge request is accepted** selected, so merging it normally removes the branch for you.

If you leave the branch, the CMS deletes it from the contributor’s fork the next time they load the board, so their fork doesn’t collect a branch per published entry. If they edit the same entry again before that happens, the CMS commits onto whatever branch is still there and opens a fresh pull request. Either way, it takes care of itself.

**Pull CMS Changes to Your Local Repository**

Sveltia CMS commits changes to the remote repository, not to the copy on your computer. To see content published in the CMS on your local development server, run `git pull` first. Pulling before you make your own changes also helps avoid merge conflicts when you push. This doesn’t apply to the [local development workflow](https://sveltiacms.app/docs/workflows/local), where the CMS writes to your local files instead.

#### Reviewing in Sveltia CMS

You don’t have to leave the CMS to look at a contribution. The pull requests contributors have opened to your configured branch are listed on your own [Editorial Workflow board](https://sveltiacms.app/docs/workflows/editorial#editorial-workflow-page), each card marked **From a fork**:

- **A draft pull request** is in the Draft column, and **one ready for review** in In Review. A contributor’s draft that hasn’t been sent for review has no pull request yet, so it isn’t listed. Dragging a card between columns labels the pull request as it does for your own, and moves it in or out of the draft state.
- **Clicking a card** opens the entry in the editor, with a notice at the top saying where your changes go. When the contributor allows edits from maintainers, saving commits your changes to their branch in their fork, so they show up in the pull request. When they don’t, the entry can only be viewed.
- **Publishing happens on your Git service.** In place of the Publish button, the card and the editor offer **Review on GitHub**, **Review on GitLab**, **Review on Gitea** or **Review on Forgejo**, which opens the pull request. The CMS only shows you the entry, while merging takes everything on the contributor’s branch, so review the whole pull request there before merging it. For the same reason, moving a card to Ready doesn’t [approve](https://sveltiacms.app/docs/workflows/editorial#approvals) the pull request.
- **Discarding** closes the pull request but leaves the branch in the contributor’s fork. The entry goes back to the Draft column of their board, so they can keep working on it or discard it themselves.

A contribution is kept apart from your own work, as anyone can open one:

- You can only open its entry from the board. The entry list and search keep showing the published version, or your own pending version if you have one, and so does the editor when you open the entry from there. Editing an entry from anywhere else therefore never commits to a contributor’s branch, and a contribution can’t take an entry over.
- It can’t be used to take a published entry off the site.
- If the pull request is merged or closed while you have the entry open, the editor says so, and saving is refused rather than committed anywhere else.

Only pull requests from branches named the way the CMS names its workflow branches, such as `cms/[FORK_OWNER]/[FORK_NAME]/[COLLECTION_NAME]/[SLUG]`, are listed. Other pull requests from forks, such as code changes, aren’t shown. On GitHub and GitLab, the CMS looks for contributions among the 100 most recently updated open pull requests to your configured branch, so on a busy repository the oldest ones may not show up on the board. They’re still on your Git service.

### Deleting Entries

A contributor can delete their own unpublished work. The Delete button closes their pull request, if there is one, and deletes the branch from their fork. Nothing was ever merged, so nothing is left behind. If the entry updates one that’s already live, the button is labeled **Discard** instead and the published version is untouched.

Taking a published entry off the site is a maintainer’s job, so contributors aren’t offered it. The Delete control is hidden for them in the entry editor, and in the entry list a selection that includes a published entry can’t be deleted. Deleting a published entry yourself works as it does in [Editorial Workflow](https://sveltiacms.app/docs/workflows/editorial#deleting-a-published-entry).

### Security Considerations

Open Authoring opens your CMS to a wider audience:

- On a public repository, **anyone with an account on your Git service can sign in** and read every entry the CMS is configured to show. That’s the same content the repository already makes public.
- On a private repository, only the people you’ve granted read access to can get in — GitHub’s `read` permission, GitLab’s **Reporter** role or the **Read** permission on Gitea/Forgejo.

In neither case can a contributor change anything on your site without your review.

**Keep previews sanitized**

Keep the [`sanitize_preview` option](https://sveltiacms.app/docs/fields/richtext#sanitize-preview) at its default of `true`. Turning it off lets a contributor inject scripts into the preview pane, which then run in the browser of anyone who opens that entry — including yours while you review it. That happens as soon as you open a contribution from your [Editorial Workflow board](#reviewing-in-sveltia-cms), and the script runs with your sign-in, which has write access to your repository.

See the [security guide](https://sveltiacms.app/docs/security) for more on hardening a Sveltia CMS deployment.

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
- Netlify/Decap CMS doesn’t show contributors’ pull requests to maintainers, who review them on the Git service only. Sveltia CMS lists them on the maintainers’ Editorial Workflow board, where the entry can be viewed and edited before the pull request is merged on the Git service. See [Reviewing in Sveltia CMS](#reviewing-in-sveltia-cms).
- Git Gateway is [not supported](https://sveltiacms.app/docs/migration/netlify-decap-cms#features-not-to-be-implemented) in Sveltia CMS, so the Git Gateway alternative for external contributors described in the Decap CMS documentation doesn’t apply.

Source: https://sveltiacms.app/docs/workflows/open
