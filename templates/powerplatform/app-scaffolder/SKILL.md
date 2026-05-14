---
name: codeapps-app-scaffolder
description: Scaffold a new Power Apps code app, convert an existing Vite/React/TS app into a code app, or fix a broken initial setup (missing power.config.json, missing @microsoft/power-apps, app not loading in the host).
license: MIT
compatibility: Requires Node.js LTS, Power Platform CLI (pac), and Git.
metadata:
  author: powerplatform
  version: "1.0"
---

Get a Power Apps code app scaffolded and running. Do NOT add data sources — hand off to `powerapps-connector-integrator` or `powerapps-dataverse-specialist` for that.

**Source of truth**: https://learn.microsoft.com/en-us/power-apps/developer/code-apps/how-to/create-an-app-from-scratch

---

## Step 1 — Verify prerequisites

Check all four before doing anything else. If any is missing, stop and tell the user — don't try to install them.

```powershell
node -v          # must be LTS
pac --version    # Power Platform CLI
git --version
# Confirm the target environment has code apps enabled
pac env who
```

---

## Step 2 — Determine the path

**Greenfield (new app)** → follow the Canonical Flow below.
**Existing Vite/TS app** → follow the Conversion Path below.
**Broken setup** → follow the Repair Checklist below.

---

## Canonical Flow (greenfield)

```powershell
# 1. Scaffold from the official template
npx degit github:microsoft/PowerAppsCodeApps/templates/vite my-app
cd my-app

# 2. Auth + environment
pac auth create
pac env select --environment <Environment ID>
# Verify:
pac auth list
pac env who

# 3. Install deps and initialize
npm install
pac code init --displayname "App From Scratch"
# Verify power.config.json was created with non-empty appId and environmentId

# 4. Run locally
npm run dev
# Open the Local Play URL in the same browser profile signed into the Power Platform tenant
# Dec 2025 note: Chrome/Edge block public→localhost. Grant the browser prompt or
# add allow="local-network-access" on iframes for embedded scenarios.

# 5. Build and push
npm run build && pac code push
# pac code push prints the Power Apps URL on success
```

---

## Conversion Path (existing Vite/TS app)

Order matters — do not skip steps:

```powershell
# 1. Auth first
pac auth create
pac env select --environment <Environment ID>

# 2. Install the client library
npm install @microsoft/power-apps

# 3. Initialize in the project root (next to package.json)
pac code init --displayname "<name>"
# power.config.json is created here

# 4. Verify vite.config.ts
# buildPath must point to ./dist and buildEntryPoint to index.html
```

Then in `src/main.tsx`, call `initialize()` before rendering React:

```typescript
import { initialize } from '@microsoft/power-apps';

initialize().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
});
```

```powershell
# 5. Test locally, then push
npm run dev
npm run build && pac code push
```

---

## Repair Checklist

Check each item when an existing setup is broken:

- [ ] `power.config.json` exists with non-empty `appId` and `environmentId`
- [ ] `package.json` has `@microsoft/power-apps` as a dependency
- [ ] `dist/` path matches `buildPath` in `power.config.json`
- [ ] `index.html` at project root matches `buildEntryPoint`
- [ ] `npm run dev` serves on the port listed in `localAppUrl`
- [ ] `initialize()` is called before React renders in `src/main.tsx`

---

## Rules

- Always run commands from the project root; use absolute paths in tool calls.
- Never edit `power.config.json` by hand on first setup — let `pac code init` create it.

---

## Handoffs

| Topic | Route to |
|---|---|
| Connector data sources (Office365, SQL, SharePoint) | `powerapps-connector-integrator` |
| Dataverse tables | `powerapps-dataverse-specialist` |
| Solution targeting on push, pipelines | `powerapps-alm-engineer` |
| Architecture questions | `powerapps-architect` |
