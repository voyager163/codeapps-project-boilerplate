## Why

Generated CodeSpec projects currently include local quality tooling but no GitHub-native CI, security scanning, or supply-chain checks. Private repositories with GitHub Advanced Security need a ready baseline that uses free GitHub Actions and GHAS capabilities without relying on paid third-party services.

## What Changes

- Add starter GitHub workflow templates for GHAS scanning and quality checks under the generated project's `.github/workflows/` directory.
- Add a GHAS workflow that runs CodeQL JavaScript/TypeScript analysis with the `security-extended` query suite on pushes to `main`, pull requests targeting `main`, and a weekly Monday 02:00 UTC schedule.
- Add dependency review to the GHAS workflow for pull requests only, failing on high-severity dependency changes and writing PR summaries only when failures occur.
- Add a quality workflow that runs linting, formatting, Vitest coverage reporting, Semgrep OSS, commit linting, npm audit, and OpenSSF Scorecard using tools that are free for private repositories.
- Add a weekly quality drift scan for checks whose findings can change without source changes, such as Semgrep rules, npm advisories, and Scorecard posture.
- Update the starter package scripts and test configuration so the generated workflows have the expected lint and coverage commands.
- Keep secret scanning and push protection out of YAML because those are enabled through GitHub repository security settings.
- Exclude container scanning because the starter does not use containers.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `codespec-initializer`: Generated projects include GHAS and quality GitHub Actions workflows with supporting package scripts and coverage configuration.

## Impact

- Adds workflow templates beneath `templates/github/workflows/`.
- Updates starter package scripts and coverage-related development dependencies in `templates/starter/package.json`.
- Updates Vitest coverage configuration in `templates/starter/vite.config.ts`.
- Updates generated-project verification to assert the workflow files and supporting scripts are present.
- Updates the `codespec-initializer` spec to describe generated CI/security workflow behavior.