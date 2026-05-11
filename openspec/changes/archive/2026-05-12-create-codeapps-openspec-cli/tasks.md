## 1. Package And Template Structure

- [x] 1.1 Add npm package metadata for `create-codeapps-openspec`, including a `bin` entry for the initializer.
- [x] 1.2 Add `bin/create-codeapps-openspec.js` as the CLI entry point.
- [x] 1.3 Add `templates/starter/` containing the customized starter snapshot and a `SOURCE.md` documenting the Microsoft starter source.
- [x] 1.4 Add `templates/openspec/config.yaml` with the fixed Power Apps Code Apps OpenSpec configuration.
- [x] 1.5 Add `templates/github/` containing all 11 OPSX prompts and all 11 matching OpenSpec skill folders for generated projects.

## 2. CLI Prerequisite Flow

- [x] 2.1 Parse the optional project name positional argument and prompt for a project name when it is omitted.
- [x] 2.2 Validate that Node.js, npm, and git are available before creating the target folder.
- [x] 2.3 Check whether OpenSpec is available and automatically install `@fission-ai/openspec@latest` globally when it is missing.
- [x] 2.4 Re-check OpenSpec after automatic installation and stop with recovery guidance if installation fails.
- [x] 2.5 Fail safely when the target folder already exists.

## 3. Project Creation Flow

- [x] 3.1 Copy `templates/starter/` into the target folder without running `degit`.
- [x] 3.2 Copy `templates/github/` into the target folder as `.github/`.
- [x] 3.3 Run `npm install` inside the target folder and stop with a clear error if it fails.
- [x] 3.4 Run `openspec init` when the target folder has no `openspec/` folder.
- [x] 3.5 Run `openspec update` when the target folder already has an `openspec/` folder.
- [x] 3.6 Replace the generated `openspec/config.yaml` with `templates/openspec/config.yaml`.
- [x] 3.7 Run `git init` inside the target folder.

## 4. Output And Error Handling

- [x] 4.1 Print step-by-step setup progress similar to the project-ready summary explored earlier.
- [x] 4.2 Print next steps for `cd`, `code .`, manual `pac code init`, OPSX usage, and `npm run dev`.
- [x] 4.3 Ensure the CLI does not ask for an AI assistant, register plugin marketplaces, or install Code Apps plugin skills.
- [x] 4.4 Return non-zero exit codes for missing tools, target folder conflicts, install failures, OpenSpec failures, and git initialization failures.

## 5. Verification And Documentation

- [x] 5.1 Add tests or a verification script that creates a temporary project and checks the expected generated files.
- [x] 5.2 Verify generated projects include all 11 OPSX prompt files.
- [x] 5.3 Verify generated projects include all 11 OpenSpec skill folders.
- [x] 5.4 Verify generated projects receive the fixed Power Apps Code Apps `openspec/config.yaml`.
- [x] 5.5 Update the README with CLI usage, prerequisites, generated project contents, and next steps.