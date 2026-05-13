## 1. CLI Parsing

- [x] 1.1 Update argument parsing so project creation requires the `init` subcommand.
- [x] 1.2 Make `codespec` without a subcommand print command help instead of prompting for a project name.
- [x] 1.3 Reject root positional project names such as `codespec my-app` with an actionable `codespec init my-app` message.
- [x] 1.4 Reserve `codespec init .` and `codespec init --here` with clear unsupported-current-folder messages.
- [x] 1.5 Keep existing project creation options working after `init`, including `--skip-install`, `--skip-git`, `-h`, and `--help`.

## 2. Documentation

- [x] 2.1 Update README quick-start and npx examples to use `codespec init my-app`.
- [x] 2.2 Update README setup-flow and CLI options sections to describe the explicit `init` command.
- [x] 2.3 Search documentation and OpenSpec artifacts for stale `codespec my-app` examples and update intentional references.

## 3. Verification Coverage

- [x] 3.1 Update repository smoke verification to create the temporary project with `init`.
- [x] 3.2 Add verification coverage that root positional project creation fails before files are created.
- [x] 3.3 Add verification coverage for root help behavior and reserved current-folder init forms if practical in the existing script.

## 4. Validation

- [x] 4.1 Run `node --check bin/create-codespec.js`.
- [x] 4.2 Run `node --check scripts/verify-generated-project.js`.
- [x] 4.3 Run `npm run verify`.