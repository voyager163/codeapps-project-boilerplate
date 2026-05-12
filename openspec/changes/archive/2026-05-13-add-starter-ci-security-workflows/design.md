## Context

CodeSpec generates Vite, React 19, and TypeScript starter projects by copying `templates/starter` and overlaying `templates/github` into the generated `.github` directory. The starter already includes ESLint, Prettier, Vitest, Playwright, and GitHub Copilot/OpenSpec prompt assets, but it does not include GitHub Actions workflows or coverage configuration.

The target generated repositories are private GitHub repositories with GitHub Advanced Security licensed. The workflows should use GitHub-native or free OSS tooling for private repositories and avoid paid third-party services. Secret scanning and push protection remain repository settings, not workflow YAML. Container scanning is out of scope because the starter does not use containers.

## Goals / Non-Goals

**Goals:**

- Generate two CI/security workflow files: `.github/workflows/ghas.yml` and `.github/workflows/quality.yml`.
- Keep the workflows compatible with generated npm projects using Node 20 and npm dependency caching.
- Run GHAS CodeQL and dependency review checks with the requested event triggers and permissions.
- Run quality, coverage, Semgrep OSS, commitlint, npm audit, and Scorecard checks without paid external services.
- Add weekly drift coverage for checks whose findings can change without source changes.
- Update starter scripts and Vitest coverage configuration so workflow commands exist in generated projects.
- Extend generated-project verification to catch missing workflow and script support.

**Non-Goals:**

- Do not configure GitHub secret scanning or push protection in YAML.
- Do not add container scanning.
- Do not add Codecov, SonarCloud, Semgrep Cloud, or any other paid third-party service.
- Do not change the initializer's copy mechanism unless the existing template overlay cannot copy workflows.

## Decisions

### Store workflow templates in the GitHub overlay

Place the new workflow files under `templates/github/workflows/`. The initializer already copies `templates/github` into generated projects as `.github`, so this keeps workflow delivery aligned with the existing prompt and skill overlay.

Alternative considered: place workflows under `templates/starter/.github/workflows/`. That would work during starter copy, but it would split `.github` ownership across the starter and overlay and make the existing overlay step less obvious.

### Keep GHAS checks in `ghas.yml`

The GHAS workflow should run on pushes to `main`, pull requests targeting `main`, and a weekly Monday 02:00 UTC schedule. CodeQL should use `github/codeql-action/init@v3` and `github/codeql-action/analyze@v3`, a matrix containing `javascript-typescript`, `fail-fast: false`, and the `security-extended` query suite. CodeQL results are uploaded to GitHub code scanning by the CodeQL action.

Dependency Review should run only for `pull_request` events using `actions/dependency-review-action@v4`, with `fail-on-severity: high`, `comment-summary-in-pr: on-failure`, and `warn-only: false`.

Alternative considered: combine GHAS and quality checks into one workflow. Keeping them separate makes GHAS-specific permissions, scheduling, and Security tab behavior easier to reason about.

### Use `quality.yml` for free local and GitHub-native checks

The quality workflow should run on pushes to any branch and on pull requests. It should also include a weekly schedule for drift-sensitive checks, such as Semgrep OSS rule updates, npm advisory updates, and Scorecard posture changes.

The workflow should include separate jobs for lint/format, tests/coverage, Semgrep OSS, commitlint, and dependency audit/Scorecard. Commitlint should run only for pull requests. Semgrep should skip Dependabot by using a job-level `if` condition for `github.actor != 'dependabot[bot]'`.

Alternative considered: run every quality job weekly. That adds noise and runner cost without much benefit for deterministic lint/format and commit message checks.

### Enforce coverage without unsupported action inputs

`davelosert/vitest-coverage-report-action@v2` reports Vitest coverage through GitHub summaries and pull request comments, but its current action metadata does not define `min-coverage-overall` or `min-coverage-changed-files` inputs. The implementation should not rely on unsupported inputs for enforcement.

Vitest should provide the coverage gate with the v8 provider, reporters `text`, `json-summary`, and `json`, and overall thresholds of 80 for statements, branches, functions, and lines. The workflow can still use `davelosert/vitest-coverage-report-action@v2` to publish native GitHub coverage feedback from `coverage/coverage-summary.json` and `coverage/coverage-final.json`.

Changed-file coverage should be enforced by a small generated-project script or workflow step that reads the Vitest JSON coverage output and fails when a covered changed source file is below 80 percent. This avoids paid services and preserves the requested changed-file coverage gate.

Alternative considered: use Vitest `perFile` thresholds. That is stricter than changed-file coverage and can make unrelated legacy files block a pull request.

### Isolate Scorecard permissions

The quality workflow should set the requested workflow-level permissions: `contents: read`, `pull-requests: write`, `checks: write`, `security-events: write`, and `actions: read`.

OpenSSF Scorecard with `publish_results: true` requires `id-token: write` in the Scorecard job. The implementation should add a job-level permission override for the Scorecard job that includes only the permissions Scorecard and SARIF upload need, including `id-token: write` and `security-events: write`.

Alternative considered: set `publish_results: false`. That avoids OIDC permission complexity but does not satisfy the requested Scorecard publishing behavior.

### Upload SARIF to GitHub code scanning

Semgrep OSS should run inside the `semgrep/semgrep` container with `semgrep scan --config auto --sarif --output semgrep.sarif`, without `SEMGREP_APP_TOKEN` and without uploading to Semgrep Cloud. The SARIF file should be uploaded with `github/codeql-action/upload-sarif@v3`.

Scorecard should produce SARIF using `results_format: sarif` and a local results file, then upload that SARIF file with `github/codeql-action/upload-sarif@v3` so results appear in the GitHub Security tab.

## Risks / Trade-offs

- Scorecard publishing restrictions conflict with broad workflow-level write permissions -> Mitigate with a narrow Scorecard job-level permission override and verify in a generated project.
- The coverage action does not support the requested `min-coverage-*` inputs -> Mitigate by enforcing thresholds through Vitest and a local changed-file coverage gate while using the action for GitHub-native reporting.
- Semgrep `--config auto` rule behavior can change over time -> Treat scheduled runs as drift detection and keep Dependabot skipped to reduce automated PR noise.
- Weekly quality scans can consume extra runner minutes -> Limit weekly-only value to drift-sensitive jobs instead of rerunning all deterministic checks.
- Pull requests from forks may not have write permissions for comments or SARIF upload -> The target is private repositories, where fork PRs are less central; document residual limitations if needed.

## Migration Plan

1. Add workflow templates to `templates/github/workflows/`.
2. Add starter package scripts and dependencies required by workflow commands.
3. Add Vitest coverage configuration and any local changed-file coverage gate.
4. Update generated-project verification to assert workflows and supporting scripts exist.
5. Run repository verification and, if practical, inspect a generated project to confirm the workflows are copied into `.github/workflows/`.

Rollback is removing the new workflow templates and reverting starter script/config changes. Existing generated projects are unaffected unless regenerated or manually updated.

## Open Questions

- Whether the changed-file coverage gate should check line coverage only or require all four Vitest metrics for each covered changed file.