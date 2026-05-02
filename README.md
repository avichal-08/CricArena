# CricArena

<div align="center">

### The Premier Fantasy Cricket Platform for IPL 2026

**Build squads. Create lobbies. Climb the global leaderboard.**

[Live Link](https://cricarena.app) · [How It Works](https://cricarena.app/how-it-works) · [Report a Bug](https://github.com/yourusername/cricarena/issues) · [Request a Feature](https://github.com/yourusername/cricarena/issues)

</div>

---

## Overview

CricArena is a full-stack fantasy cricket platform built for IPL enthusiasts. Players select squads of 12 from real match rosters, compete in private or public lobbies, and earn points based on live match performance — all powered by a role-based scoring engine.

Whether you're running a college league, a friends group, or an open public arena, CricArena gives you the infrastructure to compete at any scale.

---

## Screenshots

<table>
  <tr>
    <td align="center"><b>Landing Page</b></td>
    <td align="center"><b>Dashboard</b></td>
  </tr>
  <tr>
    <td><img src="./public/landing.png" width="540" /></td>
    <td><img src="./public/dashboard.png" width="540" /></td>
  </tr>
  <tr>
    <td align="center"><b>Squad Builder</b></td>
    <td align="center"><b>Leaderboard</b></td>
  </tr>
  <tr>
    <td><img src="./public/squadBuilder.png" width="540" /></td>
    <td><img src="./public/leaderboard.png" width="540" /></td>
  </tr>
</table>

---

## Features

**Core Gameplay**
- Squad builder with 12-player selection, enforced role diversity (BAT · BOWL · AR · WK), and per-team caps of 7
- Match mode (single fixture) and Tournament mode (full IPL season point accumulation)
- Automatic squad validation — incomplete or invalid lineups cannot be submitted

**Lobbies**
- Private arenas with admin approval flow and member management
- Public arenas with instant-join for open competition
- Copy-to-clipboard invite link sharing
- Join request accept / reject controls for admins

**Scoring Engine**
- Admin-injected JSON scorecards trigger automatic point calculation
- Batting: runs (+1), fours (+1 bonus), sixes (+2 bonus), milestones at 30 / 50 / 100
- Bowling: wickets (+25 each), haul bonuses at 3 / 4 / 5 wickets, maiden overs (+12)
- Strike rate modifier: −6 to +6 based on batting SR (applied at 10+ balls)
- Economy rate modifier: −6 to +6 based on bowling ER (applied at 2+ overs)
- Catches scored at +8 each; 3+ catches in a match earns an additional +4

**Leaderboards**
- Per-lobby live standings updated on every score injection
- Global all-time leaderboard across all users and matches
- Personal player profile with lifetime points, highest score, and full match ledger

**Auth & Roles**
- Google OAuth via NextAuth.js — one-click sign-in, no passwords
- User roles: `user` and `admin`
- Admin panel for match score processing with match selection and JSON input

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2 (App Router) |
| Language | TypeScript 5.x |
| Styling | Tailwind CSS 4.x |
| UI Primitives | shadcn/ui · Radix UI · lucide-react |
| ORM | Drizzle ORM 0.45 |
| Database | PostgreSQL via Neon Serverless |
| Auth | NextAuth.js 4.x with DrizzleAdapter |
| Runtime | Bun |
| Deployment | Vercel (recommended) |

---

## Project Structure

```
cricarena/
├── app/
│   ├── (dashboard)/              # Authenticated dashboard routes
│   │   ├── global-leaderboard/   # Global rankings page
│   │   ├── home/                 # Main dashboard
│   │   └── matches/              # All fixtures + match detail pages
│   ├── admin/
│   │   └── scoring/              # Admin score injection panel
│   ├── api/
│   │   ├── auth/[...nextauth]/   # NextAuth handler
│   │   └── lobby/                # Lobby CRUD + member management APIs
│   ├── how-it-works/             # Marketing: how it works page
│   ├── lobby/
│   │   ├── [lobbyId]/            # Lobby dashboard + squad builder
│   │   ├── active/               # Active lobbies list
│   │   ├── create/               # Create lobby flow
│   │   ├── past/                 # Past lobbies
│   │   └── public/               # Public arenas directory
│   ├── profile/                  # User stats + match history
│   ├── signin/                   # Sign-in page
│   └── page.tsx                  # Landing page
├── actions/
│   ├── ProcessMatchScores.ts     # Server action: score injection + calculation
│   └── SquadBuilder.ts           # Server action: squad save + validation
├── components/
│   ├── ui/                       # shadcn-style primitives
│   ├── SideBar.tsx               # Responsive nav sidebar
│   ├── SquadBuilder.tsx          # Interactive squad selection UI
│   ├── LobbyDashboardClient.tsx  # Tabbed lobby overview
│   ├── GlobalLeaderboardClient.tsx
│   ├── Leaderboard.tsx
│   ├── MembersList.tsx
│   ├── RequestsList.tsx
│   └── ...
├── drizzle/
│   └── src/
│       ├── db/schema.ts          # Full database schema
│       └── index.ts              # Neon connection pool
├── lib/
│   ├── configs/authOptions.ts    # NextAuth configuration
│   ├── CreateLobby.ts            # Lobby creation transaction
│   └── utils.ts                  # cn() utility
├── scripts/                      # One-time DB seed scripts
│   ├── create-tournament.ts
│   ├── create-team.ts
│   ├── create-player.ts
│   ├── create-match.ts
│   └── set-admin.ts
├── types/                        # Shared TypeScript types
├── utils/                        # Pure utility functions
├── data/
│   ├── schedule.json             # IPL 2026 match schedule
│   └── squads.json               # All team + player rosters
└── drizzle.config.ts
```

---

## Database Schema

```
users          → id, name, email, image, role (user | admin)
accounts       → OAuth account linking (NextAuth)
tournaments    → id, name, startDate, endDate
teams          → id, name, shortName, logoUrl
players        → id, name, teamId, role, playingStyle
matches        → id, tournamentId, teamAId, teamBId, startTime, isAbandoned
lobbies        → id, name, type, mode, tournamentId, matchId, createdBy
lobbyMembers   → id, lobbyId, userId, role, status (pending|accepted|rejected)
matchEntries   → id, userId, lobbyId, matchId, teamSelection[], prePredictions{}, score
```

---

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) >= 1.0 or Node.js >= 20
- A [Neon](https://neon.tech) PostgreSQL database
- A Google OAuth app ([console.cloud.google.com](https://console.cloud.google.com))

### 1. Clone and install

```bash
git clone https://github.com/yourusername/cricarena.git
cd cricarena
bun install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Fill in `.env`:

```env
# Database
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here-generate-with-openssl-rand-base64-32

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

> **Generate NEXTAUTH_SECRET:**
> ```bash
> openssl rand -base64 32
> ```

### 3. Push the database schema

```bash
bun drizzle-kit push
```

### 4. Seed the database

Run each seed script in order:

```bash
# 1. Create the IPL 2026 tournament
bun tsx scripts/create-tournament.ts

# 2. Create all 10 IPL franchises
bun tsx scripts/create-team.ts

# 3. Seed all player rosters (~240 players)
bun tsx scripts/create-player.ts

# 4. Seed the full match schedule (50 fixtures)
bun tsx scripts/create-match.ts
```

### 5. Set yourself as admin

Edit `scripts/set-admin.ts` and replace the email:

```ts
const SetAdminEmails = ["your-email@gmail.com"];
```

Then run:

```bash
bun tsx scripts/set-admin.ts
```

### 6. Start the development server

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables Reference

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | Neon PostgreSQL connection string |
| `NEXTAUTH_URL` | ✅ | Full URL of your app (e.g. `http://localhost:3000`) |
| `NEXTAUTH_SECRET` | ✅ | Random secret for JWT encryption |
| `GOOGLE_CLIENT_ID` | ✅ | Google OAuth 2.0 client ID |
| `GOOGLE_CLIENT_SECRET` | ✅ | Google OAuth 2.0 client secret |

---

## Google OAuth Setup

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services → Credentials**
4. Click **Create Credentials → OAuth 2.0 Client IDs**
5. Set Application Type to **Web application**
6. Add Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)
7. Copy the **Client ID** and **Client Secret** into your `.env`

---

## Scoring System

### Batting

| Metric | Points |
|---|---|
| Per run scored | +1 |
| Boundary (4) | +1 bonus |
| Six (6) | +2 bonus |
| 30+ runs | +4 milestone |
| 50+ runs | +8 milestone |
| Century (100+) | +16 milestone |

### Bowling

| Metric | Points |
|---|---|
| Per wicket | +25 |
| 3-wicket haul | +4 bonus |
| 4-wicket haul | +8 bonus |
| 5-wicket haul | +16 bonus |
| Maiden over | +12 |
| Per catch | +8 |
| 3+ catches | +4 additional |

### Strike Rate Modifier *(10+ balls faced)*

| SR Range | Points |
|---|---|
| > 170 | +6 |
| 150 – 170 | +4 |
| 130 – 150 | +2 |
| 70 – 130 | 0 |
| 60 – 70 | −2 |
| 50 – 60 | −4 |
| < 50 | −6 |

### Economy Rate Modifier *(2+ overs bowled)*

| ER Range | Points |
|---|---|
| < 5 | +6 |
| 5 – 6 | +4 |
| 6 – 7 | +2 |
| 7 – 10 | 0 |
| 10 – 11 | −2 |
| 11 – 12 | −4 |
| > 12 | −6 |

---

## Score Injection (Admin)

After a match ends, navigate to `/admin/scoring` and paste a JSON scorecard:

```json
[
  {
    "playerName": "Virat Kohli",
    "runs": 82,
    "ballsFaced": 53,
    "fours": 6,
    "sixes": 4,
    "wickets": 0,
    "oversBowled": 0,
    "runsConceded": 0,
    "maidens": 0,
    "catches": 1
  },
  {
    "playerName": "Jasprit Bumrah",
    "runs": 0,
    "ballsFaced": 0,
    "fours": 0,
    "sixes": 0,
    "wickets": 3,
    "oversBowled": 4.0,
    "runsConceded": 21,
    "maidens": 1,
    "catches": 0
  }
]
```

> **Overs format:** Use standard cricket decimal notation. `3.5` = 3 complete overs + 5 extra balls (23 total balls). Economy rate is computed automatically.

Player names are matched case-insensitively against the database. Unmatched names are silently skipped. All lobby entries for that match are updated in a single pass.

---

## Deployment

### Vercel (Recommended)

```bash
bun run build
vercel deploy
```

Set all environment variables in the Vercel project dashboard under **Settings → Environment Variables**.

### Self-hosted

```bash
bun run build
bun run start
```

Ensure `DATABASE_URL`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, and both Google OAuth variables are set in your production environment.

---

## Available Scripts

```bash
bun dev                          # Start development server
bun build                        # Build for production
bun start                        # Start production server
bun lint                         # Run ESLint

bun drizzle-kit push             # Push schema to database
bun drizzle-kit studio           # Open Drizzle Studio (DB GUI)
bun drizzle-kit generate         # Generate migration files

bun tsx scripts/create-tournament.ts
bun tsx scripts/create-team.ts
bun tsx scripts/create-player.ts
bun tsx scripts/create-match.ts
bun tsx scripts/set-admin.ts
```

---

## Roadmap

- [ ] Predictions system (toss, top scorer, POTM) with bonus points
- [ ] Push notifications for match deadlines and score updates
- [ ] In-lobby chat
- [ ] Player performance history and form indicators
- [ ] Multiple concurrent tournament support
- [ ] Mobile app (React Native)
- [ ] Automated scorecard ingestion via cricket data API
- [ ] Sub-lobbies / group stages within large tournaments

---

## Contributing

Contributions are welcome. Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to your branch: `git push origin feat/your-feature`
5. Open a Pull Request against `main`

Please ensure your code passes `bun lint` before submitting.

--- 

## License

This project is licensed under the **Creative Commons Attribution-NonCommercial 4.0 International License** (CC BY-NC 4.0).

You are free to:
* **Share:** Copy and redistribute the material in any medium or format.
* **Adapt:** Remix, transform, and build upon the material.

Under the following terms:
* **Attribution:** You must give appropriate credit, provide a link to the license, and indicate if changes were made.
* **NonCommercial:** You may **not** use the material for commercial purposes (you cannot monetize this code or use it in a for-profit product).

See [`LICENSE`](./LICENSE) for details.

---

<div align="center">

Built with 🔥 for cricket fans everywhere.

**[live link](https://cricarena-sage.vercel.app/)** · **[X](https://x.com/Avichal_08)** · **[LinkedIn](https://www.linkedin.com/in/avichal-pandey-743310293/)**

</div>