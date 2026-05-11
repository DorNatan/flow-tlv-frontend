# Flow TLV — Frontend (Standalone)

Real-time urban mobility platform for Tel Aviv. Standalone React + Vite frontend, ready to deploy to Vercel.

All data is mocked client-side (no backend required).

## Run locally

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

The build output is written to `dist/`.

## Environment

Create a `.env` file (copy from `.env.example`):

```
VITE_GOOGLE_MAPS_API_KEY=your_key_here
```

The Live Traffic Map page uses Google Maps. Without a key it shows a friendly placeholder; the rest of the app works without it.

## Deploy to Vercel

1. Push this folder to a Git repo.
2. Import the repo on Vercel.
3. Vercel auto-detects Vite (build command `npm run build`, output `dist`).
4. Add `VITE_GOOGLE_MAPS_API_KEY` under Project Settings → Environment Variables.
5. Deploy.

`vercel.json` includes the SPA rewrite so deep links (e.g. `/incidents`) work.

## Stack

- React 19 + Vite 7
- TypeScript 5.9
- Tailwind CSS 4 + shadcn/ui (Radix primitives)
- TanStack Query 5 (with in-memory mock data layer in `src/lib/mock-api.ts`)
- wouter (routing)
- Recharts (charts)
- Google Maps JS (live traffic map)
- Hebrew + English with full RTL support

## Pages

- `/` — Map dashboard with city pulse and live congestion
- `/live-map` — Google Maps live traffic with Tel Aviv mask
- `/incidents` — Incident feed with filters
- `/roadblocks` — Active roadblocks table
- `/events` — Upcoming city events
- `/parking` — Parking zone occupancy
- `/control` — Operations control center

## Replacing the mock data layer with a real API

All data hooks live in `src/lib/mock-api.ts` and follow the React Query pattern. To wire a real backend, swap each `queryFn`/`mutationFn` body with a `fetch` call — the hook signatures consumed by the pages don't need to change.
