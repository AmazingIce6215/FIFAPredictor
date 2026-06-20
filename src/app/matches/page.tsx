'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { motion } from 'framer-motion'
import { Swords } from 'lucide-react'
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

  const filters: { key: FilterType; label: string; count?: number }[] = [
    { key: 'all', label: 'All', count: matches.length },
    { key: 'live', label: `Live (${matches.filter((m) => isLive(m.status)).length})` },
    { key: 'today', label: 'Today' },
    { key: 'upcoming', label: 'Upcoming' },
    { key: 'finished', label: 'Finished' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Swords size={20} className="text-gold" />
          <h1 className="text-xl font-bold font-display uppercase tracking-wider text-text-primary">
            Matches
          </h1>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setActiveFilter(f.key)}
            className={`rounded-lg px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
              activeFilter === f.key
                ? 'bg-gold text-background'
                : 'border border-border text-text-secondary hover:border-border-bright hover:text-text-primary'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass rounded-xl p-5">
              <div className="skeleton-pulse mb-3 h-3 w-24 rounded" />
              <div className="flex items-center gap-3">
                <div className="skeleton-pulse h-8 w-8 rounded-full" />
                <div className="skeleton-pulse h-4 flex-1 rounded" />
                <div className="skeleton-pulse h-8 w-16 rounded" />
                <div className="skeleton-pulse h-4 flex-1 rounded" />
                <div className="skeleton-pulse h-8 w-8 rounded-full" />
              </div>
              <div className="skeleton-pulse mt-3 h-3 w-full rounded" />
            </div>
          ))}
        </div>
      ) : filteredMatches.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16">
          <Swords size={40} className="text-text-muted" />
          <p className="text-sm text-text-secondary">No matches match this filter.</p>
        </div>
      ) : (
        stages.map((stage) => {
          const stageMatches = filteredMatches.filter((m) => m.stage === stage)
          return (
            <motion.div
              key={stage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="mb-3 text-sm font-bold font-display uppercase tracking-wider text-gold">
                {getStageLabel(stage)}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {stageMatches.map((match, i) => (
                  <MatchCard key={match.id} match={match} index={i} />
                ))}
              </div>
            </motion.div>
          )
        })
      )}
    </div>
  )
}
