'use client'

import { useState } from 'react'
import useSWR from 'swr'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Swords, Users, LayoutGrid, GitBranch, ChevronRight, Trophy, Clock, Activity } from 'lucide-react'
import { MatchData, StandingTable } from '@/lib/types'
import { isLive, getTeamFlagSrc, formatTime, formatDate, getStageLabel } from '@/lib/utils'

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

function MatchCard({ match, index = 0 }: { match: MatchData; index?: number }) {
  const live = isLive(match.status)
  const finished = match.status === 'FINISHED'
  const homeScore = match.score.fullTime.home
  const awayScore = match.score.fullTime.away

  return (
    <Link href={`/matches/${match.id}`} className="no-underline block group">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05, duration: 0.3 }}
        className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all cursor-pointer"
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {getStageLabel(match.stage)}{match.group ? ` · ${match.group}` : ''}
          </span>
          <div className="flex items-center gap-2">
            {live && (
              <span className="flex items-center gap-1 text-xs font-bold text-red-600">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                LIVE
              </span>
            )}
            {!live && (
              <span className="text-xs font-medium text-gray-400">
                {finished ? formatDate(match.utcDate) : formatTime(match.utcDate)}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 text-center">
            <Image
              src={getTeamFlagSrc(match.homeTeam)}
              alt={match.homeTeam.country || match.homeTeam.name}
              width={44}
              height={44}
              className="mx-auto mb-2 object-contain"
              unoptimized
            />
            <div className="text-sm font-semibold text-gray-900 leading-tight">
              {match.homeTeam.shortName || match.homeTeam.name}
            </div>
          </div>

          <div className="text-center shrink-0 px-2">
            {live || finished ? (
              <div className="text-3xl font-bold text-gray-900 tabular-nums tracking-tight">
                <span>{homeScore ?? '-'}</span>
                <span className="text-gray-300 text-2xl mx-1">:</span>
                <span>{awayScore ?? '-'}</span>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Clock size={16} className="text-gray-400 mb-1" />
                <span className="text-sm font-semibold text-gray-700 tabular-nums">
                  {formatTime(match.utcDate)}
                </span>
              </div>
            )}
          </div>

          <div className="flex-1 text-center">
            <Image
              src={getTeamFlagSrc(match.awayTeam)}
              alt={match.awayTeam.country || match.awayTeam.name}
              width={44}
              height={44}
              className="mx-auto mb-2 object-contain"
              unoptimized
            />
            <div className="text-sm font-semibold text-gray-900 leading-tight">
              {match.awayTeam.shortName || match.awayTeam.name}
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}

export default function HomePage() {
  const [showAllGroups, setShowAllGroups] = useState(false)

  const { data: matchesData, isLoading: matchesLoading } = useSWR<{ matches: MatchData[] }>(
    '/api/matches',
    fetcher,
    { refreshInterval: 60000 },
  )

  const { data: standingsData } = useSWR<{ standings: StandingTable[] }>(
    '/api/standings',
    fetcher,
    { refreshInterval: 120000 },
  )

  const matches = matchesData?.matches ?? []
  const standings = standingsData?.standings ?? []

  const liveMatches = getLiveMatches(matches)
  const todayMatches = getTodayMatches(matches)
  const upcoming = getUpcomingMatches(matches)

  const displayMatches =
    liveMatches.length > 0 ? liveMatches :
    todayMatches.length > 0 ? todayMatches :
    upcoming

  const sectionTitle =
    liveMatches.length > 0 ? 'Live Matches' :
    todayMatches.length > 0 ? "Today's Matches" :
    'Upcoming Matches'

  const navLinks = [
    { href: '/matches', label: 'Matches', icon: Swords },
    { href: '/teams', label: 'Teams', icon: Users },
    { href: '/standings', label: 'Standings', icon: LayoutGrid },
    { href: '/bracket', label: 'Bracket', icon: GitBranch },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3 no-underline">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-900 text-white">
                <Trophy size={16} />
              </div>
              <div>
                <div className="text-base font-bold text-blue-900 leading-tight">WC26</div>
                <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Predictor</div>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-blue-900 hover:bg-blue-50 transition-colors no-underline"
                >
                  <link.icon size={15} />
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              {liveMatches.length > 0 && (
                <Link
                  href="/matches"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 border border-red-200 no-underline"
                >
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-xs font-bold text-red-600 uppercase">{liveMatches.length} Live</span>
                </Link>
              )}
              <Link
                href="/matches"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-900 text-white text-sm font-semibold hover:bg-blue-800 transition-colors no-underline"
              >
                <Activity size={14} />
                Live
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Featured Section */}
        {displayMatches.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{sectionTitle}</h2>
                <p className="text-sm text-gray-500 mt-0.5">FIFA World Cup 2026 · AI Predictions</p>
              </div>
              <Link
                href="/matches"
                className="flex items-center gap-1 text-sm font-semibold text-blue-900 hover:text-blue-700 no-underline"
              >
                View All <ChevronRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayMatches.slice(0, 6).map((match, i) => (
                <MatchCard key={match.id} match={match} index={i} />
              ))}
            </div>
          </section>
        )}

        {/* Group Standings */}
        {standings.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Group Standings</h2>
              <button
                onClick={() => setShowAllGroups(!showAllGroups)}
                className="flex items-center gap-1 text-sm font-semibold text-blue-900 hover:text-blue-700"
              >
                {showAllGroups ? 'Show Less' : 'Show All'}
                <ChevronRight size={16} />
              </button>
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {(showAllGroups ? standings : standings.slice(0, 4)).map((st) => (
                <div key={st.group || st.stage} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                  <div className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">
                    {st.group || st.stage}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold text-gray-400 uppercase tracking-wider pb-2 border-b border-gray-100">
                      <span className="w-6" />
                      <span className="flex-1">Team</span>
                      <span className="w-6 text-center">P</span>
                      <span className="w-6 text-center">W</span>
                      <span className="w-6 text-center">D</span>
                      <span className="w-6 text-center">L</span>
                      <span className="w-7 text-center">Pts</span>
                    </div>
                    {st.table.map((entry) => (
                      <div key={entry.team.id} className="flex items-center justify-between py-2 text-sm border-b border-gray-50 last:border-0">
                        <span className="w-6 text-sm font-bold text-gray-400">{entry.position}</span>
                        <span className="flex-1 font-medium text-gray-800">{entry.team.shortName || entry.team.name}</span>
                        <span className="w-6 text-center text-gray-600">{entry.playedGames}</span>
                        <span className="w-6 text-center text-gray-600">{entry.won}</span>
                        <span className="w-6 text-center text-gray-600">{entry.draw}</span>
                        <span className="w-6 text-center text-gray-600">{entry.lost}</span>
                        <span className="w-7 text-center font-bold text-blue-900">{entry.points}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Loading State */}
        {matchesLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="skeleton-pulse mb-4 h-4 w-24 rounded" />
                <div className="flex items-center gap-4">
                  <div className="flex-1 text-center">
                    <div className="skeleton-pulse w-11 h-11 rounded-full mx-auto mb-2" />
                    <div className="skeleton-pulse h-4 w-20 mx-auto rounded" />
                  </div>
                  <div className="skeleton-pulse h-8 w-16 rounded" />
                  <div className="flex-1 text-center">
                    <div className="skeleton-pulse w-11 h-11 rounded-full mx-auto mb-2" />
                    <div className="skeleton-pulse h-4 w-20 mx-auto rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Trophy size={14} className="text-blue-900" />
              WC26 Predictor
            </div>
            <div className="text-xs text-gray-400">
              Data: football-data.org · api-sports.io · TheSportsDB
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
