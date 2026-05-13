# Power Platform Code Apps — Copilot Skills

Custom GitHub Copilot skills for Power Apps Full Code App development.

## Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Power Platform Code Apps host |
| Framework | React 19 + Vite |
| Data | Dataverse Web API (OData v4) |
| State | TanStack Query v5 |
| Language | TypeScript (strict) |

## Available Skills

| Command | File | Description |
|---------|------|-------------|
| `/powerapp:dataverse-query` | `powerapp-dataverse-query.prompt.md` | Scaffold a typed read-only TanStack Query hook for Dataverse |

## Skill Anatomy

Every skill follows a strict 4-part structure:

1. **Header** — YAML frontmatter with `description`
2. **Persona** — Who the AI acts as
3. **Execution Rules** — Absolute constraints (no hallucination)
4. **Output Format** — Exact deliverable structure

## Adding a New Skill

1. Create `powerapp-<action>.prompt.md` in this folder
2. Follow the 4-part anatomy above
3. Update this README's table
4. Submit a PR for review
