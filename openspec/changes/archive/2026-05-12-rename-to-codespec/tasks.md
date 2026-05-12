## 1. CLI And Package Identity

- [x] 1.1 Update root package metadata so the package name and bin key are `create-codespec`.
- [x] 1.2 Rename the legacy CLI entry file to `bin/create-codespec.js`.
- [x] 1.3 Update the CLI internal `packageName`, help output, and fallback normalized package name to CodeSpec naming.
- [x] 1.4 Update `scripts/verify-generated-project.js` to use the new executable path and CodeSpec temp folder prefix.

## 2. Documentation And OpenSpec Naming

- [x] 2.1 Update README title, quick-start commands, CLI options, repository layout, verification commands, and publishing checklist to use `create-codespec` and CodeSpec repository naming.
- [x] 2.2 Rename the active canonical spec folder to `openspec/specs/codespec-initializer/` and update its purpose and command examples.
- [x] 2.3 Rename archived OpenSpec change paths and text that encode the old project identity.
- [x] 2.4 Preserve Power Apps Code Apps, `pac code init`, and `microsoft/PowerAppsCodeApps` references where they describe the platform or upstream source.

## 3. Verification

- [x] 3.1 Run `node --check bin/create-codespec.js`.
- [x] 3.2 Run `node --check scripts/verify-generated-project.js`.
- [x] 3.3 Run `npm run verify`.
- [x] 3.4 Run `npm pack --dry-run` and confirm the renamed executable is included.
- [x] 3.5 Search the repository for old project identity terms and confirm only intentional platform/upstream references remain.
- [x] 3.6 Run `openspec status --change "rename-to-codespec"` and confirm the change is apply-ready.
