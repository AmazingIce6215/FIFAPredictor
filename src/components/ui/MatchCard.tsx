'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { MatchData } from '@/lib/types'
import { isLive, getTeamFlagSrc, formatDate, formatTime, getStageLabel } from '@/lib/utils'
import LivePulse from './LivePulse'
import ProbabilityBar from './ProbabilityBar'

interface MatchCardProps {
  match: MatchData
  homeWinProb?: number
  drawProb?: number
  awayWinProb?: number
  prediction?: string
  index?: number
}

export default function MatchCard({
  match,
  homeWinProb,
  drawProb,
  awayWinProb,
  prediction,
  index = 0,
}: MatchCardProps) {
  const live = isLive(match.status)
  const finished = match.status === 'FINISHED'
  const homeScore = match.score.fullTime.home
  const awayScore = match.score.fullTime.away

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.35 }}
    >
      <Link href={`/matches/${match.id}`}>
        <div
          className={`group relative cursor-pointer overflow-hidden rounded-xl border border-border bg-gradient-to-b from-surface to-surface/50 p-5 transition-all duration-300 hover:border-primary/30 hover:shadow-[0_0_30px_var(--primary-glow)] ${
            live ? 'border-live-red/40' : ''
          }`}
        >
          {live && (
            <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-live-red to-transparent animate-breathe" />
          )}

          <div className="mb-3 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-raised px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
              {getStageLabel(match.stage)}
              {match.group ? ` · ${match.group}` : ''}
            </span>
            {live ? (
              <LivePulse status={match.status} />
            ) : (
              <span className="text-[10px] text-text-muted">
                {finished
                  ? formatDate(match.utcDate)
                  : formatTime(match.utcDate)}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-1 items-center gap-2.5">
              <Image
                src={getTeamFlagSrc(match.homeTeam)}
                alt={match.homeTeam.country || match.homeTeam.name}
                width={28}
                height={28}
                className="h-7 w-7 rounded object-contain ring-1 ring-border/50"
                unoptimized
              />
              <span className="text-sm font-semibold font-display text-text-primary transition-colors group-hover:text-primary-light">
                {match.homeTeam.shortName || match.homeTeam.name}
              </span>
            </div>

            <div className="flex-shrink-0 text-center">
              {live || finished ? (
                <span className="text-xl font-bold font-display text-text-primary tabular-nums tracking-tight">
                  {homeScore ?? '-'}
                  <span className="mx-1 text-text-muted">:</span>
                  {awayScore ?? '-'}
                </span>
              ) : (
                <span className="text-[11px] font-semibold text-text-secondary">
                  {formatTime(match.utcDate)}
                </span>
              )}
            </div>

            <div className="flex flex-1 items-center justify-end gap-2.5">
              <span className="text-sm font-semibold font-display text-text-primary transition-colors group-hover:text-primary-light">
                {match.awayTeam.shortName || match.awayTeam.name}
              </span>
              <Image
                src={getTeamFlagSrc(match.awayTeam)}
                alt={match.awayTeam.country || match.awayTeam.name}
                width={28}
                height={28}
                className="h-7 w-7 rounded object-contain ring-1 ring-border/50"
                unoptimized
              />
            </div>
          </div>

          {homeWinProb !== undefined && drawProb !== undefined && awayWinProb !== undefined && (
            <div className="mt-3">
              <ProbabilityBar
                homeWin={homeWinProb}
                draw={drawProb}
                awayWin={awayWinProb}
                homeLabel={match.homeTeam.shortName}
                awayLabel={match.awayTeam.shortName}
                compact
              />
            </div>
          )}

          {prediction && (
            <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-gold/10 px-2.5 py-1 text-[10px] font-semibold text-gold">
              <span>AI</span>
              <span className="h-1 w-1 rounded-full bg-gold/40" />
              <span>{prediction}</span>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  )
}
