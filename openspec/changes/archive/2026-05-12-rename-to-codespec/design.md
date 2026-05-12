## Context

The repository is already named `codespec`, but the initializer still carries a legacy identity in functional package metadata, the CLI executable filename, help output, verification automation, README usage, OpenSpec specs, and archived OpenSpec documentation.

The generated applications are still Power Apps Code Apps projects. The rename should therefore target this repository and initializer identity while keeping platform-specific references such as Power Apps Code Apps, `pac code init`, and the Microsoft starter source intact.

## Goals / Non-Goals

**Goals:**

- Make `codespec` the canonical project identity across package metadata, CLI code, docs, verification, and OpenSpec artifacts.
- Change the user-facing command to `npx create-codespec <project-name>`.
- Rename files and directories whose names encode the old initializer identity.
- Remove stale legacy initializer references from active documentation and code.
- Include archived OpenSpec documentation in the rename sweep so repository search results do not imply the old name is still current.

**Non-Goals:**

- Do not change generated app runtime behavior or the starter template architecture.
- Do not rename the Power Apps Code Apps platform, the `pac code init` workflow, or upstream source references to `microsoft/PowerAppsCodeApps`.
- Do not add a compatibility alias for the legacy command.
- Do not publish the package or commit the rename.

## Decisions

### Use `create-codespec` as the package and bin name

The npm package and binary should both be `create-codespec`. This keeps the install/run experience short and maps directly to the repository name. The main alternative was `codespec` as the binary, but `create-*` better signals an npm initializer and matches current usage through `npx`.

### Rename the executable file to match the binary

Rename the CLI entry file to `bin/create-codespec.js` and update all local references. Keeping the old filename with a new bin key would work technically, but it would leave confusing project identity in source paths and verification output.

### Preserve platform names, not old project identity

Legacy initializer, repository, and package fallback references should be renamed. References to Power Apps Code Apps, `pac code init`, and `microsoft/PowerAppsCodeApps` should remain because they describe the app platform and upstream template source, not this initializer's name.

### Treat the command rename as breaking

Do not keep a legacy bin alias. A compatibility alias would reduce friction for early users, but it would preserve the old name in package metadata and contradict the goal to rename all documentation and code before publishing.

### Rename OpenSpec capability identity during implementation

The active spec should live under `openspec/specs/codespec-initializer/`, and the delta spec should use the same CodeSpec-oriented capability identity. Archived change paths and text should also be renamed where they encode the old project identity, while preserving the archive date and the historical meaning of the initial CLI creation.

## Risks / Trade-offs

- **Existing unpublished command references break** -> This is acceptable because the rename is explicitly breaking and should happen before wider publication.
- **Over-renaming platform references could make docs inaccurate** -> Limit replacements to project identity terms and intentionally preserve Power Apps Code Apps platform wording and upstream repository links.
- **Archived artifacts lose exact historical wording** -> This is a trade-off for a clean repository-wide identity sweep; the archive date and purpose remain intact.
- **OpenSpec capability rename can leave duplicate specs** -> Implementation should move the capability directory rather than copy it, and verification should search for old project identity terms afterward.

## Migration Plan

1. Rename package/bin metadata, executable file, internal constants, and verification references.
2. Rename active OpenSpec capability directories and update requirement examples to `create-codespec`.
3. Update README and archived OpenSpec documentation for the new project identity.
4. Run syntax checks, smoke verification, packaging dry run, and a repository-wide old-name search.
5. If the rename fails, revert the file/path renames and restore the previous package/bin metadata before publishing.

## Open Questions

None. The change intentionally chooses a clean breaking rename to `codespec` / `create-codespec`.
