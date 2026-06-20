'use client'

import useSWR from 'swr'
import { motion } from 'framer-motion'
import { LayoutGrid } from 'lucide-react'
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
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <LayoutGrid size={20} className="text-gold" />
        <h1 className="text-xl font-bold font-display uppercase tracking-wider text-text-primary">
          Group Standings
        </h1>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="glass rounded-xl overflow-hidden">
              <div className="skeleton-pulse h-10" />
              <div className="p-4 space-y-3">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="skeleton-pulse h-8 rounded" />
                ))}
              </div>
            </div>
          ))}
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
