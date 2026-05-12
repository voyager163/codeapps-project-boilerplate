## 1. Workflow Templates

- [x] 1.1 Create `templates/github/workflows/ghas.yml` with push-to-main, pull-request-to-main, and Monday 02:00 UTC schedule triggers.
- [x] 1.2 Configure the GHAS workflow-level permissions and CodeQL job with `github/codeql-action@v3`, a `javascript-typescript` matrix, `fail-fast: false`, and the `security-extended` query suite.
- [x] 1.3 Add the GHAS dependency review job with `actions/dependency-review-action@v4`, pull-request-only execution, high-severity failure, on-failure PR summaries, and `warn-only: false`.
- [x] 1.4 Create `templates/github/workflows/quality.yml` with push, pull request, and weekly scheduled drift-scan triggers plus the requested workflow-level permissions.
- [x] 1.5 Add quality workflow jobs for lint/format and tests/coverage using Node 20, npm caching, dependency installation, and the generated package scripts.
- [x] 1.6 Add Semgrep OSS, commitlint, npm audit, and OpenSSF Scorecard jobs with the required event guards, SARIF uploads, and no paid external services.
- [x] 1.7 Scope the Scorecard job permissions so `publish_results: true` has the required `id-token: write` permission while keeping the rest of the workflow least-privileged.

## 2. Starter Tooling

- [x] 2.1 Update `templates/starter/package.json` so `npm run lint` fails on ESLint warnings and `npm run test:coverage` runs Vitest coverage in non-watch mode.
- [x] 2.2 Add the Vitest v8 coverage dependency required by generated projects.
- [x] 2.3 Update `templates/starter/vite.config.ts` with v8 coverage provider, `text`, `json-summary`, and `json` reporters, and 80 percent overall coverage thresholds.
- [x] 2.4 Add a generated-project changed-file coverage gate or workflow step that fails covered changed source files below 80 percent line coverage.
- [x] 2.5 Confirm the coverage report action is used only for GitHub-native reporting and does not rely on unsupported `min-coverage-*` inputs.

## 3. Verification And Documentation

- [x] 3.1 Update `scripts/verify-generated-project.js` to assert generated GHAS and quality workflow files exist.
- [x] 3.2 Extend generated-project verification to assert the new lint behavior, coverage script, coverage dependency, and changed-file coverage support.
- [x] 3.3 Update starter documentation if needed to mention generated workflows, GHAS repository settings, and the absence of container scanning.
- [x] 3.4 Run `npm run verify` from the repository root and fix any generated-project verification failures.
- [x] 3.5 Inspect a generated project to confirm `.github/workflows/ghas.yml`, `.github/workflows/quality.yml`, and supporting package scripts are present.
- [x] 3.6 Run OpenSpec status for `add-starter-ci-security-workflows` and confirm the change is ready for implementation review.