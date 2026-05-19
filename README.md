# Subway Fadya

Subway Fadya is a full-stack 3D endless runner built with Next.js 15 App Router, TypeScript, TailwindCSS, Three.js, React Three Fiber, Framer Motion, Zustand, React Hook Form, Zod, Prisma, Neon PostgreSQL, JWT auth, and Supabase Storage.

## Run locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and fill `DATABASE_URL`, `DIRECT_URL`, `JWT_SECRET`, and Supabase keys.
3. Run database setup:
   ```bash
   npm run db:generate
   npm run db:dev
   npm run db:seed
   ```
4. Start the app:
   ```bash
   npm run dev
   ```

Default seed login:
- `admin@subwayfadya.local` / `SubwayFadya!2026`
- `player@subwayfadya.local` / `SubwayFadya!2026`

## Supabase Storage

Create these buckets in Supabase Storage:
- `avatars`
- `skins`
- `game-assets`
- `player-uploads`
- `screenshots`

The upload layer validates image type, enforces a 3MB limit, compresses images to WebP, supports public URLs, and can return signed URLs for private bucket flows.

## Gameplay

Desktop controls:
- `A` or Left Arrow: move left
- `D` or Right Arrow: move right
- `Space`: jump
- `S` or Down Arrow: slide

Mobile controls:
- Swipe left/right/up/down.

The game includes procedural subway generation, three lanes, dynamic obstacles, coins, power-ups, combo scoring, lives, gravity-style jump/slide states, difficulty scaling, and server-side score validation.

## API Routes

Auth: `/api/auth/register`, `/api/auth/login`, `/api/auth/logout`, `/api/auth/reset-password`, `/api/auth/refresh`

Player: `/api/player/profile`, `/api/player/avatar`

Game: `/api/game/start`, `/api/game/end`, `/api/game/score`

Leaderboard: `/api/leaderboard`

Inventory: `/api/inventory`

Shop: `/api/shop`

Admin: `/api/admin/players`, `/api/admin/items`, `/api/admin/achievements`, `/api/admin/powerups`

## Production notes

Use Neon pooled `DATABASE_URL` with `pgbouncer=true` for runtime queries and `DIRECT_URL` for Prisma migrations. Set a long random `JWT_SECRET`. Deploy with `npm run build`, then `npm run db:migrate` against Neon.
# subway-fadya
# subway-fadya
