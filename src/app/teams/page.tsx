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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gold/30 to-gold/10 ring-1 ring-gold/20">
            <Users size={18} className="text-gold" />
          </div>
          <div>
            <h1 className="text-lg font-bold font-display uppercase tracking-wider text-text-primary">
              Teams
            </h1>
            <p className="text-[10px] text-text-muted">{allTeams.length} qualified nations</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search teams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-border bg-surface py-2.5 pl-9 pr-3 text-xs text-text-primary placeholder:text-text-muted focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30 transition-all duration-200"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setSelectedGroup(null)}
            className={`rounded-lg px-3.5 py-2 text-[10px] font-bold uppercase tracking-wider transition-all duration-200 ${
              !selectedGroup
                ? 'bg-gold text-background shadow-[0_0_15px_rgba(251,191,36,0.2)]'
                : 'bg-surface text-text-secondary border border-border hover:border-border-bright hover:text-text-primary'
            }`}
          >
            All
          </button>
          {GROUP_LABELS.map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGroup(g === selectedGroup ? null : g)}
              className={`rounded-lg px-3 py-2 text-[10px] font-bold uppercase tracking-wider transition-all duration-200 ${
                selectedGroup === g
                  ? 'bg-gold text-background shadow-[0_0_15px_rgba(251,191,36,0.2)]'
                  : 'bg-surface text-text-secondary border border-border hover:border-border-bright hover:text-text-primary'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Teams Grid */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="rounded-xl border border-border bg-surface p-6 text-center">
              <div className="skeleton-pulse mx-auto mb-3 h-14 w-14 rounded-full" />
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
                <div className="group relative overflow-hidden rounded-xl border border-border bg-gradient-to-b from-surface to-surface/50 p-6 text-center transition-all duration-300 hover:border-gold/30 hover:shadow-[0_0_25px_rgba(251,191,36,0.08)] hover:-translate-y-0.5">
                  <div className="absolute inset-0 bg-gradient-to-t from-gold/[0.03] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="relative">
                    <Image
                      src={getFlagUrl(team.name)}
                      alt={team.name}
                      width={56}
                      height={56}
                      className="mx-auto h-14 w-14 rounded-full object-contain ring-2 ring-border/50 transition-all duration-300 group-hover:ring-gold/40"
                      unoptimized
                    />
                    <h3 className="mt-3 text-sm font-bold font-display text-text-primary transition-colors duration-200 group-hover:text-gold">
                      {team.name}
                    </h3>
                    <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
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
