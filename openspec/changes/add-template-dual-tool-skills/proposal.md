## Why

The codespec initializer currently scaffolds projects with GitHub Copilot OPSX prompts only. Developers using Claude Code get no skill support, and the Power Apps codeapps skills (architect, dataverse, connectors, ALM, scaffolding, env-vars) are excluded entirely from generated projects. This limits adoption to a single AI tool and forces developers to manually set up codeapps skills.

## What Changes

- Add Claude Code command files to the template so OPSX skills work in both Claude Code and GitHub Copilot
- Add codeapps skills (source SKILL.md files, Copilot prompts, and Claude Code commands) to the template
- Add two new copy steps in `create-codespec.js` to deploy `.claude/` and `.powerplatform/` directories
- **BREAKING**: Remove the "Code Apps Plugin Exclusion" requirement — codeapps skills will now ship with every generated project
- Update the CLI's "next steps" output to mention both Claude Code and GitHub Copilot

## Capabilities

### New Capabilities
- `dual-tool-skill-template`: Template support for both Claude Code and GitHub Copilot, including OPSX and codeapps skill sets

### Modified Capabilities
- `codespec-initializer`: Remove Code Apps Plugin Exclusion requirement, expand OPSX overlay to include Claude Code commands, add codeapps skill overlay step, update next-steps output

## Impact

- `templates/claude/commands/opsx/*.md`: 11 new files (Claude Code OPSX commands)
- `templates/claude/commands/codeapps/*.md`: 6 new files (Claude Code codeapps commands)
- `templates/github/prompts/codeapps-*.prompt.md`: 6 new files (Copilot codeapps prompts)
- `templates/powerplatform/*/SKILL.md`: 6 new files (codeapps skill source files)
- `bin/create-codespec.js`: Add `copyClaudeOverlay` and `copyPowerPlatformOverlay` steps
- `scripts/verify-generated-project.js`: May need updates for new file assertions
