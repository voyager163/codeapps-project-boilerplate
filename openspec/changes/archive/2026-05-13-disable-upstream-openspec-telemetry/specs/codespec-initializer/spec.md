## ADDED Requirements

### Requirement: Upstream OpenSpec Telemetry Opt-Out

The initializer SHALL disable upstream OpenSpec telemetry for OpenSpec commands it runs on behalf of developers by setting `OPENSPEC_TELEMETRY=0` in the spawned process environment.

#### Scenario: OpenSpec prerequisite commands opt out

- **WHEN** the initializer checks whether OpenSpec is available or automatically installs OpenSpec
- **THEN** the spawned command environment SHALL include `OPENSPEC_TELEMETRY=0`.

#### Scenario: OpenSpec project setup commands opt out

- **WHEN** the initializer runs `openspec init` or `openspec update` for a generated project
- **THEN** the spawned command environment SHALL include `OPENSPEC_TELEMETRY=0`.

#### Scenario: Generated app telemetry remains unchanged

- **WHEN** the initializer creates the starter application files
- **THEN** the generated Power Apps telemetry scaffold SHALL remain available for application telemetry.

### Requirement: Generated OPSX OpenSpec Telemetry Opt-Out

The initializer SHALL generate OPSX prompt and skill assets that direct agents to disable upstream OpenSpec telemetry when running OpenSpec CLI commands.

#### Scenario: Generated OPSX command instructions opt out

- **WHEN** a generated OPSX prompt or skill instructs an agent to run an OpenSpec CLI command
- **THEN** the instruction SHALL require `OPENSPEC_TELEMETRY=0` in the command environment.

#### Scenario: Template and local OPSX assets stay synchronized

- **WHEN** maintainers update the generated OPSX telemetry opt-out guidance
- **THEN** the template OPSX assets and repository-local OPSX assets SHALL remain consistent.