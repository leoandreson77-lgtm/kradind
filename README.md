# KRADIND Adventures — Curated Himalayan Expeditions & Escapes

A premium trekking discovery and booking platform for exploring Himalayan escapes, checking live trail conditions, and booking guided departures.

## Features

- **Trek Discovery**: Filter by duration, difficulty, season, and terrain (Weekend, High Altitude, Monsoon, Snow).
- **Interactive Trek Matcher**: Custom multi-step wizard to pair adventurers with ideal trails based on preference and fitness level.
- **Live Trail Radar**: Real-time trail weather, status alerts, temperature monitors, and region conditions.
- **Detailed Itineraries & Gear Guides**: Interactive day-by-day trek breakdown, altitude graphs, gear add-on selections, and departure batch bookings.

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Wouter, Lucide Icons, React Query
- **Backend Service**: Node.js, Express, TypeScript
- **Database / Schema**: PostgreSQL, Drizzle ORM, Zod validation
- **Architecture**: Workspace structure with modular API contracts and type-safe endpoints

## Getting Started

### Prerequisites
- Node.js 20+
- pnpm 9+

### Quick Start

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Start the API server & frontend in development mode:
   ```bash
   pnpm --filter @workspace/api-server run dev
   ```

3. Typecheck across workspace:
   ```bash
   pnpm run typecheck
   ```

4. Build production assets:
   ```bash
   pnpm run build
   ```

## Project Layout

- `artifacts/kradind-adventures/` — Main frontend application source (React + Vite)
- `artifacts/api-server/` — Express backend service providing trek & radar APIs
- `lib/api-spec/` — OpenAPI specification and generated hooks/types
- `lib/db/` — Database schemas and Drizzle migrations

## License
Copyright © 2026 KRADIND Adventures. All rights reserved.
