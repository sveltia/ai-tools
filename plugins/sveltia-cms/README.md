# Sveltia CMS Agent Skill

The official [Agent Skill](https://agentskills.io/) for [Sveltia CMS](https://sveltiacms.app), packaged as a Claude Code plugin.

## Installation

In Claude Code:

```
/plugin marketplace add sveltia/ai-tools
/plugin install sveltia-cms@sveltia
```

For any other skills-compatible agent, copy `skills/sveltia-cms` into the directory that agent reads skills from. The skill's frontmatter uses only fields from the Agent Skills specification, so it also uploads to claude.ai and the Skills API without modification.

## Layout

```
skills/sveltia-cms/
├── SKILL.md                    Hand-written. Loaded when the skill activates.
├── references/                 Generated. Loaded individually, on demand.
└── scripts/validate-config.mjs Validates a config against the release's JSON schema.
```

## Regenerating the references

`references/` is generated from the documentation, which lives in the separate [`sveltia-cms-site`](https://github.com/sveltia/sveltia-cms-site) repository. The generator sits there too, next to the Markdown it reads, and writes across into this repository.

Check both repositories out side by side, then run the generator from the documentation repository:

```sh
cd ../sveltia-cms-site
pnpm run build:skill
```

It expects this checkout at `../sveltia-ai-tools`; set `AI_TOOLS_DIR` if yours is elsewhere. Commit the result here — the plugin is installed straight from Git, so the generated files have to be checked in.

The generator warns when a documentation page belongs to no reference file, so new pages are not silently dropped. Add them to the `references` manifest in the script, or to its `uncoveredByDesign` list if they are not useful to an agent.

`SKILL.md` is not generated. It carries the parts that need editorial judgment — the minimal setup, the mistakes worth calling out, and the routing table to the reference files — so review it when the setup instructions or field types change.
