---
name: codeapp-dataverse-query
description: Scaffold a typed Dataverse data hook using generated services from @microsoft/power-apps SDK.
license: MIT
compatibility: Requires @microsoft/power-apps SDK and generated services.
metadata:
  author: powerplatform-skills
  version: "1.0"
  generatedBy: "1.0.0"
---

Scaffold a typed Dataverse data hook using generated services.

**Prompt**: [codeapp-dataverse-query.prompt.md](../../prompts/codeapp-dataverse-query.prompt.md)

**Related skills**:
- [codeapp-deploy](../codeapp-deploy/SKILL.md) — Deploy the app after adding data hooks

**Prerequisites**:
```bash
npx power-apps add-data-source --apiId shared_commondataserviceforapps --table <tablename>
```

**Generates**:
- `src/hooks/use<Entity>.ts` — custom hook calling the generated service

**Patterns used** (from [microsoft/PowerAppsCodeApps](https://github.com/microsoft/PowerAppsCodeApps)):
- Generated services (`ContactsService.getAll()`) — never raw fetch
- `IGetAllOptions`: `select`, `filter`, `orderBy`, `top`, `maxPageSize`, `skipToken`
- `IOperationResult<T>`: check `result.data` and `result.success`
- Three-level error handling (service → hook state → console)
- Lookup fields: `_<field>_value` for reading, `@odata.bind` for writing

**Usage**:
```
/codeapp:dataverse-query active contacts with email and phone sorted by name
/codeapp:dataverse-query top 10 accounts with revenue over 1M
```
