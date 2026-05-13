## Context

The codespec initializer scaffolds Power Apps code app projects from `templates/`. Currently it copies three overlays:

1. `templates/starter/` → project root (Vite + React + TS app)
2. `templates/github/` → `.github/` (Copilot prompts, skills, CI workflows)
3. `templates/openspec/config.yaml` → `openspec/config.yaml`

This gives generated projects GitHub Copilot OPSX support only. Claude Code has no commands, and the 6 codeapps skills (architect, alm-engineer, app-scaffolder, connector-integrator, dataverse-specialist, env-vars-specialist) are absent from templates entirely.

The root repo has working examples of both configurations:
- `.claude/commands/opsx/*.md` — Claude Code OPSX commands that read `.github/prompts/opsx-*.prompt.md`
- `.claude/commands/codeapps/*.md` — Claude Code codeapps commands that read `.powerplatform/*/SKILL.md`
- `.github/prompts/codeapps-*.prompt.md` — Copilot prompts using `#file:` references to `.powerplatform/*/SKILL.md`

## Goals / Non-Goals

**Goals:**
- Generated projects work with both Claude Code and GitHub Copilot out of the box
- Both OPSX and codeapps skill sets are available in both tools
- Single source of truth is maintained (SKILL.md for codeapps, prompt files for OPSX)
- The CLI scaffolding flow remains simple and non-interactive for tool choice

**Non-Goals:**
- Making tool support configurable or selectable (both always ship)
- Creating new skill content (reuse existing SKILL.md and prompt files verbatim)
- Adding support for other AI tools (Codex, Cursor, etc.) in this change
- Modifying the OPSX or codeapps skill content itself

## Decisions

### Decision 1: Two new template overlay directories

Add `templates/claude/` and `templates/powerplatform/` alongside the existing `templates/github/`. Each maps to a dotfile directory in the generated project:

| Template source | Target in generated project |
|---|---|
| `templates/claude/` | `.claude/` |
| `templates/powerplatform/` | `.powerplatform/` |

**Rationale:** Follows the same pattern as `templates/github/` → `.github/`. Each AI tool's config lives in its own template directory, making it clear what ships where.

**Alternative considered:** Putting everything under `templates/starter/` with dotfile names. Rejected because the starter template is the app itself — tool configs are overlays applied after scaffolding, same as the GitHub overlay.

### Decision 2: Claude Code commands reference prompt files (not inline content)

The Claude Code command files for OPSX will contain:
```
Read the file '.github/prompts/opsx-<name>.prompt.md' and follow its instructions.

$ARGUMENTS
```

The codeapps commands will contain:
```
Read the file '.powerplatform/<name>/SKILL.md' and follow its instructions.

$ARGUMENTS
```

**Rationale:** Maintains single source of truth. Content is authored once (in prompt files or SKILL.md) and referenced by both tools. Updates to skill content don't require touching Claude Code command files.

### Decision 3: Copy functions follow existing pattern

Two new functions in `create-codespec.js`:
- `copyClaudeOverlay(templateRoot, targetPath)` — copies `templates/claude/` to `.claude/`
- `copyPowerPlatformOverlay(templateRoot, targetPath)` — copies `templates/powerplatform/` to `.powerplatform/`

Both use `fs.cpSync` with `force: true` (same as `copyGithubOverlay`) and run after the starter copy.

### Decision 4: Codeapps skill files copied verbatim from root

The `.powerplatform/*/SKILL.md` files in the root repo are the authoritative source. The template versions at `templates/powerplatform/*/SKILL.md` will be identical copies. Same for `templates/github/prompts/codeapps-*.prompt.md` and `templates/claude/commands/`.

**Rationale:** Keeps things simple. The root files serve this repo's own development; the template files serve generated projects. Both need identical content.

## Risks / Trade-offs

- **Content drift** — Template skill files could diverge from root files over time. → Mitigation: The verification script can assert template files match root files, or a future change can deduplicate.
- **Template size increase** — Adding ~29 small markdown files is negligible.
- **Codeapps skills may not apply to all projects** — Every generated project gets Power Apps codeapps skills even if not needed. → Accepted trade-off: this is a Power Apps code app scaffolder, so the skills are always relevant.
