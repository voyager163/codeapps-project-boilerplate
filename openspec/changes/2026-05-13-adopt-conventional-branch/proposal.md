## Why

The project currently has no standardized branch naming convention. Developers create branches with inconsistent names (e.g., mixed casing, varying prefixes, no clear pattern), making it difficult to identify branch purpose at a glance, automate CI/CD workflows based on branch type, and onboard new contributors.

Adopting the [Conventional Branch 1.0.0](https://conventional-branch.github.io/) specification provides a structured, human- and machine-readable naming convention for Git branches. This aligns with the project's existing use of Conventional Commits and brings the same level of clarity to branch names.

## What Changes

- Add a `BRANCHING.md` document (or section in `CONTRIBUTING.md`) defining the adopted branch naming convention.
- Enforce the `<type>/<description>` format with allowed prefixes: `feature/`, `feat/`, `bugfix/`, `fix/`, `hotfix/`, `release/`, `chore/`.
- Trunk branches are `main`, `master`, or `develop` (no prefix required).
- Descriptions use lowercase alphanumerics and hyphens only (dots allowed in release versions).
- Add branch name validation to CI using `commit-check` or `commit-check-action` to reject non-conforming branches on PR creation.
- Update the `create-codespec` CLI to initialize new projects with a `.commit-check.yml` (or equivalent) config that includes branch naming rules.
- Update OpenSpec prompts/skills that create branches (e.g., `opsx-new`, `opsx-apply`) to follow the convention automatically.

Rollback plan: remove the CI check and branching docs. Existing branches are unaffected — the convention only applies to newly created branches going forward.

Affected teams: all contributors to this repository, the CLI initializer, and any CI/CD automation that triggers on branch patterns.

## Capabilities

### New Capabilities

- `conventional-branch-enforcement`: Defines the branch naming rules, CI validation, and integration with existing tooling (OpenSpec prompts, CLI scaffolding).

### Modified Capabilities

- `codespec-initializer`: Add `.commit-check.yml` to generated projects with branch naming rules.
- `open-source-project-readiness`: Add branching convention documentation to contribution guidelines.

## Specification Summary

### Allowed Prefixes

| Prefix | Purpose | Example |
|--------|---------|---------|
| `feature/` or `feat/` | New features | `feature/add-login-page` |
| `bugfix/` or `fix/` | Bug fixes | `fix/header-bug` |
| `hotfix/` | Urgent production fixes | `hotfix/security-patch` |
| `release/` | Release preparation | `release/v1.2.0` |
| `chore/` | Non-code tasks (deps, docs) | `chore/update-dependencies` |

### Rules

1. Use lowercase alphanumerics, hyphens, and dots only.
2. No consecutive, leading, or trailing hyphens or dots.
3. Keep descriptions clear and concise.
4. Include ticket numbers when applicable (e.g., `feature/issue-123-new-login`).

### Grammar (ABNF)

```
branch-name     = trunk-branch / prefixed-branch
trunk-branch    = "main" / "master" / "develop"
prefixed-branch = type "/" description
type            = "feature" / "feat" / "bugfix" / "fix"
                / "hotfix" / "release" / "chore"
description     = desc-segment *("-" desc-segment)
desc-segment    = 1*(ALPHA / DIGIT) *("." 1*(ALPHA / DIGIT))
```

## References

- Specification: https://conventional-branch.github.io/
- Validation tool: https://github.com/commit-check/commit-check
- GitHub Action: https://github.com/commit-check/commit-check-action
- License: Creative Commons CC BY 4.0, created by Xianpeng Shen
