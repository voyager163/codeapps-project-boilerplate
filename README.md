# create-codeapps-openspec

Create a Power Apps Code Apps project that is ready for OpenSpec-driven development.

```bash
npx create-codeapps-openspec my-app
```

This package is an opinionated initializer. It creates a project from this repo's customized Code Apps starter template, adds the OpenSpec OPSX prompt and skill files, initializes OpenSpec, applies the Power Apps Code Apps OpenSpec configuration, installs dependencies, initializes git, and prints the next steps.

## Philosophy

This starter is for teams that want AI-assisted development to be grounded in clear specs instead of long chat history.

The workflow is:

```text
Explore the idea -> propose the change -> generate specs/design/tasks -> implement -> archive
```

OpenSpec keeps the work lightweight:

- Fluid, not rigid.
- Iterative, not waterfall.
- Easy to start, but organized enough for real projects.
- Built around project files that can be reviewed, updated, and archived.

## Quick Start

```bash
npx create-codeapps-openspec my-app
cd my-app
code .
```

Initialize the Power Apps code app for your target environment:

```bash
pac code init --environment <environmentId> --displayName <appDisplayName>
```

Use the expanded OPSX workflow in GitHub Copilot to drive changes:

```text
/opsx:explore
/opsx:new
/opsx:continue
/opsx:ff
/opsx:propose
/opsx:verify
/opsx:apply
/opsx:sync
/opsx:archive
/opsx:bulk-archive
/opsx:onboard
```

Start local development:

```bash
npm run dev
```

## Prerequisites

- Node.js 20.19.0 or newer
- npm
- git
- Power Platform CLI for `pac code init`
- Visual Studio Code with GitHub Copilot
- OpenSpec

If OpenSpec is missing, the initializer installs it automatically:

```bash
npm install -g @fission-ai/openspec@latest
```

## What The CLI Does

The initializer runs this setup flow:

```text
1. Ask for a project name if missing
2. Check Node.js
3. Check npm
4. Check git
5. Check OpenSpec and install it if missing
6. Fail if the target folder already exists
7. Copy templates/starter into the target folder
8. Copy the OPSX prompts and skills into .github/
9. Run npm install
10. Run openspec init or openspec update
11. Replace openspec/config.yaml with the fixed Code Apps config
12. Run git init
13. Print next steps
```

The initializer does not install Code Apps assistant plugins, register plugin marketplaces, or ask developers to choose an AI assistant.

## Generated Project

Generated projects include:

```text
my-app/
	package.json
	src/
	public/
	openspec/
		config.yaml
		changes/
		specs/
	.github/
		prompts/
			opsx-*.prompt.md
		skills/
			openspec-*/
```

The generated `openspec/config.yaml` is tailored for Power Apps Code Apps:

```text
Platform: Power Apps Code Apps
Frontend: Vite + React 18 TypeScript
Styling: Tailwind CSS
Routing: React Router
Data: TanStack Query + Power Platform connectors
Auth: Power Platform managed
Deploy: pac CLI
```

## OPSX Workflow

Use the expanded OpenSpec workflow commands as the normal development path. Generated projects include all 11 OPSX prompt files and all 11 matching OpenSpec skill folders by default.

```text
/opsx:explore <idea>
```

Think through an idea without implementing. Use this for architecture exploration, problem framing, risks, and tradeoffs.

```text
/opsx:new <change>
```

Start a new change and inspect the first artifact instructions before drafting.

```text
/opsx:continue <change>
```

Continue creating or updating artifacts for an active change.

```text
/opsx:ff <change>
```

Fast-forward artifact creation until the change is ready for implementation.

```text
/opsx:propose <change>
```

Create a proposal, design, specs, and tasks for a new change.

```text
/opsx:verify <change>
```

Check that the change artifacts are complete and internally consistent.

```text
/opsx:apply <change>
```

Implement the tasks from an approved OpenSpec change.

```text
/opsx:sync <change>
```

Sync completed change artifacts back into the canonical specs when appropriate.

```text
/opsx:archive <change>
```

Archive a completed change and sync the final specs.

```text
/opsx:bulk-archive
```

Archive multiple completed changes when the workspace has accumulated finished work.

```text
/opsx:onboard
```

Inspect the project and generate onboarding context for the assistant.

## Development Guidelines For Generated Apps

Follow these rules when building Code Apps from the generated project.

- Start meaningful work with `/opsx:explore`, `/opsx:new`, `/opsx:ff`, or `/opsx:propose` before implementation.
- Keep requirements in OpenSpec artifacts, not only in chat history.
- Use Power Platform connectors for runtime data access.
- Do not add a custom backend unless the OpenSpec change explicitly justifies it.
- Do not add a custom auth layer; authentication is handled by Power Platform.
- Use generated services under `src/generated/` when Power Apps tooling creates connector services.
- Keep TypeScript strict and fix type errors before considering a task complete.
- Keep UI changes consistent with the starter's Vite, React, Tailwind, and routing conventions.
- Run build and verification commands before archiving a change.

## CLI Options

```bash
npx create-codeapps-openspec my-app --skip-install
npx create-codeapps-openspec my-app --skip-git
```

By default, `npm install` and `git init` both run automatically.

The CLI fails if the target folder already exists. This avoids accidental overwrites.

## Repository Layout

This repository contains both the initializer and the templates it copies.

```text
codeapps-project-boilerplate/
	bin/
		create-codeapps-openspec.js
	templates/
		starter/
			SOURCE.md
			package.json
			src/
			public/
		openspec/
			config.yaml
		github/
			prompts/
			skills/
	openspec/
		changes/
		specs/
	scripts/
		verify-generated-project.js
```

`templates/starter` was imported once from `microsoft/PowerAppsCodeApps/templates/starter`. This repo now owns that snapshot, so future starter changes should be made here intentionally.

## Maintaining The Starter

When updating the starter template:

1. Edit files under `templates/starter/`.
2. Keep [templates/starter/SOURCE.md](templates/starter/SOURCE.md) accurate if you intentionally resync from upstream.
3. Make sure generated projects still build with `npm run build`.
4. Run the verification script in this repo.

Do not make the CLI fetch the Microsoft starter during project creation. The initializer should always use the local customized starter.

## Maintaining OpenSpec Assets

The generated `.github` files come from [templates/github](templates/github).

If the repo's live OPSX prompts or skills are updated, sync the template copy as well:

```bash
rm -rf templates/github/prompts templates/github/skills
mkdir -p templates/github/prompts templates/github/skills
cp -R .github/prompts/. templates/github/prompts/
cp -R .github/skills/. templates/github/skills/
```

Generated projects should include all 11 OPSX prompt files and all 11 OpenSpec skill folders.

## Updating OpenSpec

To update OpenSpec globally:

```bash
npm install -g @fission-ai/openspec@latest
```

Inside an existing generated project, refresh OpenSpec instructions with:

```bash
openspec update
```

This initializer overwrites `openspec/config.yaml` during creation so generated projects receive the Power Apps Code Apps defaults.

## Verification

Run the smoke verification script:

```bash
npm run verify
```

The script creates a temporary generated project and checks that:

- the starter files are copied;
- OpenSpec initializes successfully;
- all 11 OPSX prompt files are present;
- all 11 OpenSpec skill folders are present;
- `openspec/config.yaml` matches the fixed Power Apps Code Apps config.

Before publishing or handing off a change, also run:

```bash
node --check bin/create-codeapps-openspec.js
node --check scripts/verify-generated-project.js
npm pack --dry-run
```

## Publishing Checklist

Before publishing a package version:

1. Run `npm run verify`.
2. Run `npm pack --dry-run` and inspect the included files.
3. Confirm `templates/starter` contains no local secrets or generated build output.
4. Confirm [templates/openspec/config.yaml](templates/openspec/config.yaml) has the desired Power Apps Code Apps defaults.
5. Confirm [templates/github](templates/github) contains exactly the expected OPSX prompts and skills.

## License

MIT. The starter template snapshot is based on Microsoft's Power Apps Code Apps starter, which is also MIT licensed.