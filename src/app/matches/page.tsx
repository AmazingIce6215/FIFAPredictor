'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { motion } from 'framer-motion'
import { Swords, Calendar, Radio, Clock, CheckCircle } from 'lucide-react'
import MatchCard from '@/components/ui/MatchCard'
import { MatchData } from '@/lib/types'
import { isLive, getStageLabel } from '@/lib/utils'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

type FilterType = 'all' | 'live' | 'today' | 'upcoming' | 'finished'

export default function MatchesPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')

  const { data, isLoading } = useSWR<{ matches: MatchData[] }>(
    '/api/matches',
    fetcher,
    { refreshInterval: 60000 }
  )

  const matches = data?.matches ?? []

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const filteredMatches = matches.filter((m) => {
    switch (activeFilter) {
      case 'live':
        return isLive(m.status)
      case 'today': {
        const d = new Date(m.utcDate)
        return d >= today && d < tomorrow
      }
      case 'upcoming':
        return ['SCHEDULED', 'TIMED'].includes(m.status)
      case 'finished':
        return m.status === 'FINISHED'
      default:
        return true
    }
  })

  const stages = Array.from(new Set(filteredMatches.map((m) => m.stage))).sort()

  const filters: { key: FilterType; label: string; icon: typeof Swords }[] = [
    { key: 'all', label: 'All', icon: Swords },
    { key: 'live', label: 'Live', icon: Radio },
    { key: 'today', label: 'Today', icon: Calendar },
    { key: 'upcoming', label: 'Upcoming', icon: Clock },
    { key: 'finished', label: 'Finished', icon: CheckCircle },
  ]

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 ring-1 ring-primary/30">
            <Swords size={18} className="text-primary-light" />
          </div>
          <div>
            <h1 className="text-lg font-bold font-display uppercase tracking-wider text-text-primary">
              Matches
            </h1>
            <p className="text-[10px] text-text-muted">{matches.length} total matches</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((f) => {
          const count = f.key === 'all' ? matches.length : f.key === 'live' ? matches.filter(m => isLive(m.status)).length : null
          const isActive = activeFilter === f.key
          return (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-[11px] font-bold uppercase tracking-wider transition-all duration-200 ${
                isActive
                  ? 'bg-primary text-white shadow-[0_0_20px_var(--primary-glow)]'
                  : 'border border-border text-text-secondary hover:border-border-bright hover:text-text-primary bg-surface'
              }`}
            >
              <f.icon size={13} />
              {f.label}
              {count !== null && count > 0 && (
                <span className={`ml-1 rounded-full px-1.5 py-0.5 text-[9px] ${isActive ? 'bg-white/15 text-white' : 'bg-surface-raised text-text-muted'}`}>
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-xl border border-border bg-surface p-5">
              <div className="skeleton-pulse mb-3 h-3 w-24 rounded" />
              <div className="flex items-center gap-3">
                <div className="skeleton-pulse h-8 w-8 shrink-0 rounded-full" />
                <div className="skeleton-pulse h-4 flex-1 rounded" />
                <div className="skeleton-pulse h-8 w-16 shrink-0 rounded" />
                <div className="skeleton-pulse h-4 flex-1 rounded" />
                <div className="skeleton-pulse h-8 w-8 shrink-0 rounded-full" />
              </div>
              <div className="skeleton-pulse mt-3 h-3 w-full rounded" />
            </div>
          ))}
        </div>
      ) : filteredMatches.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-20">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-raised ring-1 ring-border">
            <Swords size={28} className="text-text-muted" />
          </div>
          <p className="text-sm text-text-secondary">No matches match this filter.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {stages.map((stage) => {
            const stageMatches = filteredMatches.filter((m) => m.stage === stage)
            return (
              <motion.div
                key={stage}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="mb-4 flex items-center gap-2">
                  <div className="h-4 w-0.5 rounded-full bg-gold" />
                  <h2 className="text-xs font-bold font-display uppercase tracking-wider text-gold">
                    {getStageLabel(stage)}
                  </h2>
                  <span className="rounded-full bg-surface-raised px-2 py-0.5 text-[9px] font-semibold text-text-muted">
                    {stageMatches.length}
                  </span>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {stageMatches.map((match, i) => (
                    <MatchCard key={match.id} match={match} index={i} />
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
