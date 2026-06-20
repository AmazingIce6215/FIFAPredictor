'use client'

import { useState } from 'react'
import useSWR from 'swr'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Users, Search } from 'lucide-react'
import { TeamInfo } from '@/lib/types'
import { getFlagUrl } from '@/lib/utils'
import { GROUPS } from '@/lib/country-codes'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

const GROUP_LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']

export default function TeamsPage() {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const { data, isLoading } = useSWR<{ matches: any[] }>('/api/matches', fetcher, {
    revalidateOnFocus: false,
  })

  // Build team list from GROUPS const
  const allTeams = GROUP_LABELS.flatMap((g) =>
    (GROUPS[g] || []).map((name) => ({
      name,
      group: g,
      id: name.toLowerCase().replace(/\s+/g, '-'),
    }))
  )

  const filteredTeams = allTeams.filter((team) => {
    if (selectedGroup && team.group !== selectedGroup) return false
    if (searchQuery && !team.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users size={20} className="text-gold" />
          <h1 className="text-xl font-bold font-display uppercase tracking-wider text-text-primary">
            Teams
          </h1>
        </div>
        <span className="text-xs text-text-muted">{allTeams.length} nations</span>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search teams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-border bg-surface py-2 pl-9 pr-3 text-xs text-text-primary placeholder:text-text-muted focus:border-gold focus:outline-none"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setSelectedGroup(null)}
            className={`rounded-lg px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider transition-colors ${
              !selectedGroup
                ? 'bg-gold text-background'
                : 'border border-border text-text-secondary hover:border-border-bright'
            }`}
          >
            All
          </button>
          {GROUP_LABELS.map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGroup(g === selectedGroup ? null : g)}
              className={`rounded-lg px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider transition-colors ${
                selectedGroup === g
                  ? 'bg-gold text-background'
                  : 'border border-border text-text-secondary hover:border-border-bright'
              }`}
            >
              Group {g}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="glass rounded-xl p-5">
              <div className="skeleton-pulse mx-auto mb-3 h-12 w-12 rounded-full" />
              <div className="skeleton-pulse mx-auto h-4 w-24 rounded" />
              <div className="skeleton-pulse mx-auto mt-2 h-3 w-16 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        >
          {filteredTeams.map((team, i) => (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}
            >
              <Link href={`/teams/${team.id}`}>
                <div className="glass glass-hover group flex cursor-pointer flex-col items-center gap-3 rounded-xl p-6 text-center transition-all duration-200 hover:scale-[1.02]">
                  <Image
                    src={getFlagUrl(team.name)}
                    alt={team.name}
                    width={56}
                    height={56}
                    className="h-14 w-14 rounded object-contain"
                    unoptimized
                  />
                  <div>
                    <span className="text-sm font-bold font-display text-text-primary group-hover:text-gold-bright transition-colors">
                      {team.name.toUpperCase()}
                    </span>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-gold">
                      Group {team.group}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
