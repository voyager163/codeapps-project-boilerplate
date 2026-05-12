## Why

CodeSpec is intended to be an open source starting point for teams building Power Apps Code Apps with spec-driven development, but the repository currently reads mostly like a CLI reference. It needs stronger public-facing documentation, community contribution guidance, and lightweight branding so new users can quickly understand the project, trust it, and participate.

## What Changes

- Improve the README opening so it presents CodeSpec's purpose, audience, and spec-driven development stance before detailed CLI mechanics.
- Add README badges for latest release, GitHub stars, license, and npm package status when appropriate.
- Add a lightweight project icon and use it in the README header.
- Add community documentation for contribution expectations and contributor conduct.
- Clarify that OpenSpec is the current spec-driven development framework because it is lightweight and easy to learn, while preserving CodeSpec's ability to adopt a better framework in the future.
- Add maintainer guidance for validating documentation and community-file changes.

## Capabilities

### New Capabilities

- `open-source-project-readiness`: Public-facing repository documentation, trust signals, community contribution guidance, and lightweight branding for CodeSpec as an open source project.

### Modified Capabilities

- `codespec-initializer`: Repository documentation requirements will be refined to include public open-source positioning while preserving Power Apps Code Apps platform references.

## Impact

- Affected files will include README documentation, community health files such as `CODE_OF_CONDUCT.md` and `CONTRIBUTING.md`, and a small media asset for the project icon.
- No CLI behavior, generated project runtime behavior, package dependencies, or public APIs are expected to change.
- Verification should focus on documentation correctness, link validity, package metadata consistency, and existing initializer smoke checks.