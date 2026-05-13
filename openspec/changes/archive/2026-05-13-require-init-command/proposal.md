## Why

CodeSpec is moving from a single-purpose project scaffolder into a small command family with diagnostics, verification, repair, and cinematic CLI output. Requiring an explicit `init` subcommand makes project creation align with OpenSpec and Spec Kit while keeping root-level command names unambiguous before launch.

## What Changes

- **BREAKING**: Project creation SHALL use `codespec init <project-name>` instead of `codespec <project-name>`.
- The CLI SHALL reject root positional project names such as `codespec my-app` and direct developers to `codespec init my-app`.
- The CLI SHALL reserve root command names such as `init`, `doctor`, `check`, `verify`, `repair`, `help`, and `version` for command dispatch.
- The CLI documentation and help output SHALL present `codespec init <project-name>` as the project creation command.
- `codespec init .` and `codespec init --here` SHALL be reserved for a future existing-folder initialization mode rather than implemented as part of this change.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `codespec-initializer`: Change the initializer command contract from root positional project creation to explicit `init` subcommand project creation.

## Impact

- Affected code: `bin/create-codespec.js`, `scripts/verify-generated-project.js`.
- Affected docs: `README.md`, `CONTRIBUTING.md` if command examples or validation instructions mention project creation syntax.
- Affected package behavior: the existing `codespec` and `create-codespec` bin entries remain, but command parsing changes require `init` before a project name.
- No new runtime dependencies are required for this narrow change; cinematic output and additional commands can be specified separately.