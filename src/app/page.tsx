'use client'

import { useState, useEffect } from 'react'
import useSWR from 'swr'
import { motion } from 'framer-motion'
import { Swords, Users, LayoutGrid, GitBranch, ChevronRight } from 'lucide-react'
import FootballGL from '@/components/ui/FootballGL'
import { MatchData, StandingTable } from '@/lib/types'
import { isLive } from '@/lib/utils'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

function getTodayMatches(matches: MatchData[]): MatchData[] {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  return matches.filter((m) => {
    const d = new Date(m.utcDate)
    return d >= today && d < tomorrow
  })
}

function getUpcomingMatches(matches: MatchData[]): MatchData[] {
  const now = new Date()
  return matches
    .filter((m) => ['SCHEDULED', 'TIMED'].includes(m.status))
    .slice(0, 6)
}

function getLiveMatches(matches: MatchData[]): MatchData[] {
  return matches.filter((m) => isLive(m.status))
}

function LiveDot({ withText = true }: { withText?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="relative inline-block h-2 w-2">
        <span className="absolute inset-0 rounded-full bg-red" />
        <span className="absolute inset-0 animate-live-pulse rounded-full bg-red" />
      </span>
      {withText && (
        <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-red">
          LIVE
        </span>
      )}
    </span>
  )
}

function FormBadge({ results }: { results: ('W' | 'D' | 'L')[] }) {
  const styles = {
    W: 'bg-[#0D3320] text-volt border-volt/20',
    D: 'bg-[#2A2010] text-gold border-gold/20',
    L: 'bg-[#2D0F0F] text-red border-red/20',
  }
  return (
    <div className="flex gap-[3px] justify-center">
      {results.map((v, i) => (
        <span
          key={i}
          className={`inline-flex h-5 w-5 items-center justify-center rounded text-[9px] font-bold border ${styles[v]}`}
        >
          {v}
        </span>
      ))}
    </div>
  )
}

function ProbBar({
  h, d, a, ht, at, delay = 0,
}: {
  h: number; d: number; a: number; ht: string; at: string; delay?: number
}) {
  const [go, setGo] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setGo(true), delay + 500)
    return () => clearTimeout(t)
  }, [delay])

  const segs = [
    { w: h, bg: 'bg-volt', r: 'rounded-l-sm' },
    { w: d, bg: 'bg-smoke', r: '' },
    { w: a, bg: 'bg-blue', r: 'rounded-r-sm' },
  ]

  return (
    <div>
      <div className="flex justify-between mb-1.5">
        <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-ash">{ht}</span>
        <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-ash">DRAW</span>
        <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-ash">{at}</span>
      </div>
      <div className="flex h-1 rounded-sm overflow-hidden bg-surface gap-px">
        {segs.map((s, i) => (
          <div
            key={i}
            className={`${s.bg} ${s.r}`}
            style={{
              width: go ? `${s.w}%` : '0%',
              transition: `width 0.9s cubic-bezier(0.34,1.26,0.64,1) ${i * 0.08}s`,
            }}
          />
        ))}
      </div>
      <div className="flex justify-between mt-1.5">
        <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-volt">{h}%</span>
        <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-smoke">{d}%</span>
        <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-blue">{a}%</span>
      </div>
    </div>
  )
}

function MatchCard({
  live, hFlag, aFlag, hTeam, aTeam, hForm, aForm, score, min, time, group, stage, hp, dp, ap, note, delay,
}: {
  live: boolean; hFlag: string; aFlag: string; hTeam: string; aTeam: string
  hForm: ('W' | 'D' | 'L')[]; aForm: ('W' | 'D' | 'L')[]
  score?: [string, string]; min?: string; time?: string
  group: string; stage: string; hp: number; dp: number; ap: number
  note: string; delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.001, duration: 0.4 }}
      className="rounded-xl border p-5 relative overflow-hidden bg-card"
      style={{ borderColor: live ? 'rgba(255,48,48,0.15)' : 'var(--border)' }}
    >
      {live && <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-red" />}
      <div className="flex justify-between items-center mb-4">
        <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-ash">{group} · {stage}</span>
        {live ? <LiveDot /> : <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-gold">{time}</span>}
      </div>
      <div className="flex items-center justify-between mb-5">
        <div className="flex-1 text-center">
          <div className="text-[30px] mb-1">{hFlag}</div>
          <div className="text-[11px] font-bold tracking-[0.07em] text-chalk mb-1.5">{hTeam}</div>
          <FormBadge results={hForm} />
        </div>
        <div className="text-center px-3.5">
          {score ? (
            <>
              <div className="font-display text-[44px] leading-none tracking-[0.06em] text-chalk">
                {score[0]}<span className="text-smoke text-[28px] mx-1">:</span>{score[1]}
              </div>
              {live && <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-red">{min}&apos;</div>}
            </>
          ) : (
            <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-smoke">VS</span>
          )}
        </div>
        <div className="flex-1 text-center">
          <div className="text-[30px] mb-1">{aFlag}</div>
          <div className="text-[11px] font-bold tracking-[0.07em] text-chalk mb-1.5">{aTeam}</div>
          <FormBadge results={aForm} />
        </div>
      </div>
      <ProbBar h={hp} d={dp} a={ap} ht={hTeam.slice(0, 3)} at={aTeam.slice(0, 3)} delay={delay} />
      <div
        className="mt-3.5 p-2.5 rounded-lg text-[10px] border"
        style={{
          background: live ? 'rgba(255,48,48,0.03)' : 'rgba(255,215,0,0.03)',
          borderColor: live ? 'rgba(255,48,48,0.08)' : 'rgba(255,215,0,0.08)',
        }}
      >
        <div className="text-[9px] font-semibold uppercase tracking-[0.08em] mb-1" style={{ color: live ? 'var(--red)' : 'var(--gold)' }}>
          AI ANALYSIS · GROQ LLAMA-3.3-70B
        </div>
        <div className="text-[11px] leading-relaxed text-ash">{note}</div>
      </div>
    </motion.div>
  )
}

export default function HomePage() {
  const [showAllGroups, setShowAllGroups] = useState(false)

  const { data: matchesData, isLoading: matchesLoading } = useSWR<{ matches: MatchData[] }>(
    '/api/matches',
    fetcher,
    { refreshInterval: 60000 },
  )

  const { data: standingsData } = useSWR<{ standings: StandingTable[] }>(
    '/api/standings',
    fetcher,
    { refreshInterval: 120000 },
  )

  const matches = matchesData?.matches ?? []
  const standings = standingsData?.standings ?? []

  const liveMatches = getLiveMatches(matches)
  const todayMatches = getTodayMatches(matches)
  const upcoming = getUpcomingMatches(matches)

  const timeline = [
    { t: "1'", tag: 'Kickoff', p: 45 },
    { t: "23'", tag: 'Yellow', p: 47 },
    { t: "38'", tag: '⚽ Goal', p: 58, ev: true },
    { t: "51'", tag: '⚽ Goal', p: 63, ev: true },
    { t: "55'", tag: '⚽ Gegn.', p: 60 },
    { t: "62'", tag: 'Yellow', p: 61 },
    { t: "67'", tag: 'Now', p: 64, now: true },
  ]

  const sampleMatches = [
    {
      live: true, hFlag: '🇧🇷', aFlag: '🇩🇪', hTeam: 'BRAZIL', aTeam: 'GERMANY',
      hForm: ['W', 'W', 'D', 'W', 'W'] as ('W' | 'D' | 'L')[],
      aForm: ['W', 'D', 'W', 'L', 'W'] as ('W' | 'D' | 'L')[],
      score: ['2', '1'] as [string, string], min: '67', group: 'GROUP A', stage: 'MATCHDAY 2',
      hp: 64, dp: 14, ap: 22, delay: 0,
      note: "Brazil's lead and sustained possession dominance make them the clear favourite. Germany's equaliser window narrows with each minute.",
    },
    {
      live: false, hFlag: '🇦🇷', aFlag: '🇫🇷', hTeam: 'ARGENTINA', aTeam: 'FRANCE',
      hForm: ['W', 'W', 'W', 'W', 'D'] as ('W' | 'D' | 'L')[],
      aForm: ['W', 'W', 'D', 'W', 'W'] as ('W' | 'D' | 'L')[],
      time: '20:00 UTC', group: 'GROUP C', stage: 'MATCHDAY 2',
      hp: 42, dp: 23, ap: 35, delay: 200,
      note: 'A World Cup final rematch. Argentina holds a marginal form edge. Mbappé fitness (rated 78% to start) is the decisive variable today.',
    },
  ]

  const navLinks = [
    { href: '/matches', label: 'Matches', icon: Swords },
    { href: '/teams', label: 'Teams', icon: Users },
    { href: '/standings', label: 'Standings', icon: LayoutGrid },
    { href: '/bracket', label: 'Bracket', icon: GitBranch },
  ]

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', color: 'var(--chalk)' }}>

      {/* ── NAVBAR ── */}
      <nav className="flex items-center justify-between px-8 border-b" style={{ height: 52, borderColor: 'var(--border)', background: 'rgba(4,13,26,0.96)' }}>
        <div className="flex items-center gap-2">
          <span className="text-base">⚽</span>
          <span className="font-display text-base tracking-[0.1em] text-chalk">
            WC26 <span className="text-volt">PREDICT</span>
          </span>
        </div>
        <div className="hidden md:flex gap-6">
          {navLinks.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-[10px] font-semibold uppercase tracking-[0.08em] text-smoke hover:text-chalk transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border" style={{ borderColor: 'rgba(255,48,48,0.2)', background: 'rgba(255,48,48,0.05)' }}>
            <LiveDot withText={false} />
            <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-ash">{liveMatches.length} LIVE</span>
          </div>
          <button className="bg-volt text-[#040D1A] border-none rounded-full px-4 py-[7px] font-bold text-[11px] tracking-[0.05em] cursor-pointer font-body">
            LIVE →
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="px-8 md:px-12 flex items-center justify-between relative overflow-hidden" style={{ paddingTop: 52, paddingBottom: 40 }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 50% 80% at 72% 45%,rgba(0,255,135,0.045) 0%,transparent 70%)',
        }} />
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 55% 50% at 18% 80%,rgba(77,158,255,0.03) 0%,transparent 70%)',
        }} />

        <div className="max-w-lg relative z-10">
          <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-volt mb-3.5">
            FIFA WORLD CUP 2026 · AI PREDICTION ENGINE
          </div>
          <h1 className="font-display text-[74px] leading-[0.88] tracking-[-0.01em] mb-6 text-chalk">
            PREDICT<br />THE<br />
            <span className="text-transparent" style={{ WebkitTextStroke: '1.5px var(--volt)' }}>BEAUTIFUL</span><br />GAME
          </h1>
          <p className="text-sm leading-relaxed text-ash max-w-sm mb-7">
            Real-time AI predictions using team form, H2H history, player data and live events — updated every 60 seconds via Groq.
          </p>
          <div className="flex gap-2.5">
            <button className="bg-volt text-[#040D1A] border-none rounded-full px-6 py-[11px] font-bold text-xs tracking-[0.05em] cursor-pointer font-body">
              VIEW LIVE MATCHES
            </button>
            <button className="bg-transparent text-chalk rounded-full px-6 py-[11px] text-xs cursor-pointer font-body" style={{ border: '1px solid var(--border-hi)' }}>
              AI Predictions →
            </button>
          </div>
        </div>

        <div className="relative z-10 flex flex-col items-center gap-4 hidden lg:flex">
          <div className="relative">
            <div className="absolute -inset-12 pointer-events-none rounded-full" style={{
              background: 'radial-gradient(circle,rgba(0,255,135,0.1) 0%,transparent 70%)',
            }} />
            <FootballGL size={250} />
          </div>
          {/* Stage tracker */}
          <div className="flex gap-1.5 items-center">
            {[['GROUP', '›'], ['R32', '›'], ['R16', '›'], ['QF', '›'], ['SF', '›'], ['FINAL', '']].map(([s, arrow], i) => (
              <div key={s} className="flex items-center gap-1.5">
                <div
                  className="px-[7px] py-[3px] rounded text-[9px] font-semibold uppercase tracking-[0.08em]"
                  style={{
                    color: i === 0 ? 'var(--volt)' : 'var(--smoke)',
                    background: i === 0 ? 'rgba(0,255,135,0.07)' : 'transparent',
                    border: i === 0 ? '1px solid rgba(0,255,135,0.15)' : '1px solid var(--border)',
                  }}
                >
                  {s}
                </div>
                {arrow && <span className="text-[9px] text-smoke">{arrow}</span>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-px mx-8 md:mx-12" style={{
        background: 'linear-gradient(90deg,transparent,var(--border),transparent)',
      }} />

      {/* ── MATCH CARDS ── */}
      <section className="px-8 md:px-12 py-8">
        <div className="flex justify-between items-baseline mb-5">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-volt mb-1">
              TODAY&apos;S MATCHES
            </div>
            <div className="font-display text-[26px] tracking-[0.05em] text-chalk">
              AI PREDICTIONS
            </div>
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-smoke">
            JUNE 20, 2026 · GROUP STAGE
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {sampleMatches.map((m, i) => (
            <MatchCard key={i} {...m} />
          ))}
        </div>
      </section>

      {/* ── LIVE PROBABILITY TRACKER ── */}
      <section className="px-8 md:px-12 pb-10">
        <div className="rounded-xl border p-5" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className="flex justify-between items-center mb-4">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-volt mb-1">
                LIVE PROBABILITY TRACKER
              </div>
              <div className="font-display text-[22px] tracking-[0.05em] text-chalk">
                BRAZIL WIN % · UPDATES EVERY 60 SECONDS
              </div>
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-smoke">
              LAST UPDATE 8s AGO
            </span>
          </div>
          <div className="flex gap-2.5 items-end h-[72px] mb-2.5">
            {timeline.map(({ t, p, ev, now }, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span
                  className="text-[10px] font-semibold"
                  style={{ color: now ? 'var(--volt)' : ev ? 'var(--volt)' : 'var(--smoke)' }}
                >
                  {p}%
                </span>
                <div
                  className="w-full rounded-t-sm"
                  style={{
                    height: `${(p / 75) * 100}%`,
                    background: now ? 'var(--volt)' : ev ? 'rgba(0,255,135,0.5)' : 'rgba(0,255,135,0.2)',
                  }}
                />
              </div>
            ))}
          </div>
          <div className="flex gap-2.5">
            {timeline.map(({ t, tag, ev, now }, i) => (
              <div
                key={i}
                className="flex-1 p-1.5 rounded-md"
                style={{
                  background: 'var(--card)',
                  border: now ? '1px solid rgba(0,255,135,0.2)' : '1px solid var(--border)',
                }}
              >
                <div
                  className="text-[9px] font-semibold uppercase tracking-[0.08em] mb-0.5"
                  style={{ color: now ? 'var(--volt)' : 'var(--smoke)' }}
                >
                  {t}
                </div>
                <div
                  className="text-[11px]"
                  style={{ color: ev ? 'var(--volt)' : 'var(--ash)' }}
                >
                  {tag}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DESIGN TOKEN STRIP ── */}
      <section className="px-8 md:px-12 pb-10">
        <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-smoke mb-3">
          PITCH DARK — DESIGN TOKEN REFERENCE
        </div>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-2 mb-4">
          {[
            { n: 'Void', v: '#040D1A', t: '#F0F4F8' },
            { n: 'Surface', v: '#071525', t: '#F0F4F8' },
            { n: 'Card', v: '#0A1A30', t: '#F0F4F8' },
            { n: 'Chalk', v: '#F0F4F8', t: '#040D1A' },
            { n: 'Turf Volt ★', v: '#00FF87', t: '#040D1A' },
            { n: 'Gold Cup', v: '#FFD700', t: '#040D1A' },
            { n: 'Live Red', v: '#FF3030', t: '#F0F4F8' },
            { n: 'Away Blue', v: '#4D9EFF', t: '#F0F4F8' },
          ].map(({ n, v, t }) => (
            <div
              key={n}
              className="rounded-lg p-[11px] border"
              style={{ background: v, borderColor: 'rgba(240,244,248,0.07)' }}
            >
              <div className="text-[9px] font-bold uppercase tracking-[0.04em] mb-1" style={{ color: t }}>
                {n}
              </div>
              <div className="text-[9px] font-mono" style={{ color: `${t}AA` }}>{v}</div>
            </div>
          ))}
        </div>
        <div
          className="flex items-center gap-5 p-3.5 rounded-lg border"
          style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
        >
          <span className="font-display text-[40px] tracking-[0.02em] text-chalk">Bebas Neue</span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-volt">Display · Scores · All headings</span>
          <span className="w-px h-6" style={{ background: 'var(--border)' }} />
          <span className="text-sm text-ash">Inter — body, labels, stats, captions, data text</span>
          <span className="w-px h-6" style={{ background: 'var(--border)' }} />
          <span className="text-[11px] font-mono text-smoke">tabular-nums for all stat values</span>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <div className="border-t px-8 md:px-12 py-4 flex justify-between" style={{ borderColor: 'var(--border)' }}>
        <span className="font-display text-[13px] tracking-[0.1em] text-smoke">
          WC26 PREDICT · PITCH DARK SYSTEM
        </span>
        <span className="text-[11px] text-smoke">
          Groq llama-3.3-70b · football-data.org · api-sports.io · TheSportsDB
        </span>
      </div>

      {/* ── Group Standings (preserved from original) ── */}
      {standings.length > 0 && (
        <section className="px-8 md:px-12 pb-10">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-display text-[22px] tracking-[0.05em] text-chalk">
              Group Standings
            </h2>
            <button
              onClick={() => setShowAllGroups(!showAllGroups)}
              className="text-[10px] font-semibold uppercase tracking-[0.08em] text-gold hover:text-chalk transition-colors flex items-center gap-1"
            >
              {showAllGroups ? 'Show Less' : 'Show All'}
              <ChevronRight size={12} />
            </button>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {(showAllGroups ? standings : standings.slice(0, 4)).map((st) => (
              <div
                key={st.group || st.stage}
                className="rounded-xl border p-4"
                style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
              >
                <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-ash mb-3">
                  {st.group || st.stage}
                </div>
                {st.table.map((entry) => (
                  <div key={entry.team.id} className="flex items-center justify-between py-1.5 text-xs border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-semibold text-smoke w-4">{entry.position}</span>
                      <span className="text-chalk font-medium">{entry.team.shortName || entry.team.name}</span>
                    </div>
                    <div className="flex items-center gap-3 text-ash text-[10px]">
                      <span>{entry.playedGames}</span>
                      <span>{entry.won}</span>
                      <span>{entry.draw}</span>
                      <span>{entry.lost}</span>
                      <span className="font-bold text-chalk">{entry.points}</span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Loading State */}
      {matchesLoading && (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-8 md:px-12 pb-10">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-xl border p-5" style={{ borderColor: 'var(--border)', background: 'var(--card)' }}>
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
      )}
    </div>
  )
}
