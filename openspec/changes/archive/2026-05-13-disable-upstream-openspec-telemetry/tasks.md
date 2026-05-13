## 1. Disable OpenSpec Telemetry in CLI Commands

- [x] 1.1 Add command-runner support for child process environment overrides while preserving the existing inherited environment by default.
- [x] 1.2 Update OpenSpec availability checks to run with `OPENSPEC_TELEMETRY=0`.
- [x] 1.3 Update automatic OpenSpec installation to pass `OPENSPEC_TELEMETRY=0` to the spawned npm process.
- [x] 1.4 Update `openspec init` and `openspec update` setup commands to run with `OPENSPEC_TELEMETRY=0`.
- [x] 1.5 Keep non-OpenSpec commands, including starter dependency installation and git initialization, on the existing environment behavior.

## 2. Document and Verify the Opt-Out

- [x] 2.1 Update generated OPSX prompt and skill templates so agents are instructed to run OpenSpec CLI commands with `OPENSPEC_TELEMETRY=0`.
- [x] 2.2 Keep repository-local `.github` OPSX assets synchronized with the generated `templates/github` copies.
- [x] 2.3 Update repository documentation to explain that CodeSpec disables upstream OpenSpec telemetry during initializer-managed OpenSpec operations and generated OPSX workflows.
- [x] 2.4 Add or update verification coverage for the telemetry opt-out wiring where practical without changing generated app telemetry behavior.
- [x] 2.5 Run `npm run verify` to confirm generated project creation still succeeds.