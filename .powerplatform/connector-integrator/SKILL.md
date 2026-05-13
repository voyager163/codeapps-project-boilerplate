---
name: codeapps-connector-integrator
description: Wire a Power Platform connector (Office 365, SQL, SharePoint, etc. — anything except Dataverse) into a code app. Handles pac code add-data-source, dataset/table discovery, generated service consumption, and connection references for ALM.
license: MIT
compatibility: Requires Power Platform CLI (pac) 1.46+. App must already be initialized (power.config.json exists).
metadata:
  author: powerplatform
  version: "1.0"
---

Add and consume Power Platform connectors in a code app. For Dataverse tables, hand off to `powerapps-dataverse-specialist`.

**Source of truth**: https://learn.microsoft.com/en-us/power-apps/developer/code-apps/how-to/connect-to-data

---

## Step 1 — Verify prereqs

```powershell
# App must be initialized
Test-Path power.config.json   # must exist; if not, route to powerapps-app-scaffolder
pac env who                   # confirm correct environment
```

**Unsupported connectors** (as of doc): Excel Online (Business), Excel Online (OneDrive). Tell the user up front if they ask for these.

---

## Step 2 — Get the connection details

The connection must already exist in [make.powerapps.com](https://make.powerapps.com) (Connections page). PAC CLI cannot create new connections.

```powershell
pac connection list
# Note the API Name and Connection ID from the output
# Or read them from the connection URL in the Power Apps maker portal
```

---

## Step 3 — Add the data source

**Nontabular** (e.g., Office 365 Users):
```powershell
pac code add-data-source -a <apiName> -c <connectionId>
# Example:
pac code add-data-source -a "shared_office365users" -c "aaaaaaaa000011112222bbbbbbbbbbbb"
```

**Tabular** (SQL, SharePoint, etc.):
```powershell
pac code add-data-source -a <apiName> -c <connectionId> -t <tableId> -d <datasetName>

# SQL example:
pac code add-data-source -a "shared_sql" -c <connectionId> -t "[dbo].[MobileDeviceInventory]" -d "<server>,<database>"

# SharePoint example:
pac code add-data-source -a "shared_sharepointonline" -c <connectionId> -t "<List Name>" -d "https://<tenant>.sharepoint.com/sites/<site>"
```

**SQL stored procedure**:
```powershell
pac code add-data-source -a <apiId> -c <connectionId> -d <datasetName> -sp <storedProcedureName>
```

---

## Step 3a — Discover names when you don't know them

Names are case-sensitive — copy exactly from output.

```powershell
pac code list-datasets   -a <apiId> -c <connectionId>
pac code list-tables     -a <apiId> -c <connectionId> -d <datasetName>
pac code list-sql-stored-procedures -c <connectionId> -d <datasetName>
```

---

## Step 4 — What gets generated

After `add-data-source`, files appear under `src/generated/services/` and `src/generated/models/`:

- `<Name>Model.ts` — typed shapes
- `<Name>Service.ts` — methods for calling the connector

**Import pattern:**
```typescript
import { Office365UsersService } from './generated/services/Office365UsersService';
import type { User } from './generated/models/Office365UsersModel';
```

**Calling generated services:**
```typescript
// Nontabular
await Office365UsersService.MyProfile_V2("id,displayName,jobTitle,userPrincipalName");

// Tabular CRUD
await MobileDeviceInventoryService.getall();
await MobileDeviceInventoryService.create(record);
await MobileDeviceInventoryService.update(id, changedFields);  // pass only changed fields
await MobileDeviceInventoryService.delete(id);
```

---

## Step 5 — Schema changes

There is no refresh command. If the connector schema changes:

```powershell
pac code delete-data-source -a <apiName> -ds <dataSourceName>
# Then re-add with add-data-source
```

---

## Step 6 — Connection references (recommended for ALM)

From PAC CLI 1.51.1 (Dec 2025), bind to a connection reference inside a solution rather than a raw connection ID:

```powershell
pac code list-connection-references -env <environmentURL> -s <solutionID>
pac code add-data-source -a <apiName> -cr <connectionReferenceLogicalName> -s <solutionID>
```

This makes the app portable across Dev/Test/Prod. Coordinate with `powerapps-alm-engineer` when introducing this.

---

## Step 7 — Verify and publish

```powershell
npm run dev                        # smoke test locally
npm run build && pac code push     # publish to the environment
```

---

## Rules

- Never hand-write generated files. If a service signature looks wrong, delete and re-add the data source.

---

## Handoffs

| Topic | Route to |
|---|---|
| Dataverse tables | `powerapps-dataverse-specialist` |
| `@envvar:` references for dataset/table | `powerapps-env-vars-specialist` |
| Solution / preferred-solution / pipeline questions | `powerapps-alm-engineer` |
