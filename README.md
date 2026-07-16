# Orbit 81

A space-themed mandalart (81-square) goal tracker: 1 core goal, 8 sub-goals, 64 actions.

**Live**: https://orbit81.vercel.app

![React](https://img.shields.io/badge/React-18-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-blue) ![Vite](https://img.shields.io/badge/Vite-5-purple)

## Demo

_Demo assets coming soon._

<!-- TODO(demo): hero — desktop 9x9 grid overview
     ![Orbit 81 grid](docs/demo-desktop.png) -->

<!-- TODO(demo): core loop GIF — checking an action, watching progress/rocket evolve
     ![Orbit 81 core loop](docs/demo-loop.gif) -->

<!-- TODO(demo): mobile screen
     ![Orbit 81 mobile](docs/demo-mobile.png) -->

## Features

- 9x9 mandalart grid: 1 core goal, 8 sub-goals, 64 actions
- Checking off actions fuels a rocket that evolves as your progress grows
- Hit 100% and watch the launch sequence play
- Guest mode: use it fully offline, no login required, data stays local

## Tech Stack

- React 18, TypeScript, Vite 5
- Tailwind CSS, shadcn/ui, framer-motion
- Supabase (Auth: Email + Google OAuth, `profiles` table with RLS)
- Deployed on Vercel

## How it works

Goal data (the grid, checkmarks, labels) lives in **localStorage**, isolated per user by key. Supabase is only used for **auth and profiles** (callsign, avatar) — none of your goal content touches the backend. Guest mode skips Supabase entirely and stores everything locally.

## Getting Started

```sh
npm i
npm run dev
```

The dev server runs at **http://localhost:8080** (overridden in `vite.config`, not Vite's default 5173).

### Environment variables

Create a `.env.local` (do not commit it):

| Variable | Description |
| --- | --- |
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable/anon key (safe to expose client-side; authorization is enforced by RLS, not by this key) |

## Deployment

```sh
vercel --prod
```

Deploys are done via the Vercel CLI. **A `git push` alone does not trigger a deploy** — run `vercel --prod` explicitly.

## Security

- Row Level Security (RLS) enforces per-user data access in Supabase
- `vercel.json` sets security headers: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`
