## ADDED Requirements

### Requirement: Starter GHAS Workflow

The initializer SHALL generate projects with a GitHub Advanced Security workflow at `.github/workflows/ghas.yml` for CodeQL SAST and dependency review checks in private GHAS-enabled repositories.

#### Scenario: GHAS workflow is generated

- **WHEN** a developer creates a project with the initializer
- **THEN** the generated project SHALL contain `.github/workflows/ghas.yml`
- **AND** the workflow SHALL define `contents: read`, `security-events: write`, `actions: read`, and `pull-requests: write` permissions at the workflow level.

#### Scenario: CodeQL analyzes JavaScript and TypeScript

- **WHEN** the GHAS workflow runs for a push to `main`, a pull request targeting `main`, or the weekly Monday 02:00 UTC schedule
- **THEN** it SHALL run `github/codeql-action` version 3 for a matrix containing `javascript-typescript`
- **AND** the matrix strategy SHALL set `fail-fast` to `false`
- **AND** CodeQL SHALL use the `security-extended` query suite
- **AND** CodeQL findings SHALL be uploaded to GitHub code scanning.

#### Scenario: Dependency review runs only for pull requests

- **WHEN** the GHAS workflow runs for a pull request
- **THEN** it SHALL run `actions/dependency-review-action` version 4
- **AND** it SHALL set `fail-on-severity` to `high`
- **AND** it SHALL set `comment-summary-in-pr` to `on-failure`
- **AND** it SHALL set `warn-only` to `false`.

#### Scenario: GHAS settings remain outside workflow YAML

- **WHEN** a maintainer inspects the generated GHAS workflow
- **THEN** it SHALL NOT define secret scanning, push protection, or container scanning jobs
- **AND** secret scanning and push protection SHALL remain repository security settings rather than generated workflow steps.

### Requirement: Starter Quality Workflow

The initializer SHALL generate projects with a quality workflow at `.github/workflows/quality.yml` that runs free quality, coverage, static analysis, commit message, and supply-chain checks for private repositories.

#### Scenario: Quality workflow triggers and permissions are generated

- **WHEN** a developer creates a project with the initializer
- **THEN** the generated project SHALL contain `.github/workflows/quality.yml`
- **AND** the workflow SHALL run on pushes to any branch and on pull requests
- **AND** the workflow SHALL include a weekly scheduled run for drift-sensitive checks
- **AND** the workflow SHALL define `contents: read`, `pull-requests: write`, `checks: write`, `security-events: write`, and `actions: read` permissions at the workflow level.

#### Scenario: Lint and format checks run with Node 20

- **WHEN** the quality workflow runs for a push or pull request
- **THEN** it SHALL set up Node.js 20 with npm caching
- **AND** it SHALL install dependencies with npm
- **AND** it SHALL run `npm run lint`
- **AND** it SHALL run `npm run format:check`.

#### Scenario: Tests and coverage run without an external coverage service

- **WHEN** the quality workflow runs tests and coverage
- **THEN** it SHALL run `npm run test:coverage` with Vitest coverage provider `v8`
- **AND** Vitest SHALL produce `text`, `json-summary`, and `json` coverage reports
- **AND** the workflow SHALL fail when overall coverage is below 80 percent
- **AND** the workflow SHALL fail when a covered changed source file is below 80 percent line coverage
- **AND** it SHALL use `davelosert/vitest-coverage-report-action` version 2 for GitHub-native coverage reporting without an external coverage service.

#### Scenario: Semgrep OSS runs locally and uploads SARIF

- **WHEN** the quality workflow runs static analysis for an actor other than `dependabot[bot]`
- **THEN** it SHALL run inside the `semgrep/semgrep` Docker container
- **AND** it SHALL execute `semgrep scan --config auto --sarif`
- **AND** it SHALL NOT require `SEMGREP_APP_TOKEN`
- **AND** it SHALL upload the generated SARIF to GitHub code scanning.

#### Scenario: Commitlint enforces Conventional Commits for pull requests

- **WHEN** the quality workflow runs for a pull request
- **THEN** it SHALL check out the repository with `fetch-depth` set to `0`
- **AND** it SHALL run `wagoid/commitlint-github-action` version 6
- **AND** it SHALL enforce Conventional Commits formatting.

#### Scenario: Dependency audit and Scorecard run with SARIF output

- **WHEN** the quality workflow runs dependency and supply-chain checks
- **THEN** it SHALL run `npm audit --audit-level=high`
- **AND** it SHALL run `ossf/scorecard-action` version 2 with `results_format` set to `sarif`
- **AND** it SHALL set Scorecard `publish_results` to `true`
- **AND** it SHALL upload Scorecard SARIF to GitHub code scanning.

#### Scenario: Weekly quality run focuses on drift-sensitive checks

- **WHEN** the quality workflow runs on its weekly schedule
- **THEN** it SHALL run Semgrep OSS, npm audit, and OpenSSF Scorecard checks
- **AND** it SHALL NOT require pull-request-only commitlint behavior.

### Requirement: Starter CI Supporting Tooling

The initializer SHALL generate projects whose npm scripts and Vitest configuration support the generated quality workflow commands and coverage gates.

#### Scenario: Starter package exposes CI scripts

- **WHEN** a developer inspects the generated package scripts
- **THEN** the `lint` script SHALL fail on ESLint warnings
- **AND** the project SHALL include a `test:coverage` script for non-watch Vitest coverage runs
- **AND** the project SHALL include a CI-usable command or workflow step for enforcing changed-file coverage.

#### Scenario: Starter coverage configuration supports workflow reporting

- **WHEN** a developer inspects the generated Vitest configuration and package metadata
- **THEN** coverage SHALL use the `v8` provider
- **AND** coverage reporters SHALL include `text`, `json-summary`, and `json`
- **AND** overall coverage thresholds SHALL be set to 80 percent
- **AND** dependencies required for Vitest v8 coverage SHALL be available in generated project package metadata.