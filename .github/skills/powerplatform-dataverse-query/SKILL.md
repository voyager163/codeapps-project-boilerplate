# Skill: powerapp-dataverse-query

Scaffolds a fully typed Dataverse query hook using TanStack Query v5 for Power Apps Code Apps (React 19 + Vite).

## What it generates

- A TypeScript entity interface (`src/types/<entity>.ts`)
- A TanStack Query custom hook (`src/hooks/use<Entity>Query.ts`)

## Constraints enforced

- Uses Power Platform runtime fetch (no Axios, no third-party clients)
- Correct OData v4 headers on every request
- No manual auth token management
- Explicit `$select` (never fetches all columns)
- Read-only (no mutations)

## Usage

```
/powerapp:dataverse-query active accounts with name and revenue sorted by revenue desc
```
