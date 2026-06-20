'use client'

import useSWR from 'swr'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Shield, TrendingUp, Calendar, Swords, Target } from 'lucide-react'
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
      <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-surface via-surface to-background p-8">
        <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-gold/5 blur-3xl" />
        <div className="relative z-10 flex flex-col items-center gap-5">
          <div className="relative h-28 w-28 overflow-hidden rounded-2xl bg-surface-raised ring-2 ring-border/50">
            <Image
              src={flagUrl}
              alt={name}
              width={112}
              height={112}
              className="h-full w-full object-contain p-3"
              unoptimized
            />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold font-display tracking-wide text-text-primary md:text-3xl">
              {name}
            </h1>
            <span className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-gold/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gold ring-1 ring-gold/20">
              Group {group}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<Shield size={15} className="text-gold" />}
          label="FIFA Ranking"
          value={<span className="text-gold">#{ranking}</span>}
        />
        <StatCard
          icon={<TrendingUp size={15} className="text-win" />}
          label="Recent Form"
          value={<FormBadge results={recentForm} />}
        />
        <StatCard
          icon={<Swords size={15} className="text-primary-light" />}
          label="Matches Played"
          value="5"
        />
        <StatCard
          icon={<Calendar size={15} className="text-gold" />}
          label="Group"
          value={group}
        />
      </div>

      {/* Squad */}
      <div className="rounded-xl border border-border bg-gradient-to-b from-surface to-surface/50 p-6">
        <h2 className="mb-5 flex items-center gap-2 text-xs font-bold font-display uppercase tracking-wider text-gold">
          <Target size={14} />
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
              className="flex items-center gap-3 rounded-xl bg-surface-raised/50 p-3 transition-colors hover:bg-surface-raised"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold/10 text-xs font-bold text-gold ring-1 ring-gold/20">
                {p.num}
              </div>
              <div>
                <span className="text-xs font-bold text-text-primary">{p.name}</span>
                <p className="text-[9px] font-semibold text-text-muted uppercase tracking-wider">{p.pos}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Results */}
      <div>
        <h2 className="mb-4 text-xs font-bold font-display uppercase tracking-wider text-gold">
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
    <div className="rounded-xl border border-border bg-gradient-to-b from-surface to-surface/50 p-5 transition-all duration-200 hover:border-border-bright">
      <div className="mb-2 flex items-center gap-1.5">{icon}</div>
      <p className="text-[9px] font-semibold uppercase tracking-wider text-text-muted">{label}</p>
      <div className="mt-1 text-lg font-bold font-display text-text-primary">{value}</div>
    </div>
  )
}
