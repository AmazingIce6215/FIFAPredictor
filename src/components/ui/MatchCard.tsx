'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { MatchData } from '@/lib/types'
import { isLive, getFlagUrl, formatDate, formatTime, getStageLabel } from '@/lib/utils'
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
          className={`glass glass-hover group cursor-pointer rounded-xl p-5 transition-all duration-200 hover:scale-[1.01] ${
            live ? 'border-l-live-red border-l-2' : ''
          }`}
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
              {getStageLabel(match.stage)}
              {match.group ? ` · ${match.group}` : ''}
              {match.matchday ? ` · Matchday ${match.matchday}` : ''}
            </span>
            {live ? (
              <LivePulse status={match.status} />
            ) : (
              <span className="text-[11px] text-text-muted">
                {finished
                  ? formatDate(match.utcDate)
                  : `${formatDate(match.utcDate)} · ${formatTime(match.utcDate)}`}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-1 items-center gap-3">
              <Image
                src={getFlagUrl(match.homeTeam.country)}
                alt={match.homeTeam.country}
                width={32}
                height={32}
                className="h-8 w-8 rounded object-contain"
                unoptimized
              />
              <span className="text-sm font-bold font-display text-text-primary group-hover:text-gold-bright transition-colors">
                {match.homeTeam.shortName || match.homeTeam.name}
              </span>
            </div>

            <div className="flex-shrink-0 text-center">
              {live || finished ? (
                <span className="text-2xl font-bold font-display text-text-primary tabular-nums">
                  {homeScore ?? '-'}:{awayScore ?? '-'}
                </span>
              ) : (
                <span className="text-xs font-semibold text-text-secondary">
                  {formatTime(match.utcDate)}
                </span>
              )}
            </div>

            <div className="flex flex-1 items-center justify-end gap-3">
              <span className="text-sm font-bold font-display text-text-primary group-hover:text-gold-bright transition-colors">
                {match.awayTeam.shortName || match.awayTeam.name}
              </span>
              <Image
                src={getFlagUrl(match.awayTeam.country)}
                alt={match.awayTeam.country}
                width={32}
                height={32}
                className="h-8 w-8 rounded object-contain"
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
            <div className="mt-2 text-[11px] text-gold">
              <span className="font-semibold">AI:</span> {prediction}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  )
}
