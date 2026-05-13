## Context

The CodeSpec initializer shells out to OpenSpec while creating a generated project. It checks whether `openspec` is available, installs `@fission-ai/openspec` when missing, and runs `openspec init` or `openspec update` in the target project.

Generated projects also include OPSX prompt and skill files under `.github/` that instruct agents to run OpenSpec commands such as `openspec list`, `openspec new change`, `openspec status`, `openspec instructions`, and `openspec archive` during normal workflows.

Those commands are part of CodeSpec's setup flow, so CodeSpec should prevent upstream OpenSpec telemetry from being collected during them. The existing generated app telemetry scaffold is separate and should continue to use the Power Apps telemetry contract.

## Goals / Non-Goals

**Goals:**

- Run OpenSpec availability checks, installation, initialization, and update commands with `OPENSPEC_TELEMETRY=0`.
- Direct generated OPSX workflows to use `OPENSPEC_TELEMETRY=0` whenever an agent runs an OpenSpec CLI command.
- Keep the opt-out scoped to commands CodeSpec launches on behalf of the developer.
- Preserve current project generation behavior and error handling.
- Make the command-runner change reusable enough that new OpenSpec commands do not accidentally bypass the opt-out.

**Non-Goals:**

- Disable or redesign generated app telemetry through `@microsoft/power-apps/telemetry`.
- Add a CodeSpec telemetry collection backend.
- Change how developers manually run OpenSpec outside CodeSpec-provided CLI setup and OPSX workflow instructions.

## Decisions

### Apply the opt-out through command environment injection

CodeSpec should set `OPENSPEC_TELEMETRY=0` in the spawned process environment for OpenSpec-related subprocesses. This avoids relying on a developer's shell configuration and keeps the behavior attached to the commands CodeSpec owns.

Alternative considered: document that developers can set `OPENSPEC_TELEMETRY=0` themselves. That is weaker because the initializer would still collect upstream telemetry by default unless each developer already knew to opt out.

### Cover both direct OpenSpec commands and OpenSpec installation

The opt-out should apply to `openspec --version`, `openspec init`, `openspec update`, and the automatic `npm install -g @fission-ai/openspec@latest` step. Even if npm itself ignores the variable, any package lifecycle or post-install code in the OpenSpec package receives the same telemetry opt-out signal.

Alternative considered: only apply the variable to `openspec init` and `openspec update`. That would leave availability and install paths inconsistent with the purpose of preventing upstream collection during CodeSpec-controlled setup.

### Keep non-OpenSpec commands unchanged

Commands such as `npm install` for starter dependencies and `git init` should retain the normal inherited environment. The telemetry decision is specific to upstream OpenSpec collection, not a general subprocess policy.

Alternative considered: set `OPENSPEC_TELEMETRY=0` globally for every child process. That is harmless for most commands but less explicit and could obscure which subprocesses are intentionally covered.

### Add a generated workflow guardrail for OpenSpec commands

Generated OPSX prompts and skills should include a clear instruction that any OpenSpec CLI command run by the agent must use `OPENSPEC_TELEMETRY=0` in the command environment. This covers recurring commands in the generated workflow assets without making every code fence noisy or Unix-only.

Alternative considered: prefix every command example with `OPENSPEC_TELEMETRY=0`. That is explicit for macOS/Linux but awkward for PowerShell examples and increases drift across prompt, skill, and template copies.

## Risks / Trade-offs

- Environment variable spelling or semantics could change upstream -> Keep the requirement and implementation narrowly named so future OpenSpec changes are easy to audit.
- Future OpenSpec command invocations could forget the opt-out -> Route them through a small OpenSpec-specific helper or explicit command option instead of hand-writing spawn calls.
- Agent workflow instructions could be ignored or drift between template and live copies -> Add a shared guardrail to generated OPSX prompt and skill files, and keep `templates/github/` synchronized with local `.github/` assets.
- Verification cannot directly observe upstream telemetry behavior -> Test the initializer's spawned environment/command wiring where practical, and assert generated-project verification still succeeds.

## Migration Plan

No generated project migration is required. The change affects future CodeSpec initializer executions only.

Rollback is limited to removing the env injection and documentation/spec updates. Existing generated projects are independent after creation.

## Open Questions

- None.