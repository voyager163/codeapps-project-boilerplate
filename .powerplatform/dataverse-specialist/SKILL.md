---
name: codeapps-dataverse-specialist
description: Handle all Dataverse operations in a Power Apps code app — adding tables, CRUD via generated Service classes, querying with IGetAllOptions (select/filter/orderBy/top/skip), lookups, image/file upload, and table metadata. For non-Dataverse connectors, hand off to powerapps-connector-integrator.
license: MIT
compatibility: Requires Power Platform CLI (pac) 1.46+. App must already be initialized (power.config.json exists).
metadata:
  author: powerplatform
  version: "1.0"
---

Perform Dataverse operations in a Power Apps code app. For non-Dataverse connectors, hand off to `powerapps-connector-integrator`.

**Source of truth**: https://learn.microsoft.com/en-us/power-apps/developer/code-apps/how-to/connect-to-dataverse

---

## Step 1 — Verify prereqs

```powershell
pac --version    # must be 1.46+
pac env who      # confirm correct environment
Test-Path power.config.json   # must exist
```

Also confirm the target Dataverse table exists in the environment before trying to add it.

---

## Repo context (invoice-scanner-simulator)

`power.config.json` already declares these data sources under `databaseReferences."default.cds".dataSources`:

| Name | Logical name | Entity set |
|---|---|---|
| `suppliers` | `cr71a_supplier` | `cr71a_suppliers` |
| `invoices` | `cr71a_invoice` | `cr71a_invoices` |
| `invoiceitems` | `cr71a_invoiceitem` | `cr71a_invoiceitems` |
| `profiles` | `cr71a_profile` | `cr71a_profiles` |

Generated services should be under `src/generated/services/` (`SuppliersService`, `InvoicesService`, etc.) with matching models in `src/generated/models/`. If missing, re-add via CLI.

---

## Adding a Dataverse table

```powershell
pac code add-data-source -a dataverse -t <table-logical-name>
# Example:
pac code add-data-source -a dataverse -t cr71a_invoice
```

This generates `<TableName>Model.ts` and `<TableName>Service.ts` under `src/generated/`.

---

## Import pattern

```typescript
import { AccountsService } from './generated/services/AccountsService';
import type { Accounts } from './generated/models/AccountsModel';
```

Always read the generated file first to confirm exact method and type names before writing call code.

---

## CRUD reference

**Create** — exclude system/read-only columns (primary key, `ownerid`, `owneridname`, etc.):
```typescript
const newAccount = { name: "New Account", statecode: 0, accountnumber: "ACC001" };
const result = await AccountsService.create(newAccount as Omit<Accounts, 'accountid'>);
```

**Retrieve one** by primary key:
```typescript
const result = await AccountsService.get(accountId);
```

**Retrieve many** with `IGetAllOptions` — always pass `select` to bound column count:
```typescript
interface IGetAllOptions {
  maxPageSize?: number;
  select?: string[];
  filter?: string;      // OData
  orderBy?: string[];
  top?: number;
  skip?: number;
  skipToken?: string;
}

const result = await AccountsService.getAll({
  select: ['name', 'accountnumber', 'address1_city'],
  filter: "address1_country eq 'USA'",
  orderBy: ['name asc'],
  top: 50,
});
```

Delegation works for `filter`, `sort`, and `top`. Paging is via `skipToken`.

**Update** — only changed fields, never the full record (avoids triggering unintended business logic):
```typescript
await AccountsService.update(accountId, { name: "Updated", telephone1: "555-0123" });
```

**Delete**:
```typescript
await AccountsService.delete(accountId);
```

---

## Lookups

Currently a rough edge. Use Dataverse Web API patterns:
- "associate with a single-valued navigation property"
- "associate table rows on create"

Polymorphic lookups are not supported. A dedicated guide is "coming soon" — flag this to the user when they ask.

---

## Image and file columns (preview)

When the data source is added via the npm-based CLI, generated upload/download functions land in `src/generated/services`. Use those rather than rolling custom multipart calls.

---

## Metadata and option sets

Formatted values for option sets are returned alongside raw values. Point users to the "Get metadata for Dataverse tables" how-to when they need entity definitions at runtime.

---

## Schema changes

No refresh command. To pick up schema changes: delete the data source and re-add it (generated files will be regenerated).

---

## Not yet supported — do not promise these

- Polymorphic lookups
- Deleting Dataverse data sources via PAC CLI
- Schema/metadata CRUD
- FetchXML
- Alternate keys

---

## Handoffs

| Topic | Route to |
|---|---|
| Non-Dataverse connector | `powerapps-connector-integrator` |
| ALM / solution / preferred-solution | `powerapps-alm-engineer` |
| Environment-variable bound table/dataset names | `powerapps-env-vars-specialist` |
| Architecture question ("should this be Dataverse vs. SQL?") | `powerapps-architect` |
