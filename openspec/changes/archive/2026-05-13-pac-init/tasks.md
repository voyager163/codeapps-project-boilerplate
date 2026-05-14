## 1. CLI Options And Flow Setup

- [x] 1.1 Add `--skip-pac-init` parsing to `codespec init` and include it in help output.
- [x] 1.2 Thread the Power Apps initialization option through the initializer flow without changing existing `--skip-install` or `--skip-git` behavior.
- [x] 1.3 Update final next-step generation so completed and skipped Power Apps initialization produce different guidance.

## 2. Structured Progress Output

- [x] 2.1 Add an internal progress step model for grouped setup phases and leaf step statuses.
- [x] 2.2 Replace flat `[run]`, `[ok]`, `[skip]`, and `[fail]` setup logging with tree-style progress output.
- [x] 2.3 Ensure failed and skipped steps remain visible in the final output.

## 3. PAC CLI Preflight

- [x] 3.1 Add a Power Platform CLI availability check using the existing command detection helper.
- [x] 3.2 Run the PAC CLI check before project files are created when Power Apps initialization is enabled.
- [x] 3.3 Skip the PAC CLI check when `--skip-pac-init` is provided.
- [x] 3.4 Print a clear missing-tool message that explains how to continue by installing PAC CLI or rerunning with `--skip-pac-init`.

## 4. Guided Power Apps Initialization

- [x] 4.1 Add an interactive preparation prompt that tells the developer to find the environment ID and app display name before continuing.
- [x] 4.2 Add prompts for environment ID and app display name with blank-value validation.
- [x] 4.3 Add command confirmation before running `pac code init`.
- [x] 4.4 Run `pac code init --environment <environmentId> --displayName <appDisplayName>` from the generated project folder after local setup succeeds.
- [x] 4.5 Support skipping guided Power Apps initialization from the preparation prompt and print the manual retry command.

## 5. Documentation And Verification

- [x] 5.1 Update README quick start, prerequisites, CLI behavior, and options documentation for guided PAC initialization.
- [x] 5.2 Update generated starter documentation if it still implies `pac code init` is always only manual.
- [x] 5.3 Extend generated-project verification to cover the skip option and new output expectations.
- [x] 5.4 Add or update CLI-level tests or verification fixtures for PAC missing, PAC skipped, and PAC command invocation behavior.
- [x] 5.5 Run the repository verification command and record any remaining manual validation needed for interactive PAC prompts.