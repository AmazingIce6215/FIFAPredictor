'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Trophy, Swords, Users, LayoutGrid, GitBranch, Radio, Menu, X } from 'lucide-react'
import { useState } from 'react'

const navLinks = [
  { href: '/', label: 'Home', icon: Trophy },
  { href: '/matches', label: 'Matches', icon: Swords },
  { href: '/teams', label: 'Teams', icon: Users },
  { href: '/standings', label: 'Standings', icon: LayoutGrid },
  { href: '/bracket', label: 'Bracket', icon: GitBranch },
]

export default function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="fixed top-0 z-50 w-full">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-xl" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 ring-1 ring-primary/30 transition-all duration-300 group-hover:ring-primary/60 group-hover:shadow-[0_0_20px_var(--primary-glow)]">
            <Trophy size={16} className="text-primary-light" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold font-display leading-none tracking-wider text-gradient-gold">
              WC26
            </span>
            <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-text-muted leading-tight">
              Predictor
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-0.5 md:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[11px] font-semibold uppercase tracking-wider transition-all duration-200 ${
                  isActive
                    ? 'text-gold'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {isActive && (
                  <span className="absolute inset-0 rounded-lg bg-gold/10 ring-1 ring-gold/20" />
                )}
                <link.icon size={13} className="relative" />
                <span className="relative">{link.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-1.5 rounded-full border border-red-500/20 bg-red-500/5 px-3 py-1 sm:flex">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-live-red opacity-75" style={{ animationDuration: '1.5s' }} />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-live-red shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-live-red">Live</span>
          </span>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-text-secondary transition-colors hover:border-border-bright hover:text-text-primary md:hidden"
          >
            {mobileOpen ? <X size={15} /> : <Menu size={15} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="absolute inset-x-0 top-16 border-b border-border bg-background/95 backdrop-blur-xl md:hidden">
          <nav className="flex flex-col gap-1 p-4">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                    isActive
                      ? 'bg-gold/10 text-gold'
                      : 'text-text-secondary hover:bg-surface-raised hover:text-text-primary'
                  }`}
                >
                  <link.icon size={14} />
                  {link.label}
                </Link>
              )
            })}
          </nav>
        </div>
      )}
    </header>
  )
}
