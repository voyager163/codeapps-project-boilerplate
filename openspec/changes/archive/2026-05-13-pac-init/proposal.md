## Why

Developers currently receive `pac code init` as a manual next step after CodeSpec project creation, which leaves them to discover the required Power Platform values and handle missing PAC CLI setup on their own. CodeSpec can make the Code Apps binding step clearer by checking prerequisites up front and guiding the developer through the environment ID and display name prompts when the project is ready.

## What Changes

- Add Power Platform CLI (`pac`) to the initializer prerequisite checks before project files are created, unless the developer explicitly skips Power Apps initialization.
- Replace the flat setup log with a structured initialization progress tree that groups prerequisite checks, local project setup, Power Apps initialization, and finalization.
- Add a guided Power Apps Code App initialization step that first asks the developer to find their environment ID and app display name, waits for Enter, then prompts for both values.
- Run `pac code init --environment <environmentId> --displayName <appDisplayName>` from the generated project folder after local project setup succeeds.
- Preserve a skip path for developers who want to create the local project now and initialize Power Apps later.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `codespec-initializer`: Add structured progress output, PAC CLI prerequisite handling, and guided Power Apps Code App initialization to the project creation flow.

## Impact

- Affects the `codespec init` CLI flow in `bin/create-codespec.js`.
- Updates generated-project onboarding and README guidance for the new assisted PAC initialization behavior.
- May require verification updates in `scripts/verify-generated-project.js` to cover the new CLI output, skip path, and `pac code init` invocation behavior.