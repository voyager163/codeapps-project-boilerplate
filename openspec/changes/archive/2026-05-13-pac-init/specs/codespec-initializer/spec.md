## ADDED Requirements

### Requirement: Structured Initialization Progress

The initializer SHALL present project setup progress as a grouped initialization tree with visible status markers for completed, skipped, warning, and failed steps.

#### Scenario: Setup progress is grouped by phase

- **WHEN** the developer runs `codespec init my-app`
- **THEN** the initializer SHALL group progress under phases for prerequisite checks, local project setup, Power Apps initialization, and finalization
- **AND** each completed phase step SHALL show a completed status marker.

#### Scenario: Optional Power Apps initialization is skipped

- **WHEN** the developer skips Power Apps initialization
- **THEN** the progress output SHALL mark the Power Apps initialization step as skipped
- **AND** the final output SHALL still indicate that the local CodeSpec project is ready.

### Requirement: Guided Power Apps Code App Initialization

The initializer SHALL guide interactive developers through Power Apps Code App initialization after local project setup succeeds.

#### Scenario: Developer prepares Power Apps values before prompts

- **WHEN** the initializer reaches Power Apps initialization
- **THEN** it SHALL tell the developer to find their Power Platform environment ID and app display name
- **AND** it SHALL wait for the developer to press Enter before prompting for those values.

#### Scenario: Developer provides Power Apps values

- **WHEN** the developer enters a non-empty environment ID and app display name
- **THEN** the initializer SHALL show the `pac code init --environment <environmentId> --displayName <appDisplayName>` command that will be run
- **AND** it SHALL ask the developer to confirm before running the command.

#### Scenario: Power Apps initialization command runs

- **WHEN** the developer confirms Power Apps initialization
- **THEN** the initializer SHALL run `pac code init --environment <environmentId> --displayName <appDisplayName>` inside the generated project folder
- **AND** it SHALL report the Power Apps initialization step as completed when the command succeeds.

#### Scenario: Power Apps values are blank

- **WHEN** the developer submits a blank environment ID or app display name
- **THEN** the initializer SHALL reject the blank value
- **AND** it SHALL prompt again before attempting to run `pac code init`.

#### Scenario: Developer skips guided Power Apps initialization

- **WHEN** the developer chooses to skip Power Apps initialization
- **THEN** the initializer SHALL NOT prompt for environment ID or app display name
- **AND** it SHALL print the manual `pac code init --environment <environmentId> --displayName <appDisplayName>` command for later use.

### Requirement: Power Apps Initialization Skip Option

The initializer SHALL provide a command option that disables PAC CLI preflight and guided Power Apps initialization for local-only or automated project creation.

#### Scenario: Skip option is provided

- **WHEN** the developer runs `codespec init my-app --skip-pac-init`
- **THEN** the initializer SHALL NOT require the Power Platform CLI to be installed
- **AND** it SHALL NOT run `pac code init`
- **AND** it SHALL print the manual `pac code init` command in the final next steps.

## MODIFIED Requirements

### Requirement: Required Tool Checks

The initializer SHALL check that Node.js, npm, git, OpenSpec, and the Power Platform CLI are available before creating the project when Power Apps initialization is enabled.

#### Scenario: Required tools are present

Given Node.js, npm, git, OpenSpec, and the Power Platform CLI are available
When the initializer performs prerequisite checks
Then it SHALL continue to project creation.

#### Scenario: OpenSpec is missing

Given Node.js, npm, git, and the Power Platform CLI are available
And OpenSpec is not available
When the initializer performs prerequisite checks
Then it SHALL install OpenSpec automatically with npm
And it SHALL verify OpenSpec is available before continuing.

#### Scenario: A non-installable required tool is missing

Given Node.js, npm, git, or the Power Platform CLI is missing
When the initializer performs prerequisite checks with Power Apps initialization enabled
Then it SHALL stop before creating the project
And it SHALL print a clear message describing the missing tool.

#### Scenario: Power Platform CLI check is skipped

Given the developer has disabled Power Apps initialization for this run
When the initializer performs prerequisite checks
Then it SHALL NOT require the Power Platform CLI to be available
And it SHALL continue with local project creation when the other required tools are available.

### Requirement: Next Steps Output

The initializer SHALL print next steps after successful project creation that reflect whether Power Apps initialization was completed or skipped.

#### Scenario: Project setup and Power Apps initialization succeed

Given all setup steps complete successfully
And Power Apps initialization completes successfully
When the initializer finishes
Then it SHALL print commands to enter the project folder, open it in VS Code, use OPSX commands, and start the dev server
And it SHALL NOT present `pac code init` as an outstanding required step.

#### Scenario: Project setup succeeds and Power Apps initialization is skipped

Given local project setup completes successfully
And Power Apps initialization is skipped
When the initializer finishes
Then it SHALL print commands to enter the project folder, open it in VS Code, run `pac code init`, use OPSX commands, and start the dev server.