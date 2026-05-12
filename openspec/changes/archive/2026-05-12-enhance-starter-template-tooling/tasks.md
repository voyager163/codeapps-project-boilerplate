## 1. Align React 19 Guidance

- [x] 1.1 Update `templates/openspec/config.yaml` to describe the frontend stack as Vite + React 19 + TypeScript.
- [x] 1.2 Update repository README generated-project descriptions from React 18 to React 19.
- [x] 1.3 Review starter README wording and update it if it needs to explicitly name React 19.

## 2. Add Unit Test Tooling

- [x] 2.1 Add Vitest, jsdom, React Testing Library, and related test dependencies to `templates/starter/package.json`.
- [x] 2.2 Add `test` and `test:run` scripts to the starter package.
- [x] 2.3 Configure Vitest for the existing Vite/React/Tailwind starter.
- [x] 2.4 Add a starter test setup file for DOM matchers.
- [x] 2.5 Add at least one React starter smoke test that passes in non-watch mode.

## 3. Add Playwright E2E Tooling

- [x] 3.1 Add Playwright dependency and e2e script to `templates/starter/package.json`.
- [x] 3.2 Add Playwright configuration that starts the Vite dev server automatically.
- [x] 3.3 Add at least one e2e smoke test that verifies the starter app renders and supports a simple interaction.
- [x] 3.4 Document any Playwright browser-install expectation in starter or repository docs.

## 4. Add Prettier Formatting Tooling

- [x] 4.1 Add Prettier to the starter dev dependencies.
- [x] 4.2 Add `format` and `format:check` scripts to the starter package.
- [x] 4.3 Add repository-local Prettier configuration for generated projects.
- [x] 4.4 Add a Prettier ignore file if needed to avoid generated build and dependency output.
- [x] 4.5 Confirm ESLint and strict TypeScript settings remain intact.

## 5. Add Power Apps Telemetry Scaffold

- [x] 5.1 Add a starter telemetry module that defines an `ILogger` using `@microsoft/power-apps/telemetry`.
- [x] 5.2 Add an initialization helper that calls `initializeLogger`.
- [x] 5.3 Wire telemetry initialization into the starter app startup path without blocking React rendering on non-critical failures.
- [x] 5.4 Add or update tests to cover telemetry initialization behavior with the Power Apps telemetry API mocked.
- [x] 5.5 Confirm the telemetry scaffold does not add a custom backend, custom auth layer, or direct Application Insights connection-string requirement.

## 6. Update Verification And Documentation

- [x] 6.1 Extend `scripts/verify-generated-project.js` to assert generated projects include the expected React 19 OpenSpec context, test scripts, e2e script, formatting scripts, and telemetry files.
- [x] 6.2 Update README verification guidance to include relevant starter validation commands.
- [x] 6.3 Run repository smoke verification with `npm run verify`.
- [x] 6.4 Run syntax checks for initializer and verification scripts.
- [x] 6.5 Validate the starter by running build, lint, unit tests, formatting check, and Playwright smoke tests from `templates/starter`.
