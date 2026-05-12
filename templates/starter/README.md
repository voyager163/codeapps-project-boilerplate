# Power Apps Template - starter

An opinionated **Vite + TypeScript + React** starter template for building Power Apps code apps.

Designed for common app scenarios, easy extensibility, and minimal setup.

---

## Highlights

- **Modern tooling** - Vite, TypeScript, and React
- **Out-of-box styling** - Tailwind, shadcn/ui components, and theming out of the box
- **Batteries included** - Curated libraries pre-wired for common scenarios
- **Standard patterns** - Industry standard patterns and practices
- **Agent friendly** - Optimized for use with coding agents

---

## Pre-installed libraries

- [Tailwind CSS](https://tailwindcss.com/) - utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - pre-installed UI components
- [React Router](https://reactrouter.com/) - pages, routing
- [Zustand](https://zustand.docs.pmnd.rs/) - state management
- [Tanstack Query](https://tanstack.com/query/latest) - data fetching, state management
- [Tanstack Table](https://tanstack.com/table/latest) - interactive tables, datagrids
- [Lucide](https://lucide.dev/) - icons

## Quality scripts

- `npm run lint` - run ESLint with zero warnings allowed
- `npm run format:check` - check Prettier formatting
- `npm run test:run` - run Vitest unit tests once
- `npm run test:coverage` - run Vitest once with v8 coverage and 80 percent overall thresholds
- `npm run coverage:changed` - check changed source files against the 80 percent line coverage gate
- `npm run e2e` - run Playwright browser tests

Generated projects include GitHub Actions workflows under `.github/workflows/` for GHAS CodeQL and Dependency Review checks, free quality checks, Semgrep OSS, npm audit, and OpenSSF Scorecard. Enable Secret Scanning and Push Protection in GitHub Settings > Code security; these GHAS features are repository settings and are not configured in workflow YAML. Container scanning is not included because this starter does not use containers.

Before running Playwright tests for the first time, install the browser binaries:

```bash
npx playwright install
```
