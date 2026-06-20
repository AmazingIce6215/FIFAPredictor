'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PredictionResult } from '@/lib/types'
import { ChevronDown, AlertTriangle, TrendingUp, Target, Shield } from 'lucide-react'
import ProbabilityBar from './ProbabilityBar'
import ConfidenceTag from './ConfidenceTag'

interface PredictionCardProps {
  prediction: PredictionResult
  homeName: string
  awayName: string
  showDetails?: boolean
}

export default function PredictionCard({
  prediction,
  homeName,
  awayName,
  showDetails = true,
}: PredictionCardProps) {
  const [expanded, setExpanded] = useState(false)

  const isLive = prediction.predictionVersion === 'live'

  return (
    <div className="relative overflow-hidden rounded-xl border border-gold/20 bg-gradient-to-b from-gold/[0.03] to-surface/50 p-6">
      <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-gold/5 blur-3xl" />

      <div className="relative">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gold/15">
              <TrendingUp size={14} className="text-gold" />
            </div>
            <h3 className="text-xs font-bold font-display uppercase tracking-wider text-gold">
              AI Prediction
            </h3>
          </div>
          <ConfidenceTag confidence={prediction.confidence} />
        </div>

        <div className="mb-4">
          <ProbabilityBar
            homeWin={prediction.homeWinProbability}
            draw={prediction.drawProbability}
            awayWin={prediction.awayWinProbability}
            homeLabel={homeName}
            awayLabel={awayName}
          />
        </div>

        <div className="mb-5 text-center">
          <span className="text-3xl font-bold font-display text-text-primary tabular-nums tracking-tight">
            {prediction.predictedScore.home}
          </span>
          <span className="mx-2 text-lg font-bold text-text-muted">—</span>
          <span className="text-3xl font-bold font-display text-text-primary tabular-nums tracking-tight">
            {prediction.predictedScore.away}
          </span>
          <div className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
            Predicted Scoreline
          </div>
        </div>

        {showDetails && (
          <>
            <div className="mb-4 flex flex-wrap gap-1.5">
              {prediction.keyFactors.slice(0, 3).map((kf, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 rounded-full bg-surface-raised px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-text-secondary"
                >
                  {kf.factor}
                </span>
              ))}
            </div>

            <button
              onClick={() => setExpanded(!expanded)}
              className="flex w-full items-center justify-between rounded-lg border border-border bg-surface-raised/50 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-text-secondary transition-all duration-200 hover:border-border-bright hover:text-text-primary"
            >
              <span>Analysis & Reasoning</span>
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
              />
            </button>

            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 space-y-4">
                    <div className="rounded-lg border border-border bg-surface-raised/30 p-4">
                      <h4 className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-gold">
                        <Shield size={11} />
                        Reasoning
                      </h4>
                      <p className="text-sm leading-relaxed text-text-secondary">
                        {prediction.reasoning}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-lg border border-border bg-surface-raised/30 p-3">
                        <span className="text-[9px] font-semibold uppercase tracking-wider text-text-muted">
                          {homeName} Form
                        </span>
                        <div className="mt-1 flex items-baseline gap-1.5">
                          <span className="text-xl font-bold font-display text-win tabular-nums">
                            {prediction.formAnalysis.homeFormRating}
                          </span>
                          <span className="text-[10px] text-text-muted">/10</span>
                        </div>
                      </div>
                      <div className="rounded-lg border border-border bg-surface-raised/30 p-3">
                        <span className="text-[9px] font-semibold uppercase tracking-wider text-text-muted">
                          {awayName} Form
                        </span>
                        <div className="mt-1 flex items-baseline gap-1.5">
                          <span className="text-xl font-bold font-display text-loss tabular-nums">
                            {prediction.formAnalysis.awayFormRating}
                          </span>
                          <span className="text-[10px] text-text-muted">/10</span>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border border-border bg-surface-raised/30 p-3">
                      <span className="text-[9px] font-semibold uppercase tracking-wider text-text-muted">
                        {prediction.formAnalysis.comment}
                      </span>
                    </div>

                    {prediction.riskFactors.length > 0 && (
                      <div className="rounded-lg border border-gold/15 bg-gold/[0.04] p-4">
                        <div className="mb-2 flex items-center gap-1.5">
                          <AlertTriangle size={12} className="text-gold" />
                          <span className="text-[10px] font-bold uppercase tracking-wider text-gold">
                            Risk Factors
                          </span>
                        </div>
                        <ul className="space-y-1.5">
                          {prediction.riskFactors.map((rf, i) => (
                            <li key={i} className="flex items-start gap-2 text-[11px] text-text-secondary">
                              <span className="mt-0.5 h-1 w-1 flex-shrink-0 rounded-full bg-gold/40" />
                              {rf}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="rounded-lg border border-border bg-surface-raised/30 p-4">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-text-muted">
                        <Target size={11} />
                        Recommended
                      </div>
                      <p className="mt-1.5 text-sm font-semibold text-gold">
                        {prediction.recommendedBet}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  )
}
