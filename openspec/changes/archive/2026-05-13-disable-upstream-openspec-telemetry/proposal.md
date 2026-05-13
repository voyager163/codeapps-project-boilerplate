## Why

CodeSpec currently invokes OpenSpec during project creation to check availability, install the CLI when needed, and initialize or update generated projects. Those OpenSpec commands may collect upstream usage telemetry while the CodeSpec initializer is running.

CodeSpec should avoid causing third-party OpenSpec telemetry collection during its own setup flow. This keeps telemetry ownership clear: CodeSpec can decide what it collects for its own product, while generated project setup does not implicitly send OpenSpec usage stats on behalf of developers.

## What Changes

- Disable upstream OpenSpec telemetry for every OpenSpec command the initializer runs.
- Ensure generated OPSX prompt and skill instructions tell agents to disable upstream OpenSpec telemetry whenever they run OpenSpec CLI commands.
- Preserve the existing project creation behavior: OpenSpec is still checked, installed when missing, and initialized or updated in generated projects.
- Document the opt-out behavior so maintainers understand why OpenSpec commands are launched with telemetry disabled.

## Capabilities

### Modified

- `codespec-initializer`: Add requirements that CodeSpec disables upstream OpenSpec telemetry while performing OpenSpec prerequisite and setup operations, and while directing generated OPSX workflows to run OpenSpec CLI commands.

### New

- None.

## Impact

- Affects the CodeSpec CLI command execution path for OpenSpec-related commands.
- Affects generated OPSX prompt and skill template wording for OpenSpec command execution.
- Does not change generated application runtime telemetry scaffolding through `@microsoft/power-apps/telemetry`.
- Does not remove OpenSpec from generated projects or change the generated OpenSpec configuration.