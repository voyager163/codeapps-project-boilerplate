## Why

Developers need a simple, repeatable way to start Power Apps Code Apps projects that are already prepared for OpenSpec-driven development. The current repo provides OpenSpec prompts and skills, but it does not yet provide a packaged starter template or an npm-based setup command that creates a ready-to-use project folder.

This change creates an `npx`-driven initializer that copies this repo's customized Code Apps starter, installs dependencies, initializes OpenSpec, applies the fixed Power Apps Code Apps OpenSpec configuration, initializes git, and prints clear next steps. The initializer should avoid Code Apps plugin or skill installation; generated projects should include only the OpenSpec OPSX prompts and skills from this repo.

## What Changes

- Add an npm CLI package entry point that can be run with `npx create-codespec <project-name>`.
- Prompt for the project name when omitted.
- Check required developer tooling: Node.js, npm, git, and OpenSpec.
- Automatically install OpenSpec for the developer when it is missing.
- Copy this repo's owned `templates/starter` into the target folder instead of running `degit` during project creation.
- Include all 11 OPSX prompt files and all 11 matching OpenSpec skill folders in generated projects.
- Run `npm install` by default after the target folder is created.
- Run `openspec init` or `openspec update`, then replace `openspec/config.yaml` with the fixed Power Apps Code Apps configuration.
- Run `git init` by default.
- Fail when the target folder already exists unless a future explicit force option is provided.
- Print next steps, including opening the project in VS Code, using OPSX commands, and running `pac code init` manually.

Rollback plan: remove the CLI entry point and template packaging changes, leaving the existing OpenSpec prompt/skill files intact. Generated projects are independent once created and do not require runtime support from this initializer.

Affected teams: developers creating Power Apps Code Apps projects, maintainers of this boilerplate repo, and reviewers responsible for starter template and OpenSpec workflow quality.

## Capabilities

### New Capabilities

- `codespec-initializer`: Defines the npm initializer behavior, generated project contents, OpenSpec setup, fixed configuration application, and setup output.

### Modified Capabilities

- None.

## Impact

- Adds package/CLI structure for an `npx` initializer.
- Adds or formalizes a customized starter template owned by this repo.
- Adds a template copy of the fixed Power Apps Code Apps `openspec/config.yaml`.
- Uses the existing `.github/prompts/opsx-*.prompt.md` and `.github/skills/openspec-*` assets as generated-project content.
- Does not add or maintain Code Apps plugin skills.
- May require tests that generate a temporary project and verify expected files, commands, and failure paths.