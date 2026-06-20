'use client'

import useSWR from 'swr'
import { motion } from 'framer-motion'
import { LayoutGrid, Trophy } from 'lucide-react'
import StandingsTable from '@/components/ui/StandingsTable'
import { StandingTable } from '@/lib/types'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function StandingsPage() {
  const { data, isLoading } = useSWR<{ standings: StandingTable[] }>(
    '/api/standings',
    fetcher,
    { refreshInterval: 120000 }
  )

  const standings = data?.standings ?? []

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gold/30 to-gold/10 ring-1 ring-gold/20">
          <LayoutGrid size={18} className="text-gold" />
        </div>
        <div>
          <h1 className="text-lg font-bold font-display uppercase tracking-wider text-text-primary">
            Group Standings
          </h1>
          <p className="text-[10px] text-text-muted">
            {standings.length} groups · Top 2 advance to Round of 32
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-xl border border-border overflow-hidden">
              <div className="skeleton-pulse h-10" />
              <div className="p-4 space-y-3">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="skeleton-pulse h-8 rounded" />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : standings.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-20">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-raised ring-1 ring-border">
            <Trophy size={28} className="text-text-muted" />
          </div>
          <p className="text-sm text-text-secondary">
            Standings will be available once matches start.
          </p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid gap-6 md:grid-cols-2"
        >
          {standings.map((st) => (
            <StandingsTable
              key={st.group || st.stage}
              groupName={st.group || st.stage}
              entries={st.table}
            />
          ))}
        </motion.div>
      )}
    </div>
  )
}
