# Sveltia AI Tools

Official AI tooling for [Sveltia CMS](https://sveltiacms.app), the Git-based headless CMS.

This repository is a [Claude Code plugin marketplace](https://code.claude.com/docs/en/plugin-marketplaces). It currently hosts one plugin, [`sveltia-cms`](plugins/sveltia-cms), which packages an [Agent Skill](https://agentskills.io/) that teaches AI coding agents how to install, configure, migrate and debug Sveltia CMS.

## Installation

In Claude Code:

```
/plugin marketplace add sveltia/ai-tools
/plugin install sveltia-cms@sveltia
```

Run `/plugin marketplace update sveltia` later to pick up documentation updates.

For any other skills-compatible agent, copy [`plugins/sveltia-cms/skills/sveltia-cms`](plugins/sveltia-cms/skills/sveltia-cms) into the directory that agent reads skills from. The skill's frontmatter uses only fields from the [Agent Skills specification](https://agentskills.io/specification), so it also uploads to claude.ai and the Skills API without modification.

See [Working with AI](https://sveltiacms.app/en/docs/working-with-ai) for the full documentation.

## Contents

```
.claude-plugin/marketplace.json   Marketplace manifest
plugins/sveltia-cms/              The Sveltia CMS plugin
```

## Updating the skill

The skill's reference files are generated from the Sveltia CMS documentation, which lives in the [`sveltia-cms-site`](https://github.com/sveltia/sveltia-cms-site) repository. They are not edited here.

To regenerate them, check both repositories out side by side and run the generator from the documentation repository:

```sh
pnpm run build:skill
```

It writes into this repository, so the resulting changes are committed here. See [`plugins/sveltia-cms/README.md`](plugins/sveltia-cms/README.md) for details.

## License

[MIT](LICENSE.txt)
