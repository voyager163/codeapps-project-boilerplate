## MODIFIED Requirements

### Requirement: OPSX Prompt And Skill Overlay

The initializer SHALL include all OpenSpec OPSX prompt, skill, and Claude Code command assets in generated projects.

#### Scenario: OPSX assets are copied

- **WHEN** the initializer applies the OpenSpec assistant overlay
- **THEN** the generated project SHALL contain all 11 `opsx-*.prompt.md` files under `.github/prompts/`
- **AND** it SHALL contain all 11 matching `openspec-*` skill folders under `.github/skills/`
- **AND** it SHALL contain all 11 OPSX command files under `.claude/commands/opsx/`

### Requirement: Next Steps Output

The initializer SHALL print next steps after successful project creation.

#### Scenario: Project setup succeeds

- **WHEN** all setup steps complete successfully
- **THEN** the initializer SHALL print commands to enter the project folder, open it in VS Code, run `pac code init`, use OPSX commands, and start the dev server
- **AND** the OPSX command guidance SHALL mention both Claude Code and GitHub Copilot as supported tools

## REMOVED Requirements

### Requirement: Code Apps Plugin Exclusion

**Reason**: Codeapps skills are now shipped as part of the template to provide Power Apps specialist assistance out of the box.
**Migration**: No migration needed. Generated projects will include codeapps skills automatically.

## ADDED Requirements

### Requirement: Codeapps Skill Overlay

The initializer SHALL include Power Apps codeapps skill assets in generated projects for both Claude Code and GitHub Copilot.

#### Scenario: Codeapps assets are copied

- **WHEN** the initializer applies skill overlays
- **THEN** the generated project SHALL contain all 6 `codeapps-*.prompt.md` files under `.github/prompts/`
- **AND** it SHALL contain all 6 codeapps command files under `.claude/commands/codeapps/`
- **AND** it SHALL contain all 6 `SKILL.md` files under `.powerplatform/` in their respective subdirectories

### Requirement: Claude Code Overlay Copy Step

The initializer SHALL copy Claude Code command templates to generated projects.

#### Scenario: Claude Code overlay is applied

- **WHEN** the initializer runs the Claude Code overlay step
- **THEN** it SHALL copy `templates/claude/` to `.claude/` in the target project
- **AND** the copy SHALL use recursive mode with force overwrite

### Requirement: Power Platform Overlay Copy Step

The initializer SHALL copy Power Platform skill source files to generated projects.

#### Scenario: Power Platform overlay is applied

- **WHEN** the initializer runs the Power Platform overlay step
- **THEN** it SHALL copy `templates/powerplatform/` to `.powerplatform/` in the target project
- **AND** the copy SHALL use recursive mode with force overwrite
