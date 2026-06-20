'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { motion } from 'framer-motion'
import { Calendar, ChevronRight, Trophy, TrendingUp, Sparkles, ArrowRight } from 'lucide-react'
import MatchCard from '@/components/ui/MatchCard'
import StandingsTable from '@/components/ui/StandingsTable'
import { MatchData, StandingTable } from '@/lib/types'
import { isLive, getStageLabel } from '@/lib/utils'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

function getTodayMatches(matches: MatchData[]): MatchData[] {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  return matches.filter((m) => {
    const d = new Date(m.utcDate)
    return d >= today && d < tomorrow
  })
}

function getUpcomingMatches(matches: MatchData[]): MatchData[] {
  const now = new Date()
  return matches
    .filter((m) => ['SCHEDULED', 'TIMED'].includes(m.status))
    .slice(0, 6)
}

function getLiveMatches(matches: MatchData[]): MatchData[] {
  return matches.filter((m) => isLive(m.status))
}

export default function HomePage() {
  const [showAllGroups, setShowAllGroups] = useState(false)

  const { data: matchesData, isLoading: matchesLoading } = useSWR<{ matches: MatchData[] }>(
    '/api/matches',
    fetcher,
    { refreshInterval: 60000 }
  )

  const { data: standingsData } = useSWR<{ standings: StandingTable[] }>(
    '/api/standings',
    fetcher,
    { refreshInterval: 120000 }
  )

  const matches = matchesData?.matches ?? []
  const standings = standingsData?.standings ?? []

  const liveMatches = getLiveMatches(matches)
  const todayMatches = getTodayMatches(matches)
  const upcoming = getUpcomingMatches(matches)

  const heroMatch = liveMatches[0] || todayMatches[0] || upcoming[0]

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-surface to-surface/50 p-8"
        >
          <div className="absolute -left-20 -top-20 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -right-20 -bottom-20 h-40 w-40 rounded-full bg-gold/5 blur-3xl" />
          <div className="relative z-10">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-gold/30 to-gold/10 ring-1 ring-gold/20">
                <Trophy size={16} className="text-gold" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-gold">
                  FIFA World Cup 2026
                </span>
                <p className="text-[10px] text-text-muted">United States · Canada · Mexico</p>
              </div>
              {liveMatches.length > 0 && (
                <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-live-red/30 bg-live-red/10 px-3 py-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-live-red opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-live-red shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-live-red">
                    {liveMatches.length} Live
                  </span>
                </span>
              )}
            </div>

            {heroMatch ? (
              <div className="flex flex-col items-center gap-5">
                <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-text-secondary">
                  {getStageLabel(heroMatch.stage)}
                  {heroMatch.group ? ` · ${heroMatch.group}` : ''}
                  {heroMatch.matchday ? ` · Matchday ${heroMatch.matchday}` : ''}
                </span>
                <div className="w-full max-w-xl">
                  <MatchCard match={heroMatch} index={0} />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 py-12">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-raised ring-1 ring-border">
                  <Calendar size={28} className="text-text-muted" />
                </div>
                <p className="text-sm text-text-secondary">
                  No matches scheduled. Check back for live action.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </section>

      {/* Today's Matches */}
      {todayMatches.length > 1 && (
        <section>
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/15">
                <Calendar size={13} className="text-primary-light" />
              </div>
              <h2 className="text-sm font-bold font-display uppercase tracking-wider text-text-primary">
                Today&apos;s Matches
              </h2>
              <span className="rounded-full bg-surface-raised px-2 py-0.5 text-[9px] font-semibold text-text-muted">
                {todayMatches.length}
              </span>
            </div>
            <a
              href="/matches"
              className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-gold transition-colors hover:text-gold-bright"
            >
              View All <ChevronRight size={12} />
            </a>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {todayMatches.slice(0, 6).map((match, i) => (
              <MatchCard key={match.id} match={match} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Upcoming Matches */}
      {upcoming.length > 0 && (
        <section>
          <div className="mb-5 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gold/15">
              <TrendingUp size={13} className="text-gold" />
            </div>
            <h2 className="text-sm font-bold font-display uppercase tracking-wider text-text-primary">
              Upcoming Matches
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.slice(0, 6).map((match, i) => (
              <MatchCard key={match.id} match={match} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Group Standings Preview */}
      {standings.length > 0 && (
        <section>
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gold/15">
                <Sparkles size={13} className="text-gold" />
              </div>
              <h2 className="text-sm font-bold font-display uppercase tracking-wider text-text-primary">
                Group Standings
              </h2>
            </div>
            <button
              onClick={() => setShowAllGroups(!showAllGroups)}
              className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-gold transition-colors hover:text-gold-bright"
            >
              {showAllGroups ? 'Show Less' : 'Show All'}
              <ArrowRight size={12} />
            </button>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {(showAllGroups ? standings : standings.slice(0, 4)).map((st) => (
              <StandingsTable
                key={st.group || st.stage}
                groupName={st.group || st.stage}
                entries={st.table}
              />
            ))}
          </div>
        </section>
      )}

      {/* Loading State */}
      {matchesLoading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-xl border border-border bg-surface p-5">
              <div className="skeleton-pulse mb-3 h-3 w-24 rounded" />
              <div className="flex items-center gap-3">
                <div className="skeleton-pulse h-8 w-8 shrink-0 rounded-full" />
                <div className="skeleton-pulse h-4 flex-1 rounded" />
                <div className="skeleton-pulse h-8 w-16 shrink-0 rounded" />
                <div className="skeleton-pulse h-4 flex-1 rounded" />
                <div className="skeleton-pulse h-8 w-8 shrink-0 rounded-full" />
              </div>
              <div className="skeleton-pulse mt-3 h-3 w-full rounded" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
