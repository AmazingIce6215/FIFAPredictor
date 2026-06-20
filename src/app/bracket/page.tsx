'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { GitBranch, Trophy } from 'lucide-react'
import { getFlagUrl, getStageLabel } from '@/lib/utils'
import { GROUPS } from '@/lib/country-codes'

interface BracketSlot {
  round: string
  matchLabel: string
  homeTeam?: string
  awayTeam?: string
  homeScore?: number
  awayScore?: number
  predictedWinner?: string
  winnerProbability?: number
}

const BRACKET_DATA: BracketSlot[] = [
  { round: 'ROUND_OF_32', matchLabel: '1A vs 2B', homeTeam: 'Brazil', awayTeam: 'Serbia' },
  { round: 'ROUND_OF_32', matchLabel: '1B vs 2A', homeTeam: 'Argentina', awayTeam: 'Uruguay' },
  { round: 'ROUND_OF_32', matchLabel: '1C vs 2D', homeTeam: 'France', awayTeam: 'Denmark' },
  { round: 'ROUND_OF_32', matchLabel: '1D vs 2C', homeTeam: 'England', awayTeam: 'Netherlands' },
  { round: 'ROUND_OF_16', matchLabel: 'R32-1 vs R32-2' },
  { round: 'ROUND_OF_16', matchLabel: 'R32-3 vs R32-4' },
  { round: 'QUARTER_FINALS', matchLabel: 'QF 1' },
  { round: 'QUARTER_FINALS', matchLabel: 'QF 2' },
  { round: 'SEMI_FINALS', matchLabel: 'SF 1' },
  { round: 'FINAL', matchLabel: 'Final' },
]

function getTeamsToShow(slot: BracketSlot) {
  if (!slot.homeTeam && !slot.awayTeam) return null
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        {slot.homeTeam && (
          <Image
            src={getFlagUrl(slot.homeTeam)}
            alt={slot.homeTeam}
            width={20}
            height={20}
            className="h-5 w-5 rounded object-contain"
            unoptimized
          />
        )}
        <span className="text-[11px] font-semibold text-text-primary">
          {slot.homeTeam || 'TBD'}
        </span>
        {slot.homeScore !== undefined && (
          <span className="text-xs font-bold font-display text-text-primary tabular-nums">
            {slot.homeScore}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        {slot.awayTeam && (
          <Image
            src={getFlagUrl(slot.awayTeam)}
            alt={slot.awayTeam}
            width={20}
            height={20}
            className="h-5 w-5 rounded object-contain"
            unoptimized
          />
        )}
        <span className="text-[11px] font-semibold text-text-primary">
          {slot.awayTeam || 'TBD'}
        </span>
        {slot.awayScore !== undefined && (
          <span className="text-xs font-bold font-display text-text-primary tabular-nums">
            {slot.awayScore}
          </span>
        )}
      </div>
    </div>
  )
}

export default function BracketPage() {
  const rounds = Array.from(new Set(BRACKET_DATA.map((s) => s.round)))

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <GitBranch size={20} className="text-gold" />
        <h1 className="text-xl font-bold font-display uppercase tracking-wider text-text-primary">
          Tournament Bracket
        </h1>
      </div>

      <div className="overflow-x-auto pb-8">
        <div className="flex gap-6 min-w-[768px]">
          {rounds.map((round, rIdx) => {
            const roundSlots = BRACKET_DATA.filter((s) => s.round === round)
            return (
              <div key={round} className="flex flex-col gap-4 flex-1">
                <div className="flex items-center gap-1.5 border-b border-border pb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gold">
                    {getStageLabel(round)}
                  </span>
                </div>
                {roundSlots.map((slot, sIdx) => (
                  <motion.div
                    key={`${round}-${sIdx}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: rIdx * 0.1 + sIdx * 0.05 }}
                    className="glass glass-hover rounded-lg p-3 min-h-[80px] flex flex-col justify-center transition-all duration-200"
                  >
                    <span className="mb-1.5 text-[9px] font-semibold uppercase tracking-wider text-text-muted">
                      {slot.matchLabel}
                    </span>
                    {getTeamsToShow(slot) || (
                      <span className="text-[10px] text-text-muted italic">
                        Awaiting teams
                      </span>
                    )}
                  </motion.div>
                ))}
              </div>
            )
          })}
        </div>
      </div>

      <div className="glass rounded-xl p-6 text-center">
        <Trophy size={32} className="mx-auto mb-2 text-gold" />
        <p className="text-xs text-text-secondary">
          Bracket fills in automatically as knockout round matches are confirmed.
          AI predictions update for each match slot.
        </p>
      </div>
    </div>
  )
}
