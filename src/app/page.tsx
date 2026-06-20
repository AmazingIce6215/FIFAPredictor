'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { motion } from 'framer-motion'
import { Calendar, ChevronRight, Trophy, Clock, TrendingUp } from 'lucide-react'
import MatchCard from '@/components/ui/MatchCard'
import StandingsTable from '@/components/ui/StandingsTable'
import { MatchData, StandingTable, PredictionResult } from '@/lib/types'
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
    .slice(0, 5)
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
    <div className="space-y-10">
      {/* Hero Section */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass relative overflow-hidden rounded-2xl p-8"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-loss-blue/5" />
          <div className="relative z-10">
            <div className="mb-4 flex items-center gap-2">
              <Trophy size={18} className="text-gold" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-gold">
                FIFA World Cup 2026
              </span>
              {liveMatches.length > 0 && (
                <span className="ml-auto flex items-center gap-1.5 rounded-full bg-live-red/10 px-3 py-1">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-live-red opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-live-red" />
                  </span>
                  <span className="text-[10px] font-bold uppercase text-live-red">
                    {liveMatches.length} LIVE
                  </span>
                </span>
              )}
            </div>

            {heroMatch ? (
              <div className="flex flex-col items-center gap-6">
                <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                  {getStageLabel(heroMatch.stage)}
                  {heroMatch.group ? ` · ${heroMatch.group}` : ''}
                  {heroMatch.matchday ? ` · Matchday ${heroMatch.matchday}` : ''}
                </span>
                <MatchCard match={heroMatch} index={0} />
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 py-8">
                <Clock size={40} className="text-text-muted" />
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
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-gold" />
              <h2 className="text-base font-bold font-display uppercase tracking-wider text-text-primary">
                Today&apos;s Matches
              </h2>
            </div>
            <a
              href="/matches"
              className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-gold transition-colors hover:text-gold-bright"
            >
              View All <ChevronRight size={14} />
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
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-gold" />
            <h2 className="text-base font-bold font-display uppercase tracking-wider text-text-primary">
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
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy size={16} className="text-gold" />
              <h2 className="text-base font-bold font-display uppercase tracking-wider text-text-primary">
                Group Standings
              </h2>
            </div>
            <button
              onClick={() => setShowAllGroups(!showAllGroups)}
              className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-gold transition-colors hover:text-gold-bright"
            >
              {showAllGroups ? 'Show Less' : 'Show All'}
            </button>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
            <div key={i} className="glass rounded-xl p-5">
              <div className="skeleton-pulse mb-3 h-3 w-24 rounded" />
              <div className="flex items-center gap-3">
                <div className="skeleton-pulse h-8 w-8 rounded-full" />
                <div className="skeleton-pulse h-4 flex-1 rounded" />
                <div className="skeleton-pulse h-8 w-16 rounded" />
                <div className="skeleton-pulse h-4 flex-1 rounded" />
                <div className="skeleton-pulse h-8 w-8 rounded-full" />
              </div>
              <div className="skeleton-pulse mt-3 h-3 w-full rounded" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
