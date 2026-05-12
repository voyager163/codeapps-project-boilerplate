## Why

The repository and initializer are moving to the project identity `codespec`, but the current package, command, docs, specs, and verification paths still use the older initializer naming. Aligning the public and internal naming now avoids publishing or documenting a stale CLI identity.

## What Changes

- **BREAKING** Rename the npm package and CLI command to `create-codespec`.
- Rename the CLI entry file and internal package-name references to match the new `create-codespec` command.
- Rename verification script temp prefixes and executable paths that reference the old initializer name.
- Update README usage, repository layout, verification commands, and publishing guidance to use the CodeSpec naming.
- Update OpenSpec requirement examples so initializer behavior is specified around `npx create-codespec`.
- Rename the initializer capability/docs surface to `codespec-initializer` where it represents the project identity.
- Preserve Power Apps Code Apps references where they describe the generated application platform, starter template source, or fixed OpenSpec configuration.
- Do not keep a legacy bin alias in this change; users should use the new command.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `codespec-initializer`: Update the initializer's public command/package identity and related documentation requirements to `create-codespec`.

## Impact

- Affects npm package metadata, CLI executable filename, internal CLI help text, verification automation, README examples, OpenSpec specs, and archived project-identity references.
- Changes the command users run to `npx create-codespec <project-name>`.
- May require filesystem renames for the executable and OpenSpec capability directory, plus updated references in tests and documentation.
- Does not change generated app runtime behavior, starter dependencies, OPSX prompt/skill contents, or Power Apps Code Apps platform assumptions.
