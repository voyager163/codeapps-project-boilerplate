## Purpose

Define the template structure and content for shipping both Claude Code and GitHub Copilot skill support in generated codespec projects, covering OPSX workflow skills and Power Apps codeapps skills.

## ADDED Requirements

### Requirement: Claude Code OPSX Command Templates

The template SHALL include Claude Code command files for all 11 OPSX skills so that generated projects support OPSX workflows in Claude Code.

#### Scenario: Claude Code OPSX commands exist in template

- **WHEN** a maintainer inspects `templates/claude/commands/opsx/`
- **THEN** it SHALL contain 11 markdown files: `apply.md`, `archive.md`, `bulk-archive.md`, `continue.md`, `explore.md`, `ff.md`, `new.md`, `onboard.md`, `propose.md`, `sync.md`, `verify.md`

#### Scenario: Claude Code OPSX commands reference Copilot prompt files

- **WHEN** a maintainer reads any Claude Code OPSX command template file
- **THEN** it SHALL instruct Claude to read the corresponding `.github/prompts/opsx-<name>.prompt.md` file and follow its instructions
- **AND** it SHALL include `$ARGUMENTS` to pass user input

### Requirement: Claude Code Codeapps Command Templates

The template SHALL include Claude Code command files for all 6 codeapps skills so that generated projects support Power Apps codeapps skills in Claude Code.

#### Scenario: Claude Code codeapps commands exist in template

- **WHEN** a maintainer inspects `templates/claude/commands/codeapps/`
- **THEN** it SHALL contain 6 markdown files: `alm-engineer.md`, `app-scaffolder.md`, `architect.md`, `connector-integrator.md`, `dataverse-specialist.md`, `env-vars-specialist.md`

#### Scenario: Claude Code codeapps commands reference SKILL.md files

- **WHEN** a maintainer reads any Claude Code codeapps command template file
- **THEN** it SHALL instruct Claude to read the corresponding `.powerplatform/<skill-name>/SKILL.md` file and follow its instructions
- **AND** it SHALL include `$ARGUMENTS` to pass user input

### Requirement: Copilot Codeapps Prompt Templates

The template SHALL include GitHub Copilot prompt files for all 6 codeapps skills so that generated projects support Power Apps codeapps skills in GitHub Copilot Chat.

#### Scenario: Copilot codeapps prompts exist in template

- **WHEN** a maintainer inspects `templates/github/prompts/`
- **THEN** it SHALL contain 6 codeapps prompt files: `codeapps-alm-engineer.prompt.md`, `codeapps-app-scaffolder.prompt.md`, `codeapps-architect.prompt.md`, `codeapps-connector-integrator.prompt.md`, `codeapps-dataverse-specialist.prompt.md`, `codeapps-env-vars-specialist.prompt.md`

#### Scenario: Copilot codeapps prompts reference SKILL.md files

- **WHEN** a maintainer reads any Copilot codeapps prompt template file
- **THEN** it SHALL contain YAML frontmatter with a `description` field
- **AND** it SHALL use a `#file:` reference to attach the corresponding `.powerplatform/<skill-name>/SKILL.md` file

### Requirement: Power Platform Skill Source Templates

The template SHALL include the Power Platform codeapps SKILL.md source files so that both Claude Code commands and Copilot prompts can reference them in generated projects.

#### Scenario: Power Platform skill files exist in template

- **WHEN** a maintainer inspects `templates/powerplatform/`
- **THEN** it SHALL contain 6 skill directories: `alm-engineer/`, `app-scaffolder/`, `architect/`, `connector-integrator/`, `dataverse-specialist/`, `env-vars-specialist/`
- **AND** each directory SHALL contain a `SKILL.md` file

#### Scenario: Power Platform skill content matches root repo

- **WHEN** a maintainer compares a template SKILL.md to the corresponding root `.powerplatform/*/SKILL.md`
- **THEN** the content SHALL be identical
