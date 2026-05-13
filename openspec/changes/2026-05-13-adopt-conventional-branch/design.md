## Context

This project uses Conventional Commits for commit messages but has no equivalent standard for branch names. As the team grows and CI/CD automation expands, inconsistent branch names create friction in automation triggers, PR review, and project navigation.

Conventional Branch 1.0.0 is a lightweight specification that mirrors the philosophy of Conventional Commits but applies it to branch naming. It defines a small set of prefixes (`feature/`, `fix/`, `hotfix/`, `release/`, `chore/`) and simple formatting rules (lowercase, hyphens, no special characters).

## Goals

- Standardize branch naming across all contributors.
- Enable CI/CD pipelines to trigger workflows based on branch prefix (e.g., auto-deploy from `release/`, run extended tests on `hotfix/`).
- Provide automated validation via `commit-check-action` on GitHub PRs.
- Integrate the convention into OpenSpec prompts that create branches.
- Include branch naming config in projects scaffolded by `create-codespec`.

## Non-Goals

- Do not retroactively rename existing branches.
- Do not enforce on external forks — only on PRs targeting this repo.
- Do not add more prefix types beyond the specification's recommended set (keep it simple).
- Do not block merges on trunk branches (`main`, `develop`) — validation applies to feature/fix branches only.

## Implementation Plan

### Phase 1: Documentation

1. Add a "Branch Naming" section to `CONTRIBUTING.md` with the convention rules and examples.
2. Reference the Conventional Branch 1.0.0 specification.

### Phase 2: CI Enforcement

1. Add `.commit-check.yml` to the repo root with branch naming regex:
   ```yaml
   checks:
     - check: branch
       regex: ^(main|master|develop|(feature|feat|bugfix|fix|hotfix|release|chore)\/[a-z0-9]+([-.][a-z0-9]+)*)$
       message: "Branch name must follow Conventional Branch spec: <type>/<description>"
   ```
2. Add `commit-check-action` to `.github/workflows/quality.yml` (or a new workflow) to validate branch names on PR open/sync.

### Phase 3: Tooling Integration

1. Update `templates/github/workflows/quality.yml` to include the branch check for scaffolded projects.
2. Update OpenSpec prompts (`opsx-new.prompt.md`, `opsx-apply.prompt.md`) to instruct the AI to create branches following the convention (e.g., `feature/<change-slug>`).
3. Add `.commit-check.yml` to `templates/starter/` so generated projects inherit the rule.

### Phase 4: Skill Update

1. Update the `openspec-new-change` skill to automatically name branches as `feature/<date>-<slug>` or `chore/<date>-<slug>` based on change type.

## Validation Regex

```regex
^(main|master|develop|(feature|feat|bugfix|fix|hotfix|release|chore)\/[a-z0-9]+([-.][a-z0-9]+)*)$
```

This regex enforces:
- Trunk branches pass without prefix
- Prefixed branches require a valid type + `/` + lowercase-hyphenated description
- No uppercase, underscores, spaces, consecutive hyphens, or trailing hyphens

## Risks

- **Low**: Developers may initially forget the convention — mitigated by CI checks providing clear error messages.
- **Low**: Custom branch types not in the spec — mitigated by documenting that teams can extend, but the CI regex would need updating.
