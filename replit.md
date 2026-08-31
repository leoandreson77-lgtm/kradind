# KRADIND Adventures

A premium trekking discovery and booking experience for finding curated escapes, checking live trail conditions, and requesting a departure.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/kradind-adventures/src/pages/home.tsx` — discovery homepage and trek matcher
- `artifacts/kradind-adventures/src/pages/trek-detail.tsx` — trek detail, itinerary, gear, and booking flow
- `artifacts/api-server/src/lib/travel-data.ts` — curated trek and live trail data
- `artifacts/api-server/src/routes/` — typed trek, radar, and booking endpoints
- `lib/api-spec/openapi.yaml` — source of truth for API contracts

## Architecture decisions

- The frontend is a React + Vite artifact served at `/`, while the shared Express service owns `/api`.
- OpenAPI is the contract source; React Query hooks and Zod validators are generated from it.
- Travel catalog and radar responses are kept in a shared server-side data module for a fast first release and easy replacement with persistent storage.
- The booking flow validates against the API contract and returns a confirmation state without exposing payment credentials.

## Product

- Browse curated Himalayan escapes and filter by category or season.
- Use the two-step trek matcher to narrow down an adventure.
- Open a trek detail page with gallery, metrics, itinerary, safety, FAQs, departure batches, and gear add-ons.
- Submit a traveller booking request and view live trail radar conditions.

## User preferences

- Brand direction: deep forest green, sunset orange, slate neutrals, alpine teal, Plus Jakarta Sans headings, and Inter body copy.

## Gotchas

- Artifact builds require the workflow-provided `PORT` and `BASE_PATH` values when invoked manually.
- Regenerate the API client after changing `lib/api-spec/openapi.yaml`.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
