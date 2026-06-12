# Calcify

A premium calculator platform with 28 calculators across 6 categories — Math, Finance, Health, Unit Conversion, Date & Time, and Statistics. Full-stack React + Vite frontend with Express API backend, PostgreSQL database, dark/light mode, history, favorites, and trending.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/calcify run dev` — run the frontend (auto-assigned port)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React 19 + Vite 7, Wouter routing, TanStack Query, shadcn/ui, Tailwind CSS v4
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/calcify/` — React/Vite frontend
  - `src/pages/` — page components (home, calculators, category, calculator, history, favorites, search)
  - `src/calculators/` — 28 calculator implementations (one file per calculator)
  - `src/components/` — shared components (layout, calculator-card, shadcn ui)
  - `src/lib/calculators.ts` — client-side calculator registry
- `artifacts/api-server/` — Express backend
  - `src/routes/` — API routes (calculators, history, favorites, stats, health)
  - `src/lib/calculators-registry.ts` — server-side static calculator data
- `lib/api-spec/openapi.yaml` — single source of truth for API contract
- `lib/api-client-react/` — generated React Query hooks and Zod schemas
- `lib/db/src/schema/` — Drizzle ORM schema (history, favorites, usage tables)

## Architecture decisions

- Contract-first API: OpenAPI spec → codegen → typed hooks and schemas used on both client and server
- Calculator implementations are pure React components with no server dependency — all math runs client-side
- History is saved via API after every calculation; favorites stored in DB per session
- The `calculators-registry.ts` on the server is the authoritative list; the client registry in `calculators.ts` mirrors it for offline/fast use
- Trending and recently-used are computed from the `usage` table on the server

## Product

- 28 free calculators across 6 categories, browsable by category or searchable
- Every calculation is saved to history; calculators can be bookmarked to favorites
- Home page shows featured/trending/recently-used calculators
- Dark/light mode toggle in the navbar

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Always run `pnpm --filter @workspace/api-spec run codegen` after changing the OpenAPI spec
- Always run `pnpm --filter @workspace/db run push` after changing the DB schema
- Do not run `pnpm dev` at workspace root — use `restart_workflow` instead

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
