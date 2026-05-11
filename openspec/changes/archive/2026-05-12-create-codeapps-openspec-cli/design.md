## Context

This repo is becoming a project initializer for Power Apps Code Apps projects that use OpenSpec as the development workflow. The initializer is intentionally simpler than the earlier plugin-based idea: it does not install or maintain Code Apps assistant skills. Instead, it creates a customized starter project and includes this repo's OpenSpec OPSX prompts and skills so developers can use `/opsx:*` workflows in VS Code.

The starter template will be synced once from `microsoft/PowerAppsCodeApps/templates/starter`, then owned and edited in this repo. Generated projects should not call `degit` at runtime. The initializer should copy the local template, run setup commands, and apply the fixed Power Apps Code Apps OpenSpec configuration after OpenSpec creates its folder structure.

## Goals

- Provide an `npx`-friendly initializer named `create-codeapps-openspec`.
- Create a ready-to-use project folder from this repo's customized starter template.
- Include all 11 OPSX prompt files and all 11 matching OpenSpec skill folders in generated projects.
- Automatically install OpenSpec when it is missing from the developer machine.
- Apply the fixed Power Apps Code Apps `openspec/config.yaml` after `openspec init` or `openspec update`.
- Run `npm install` and `git init` by default.
- Print practical next steps without running `pac code init` automatically.

## Non-Goals

- Do not install or maintain Code Apps assistant plugin skills.
- Do not register plugin marketplaces.
- Do not ask the user to choose Claude Code or GitHub Copilot in v1.
- Do not run `pac code init` automatically.
- Do not fetch the Microsoft starter template during project creation.
- Do not overwrite existing target folders unless a later explicit force option is added.

## Decisions

### CLI Entry Point

Expose a package/bin that supports:

```bash
npx create-codeapps-openspec my-app
```

If `my-app` is omitted, prompt for the project name. The folder name should also be used as the default package name, normalized for npm package naming rules.

### Repository Layout

Use this layout for implementation:

```text
codeapps-project-boilerplate/
  package.json
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
        opsx-*.prompt.md
      skills/
        openspec-*/
```

`templates/starter` is the customized application template. `templates/openspec/config.yaml` is the fixed Power Apps Code Apps config. `templates/github` contains the OpenSpec prompt and skill overlay copied into generated projects as `.github/`.

### Setup Sequence

The initializer should run the setup steps in this order:

```text
User            CLI                 Project Folder            Tooling
 |               |                        |                       |
 | npx create... |                        |                       |
 |-------------->|                        |                       |
 |               | prompt name if needed  |                       |
 |               | check node/npm/git     |                       |
 |               | check openspec         |                       |
 |               | install openspec if missing -------------------->|
 |               | create target folder    |                       |
 |               | copy starter ---------->|                       |
 |               | copy .github overlay -->|                       |
 |               | npm install ------------------------------------>|
 |               | openspec init/update --------------------------->|
 |               | overwrite config ------>|                       |
 |               | git init --------------------------------------->|
 |<--------------| print next steps         |                       |
```

### Tool Checks

- Node.js must be present and compatible with OpenSpec and the starter template.
- npm must be present because the project is created through `npx` and dependencies are installed with `npm install`.
- git must be present because the initializer runs `git init` by default.
- OpenSpec should be checked with `openspec --version` or an equivalent command. If missing, run `npm install -g @fission-ai/openspec@latest`, then check again before continuing.

### OpenSpec Initialization

Run OpenSpec after the starter and `.github` overlay are copied. Use `openspec init` when the generated project has no `openspec/` folder. Use `openspec update` when OpenSpec already exists because a future force/update path may reuse this logic.

After OpenSpec completes, overwrite `openspec/config.yaml` with the fixed Power Apps Code Apps config from `templates/openspec/config.yaml`.

### Generated Project Output

Generated projects should contain:

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

### Existing Folder Handling

If the target folder already exists, fail with a clear message. A later `--force` option can be added, but v1 should avoid accidental deletion or overwrite.

### Next Steps Output

Print concise next steps after successful creation:

```text
1. cd my-app
2. code .
3. Run pac code init --environment <environmentId> --displayName <appDisplayName>
4. Use /opsx:explore, /opsx:propose, and /opsx:apply with GitHub Copilot
5. Run npm run dev
```

## Risks

- Global OpenSpec installation can fail due to permissions or npm configuration. The CLI should show the failed command and a manual recovery command.
- Starter dependencies may change over time. Because this repo owns the starter snapshot, updates should be intentional and tested.
- OpenSpec CLI behavior may change. Tests should verify that `openspec init` plus config replacement produces the expected folder structure.
- Generated `.github` prompt and skill paths may need adjustment if VS Code or OpenSpec conventions change.