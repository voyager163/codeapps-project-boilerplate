# Power Platform Code Apps Skills

Custom GitHub Copilot skills for Power Apps Full Code App development (React 19 + Vite + Dataverse).

## Available Skills

| Skill | Command | Description |
|-------|---------|-------------|
| Dataverse Query | `/powerapp:dataverse-query` | Scaffold a typed TanStack Query hook for Dataverse reads |

## Stack

- **Runtime**: Power Platform Code Apps host
- **Framework**: React 19 + Vite
- **Data**: Dataverse Web API (OData v4)
- **State**: TanStack Query v5
- **Language**: TypeScript (strict)

## Adding New Skills

Each skill file follows the 4-part anatomy:
1. **Header** — YAML frontmatter with `description`
2. **Persona** — Who the AI acts as
3. **Execution Rules** — Absolute constraints
4. **Output Format** — Exact deliverable structure

Place new `.prompt.md` files in this folder and they'll be available as Copilot commands.