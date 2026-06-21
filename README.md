# WC26 Predictor — FIFA World Cup 2026 AI Predictions

AI-powered win probability predictions for every FIFA World Cup 2026 match, built with Next.js 14+ and deployed on Vercel.

## Tech Stack

- **Framework:** Next.js 14 (App Router, TypeScript strict)
- **Styling:** Tailwind CSS v3 + CSS custom properties
- **Animations:** Framer Motion
- **Data Fetching:** SWR with 60s polling for live matches
- **Icons:** Lucide React
- **Fonts:** Barlow Condensed (display), Inter (body)
- **AI:** Google Gemini API (gemini-2.0-flash)
- **APIs:** football-data.org, api-sports.io, TheSportsDB, flagcdn.com

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### API Keys

Register for free API keys:

| Service | URL | Env Variable |
|---------|-----|-------------|
| football-data.org | https://www.football-data.org/client/register | `FOOTBALL_DATA_API_KEY` |
| api-sports.io | https://dashboard.api-football.com/register | `API_SPORTS_KEY` |
| Google AI | https://aistudio.google.com/apikey | `GEMINI_API_KEY` |

### Installation

```bash
cp .env.local.example .env.local
# Edit .env.local with your API keys

npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── predict/route.ts      # POST — Groq AI prediction
│   │   ├── live/[matchId]/route.ts # GET — Live match + prediction
│   │   ├── matches/route.ts       # GET — All matches
│   │   ├── standings/route.ts     # GET — Group standings
│   │   ├── team/[id]/route.ts     # GET — Team details
│   │   └── player/[name]/route.ts # GET — Player data
│   ├── matches/[id]/page.tsx      # Match detail (core page)
│   ├── matches/page.tsx           # Match list
│   ├── teams/[id]/page.tsx        # Team profile
│   ├── teams/page.tsx             # Teams grid
│   ├── standings/page.tsx         # Group standings
│   ├── bracket/page.tsx           # Tournament bracket
│   ├── layout.tsx                 # Root layout with fonts/nav
│   └── page.tsx                   # Homepage
├── components/
│   ├── ui/                        # Reusable UI components
│   │   ├── ProbabilityBar.tsx
│   │   ├── LivePulse.tsx
│   │   ├── MatchCard.tsx
│   │   ├── TeamBadge.tsx
│   │   ├── PredictionCard.tsx
│   │   ├── StandingsTable.tsx
│   │   ├── FormBadge.tsx
│   │   ├── ProbabilityGauge.tsx
│   │   └── ConfidenceTag.tsx
│   └── layout/                    # Layout components
│       ├── Navbar.tsx
│       └── Footer.tsx
├── lib/
│   ├── types.ts                   # TypeScript interfaces
│   ├── utils.ts                   # Utility functions
│   ├── country-codes.ts           # 48-nation ISO + group map
│   ├── football-data.ts           # football-data.org wrapper
│   ├── api-sports.ts              # api-sports.io wrapper
│   ├── thesportsdb.ts             # TheSportsDB wrapper
│   └── groq-predict.ts            # Core AI prediction engine (Gemini)
├── hooks/
│   ├── useLiveMatch.ts            # SWR hook for live polling
│   └── usePrediction.ts           # SWR hook for predictions
└── app/globals.css                # CSS variables + Tailwind
```

## Features

- **Homepage** — Live match hero, today's matches, group standings preview
- **Match Detail** — AI prediction panel, live probability tracker, stats comparison, form guide
- **Matches** — Filterable list grouped by stage (Live / Today / Upcoming / Finished)
- **Teams** — 48-team grid with flag badges, filterable by group
- **Team Profile** — FIFA ranking, recent form, squad list
- **Standings** — All 12 groups with full W/D/L/GF/GA/GD/Pts
- **Bracket** — Knockout tournament visualization

## AI Prediction

The `/api/predict` route:

1. Fetches team form (last 10 matches), H2H record, season stats, and injuries
2. Builds a structured prompt with all context
3. Calls Gemini 2.0 Flash with JSON mode
4. Returns win/draw/loss probabilities, confidence, reasoning, and key factors

During live matches, predictions are regenerated every 60 seconds with live context.

## Deployment

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

Set environment variables in Vercel project settings.
