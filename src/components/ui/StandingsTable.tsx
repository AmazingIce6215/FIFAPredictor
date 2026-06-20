import Image from 'next/image'
import { StandingEntry } from '@/lib/types'
import { getFlagUrl } from '@/lib/utils'
import FormBadge from './FormBadge'

interface StandingsTableProps {
  groupName: string
  entries: StandingEntry[]
}

export default function StandingsTable({ groupName, entries }: StandingsTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-gradient-to-b from-surface to-surface/50">
      <div className="border-b border-border px-5 py-3">
        <h3 className="text-sm font-bold font-display text-gradient-gold uppercase tracking-wider">
          Group {groupName}
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border/50 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
              <th className="px-4 py-3 w-8">#</th>
              <th className="px-4 py-3">Team</th>
              <th className="px-3 py-3 text-center">P</th>
              <th className="px-3 py-3 text-center">W</th>
              <th className="px-3 py-3 text-center">D</th>
              <th className="px-3 py-3 text-center">L</th>
              <th className="px-3 py-3 text-center">GF</th>
              <th className="px-3 py-3 text-center">GA</th>
              <th className="px-3 py-3 text-center">GD</th>
              <th className="px-3 py-3 text-center">Pts</th>
              <th className="px-3 py-3 text-center">Form</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => {
              const gd = entry.goalDifference
              const gdColor =
                gd > 0 ? 'text-win' : gd < 0 ? 'text-loss' : 'text-text-muted'
              const isTopTwo = entry.position <= 2

              return (
                <tr
                  key={entry.team.id}
                  className={`border-b border-border/30 transition-colors duration-200 hover:bg-surface-raised/50 cursor-pointer ${
                    isTopTwo ? 'bg-win/5' : ''
                  }`}
                >
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold tabular-nums ${
                      isTopTwo ? 'text-gold' : 'text-text-muted'
                    }`}>
                      {entry.position}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <Image
                        src={getFlagUrl(entry.team.country)}
                        alt={entry.team.country}
                        width={20}
                        height={20}
                        className="h-5 w-5 rounded object-contain"
                        unoptimized
                      />
                      <span className="text-[11px] font-bold text-text-primary tracking-wide">
                        {entry.team.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-center text-xs text-text-primary tabular-nums font-medium">
                    {entry.playedGames}
                  </td>
                  <td className="px-3 py-3 text-center text-xs text-text-primary tabular-nums">
                    {entry.won}
                  </td>
                  <td className="px-3 py-3 text-center text-xs text-text-primary tabular-nums">
                    {entry.draw}
                  </td>
                  <td className="px-3 py-3 text-center text-xs text-text-primary tabular-nums">
                    {entry.lost}
                  </td>
                  <td className="px-3 py-3 text-center text-xs text-text-primary tabular-nums">
                    {entry.goalsFor}
                  </td>
                  <td className="px-3 py-3 text-center text-xs text-text-primary tabular-nums">
                    {entry.goalsAgainst}
                  </td>
                  <td className={`px-3 py-3 text-center text-xs font-bold tabular-nums ${gdColor}`}>
                    {gd > 0 ? '+' : ''}{gd}
                  </td>
                  <td className="px-3 py-3 text-center text-sm font-bold font-display text-gold tabular-nums">
                    {entry.points}
                  </td>
                  <td className="px-3 py-3">
                    {entry.form && <FormBadge results={entry.form} className="justify-center" />}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
