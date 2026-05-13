## 1. Power Platform Skill Source Templates

- [x] 1.1 Create `templates/powerplatform/architect/SKILL.md` (copy from `.powerplatform/architect/SKILL.md`)
- [x] 1.2 Create `templates/powerplatform/alm-engineer/SKILL.md` (copy from `.powerplatform/alm-engineer/SKILL.md`)
- [x] 1.3 Create `templates/powerplatform/app-scaffolder/SKILL.md` (copy from `.powerplatform/app-scaffolder/SKILL.md`)
- [x] 1.4 Create `templates/powerplatform/connector-integrator/SKILL.md` (copy from `.powerplatform/connector-integrator/SKILL.md`)
- [x] 1.5 Create `templates/powerplatform/dataverse-specialist/SKILL.md` (copy from `.powerplatform/dataverse-specialist/SKILL.md`)
- [x] 1.6 Create `templates/powerplatform/env-vars-specialist/SKILL.md` (copy from `.powerplatform/env-vars-specialist/SKILL.md`)

## 2. Claude Code OPSX Command Templates

- [x] 2.1 Create `templates/claude/commands/opsx/apply.md` referencing `.github/prompts/opsx-apply.prompt.md`
- [x] 2.2 Create `templates/claude/commands/opsx/archive.md` referencing `.github/prompts/opsx-archive.prompt.md`
- [x] 2.3 Create `templates/claude/commands/opsx/bulk-archive.md` referencing `.github/prompts/opsx-bulk-archive.prompt.md`
- [x] 2.4 Create `templates/claude/commands/opsx/continue.md` referencing `.github/prompts/opsx-continue.prompt.md`
- [x] 2.5 Create `templates/claude/commands/opsx/explore.md` referencing `.github/prompts/opsx-explore.prompt.md`
- [x] 2.6 Create `templates/claude/commands/opsx/ff.md` referencing `.github/prompts/opsx-ff.prompt.md`
- [x] 2.7 Create `templates/claude/commands/opsx/new.md` referencing `.github/prompts/opsx-new.prompt.md`
- [x] 2.8 Create `templates/claude/commands/opsx/onboard.md` referencing `.github/prompts/opsx-onboard.prompt.md`
- [x] 2.9 Create `templates/claude/commands/opsx/propose.md` referencing `.github/prompts/opsx-propose.prompt.md`
- [x] 2.10 Create `templates/claude/commands/opsx/sync.md` referencing `.github/prompts/opsx-sync.prompt.md`
- [x] 2.11 Create `templates/claude/commands/opsx/verify.md` referencing `.github/prompts/opsx-verify.prompt.md`

## 3. Claude Code Codeapps Command Templates

- [x] 3.1 Create `templates/claude/commands/codeapps/architect.md` referencing `.powerplatform/architect/SKILL.md`
- [x] 3.2 Create `templates/claude/commands/codeapps/alm-engineer.md` referencing `.powerplatform/alm-engineer/SKILL.md`
- [x] 3.3 Create `templates/claude/commands/codeapps/app-scaffolder.md` referencing `.powerplatform/app-scaffolder/SKILL.md`
- [x] 3.4 Create `templates/claude/commands/codeapps/connector-integrator.md` referencing `.powerplatform/connector-integrator/SKILL.md`
- [x] 3.5 Create `templates/claude/commands/codeapps/dataverse-specialist.md` referencing `.powerplatform/dataverse-specialist/SKILL.md`
- [x] 3.6 Create `templates/claude/commands/codeapps/env-vars-specialist.md` referencing `.powerplatform/env-vars-specialist/SKILL.md`

## 4. Copilot Codeapps Prompt Templates

- [x] 4.1 Create `templates/github/prompts/codeapps-architect.prompt.md` with `#file:` reference to `.powerplatform/architect/SKILL.md`
- [x] 4.2 Create `templates/github/prompts/codeapps-alm-engineer.prompt.md` with `#file:` reference to `.powerplatform/alm-engineer/SKILL.md`
- [x] 4.3 Create `templates/github/prompts/codeapps-app-scaffolder.prompt.md` with `#file:` reference to `.powerplatform/app-scaffolder/SKILL.md`
- [x] 4.4 Create `templates/github/prompts/codeapps-connector-integrator.prompt.md` with `#file:` reference to `.powerplatform/connector-integrator/SKILL.md`
- [x] 4.5 Create `templates/github/prompts/codeapps-dataverse-specialist.prompt.md` with `#file:` reference to `.powerplatform/dataverse-specialist/SKILL.md`
- [x] 4.6 Create `templates/github/prompts/codeapps-env-vars-specialist.prompt.md` with `#file:` reference to `.powerplatform/env-vars-specialist/SKILL.md`

## 5. CLI Update

- [x] 5.1 Add `copyClaudeOverlay` function to `bin/create-codespec.js` (copies `templates/claude/` → `.claude/`)
- [x] 5.2 Add `copyPowerPlatformOverlay` function to `bin/create-codespec.js` (copies `templates/powerplatform/` → `.powerplatform/`)
- [x] 5.3 Add `copyClaudeOverlay` and `copyPowerPlatformOverlay` steps to the `main()` function
- [x] 5.4 Update `printNextSteps()` to mention both Claude Code and GitHub Copilot
