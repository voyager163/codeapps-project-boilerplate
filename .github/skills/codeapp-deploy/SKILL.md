---
name: codeapp-deploy
description: Build, validate, and deploy a Power Apps Code App using npx power-apps push.
license: MIT
compatibility: Requires @microsoft/power-apps SDK.
metadata:
  author: powerplatform-skills
  version: "1.0"
  generatedBy: "1.0.0"
---

Build, validate, and deploy a Power Apps Code App to Power Platform.

**Prompt**: [codeapp-deploy.prompt.md](../../prompts/codeapp-deploy.prompt.md)

**Related skills**:
- [codeapp-dataverse-query](../codeapp-dataverse-query/SKILL.md) — Add data hooks before deploying

**CLI commands** (verified from official docs):

| Command | Purpose |
|---------|---------|
| `npx power-apps push` | Publish new version |
| `npx power-apps push --environment <url-or-guid>` | Push to specific environment |
| `npx power-apps init` | Initialize code app |
| `npx power-apps run` | Local dev server for connections |

**Phases**:
1. Pre-flight (project structure, `power.config.json`, git status)
2. Build (`tsc -b && vite build`) with auto-fix for trivial TS errors
3. Confirmation gate (never deploys silently)
4. `npx power-apps push`
5. Structured status reporting

**Constraints**:
- Never deploys without user confirmation
- Never deploys a broken build
- Max 1 auto-fix retry, then stops
- Max 1 push retry, then stops
- Never modifies git state

**Usage**:
```
/codeapp:deploy
/codeapp:deploy --environment https://org123.crm.dynamics.com
```
