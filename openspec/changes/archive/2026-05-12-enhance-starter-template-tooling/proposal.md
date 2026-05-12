## Why

The generated CodeSpec starter should match the project guidance it ships with. Today the starter already uses React 19, while the OpenSpec context and README still describe React 18, and several advertised development practices are not wired into the generated app.

Adding test, formatting, and telemetry scaffolding now gives new Code Apps projects a stronger baseline before teams begin feature work.

## What Changes

- Update generated-project guidance from Vite + React 18 + TypeScript to Vite + React 19 + TypeScript.
- Add Vitest unit-test tooling and at least one starter smoke test.
- Add Playwright e2e tooling and at least one browser smoke test for the generated starter.
- Add Prettier configuration and npm scripts alongside the existing ESLint setup.
- Add a minimal telemetry scaffold using `@microsoft/power-apps/telemetry` `ILogger` and `initializeLogger`, without inventing a custom backend or custom auth layer.
- Update verification and documentation so generated-project claims match the starter template.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `codespec-initializer`: Generated projects SHALL include React 19-aligned guidance plus starter test, formatting, and telemetry scaffolding.

## Impact

- Affected teams: CodeSpec maintainers, generated app developers, and teams adopting Power Apps Code Apps with OpenSpec workflows.
- Affected files: `templates/starter/**`, `templates/openspec/config.yaml`, repository README/docs, and generated-project verification scripts.
- Dependencies: Vitest, Playwright, Prettier, likely React Testing Library and jsdom for component tests.
- Runtime surface: telemetry initialization through the existing `@microsoft/power-apps` package; no new backend or auth surface.

## Rollback Plan

Revert the starter dependency/config/script changes, remove the generated test and telemetry scaffolding files, and restore README/OpenSpec wording to the previous starter description. Because the initializer copies local templates, rollback is limited to repository files and does not require migration logic for already generated projects.
