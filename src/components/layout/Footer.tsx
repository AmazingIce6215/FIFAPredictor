import { Trophy } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface/50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Trophy size={18} className="text-gold" />
              <span className="text-base font-bold font-display text-gold">WC26 PREDICTOR</span>
            </div>
            <p className="text-xs leading-relaxed text-text-secondary">
              AI-powered predictions for the FIFA World Cup 2026. Data sourced from football-data.org,
              API-Sports, and TheSportsDB. Predictions powered by Groq AI.
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-gold">Quick Links</h4>
            <ul className="space-y-1.5">
              {['Matches', 'Teams', 'Standings', 'Bracket'].map((l) => (
                <li key={l}>
                  <a
                    href={`/${l.toLowerCase()}`}
                    className="text-xs text-text-secondary transition-colors hover:text-gold"
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-gold">Data</h4>
            <p className="text-xs leading-relaxed text-text-secondary">
              Match data refreshes every 60 seconds during live matches. Predictions are AI-generated
              and should not be used as financial advice.
            </p>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-6 text-center">
          <p className="text-[11px] text-text-muted">
            &copy; {new Date().getFullYear()} WC26 Predictor. Not affiliated with FIFA.
          </p>
        </div>
      </div>
    </footer>
  )
}
