'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PredictionResult } from '@/lib/types'
import { ChevronDown, AlertTriangle } from 'lucide-react'
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
    <div className="glass rounded-xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-bold font-display uppercase tracking-wider text-gold">
          AI Prediction {isLive ? '(Live Updated)' : ''}
        </h3>
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

      <div className="mb-4 text-center">
        <span className="text-2xl font-bold font-display text-text-primary">
          {prediction.predictedScore.home} - {prediction.predictedScore.away}
        </span>
        <span className="ml-2 text-xs text-text-secondary">
          predicted scoreline
        </span>
      </div>

      {showDetails && (
        <>
          <div className="mb-4 flex flex-wrap gap-2">
            {prediction.keyFactors.slice(0, 3).map((kf, i) => (
              <span
                key={i}
                className="inline-flex items-center rounded-full border border-border bg-surface px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-text-secondary"
              >
                {kf.factor}
              </span>
            ))}
          </div>

          <button
            onClick={() => setExpanded(!expanded)}
            className="flex w-full items-center justify-between rounded-lg border border-border bg-surface px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-text-secondary transition-colors hover:border-border-bright hover:text-text-primary"
          >
            <span>Analysis & Reasoning</span>
            <ChevronDown
              size={14}
              className={`transition-transform ${expanded ? 'rotate-180' : ''}`}
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
                  <div className="rounded-lg bg-surface p-4">
                    <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-gold">
                      Reasoning
                    </h4>
                    <p className="text-sm leading-relaxed text-text-secondary">
                      {prediction.reasoning}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-surface p-3">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                        {homeName} Form
                      </span>
                      <div className="mt-1 flex items-baseline gap-1.5">
                        <span className="text-lg font-bold font-display text-text-primary tabular-nums">
                          {prediction.formAnalysis.homeFormRating}
                        </span>
                        <span className="text-[10px] text-text-muted">/10</span>
                      </div>
                    </div>
                    <div className="rounded-lg bg-surface p-3">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                        {awayName} Form
                      </span>
                      <div className="mt-1 flex items-baseline gap-1.5">
                        <span className="text-lg font-bold font-display text-text-primary tabular-nums">
                          {prediction.formAnalysis.awayFormRating}
                        </span>
                        <span className="text-[10px] text-text-muted">/10</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg bg-surface p-3">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                      {prediction.formAnalysis.comment}
                    </span>
                  </div>

                  {prediction.riskFactors.length > 0 && (
                    <div className="rounded-lg border border-gold/20 bg-gold/5 p-3">
                      <div className="mb-1 flex items-center gap-1.5">
                        <AlertTriangle size={12} className="text-gold" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gold">
                          Risk Factors
                        </span>
                      </div>
                      <ul className="space-y-1">
                        {prediction.riskFactors.map((rf, i) => (
                          <li key={i} className="text-[11px] text-text-secondary">
                            • {rf}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="rounded-lg bg-surface p-3">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                      Recommended
                    </span>
                    <p className="mt-1 text-sm font-semibold text-gold">
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
  )
}
