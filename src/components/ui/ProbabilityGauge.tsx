'use client'

import { motion } from 'framer-motion'

interface ProbabilityGaugeProps {
  probability: number
  label: string
  color?: string
  size?: number
}

export default function ProbabilityGauge({
  probability,
  label,
  color = 'var(--gold)',
  size = 120,
}: ProbabilityGaugeProps) {
  const strokeWidth = 8
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (probability / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="rotate-[-90deg]">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--border)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ type: 'spring', stiffness: 60, damping: 15 }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <motion.span
          className="text-2xl font-bold font-display text-text-primary tabular-nums"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {probability}%
        </motion.span>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
          {label}
        </span>
      </div>
    </div>
  )
}
