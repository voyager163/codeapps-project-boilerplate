## Context

CodeSpec currently exposes a single initializer script that treats the first non-option argument as the project folder name. That made sense while the package only created projects, but it conflicts with the planned command family because root-level words such as `doctor`, `verify`, and `repair` need to dispatch commands rather than accidentally become project names.

The repository has not launched, so CodeSpec can cleanly adopt the explicit `codespec init <project-name>` form before users depend on the old shorthand. This also aligns the CLI with OpenSpec's `openspec init` and Spec Kit's `specify init` vocabulary.

## Goals / Non-Goals

**Goals:**

- Make `codespec init <project-name>` the only project creation command form.
- Stop accepting `codespec <project-name>` as shorthand project creation.
- Keep `codespec init` interactive by prompting for a project name when the name is omitted.
- Reserve root command names for the future CLI command family.
- Update verification and documentation so the new command contract is enforced.

**Non-Goals:**

- Implement `doctor`, `check`, `verify`, `repair`, cinematic rendering, or verbose diagnostics.
- Add a command framework dependency such as Commander.js.
- Implement existing-folder initialization through `codespec init .` or `codespec init --here`.
- Change OpenSpec initialization behavior inside generated projects.

## Decisions

1. Use `init` as the primary project creation subcommand.
   - Rationale: `init` matches OpenSpec and Spec Kit, and describes initializing a spec-driven Code Apps workspace rather than simply scaffolding files.
   - Alternative considered: `new`. Rejected because it is less aligned with adjacent spec-driven tools and could make future existing-folder initialization feel bolted on.

2. Remove root positional project creation before launch.
   - Rationale: No public compatibility contract exists yet, and removing the shorthand now prevents ambiguous command parsing later.
   - Alternative considered: keep `codespec my-app` with a deprecation warning. Rejected because the repo has not launched and carrying the shorthand would weaken the command model.

3. Keep the parser lightweight for this change.
   - Rationale: The current CLI can recognize `init`, help flags, and invalid root arguments without a new dependency. A later cinematic CLI change can introduce a fuller command framework if needed.
   - Alternative considered: introduce Commander.js immediately. Deferred because this change is about the command contract, not the broader CLI experience.

4. Reserve existing-folder initialization forms without implementing them.
   - Rationale: `codespec init .` and `codespec init --here` are natural future commands, but retrofitting CodeSpec into an existing app needs separate requirements for overwrite safety and repair semantics.
   - Alternative considered: implement existing-folder initialization now. Rejected to keep this change narrow and safe.

## Risks / Trade-offs

- Existing local README examples may become stale -> update README and verification coverage in the same change.
- Users who try the old shorthand from memory will see an error -> make the error actionable by showing `codespec init <project-name>`.
- A hand-rolled parser can grow awkward as commands expand -> keep this parser minimal and revisit a command framework with the cinematic CLI change.
- `create-codespec` as a bin alias may read oddly with `init` -> keep the alias for package compatibility, but document `codespec init` as the primary interface.

## Migration Plan

1. Update the CLI parser to require `init` before project creation.
2. Update help output and README examples to show `codespec init <project-name>`.
3. Update repository verification so it creates temporary projects with `init` and asserts root positional creation fails.
4. Run syntax checks and repository verification.

Rollback is straightforward before release: restore root positional parsing and documentation examples if the explicit subcommand proves unsuitable.

## Open Questions

- Should `codespec check` become an alias for `codespec doctor` in the future command-family change?
- Should `create-codespec init <project-name>` remain functional indefinitely as a bin alias, or should it eventually be removed before 1.0?