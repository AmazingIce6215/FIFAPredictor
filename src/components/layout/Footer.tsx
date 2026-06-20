import { Trophy, Globe } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-border/50 bg-gradient-to-b from-transparent to-surface/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary/30 to-primary/10 ring-1 ring-primary/20">
                <Trophy size={14} className="text-primary-light" />
              </div>
              <span className="text-sm font-bold font-display tracking-wider text-gradient-gold">
                WC26 PREDICTOR
              </span>
            </div>
            <p className="text-xs leading-relaxed text-text-secondary max-w-xs">
              AI-powered predictions for the FIFA World Cup 2026. Data sourced from football-data.org,
              API-Sports, and TheSportsDB.
            </p>
          </div>
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-gold">Quick Links</h4>
            <ul className="space-y-2">
              {['Matches', 'Teams', 'Standings', 'Bracket'].map((l) => (
                <li key={l}>
                  <a
                    href={`/${l.toLowerCase()}`}
                    className="text-xs text-text-secondary transition-colors duration-200 hover:text-gold hover:underline underline-offset-4 decoration-gold/30"
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-gold">Data</h4>
            <p className="text-xs leading-relaxed text-text-secondary">
              Match data refreshes every 60 seconds during live matches. Predictions are AI-generated
              and should not be used as financial advice.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md border border-border text-text-muted transition-colors hover:border-border-bright hover:text-text-secondary">
                <Globe size={12} />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-border/50 pt-6 text-center">
          <p className="text-[10px] text-text-muted tracking-wider uppercase">
            &copy; {new Date().getFullYear()} WC26 Predictor &mdash; Not affiliated with FIFA.
          </p>
        </div>
      </div>
    </footer>
  )
}
