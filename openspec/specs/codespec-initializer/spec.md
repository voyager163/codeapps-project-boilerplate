## Purpose

Define the behavior of the `create-codespec` initializer for creating Power Apps Code Apps projects prepared for OpenSpec-driven development.

## Requirements

### Requirement: CodeSpec CLI Identity

The initializer SHALL use `codespec` as the project identity and SHALL expose the npm package and executable command as `create-codespec`.

#### Scenario: Package metadata names CodeSpec initializer

Given a developer inspects the package metadata
When the package name and binary entries are read
Then they SHALL identify the initializer as `create-codespec`
And they SHALL NOT expose a legacy package name or bin alias.

#### Scenario: Help output shows CodeSpec command

Given the developer runs the initializer help command
When usage information is printed
Then it SHALL show `npx create-codespec [project-name] [options]`.

### Requirement: CodeSpec Documentation Identity

Repository documentation, verification scripts, OpenSpec artifacts, and community files SHALL use CodeSpec project naming for this initializer while preserving Power Apps Code Apps platform references and the project's open-source spec-driven development positioning.

#### Scenario: Repository project identity is searched

Given the repository has been renamed to CodeSpec
When maintainers search documentation, code, OpenSpec artifacts, and community files for old initializer identity terms
Then legacy initializer, repository, and package fallback terms SHALL NOT remain as project identity references.

#### Scenario: Platform references remain accurate

Given documentation describes the generated app platform or upstream starter source
When maintainers review those references
Then Power Apps Code Apps, `pac code init`, and `microsoft/PowerAppsCodeApps` references SHALL remain accurate and SHALL NOT be renamed to CodeSpec.

#### Scenario: Open-source positioning remains accurate

Given documentation describes CodeSpec's public purpose
When maintainers review README and community documentation
Then the documentation SHALL describe CodeSpec as an open source setup for Power Apps Code Apps development with spec-driven workflows
And it SHALL identify OpenSpec as the current framework choice rather than an irreversible project constraint.

### Requirement: Project Name Handling

The initializer SHALL accept an optional project folder name as a positional argument.

#### Scenario: Project name is provided

Given the developer runs `npx create-codespec my-app`
When the initializer starts
Then it SHALL use `my-app` as the target folder name
And it SHALL not prompt for the project name.

#### Scenario: Project name is omitted

Given the developer runs `npx create-codespec`
When the initializer starts
Then it SHALL prompt the developer for a project name
And it SHALL use the provided value as the target folder name.

### Requirement: Required Tool Checks

The initializer SHALL check that Node.js, npm, git, and OpenSpec are available before creating the project.

#### Scenario: Required tools are present

Given Node.js, npm, git, and OpenSpec are available
When the initializer performs prerequisite checks
Then it SHALL continue to project creation.

#### Scenario: OpenSpec is missing

Given Node.js and npm are available
And OpenSpec is not available
When the initializer performs prerequisite checks
Then it SHALL install OpenSpec automatically with npm
And it SHALL verify OpenSpec is available before continuing.

#### Scenario: A non-installable required tool is missing

Given Node.js, npm, or git is missing
When the initializer performs prerequisite checks
Then it SHALL stop before creating the project
And it SHALL print a clear message describing the missing tool.

### Requirement: Target Folder Safety

The initializer SHALL avoid overwriting an existing target folder by default.

#### Scenario: Target folder already exists

Given a folder named `my-app` already exists
When the developer runs `npx create-codespec my-app`
Then the initializer SHALL stop before copying files
And it SHALL explain that the target folder already exists.

### Requirement: Starter Template Copy

The initializer SHALL create the project from this repo's customized local starter template.

#### Scenario: Project folder is created

Given the target folder does not exist
When the initializer creates the project
Then it SHALL copy `templates/starter` into the target folder
And it SHALL not run `degit` during project creation.

### Requirement: OPSX Prompt And Skill Overlay

The initializer SHALL include all OpenSpec OPSX prompt and skill assets in generated projects.

#### Scenario: OPSX assets are copied

Given the starter template has been copied
When the initializer applies the OpenSpec assistant overlay
Then the generated project SHALL contain all 11 `opsx-*.prompt.md` files under `.github/prompts/`
And it SHALL contain all 11 matching `openspec-*` skill folders under `.github/skills/`.

### Requirement: Dependency Installation

The initializer SHALL run npm dependency installation by default.

#### Scenario: Starter dependencies are installed

Given the project files have been copied
When the initializer reaches dependency setup
Then it SHALL run `npm install` inside the target folder
And it SHALL stop with a clear error if dependency installation fails.

### Requirement: OpenSpec Initialization

The initializer SHALL initialize or update OpenSpec in the generated project.

#### Scenario: OpenSpec is initialized

Given the target folder does not contain an `openspec/` folder
When the initializer reaches OpenSpec setup
Then it SHALL run `openspec init` inside the target folder.

#### Scenario: OpenSpec already exists

Given the target folder contains an `openspec/` folder
When the initializer reaches OpenSpec setup
Then it SHALL run `openspec update` inside the target folder.

### Requirement: Fixed Power Apps Code Apps Config

The initializer SHALL apply the fixed Power Apps Code Apps OpenSpec configuration after OpenSpec setup.

#### Scenario: Config is applied

Given OpenSpec setup has completed
When the initializer applies project configuration
Then it SHALL copy `templates/openspec/config.yaml` to `openspec/config.yaml` in the target folder
And it SHALL replace the generated config with the fixed Power Apps Code Apps config.

### Requirement: Git Initialization

The initializer SHALL initialize a git repository by default.

#### Scenario: Git repository is initialized

Given project setup has completed
When the initializer reaches source control setup
Then it SHALL run `git init` inside the target folder.

### Requirement: Next Steps Output

The initializer SHALL print next steps after successful project creation.

#### Scenario: Project setup succeeds

Given all setup steps complete successfully
When the initializer finishes
Then it SHALL print commands to enter the project folder, open it in VS Code, run `pac code init`, use OPSX commands, and start the dev server.

### Requirement: Code Apps Plugin Exclusion

The initializer SHALL NOT install or maintain Code Apps assistant plugin skills.

#### Scenario: Assistant plugin setup is skipped

Given the initializer is creating a project
When setup runs
Then it SHALL NOT ask the developer to choose Claude Code or GitHub Copilot
And it SHALL NOT register a plugin marketplace
And it SHALL NOT install Code Apps plugin skills.

### Requirement: React 19 Starter Guidance

The initializer SHALL generate projects whose starter dependencies, OpenSpec context, and repository documentation describe the frontend stack as Vite, React 19, and TypeScript.

#### Scenario: Generated project guidance names React 19

Given a developer creates a project with the initializer
When they inspect the generated OpenSpec configuration and starter documentation
Then the frontend stack SHALL be described as Vite, React 19, and TypeScript.

#### Scenario: Starter package uses React 19

Given a developer inspects the generated starter package metadata
When they read the React dependencies and React type dependencies
Then those dependencies SHALL target React 19-compatible packages.

### Requirement: Starter Unit Test Tooling

The initializer SHALL generate projects with Vitest unit-test tooling, React component test support, and at least one starter smoke test.

#### Scenario: Unit test scripts are available

Given a developer creates a project with the initializer
When they inspect the generated package scripts
Then the project SHALL include scripts for running Vitest in watch mode and non-watch mode.

#### Scenario: Starter unit smoke test runs

Given a developer has installed generated project dependencies
When they run the non-watch unit test script
Then Vitest SHALL execute a starter smoke test successfully.

### Requirement: Starter End-To-End Test Tooling

The initializer SHALL generate projects with Playwright end-to-end tooling and at least one browser smoke test for the starter app.

#### Scenario: End-to-end scripts are available

Given a developer creates a project with the initializer
When they inspect the generated package scripts
Then the project SHALL include a script for running Playwright tests.

#### Scenario: Browser smoke test exercises starter app

Given a developer has installed generated project dependencies and Playwright browsers
When they run the Playwright test script
Then Playwright SHALL start the Vite dev server and verify the starter app renders in a browser.

### Requirement: Starter Formatting Tooling

The initializer SHALL generate projects with Prettier configuration and npm scripts while preserving ESLint and strict TypeScript checks.

#### Scenario: Formatting scripts are available

Given a developer creates a project with the initializer
When they inspect the generated package scripts and formatting configuration
Then the project SHALL include Prettier write and check scripts
And it SHALL include repository-local Prettier configuration.

#### Scenario: Linting remains available

Given a developer creates a project with the initializer
When they inspect the generated package scripts and TypeScript configuration
Then the existing ESLint script SHALL remain available
And strict TypeScript settings SHALL remain enabled.

### Requirement: Power Apps Telemetry Scaffold

The initializer SHALL generate projects with a minimal telemetry scaffold that initializes an `ILogger` through `@microsoft/power-apps/telemetry` without adding a custom backend or custom authentication layer.

#### Scenario: Telemetry initialization is present

Given a developer creates a project with the initializer
When they inspect the generated starter source
Then the source SHALL initialize telemetry with `initializeLogger`
And it SHALL use the `ILogger` type from `@microsoft/power-apps/telemetry`.

#### Scenario: Telemetry scaffold preserves platform boundaries

Given a developer uses the generated telemetry scaffold
When metrics are logged by the starter app
Then the metrics SHALL flow through the Power Apps telemetry contract
And the project SHALL NOT require a custom backend or custom auth layer for telemetry.

### Requirement: Starter Tooling Verification

The repository verification SHALL detect when generated projects are missing the expected starter tooling files, scripts, or OpenSpec context for React 19, testing, formatting, and telemetry.

#### Scenario: Generated project verification checks starter tooling

Given maintainers run repository verification
When the verification script creates a temporary generated project
Then it SHALL assert that the generated project includes the expected test, formatting, and telemetry starter files or scripts
And it SHALL assert that the generated OpenSpec configuration names React 19.