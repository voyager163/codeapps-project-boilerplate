## 1. Documentation

- [ ] 1.1 Add "Branch Naming Convention" section to `CONTRIBUTING.md` with rules, prefixes, and examples.
- [ ] 1.2 Reference the Conventional Branch 1.0.0 specification and link to https://conventional-branch.github.io/.

## 2. CI Enforcement

- [ ] 2.1 Create `.commit-check.yml` at repo root with branch naming regex validation.
- [ ] 2.2 Add `commit-check-action` step to `.github/workflows/quality.yml` to validate branch names on PR open and synchronize events.
- [ ] 2.3 Verify the action produces a clear error message when a branch name violates the convention.

## 3. Template Integration

- [ ] 3.1 Add `.commit-check.yml` to `templates/starter/` so scaffolded projects inherit branch validation.
- [ ] 3.2 Update `templates/github/workflows/quality.yml` to include the branch check step.

## 4. OpenSpec Prompt Updates

- [ ] 4.1 Update `opsx-new.prompt.md` to instruct branch creation following `feature/<slug>` or `chore/<slug>` pattern.
- [ ] 4.2 Update `opsx-apply.prompt.md` to validate branch name before applying changes.
- [ ] 4.3 Update `openspec-new-change/SKILL.md` to document the branch naming requirement.

## 5. Validation

- [ ] 5.1 Create a test branch with a valid name and confirm CI passes.
- [ ] 5.2 Create a test branch with an invalid name (e.g., uppercase, spaces) and confirm CI blocks the PR with a helpful message.
- [ ] 5.3 Run `npx create-codespec test-project` and verify `.commit-check.yml` is present in the output.
