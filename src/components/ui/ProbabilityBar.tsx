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
      <div className="flex h-8 w-full overflow-hidden rounded-md">
        <motion.div
          className="flex items-center justify-start bg-win-green px-2 text-xs font-bold text-white"
          style={{ width: `${homeWin}%` }}
          initial={animated ? { width: 0 } : undefined}
          animate={{ width: `${homeWin}%` }}
          transition={animated ? spring : undefined}
        >
          {homeWin > 10 && <span className="tabular-nums">{homeWin}%</span>}
        </motion.div>
        <motion.div
          className="flex items-center justify-center bg-draw-gray px-1 text-xs font-bold text-white"
          style={{ width: `${draw}%` }}
          initial={animated ? { width: 0 } : undefined}
          animate={{ width: `${draw}%` }}
          transition={animated ? spring : undefined}
        >
          {draw > 8 && <span className="tabular-nums">{draw}%</span>}
        </motion.div>
        <motion.div
          className="flex items-center justify-end bg-loss-blue px-2 text-xs font-bold text-white"
          style={{ width: `${awayWin}%` }}
          initial={animated ? { width: 0 } : undefined}
          animate={{ width: `${awayWin}%` }}
          transition={animated ? spring : undefined}
        >
          {awayWin > 10 && <span className="tabular-nums">{awayWin}%</span>}
        </motion.div>
      </div>
      {!compact && (
        <div className="mt-1 flex justify-between text-[11px] text-text-secondary">
          <span className="font-semibold uppercase">{homeLabel || 'Home'}</span>
          <span className="font-semibold uppercase">Draw</span>
          <span className="font-semibold uppercase">{awayLabel || 'Away'}</span>
        </div>
      )}
    </div>
  )
}
