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

function BracketSlotCard({ slot, index }: { slot: BracketSlot; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="rounded-xl border border-border bg-gradient-to-b from-surface to-surface/50 p-4 transition-all duration-200 hover:border-border-bright min-h-[100px]"
    >
      <div className="mb-2">
        <span className="text-[9px] font-semibold uppercase tracking-wider text-text-muted">
          {slot.matchLabel}
        </span>
      </div>
      {slot.homeTeam || slot.awayTeam ? (
        <div className="space-y-2">
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
              <span className="ml-auto text-xs font-bold font-display text-text-primary tabular-nums">
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
              <span className="ml-auto text-xs font-bold font-display text-text-primary tabular-nums">
                {slot.awayScore}
              </span>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center py-2">
          <span className="text-[10px] text-text-muted italic">Awaiting teams</span>
        </div>
      )}
    </motion.div>
  )
}

export default function BracketPage() {
  const rounds = Array.from(new Set(BRACKET_DATA.map((s) => s.round)))

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gold/30 to-gold/10 ring-1 ring-gold/20">
          <GitBranch size={18} className="text-gold" />
        </div>
        <div>
          <h1 className="text-lg font-bold font-display uppercase tracking-wider text-text-primary">
            Tournament Bracket
          </h1>
          <p className="text-[10px] text-text-muted">Knockout stage · 32 to 1</p>
        </div>
      </div>

      <div className="overflow-x-auto pb-8">
        <div className="flex gap-6 min-w-[768px]">
          {rounds.map((round, rIdx) => {
            const roundSlots = BRACKET_DATA.filter((s) => s.round === round)
            // Calculate index offset for staggered animation
            const globalStartIndex = BRACKET_DATA.findIndex((s) => s.round === round)
            return (
              <div key={round} className="flex flex-col gap-4 flex-1 min-w-[180px]">
                <div className="flex items-center gap-2 border-b border-border pb-3">
                  <div className="h-3 w-0.5 rounded-full bg-gold" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gold">
                    {getStageLabel(round)}
                  </span>
                </div>
                {roundSlots.map((slot, sIdx) => (
                  <BracketSlotCard
                    key={`${round}-${sIdx}`}
                    slot={slot}
                    index={globalStartIndex + sIdx}
                  />
                ))}
                {/* Connector lines between rounds would go here in a real bracket */}
              </div>
            )
          })}
        </div>
      </div>

      <div className="rounded-xl border border-gold/20 bg-gradient-to-br from-gold/[0.03] to-surface/50 p-6 text-center">
        <Trophy size={28} className="mx-auto mb-2 text-gold" />
        <p className="text-xs text-text-secondary leading-relaxed">
          Bracket fills in automatically as knockout round matches are confirmed.
          AI predictions update for each match slot.
        </p>
      </div>
    </div>
  )
}
