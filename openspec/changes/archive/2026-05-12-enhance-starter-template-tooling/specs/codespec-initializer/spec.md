## ADDED Requirements

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
