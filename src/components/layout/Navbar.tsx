'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Trophy, Swords, Users, LayoutGrid, GitBranch, Radio } from 'lucide-react'

const navLinks = [
  { href: '/', label: 'Home', icon: Trophy },
  { href: '/matches', label: 'Matches', icon: Swords },
  { href: '/teams', label: 'Teams', icon: Users },
  { href: '/standings', label: 'Standings', icon: LayoutGrid },
  { href: '/bracket', label: 'Bracket', icon: GitBranch },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <header className="fixed top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold/20">
            <Trophy size={16} className="text-gold" />
          </div>
          <span className="text-lg font-bold font-display tracking-wide text-gold">
            WC26 PREDICTOR
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
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

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 rounded-full border border-live-red/30 bg-live-red/5 px-3 py-1">
            <Radio size={12} className="text-live-red" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-live-red">
              Live
            </span>
          </span>
        </div>
      </div>

      <div className="h-0.5 w-full bg-border">
        <div className="h-full w-1/3 bg-gold transition-all duration-500" />
      </div>
    </header>
  )
}
