'use client'

import { motion } from 'framer-motion'

interface ProbabilityBarProps {
  homeWin: number
  draw: number
  awayWin: number
  homeLabel?: string
  awayLabel?: string
  animated?: boolean
  compact?: boolean
}

export default function ProbabilityBar({
  homeWin,
  draw,
  awayWin,
  homeLabel,
  awayLabel,
  animated = true,
  compact = false,
}: ProbabilityBarProps) {
  const spring = { type: 'spring' as const, stiffness: 60, damping: 15 }

  return (
    <div className="w-full">
      <div className="flex h-7 w-full overflow-hidden rounded-lg ring-1 ring-white/5">
        <motion.div
          className="flex items-center justify-start bg-gradient-to-r from-win/90 to-win/70 px-2 text-[10px] font-bold text-white"
          style={{ width: `${homeWin}%` }}
          initial={animated ? { width: 0 } : undefined}
          animate={{ width: `${homeWin}%` }}
          transition={animated ? spring : undefined}
        >
          {homeWin > 10 && <span className="tabular-nums">{Math.round(homeWin)}%</span>}
        </motion.div>
        <motion.div
          className="flex items-center justify-center bg-gradient-to-r from-draw/70 to-draw/50 px-1 text-[10px] font-bold text-white"
          style={{ width: `${draw}%` }}
          initial={animated ? { width: 0 } : undefined}
          animate={{ width: `${draw}%` }}
          transition={animated ? spring : undefined}
        >
          {draw > 8 && <span className="tabular-nums">{Math.round(draw)}%</span>}
        </motion.div>
        <motion.div
          className="flex items-center justify-end bg-gradient-to-l from-loss/90 to-loss/70 px-2 text-[10px] font-bold text-white"
          style={{ width: `${awayWin}%` }}
          initial={animated ? { width: 0 } : undefined}
          animate={{ width: `${awayWin}%` }}
          transition={animated ? spring : undefined}
        >
          {awayWin > 10 && <span className="tabular-nums">{Math.round(awayWin)}%</span>}
        </motion.div>
      </div>
      {!compact && (
        <div className="mt-1.5 flex justify-between text-[10px] text-text-muted">
          <span className="font-semibold uppercase tracking-wider">{homeLabel || 'Home'}</span>
          <span className="font-semibold uppercase tracking-wider">Draw</span>
          <span className="font-semibold uppercase tracking-wider">{awayLabel || 'Away'}</span>
        </div>
      )}
    </div>
  )
}
