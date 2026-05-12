## 1. README Identity And Positioning

- [x] 1.1 Add `media/logo.svg` with a lightweight CodeSpec icon suitable for README display.
- [x] 1.2 Replace the README opening with a centered CodeSpec identity block, tagline, concise value statement, logo, and dynamic badges for release, stars, license, and npm package status.
- [x] 1.3 Add or revise README sections that explain who CodeSpec is for, what generated projects include, and why spec-driven development matters for Power Apps Code Apps.
- [x] 1.4 Clarify in the README that OpenSpec is the current lightweight framework choice and that CodeSpec may adopt a better spec-driven development framework in the future.
- [x] 1.5 Keep CLI usage, OPSX workflow, generated project structure, maintainer instructions, and publishing guidance available after the newcomer-focused introduction.

## 2. Community Documentation

- [x] 2.1 Add `CODE_OF_CONDUCT.md` with standard contributor conduct sections, maintainer responsibilities, scope, enforcement, and attribution.
- [x] 2.2 Add `CONTRIBUTING.md` with local setup, verification commands, pull request expectations, documentation update guidance, and contribution focus areas.
- [x] 2.3 Add AI-assisted contribution disclosure guidance to `CONTRIBUTING.md` that requires contributors to describe if and how AI tools were used.
- [x] 2.4 Link the code of conduct and contribution guide from README where it helps new contributors find them.

## 3. Verification

- [x] 3.1 Review README badge URLs, icon path, and accessible alternate text for correctness.
- [x] 3.2 Run `npm run verify` to confirm generated project setup still passes.
- [x] 3.3 Run `node --check bin/create-codespec.js`, `node --check scripts/verify-generated-project.js`, and `npm pack --dry-run` to confirm package health is unchanged.
- [x] 3.4 Review documentation for stale project identity terms and confirm Power Apps Code Apps references remain accurate.