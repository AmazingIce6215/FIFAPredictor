'use client'

import useSWR from 'swr'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Clock, BarChart3 } from 'lucide-react'
import { useLiveMatch } from '@/hooks/useLiveMatch'
import {
  isLive,
  getFlagUrl,
  formatDate,
  formatTime,
  getStageLabel,
} from '@/lib/utils'
import LivePulse from '@/components/ui/LivePulse'
import PredictionCard from '@/components/ui/PredictionCard'
import FormBadge from '@/components/ui/FormBadge'
import { MatchData } from '@/lib/types'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function MatchDetailPage({ params }: { params: { id: string } }) {
  const { data: matchData, isLoading: matchLoading } = useSWR<MatchData>(
    `/api/matches`,
    fetcher
  )

  const { data: predictData, isLoading: predictLoading } = useSWR(
    ['/api/predict', params.id],
    () =>
      fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matchId: params.id,
          homeTeamId: 0,
          awayTeamId: 0,
        }),
      }).then((r) => r.json()),
    { revalidateOnFocus: false, dedupingInterval: 300000 }
  )

  const { liveData, prediction: livePrediction } = useLiveMatch(
    isLive(matchData?.status ?? '') ? params.id : ''
  )

  const prediction = livePrediction || predictData?.prediction
  const match = matchData

  const isLoading = matchLoading || predictLoading

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="skeleton-pulse h-48 rounded-2xl" />
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="skeleton-pulse h-96 rounded-xl" />
          <div className="skeleton-pulse h-96 rounded-xl" />
        </div>
      </div>
    )
  }

  if (!match) {
    return (
      <div className="flex flex-col items-center gap-4 py-20">
        <p className="text-text-secondary">Match not found.</p>
      </div>
    )
  }

  const live = isLive(match.status)
  const finished = match.status === 'FINISHED'
  const homeScore = match.score.fullTime.home
  const awayScore = match.score.fullTime.away

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Match Header */}
      <div className="glass relative overflow-hidden rounded-2xl p-8">
        <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-loss-blue/5" />
        <div className="relative z-10">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                {getStageLabel(match.stage)}
                {match.group ? ` · ${match.group}` : ''}
                {match.matchday ? ` · Matchday ${match.matchday}` : ''}
              </span>
            </div>
            {live ? (
              <LivePulse status={match.status} minute={liveData?.minute} />
            ) : (
              <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                <Clock size={12} />
                {finished
                  ? formatDate(match.utcDate)
                  : `${formatDate(match.utcDate)} · ${formatTime(match.utcDate)}`}
              </div>
            )}
          </div>

          <div className="flex items-center justify-center gap-8 md:gap-16">
            <div className="flex flex-col items-center gap-3">
              <Image
                src={getFlagUrl(match.homeTeam.country)}
                alt={match.homeTeam.country}
                width={80}
                height={80}
                className="h-16 w-16 rounded object-contain md:h-20 md:w-20"
                unoptimized
              />
              <span className="text-lg font-bold font-display text-text-primary md:text-2xl">
                {match.homeTeam.name.toUpperCase()}
              </span>
            </div>

            <div className="flex flex-col items-center">
              {live || finished ? (
                <span className="text-5xl font-bold font-display text-text-primary tabular-nums md:text-7xl">
                  {homeScore ?? '-'}:{awayScore ?? '-'}
                </span>
              ) : (
                <div className="flex flex-col items-center gap-1">
                  <span className="text-3xl font-bold font-display text-gold md:text-4xl">
                    vs
                  </span>
                  <span className="text-xs font-semibold text-text-secondary">
                    {formatTime(match.utcDate)}
                  </span>
                </div>
              )}
              {live && (
                <div className="mt-2 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-live-red/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-live-red">
                    {liveData?.minute}&apos;
                  </span>
                  <span className="text-[10px] text-text-muted">
                    updating every 60s
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-col items-center gap-3">
              <Image
                src={getFlagUrl(match.awayTeam.country)}
                alt={match.awayTeam.country}
                width={80}
                height={80}
                className="h-16 w-16 rounded object-contain md:h-20 md:w-20"
                unoptimized
              />
              <span className="text-lg font-bold font-display text-text-primary md:text-2xl">
                {match.awayTeam.name.toUpperCase()}
              </span>
            </div>
          </div>


        </div>
      </div>

      {/* AI Prediction Panel + Stats */}
      {prediction && (
        <div className="grid gap-6 lg:grid-cols-2">
          <PredictionCard
            prediction={prediction}
            homeName={match.homeTeam.shortName || match.homeTeam.name}
            awayName={match.awayTeam.shortName || match.awayTeam.name}
          />

          <div className="glass rounded-xl p-6">
            <div className="mb-4 flex items-center gap-2">
              <BarChart3 size={16} className="text-gold" />
              <h3 className="text-sm font-bold font-display uppercase tracking-wider text-gold">
                Team Stats Comparison
              </h3>
            </div>

            <div className="space-y-4">
              <StatRow
                label="Goals Scored Avg"
                home={predictData?.homeTeam?.goalsFor ?? '1.5'}
                away={predictData?.awayTeam?.goalsFor ?? '1.2'}
                format="goals"
              />
              <StatRow
                label="Goals Conceded Avg"
                home={predictData?.homeTeam?.goalsAgainst ?? '0.8'}
                away={predictData?.awayTeam?.goalsAgainst ?? '1.1'}
                format="goals"
                reverse
              />
              <StatRow
                label="Clean Sheets"
                home={predictData?.homeTeam?.cleanSheets ?? 3}
                away={predictData?.awayTeam?.cleanSheets ?? 2}
                format="count"
              />
              <StatRow
                label="Shots per Game"
                home={predictData?.homeTeam?.shotsOnTarget ?? 12}
                away={predictData?.awayTeam?.shotsOnTarget ?? 10}
                format="count"
              />
              <StatRow
                label="Pass Accuracy"
                home={predictData?.homeTeam?.passAccuracy ?? 85}
                away={predictData?.awayTeam?.passAccuracy ?? 82}
                format="percent"
              />
              <StatRow
                label="Possession"
                home={predictData?.homeTeam?.possession ?? 52}
                away={predictData?.awayTeam?.possession ?? 48}
                format="percent"
              />
            </div>

            <div className="mt-6 rounded-lg bg-surface p-4">
              <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-gold">
                Key Players
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] font-semibold uppercase text-text-muted">
                    {match.homeTeam.shortName}
                  </span>
                  <ul className="mt-1 space-y-1">
                    {['Player A', 'Player B', 'Player C'].map((p, i) => (
                      <li key={i} className="text-xs text-text-secondary">{p}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="text-[10px] font-semibold uppercase text-text-muted">
                    {match.awayTeam.shortName}
                  </span>
                  <ul className="mt-1 space-y-1">
                    {['Player X', 'Player Y', 'Player Z'].map((p, i) => (
                      <li key={i} className="text-xs text-text-secondary">{p}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Live Events Timeline */}
      {live && liveData && (
        <div className="glass rounded-xl p-6">
          <div className="mb-4 flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-live-red opacity-60" style={{ animationDuration: '2s' }} />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-live-red shadow-[0_0_8px_rgba(229,62,62,0.6)]" />
            </span>
            <h3 className="text-sm font-bold font-display uppercase tracking-wider text-live-red">
              Live Events
            </h3>
            <span className="text-[10px] text-text-muted">· Auto-refreshing</span>
          </div>
          <div className="flex items-center justify-center py-8">
            <p className="text-xs text-text-secondary">
              Live events feed will appear here as match progresses.
            </p>
          </div>
          <div className="mt-2 text-right">
            <span className="text-[10px] text-text-muted">
              Last updated just now
            </span>
          </div>
        </div>
      )}

      {/* Form Guide */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="glass rounded-xl p-5">
          <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-gold">
            {match.homeTeam.shortName} — Recent Form
          </h4>
          <FormBadge results={['W', 'W', 'D', 'L', 'W']} />
        </div>
        <div className="glass rounded-xl p-5">
          <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-gold">
            {match.awayTeam.shortName} — Recent Form
          </h4>
          <FormBadge results={['D', 'W', 'L', 'W', 'D']} />
        </div>
      </div>
    </motion.div>
  )
}

function StatRow({
  label,
  home,
  away,
  format,
  reverse = false,
}: {
  label: string
  home: number | string
  away: number | string
  format: 'goals' | 'percent' | 'count'
  reverse?: boolean
}) {
  const h = typeof home === 'string' ? parseFloat(home) : home
  const a = typeof away === 'string' ? parseFloat(away) : away
  const total = h + a
  const homePct = total > 0 ? (h / total) * 100 : 50
  const awayPct = total > 0 ? (a / total) * 100 : 50

  const displayVal = (v: number) => {
    if (format === 'percent') return `${Math.round(v)}%`
    return v.toFixed(1)
  }

  return (
    <div>
      <div className="mb-1 flex justify-between text-[11px] text-text-secondary">
        <span>{displayVal(h)}</span>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
          {label}
        </span>
        <span>{displayVal(a)}</span>
      </div>
      <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-border">
        <motion.div
          className="h-full rounded-full"
          style={{
            backgroundColor: reverse ? 'var(--loss-blue)' : 'var(--win-green)',
            width: `${reverse ? awayPct : homePct}%`,
          }}
          initial={{ width: 0 }}
          animate={{ width: `${reverse ? awayPct : homePct}%` }}
          transition={{ duration: 0.5 }}
        />
        <motion.div
          className="h-full rounded-full"
          style={{
            backgroundColor: reverse ? 'var(--win-green)' : 'var(--loss-blue)',
            width: `${reverse ? homePct : awayPct}%`,
          }}
          initial={{ width: 0 }}
          animate={{ width: `${reverse ? homePct : awayPct}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  )
}
