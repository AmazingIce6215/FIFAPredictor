'use client'

import useSWR from 'swr'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Clock, BarChart3, Target } from 'lucide-react'
import { useLiveMatch } from '@/hooks/useLiveMatch'
import {
  isLive,
  getFlagUrl,
  formatDate,
  formatTime,
  getStageLabel,
  getCountryCode,
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
        <div className="skeleton-pulse h-56 rounded-2xl" />
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
      {/* Match Header Hero */}
      <div className={`relative overflow-hidden rounded-2xl border p-8 ${
        live
          ? 'border-red-500/30 bg-gradient-to-br from-red-500/10 via-surface to-surface'
          : 'border-border bg-gradient-to-br from-surface via-surface to-background'
      }`}>
        <div className="absolute -inset-x-40 -inset-y-40 bg-gradient-radial from-primary/5 via-transparent to-transparent" />
        <div className="relative z-10">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="rounded-lg bg-surface-raised px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
                {getStageLabel(match.stage)}
                {match.group ? ` · ${match.group}` : ''}
                {match.matchday ? ` · MD ${match.matchday}` : ''}
              </span>
            </div>
            {live ? (
              <LivePulse status={match.status} minute={liveData?.minute} className="ring-1 ring-live-red/20" />
            ) : (
              <div className="flex items-center gap-1.5 text-[11px] text-text-muted">
                <Clock size={12} />
                {finished
                  ? formatDate(match.utcDate)
                  : `${formatDate(match.utcDate)} · ${formatTime(match.utcDate)}`}
              </div>
            )}
          </div>

          <div className="flex items-center justify-center gap-8 md:gap-20">
            <div className="flex flex-col items-center gap-3">
              <div className="relative h-20 w-20 overflow-hidden rounded-2xl bg-surface-raised ring-2 ring-border/50 md:h-24 md:w-24">
                <Image
                  src={getFlagUrl(match.homeTeam.country)}
                  alt={match.homeTeam.country}
                  width={96}
                  height={96}
                  className="h-full w-full object-contain p-2"
                  unoptimized
                />
              </div>
              <span className="text-sm font-bold font-display text-text-primary tracking-wide md:text-base">
                {match.homeTeam.name}
              </span>
            </div>

            <div className="flex flex-col items-center">
              {live || finished ? (
                <span className={`text-5xl font-extrabold font-display tabular-nums tracking-tight md:text-6xl ${
                  live ? 'text-live-red' : 'text-text-primary'
                }`}>
                  {homeScore ?? '-'}
                  <span className="text-text-muted mx-2">:</span>
                  {awayScore ?? '-'}
                </span>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <span className="text-4xl font-extrabold font-display text-gradient-gold md:text-5xl">
                    vs
                  </span>
                  <span className="text-xs font-semibold text-text-secondary tabular-nums">
                    {formatTime(match.utcDate)}
                  </span>
                </div>
              )}
              {live && (
                <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-live-red/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-live-red ring-1 ring-live-red/20">
                  {liveData?.minute}&apos; · Auto-refreshing
                </div>
              )}
            </div>

            <div className="flex flex-col items-center gap-3">
              <div className="relative h-20 w-20 overflow-hidden rounded-2xl bg-surface-raised ring-2 ring-border/50 md:h-24 md:w-24">
                <Image
                  src={getFlagUrl(match.awayTeam.country)}
                  alt={match.awayTeam.country}
                  width={96}
                  height={96}
                  className="h-full w-full object-contain p-2"
                  unoptimized
                />
              </div>
              <span className="text-sm font-bold font-display text-text-primary tracking-wide md:text-base">
                {match.awayTeam.name}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Prediction + Stats */}
      {prediction && (
        <div className="grid gap-6 lg:grid-cols-2">
          <PredictionCard
            prediction={prediction}
            homeName={match.homeTeam.shortName || match.homeTeam.name}
            awayName={match.awayTeam.shortName || match.awayTeam.name}
          />

          <div className="rounded-xl border border-border bg-gradient-to-b from-surface to-surface/50 p-6">
            <div className="mb-5 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gold/15">
                <BarChart3 size={13} className="text-gold" />
              </div>
              <h3 className="text-xs font-bold font-display uppercase tracking-wider text-gold">
                Stats Comparison
              </h3>
            </div>

            <div className="space-y-4">
              <StatRow
                label="Goals Scored Avg"
                home={predictData?.homeTeam?.goalsFor ?? '1.5'}
                away={predictData?.awayTeam?.goalsFor ?? '1.2'}
              />
              <StatRow
                label="Goals Conceded Avg"
                home={predictData?.homeTeam?.goalsAgainst ?? '0.8'}
                away={predictData?.awayTeam?.goalsAgainst ?? '1.1'}
                reverse
              />
              <StatRow
                label="Clean Sheets"
                home={predictData?.homeTeam?.cleanSheets ?? 3}
                away={predictData?.awayTeam?.cleanSheets ?? 2}
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
          </div>
        </div>
      )}

      {/* Live Events */}
      {live && liveData && (
        <div className="rounded-xl border border-live-red/20 bg-gradient-to-b from-live-red/[0.03] to-surface/50 p-6">
          <div className="mb-4 flex items-center gap-2">
            <div className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-live-red opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-live-red shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
            </div>
            <h3 className="text-xs font-bold font-display uppercase tracking-wider text-live-red">
              Live Events
            </h3>
          </div>
          <div className="flex items-center justify-center py-8">
            <p className="text-xs text-text-secondary">
              Live events feed will appear here as match progresses.
            </p>
          </div>
        </div>
      )}

      {/* Form Guide */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-gradient-to-b from-surface to-surface/50 p-5">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-xs font-bold font-display uppercase tracking-wider text-gold">
              {match.homeTeam.shortName} Form
            </h4>
            <Target size={13} className="text-gold/40" />
          </div>
          <FormBadge results={['W', 'W', 'D', 'L', 'W']} />
        </div>
        <div className="rounded-xl border border-border bg-gradient-to-b from-surface to-surface/50 p-5">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-xs font-bold font-display uppercase tracking-wider text-gold">
              {match.awayTeam.shortName} Form
            </h4>
            <Target size={13} className="text-gold/40" />
          </div>
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
  format = 'goals',
  reverse = false,
}: {
  label: string
  home: number | string
  away: number | string
  format?: 'goals' | 'percent' | 'count'
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
      <div className="mb-1.5 flex justify-between text-[10px] text-text-muted">
        <span className="font-bold text-text-secondary">{displayVal(h)}</span>
        <span className="text-[9px] font-semibold uppercase tracking-[0.1em]">{label}</span>
        <span className="font-bold text-text-secondary">{displayVal(a)}</span>
      </div>
      <div className="flex h-2 w-full overflow-hidden rounded-full bg-surface-raised ring-1 ring-border/30">
        <motion.div
          className="h-full rounded-full"
          style={{
            backgroundColor: reverse ? 'var(--loss)' : 'var(--win)',
            width: `${reverse ? awayPct : homePct}%`,
          }}
          initial={{ width: 0 }}
          animate={{ width: `${reverse ? awayPct : homePct}%` }}
          transition={{ duration: 0.5 }}
        />
        <motion.div
          className="h-full rounded-full"
          style={{
            backgroundColor: reverse ? 'var(--win)' : 'var(--loss)',
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
