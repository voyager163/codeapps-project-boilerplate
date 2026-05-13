## Context

CodeSpec currently performs prerequisite checks, copies the starter template, installs dependencies, initializes OpenSpec, initializes git, and then prints `pac code init --environment <environmentId> --displayName <appDisplayName>` as a manual next step. This leaves Power Apps Code App binding outside the initializer even though the generated project is specifically intended for Power Apps Code Apps.

The CLI output is also a flat sequence of `[run]`, `[ok]`, and `[fail]` lines. The requested experience is closer to a grouped initialization checklist that shows progress through prerequisite checks, local project setup, Power Apps initialization, and finalization.

## Goals / Non-Goals

**Goals:**

- Check for the Power Platform CLI (`pac`) before project files are created when Power Apps initialization is enabled.
- Present initialization progress as a readable grouped tree with clear success, skipped, warning, and failure states.
- Guide the developer through finding the Power Platform environment ID and app display name before prompting for those values.
- Run `pac code init` from the generated project root after local setup succeeds.
- Preserve a skip path for developers or automation that should create the local project without Power Apps initialization.

**Non-Goals:**

- Installing the Power Platform CLI automatically.
- Discovering or selecting Power Platform environments through PAC CLI APIs.
- Authenticating the developer to Power Platform.
- Changing generated application runtime behavior.
- Replacing OpenSpec or OPSX workflows.

## Decisions

### Use A Structured Step Renderer

The initializer will introduce a small internal progress renderer that records grouped steps and renders a tree-style summary. The renderer should use simple terminal-safe text and avoid adding a logging dependency.

Alternative considered: keep the current flat `runStep` output and add more lines for PAC initialization. This would be simpler but would not address the requested checklist-style experience or make skipped Power Apps initialization visible enough.

### Check PAC Before Side-Effecting Project Setup

When Power Apps initialization is enabled, `pac` will be checked during preflight after Node.js, npm, and git are available and before project files are copied or project dependencies are installed. OpenSpec auto-installation should remain available, but non-installable tool checks should run before side-effecting setup so missing tools fail early.

Alternative considered: check `pac` only immediately before running `pac code init`. That would allow local project creation to complete first, but developers would discover the missing tool late and the guided initialization would be less predictable.

### Keep Power Apps Initialization Skippable

The CLI will support a skip path for Power Apps initialization. In interactive use, the developer can skip at the preparation prompt; command options should also allow skipping so scripts can avoid interactive prompts.

Alternative considered: make PAC CLI required for every `codespec init` run. This would match the Code Apps focus, but it would make local-only exploration, documentation validation, and automated generated-project verification harder.

### Prompt Only After Explaining The Needed Values

Before asking for `environmentId` and `displayName`, the initializer will tell the developer they need the Power Platform environment ID and the app display name, then wait for Enter. Only after that pause will it prompt for the two values, validate that neither is blank, show the command, and ask for confirmation.

Alternative considered: ask for both values directly. That is faster for experienced users but confusing for first-time developers who do not yet know where those values come from.

### Run PAC From The Generated Project Root

`pac code init` will run with `cwd` set to the generated project folder after local setup, OpenSpec setup, and git initialization have completed. If the PAC command fails, the initializer should report the failure and print the manual command so the developer can retry after fixing authentication or environment issues.

Alternative considered: run PAC before dependency installation or OpenSpec setup. That would bind earlier, but it could leave the project partially initialized if later local setup fails.

## Risks / Trade-offs

- Interactive prompts can affect automation -> Provide an explicit skip option and skip or fail clearly in non-interactive contexts.
- PAC authentication or environment access can fail after the project is created -> Keep the generated project intact and print the retry command.
- Tree-style output can become noisy if every small operation is nested -> Group steps by meaningful phases and keep leaf labels concise.
- PAC CLI version differences may affect `pac code init` behavior -> Check only for command availability in preflight and let PAC surface command-specific errors during execution.

## Migration Plan

1. Add the progress renderer and migrate existing setup steps onto it.
2. Add argument parsing for the Power Apps initialization skip path.
3. Add PAC CLI preflight behavior when initialization is enabled.
4. Add the guided prompt and `pac code init` execution after local setup.
5. Update README and verification coverage.

Rollback is straightforward: keep the generated project format unchanged and revert the initializer flow to printing `pac code init` as a manual next step.

## Open Questions

- Should the initializer eventually accept `--environment` and `--display-name` flags to run fully non-interactively?
- Should the tree renderer use color when the terminal supports it, or stay plain text for predictable snapshots?