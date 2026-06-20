'use client'

import useSWR from 'swr'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Shield, TrendingUp, Calendar, Swords } from 'lucide-react'
import { getFlagUrl } from '@/lib/utils'
import { GROUPS, FIFA_RANKINGS } from '@/lib/country-codes'
import FormBadge from '@/components/ui/FormBadge'
import MatchCard from '@/components/ui/MatchCard'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

function getTeamBySlug(slug: string): { name: string; group: string } | null {
  for (const [group, teams] of Object.entries(GROUPS)) {
    for (const name of teams) {
      if (name.toLowerCase().replace(/\s+/g, '-') === slug) {
        return { name, group }
      }
    }
  }
  return null
}

export default function TeamProfilePage({ params }: { params: { id: string } }) {
  const teamInfo = getTeamBySlug(params.id)

  const { data: matchesData } = useSWR<{ matches: any[] }>('/api/matches', fetcher)

  if (!teamInfo) {
    return (
      <div className="flex flex-col items-center gap-4 py-20">
        <p className="text-text-secondary">Team not found.</p>
      </div>
    )
  }

  const { name, group } = teamInfo
  const ranking = FIFA_RANKINGS[name] || '—'
  const flagUrl = getFlagUrl(name)
  const recentForm: ('W' | 'D' | 'L')[] = ['W', 'W', 'D', 'L', 'W']

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Hero */}
      <div className="glass relative overflow-hidden rounded-2xl p-8">
        <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-loss-blue/5" />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <Image
            src={flagUrl}
            alt={name}
            width={96}
            height={96}
            className="h-24 w-24 rounded object-contain"
            unoptimized
          />
          <div className="text-center">
            <h1 className="text-2xl font-bold font-display text-text-primary md:text-3xl">
              {name.toUpperCase()}
            </h1>
            <span className="text-xs font-semibold uppercase tracking-wider text-gold">
              Group {group}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={<Shield size={16} />} label="FIFA Ranking" value={`#${ranking}`} />
        <StatCard icon={<TrendingUp size={16} />} label="Recent Form" value={<FormBadge results={recentForm} />} />
        <StatCard icon={<Swords size={16} />} label="Matches Played" value="5" />
        <StatCard icon={<Calendar size={16} />} label="Group" value={group} />
      </div>

      {/* Squad */}
      <div className="glass rounded-xl p-6">
        <h2 className="mb-4 text-sm font-bold font-display uppercase tracking-wider text-gold">
          Squad
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { name: 'Player 1', pos: 'GK', num: 1 },
            { name: 'Player 2', pos: 'DF', num: 4 },
            { name: 'Player 3', pos: 'MF', num: 8 },
            { name: 'Player 4', pos: 'FW', num: 10 },
            { name: 'Player 5', pos: 'MF', num: 6 },
            { name: 'Player 6', pos: 'DF', num: 3 },
          ].map((p, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-lg bg-surface p-3 transition-colors hover:bg-surface-raised"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold/10 text-xs font-bold text-gold">
                {p.num}
              </div>
              <div>
                <span className="text-xs font-semibold text-text-primary">{p.name}</span>
                <p className="text-[10px] text-text-muted uppercase tracking-wider">{p.pos}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Results */}
      <div>
        <h2 className="mb-4 text-sm font-bold font-display uppercase tracking-wider text-gold">
          Recent Results
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {matchesData?.matches
            ?.filter(
              (m: any) =>
                m.homeTeam.name === name || m.awayTeam.name === name
            )
            .slice(0, 6)
            .map((match: any, i: number) => (
              <MatchCard key={match.id} match={match} index={i} />
            ))}
        </div>
      </div>
    </motion.div>
  )
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: React.ReactNode
}) {
  return (
    <div className="glass rounded-xl p-4">
      <div className="mb-2 flex items-center gap-1.5 text-gold">{icon}</div>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
        {label}
      </p>
      <div className="mt-1 text-lg font-bold font-display text-text-primary">{value}</div>
    </div>
  )
}
