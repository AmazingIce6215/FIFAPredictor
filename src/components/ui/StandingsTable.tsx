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
    <div className="glass rounded-xl overflow-hidden">
      <div className="border-b border-border px-5 py-3">
        <h3 className="text-sm font-bold font-display text-gold uppercase tracking-wider">
          Group {groupName}
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
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
                gd > 0 ? 'text-win-green' : gd < 0 ? 'text-live-red' : 'text-text-secondary'

              return (
                <tr
                  key={entry.team.id}
                  className="border-b border-border/50 transition-colors hover:bg-surface-raised/50"
                >
                  <td className="px-4 py-3">
                    <span className="text-xs font-bold text-text-secondary">{entry.position}</span>
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
                      <span className="text-xs font-semibold text-text-primary">
                        {entry.team.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-center text-xs text-text-primary tabular-nums">
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
                  <td className={`px-3 py-3 text-center text-xs font-semibold tabular-nums ${gdColor}`}>
                    {gd > 0 ? '+' : ''}{gd}
                  </td>
                  <td className="px-3 py-3 text-center text-sm font-bold font-display text-text-primary tabular-nums">
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
