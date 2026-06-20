interface ConfidenceTagProps {
  confidence: 'HIGH' | 'MEDIUM' | 'LOW'
}

export default function ConfidenceTag({ confidence }: ConfidenceTagProps) {
  const config = {
    HIGH: { color: '#22C55E', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.2)', label: 'High', dots: 3 },
    MEDIUM: { color: '#FBBF24', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.2)', label: 'Medium', dots: 2 },
    LOW: { color: '#EF4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.2)', label: 'Low', dots: 1 },
  }

  const c = config[confidence]

  return (
    <span
      className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider"
      style={{
        color: c.color,
        backgroundColor: c.bg,
        border: `1px solid ${c.border}`,
      }}
    >
      <span className="flex gap-0.5">
        {[...Array(3)].map((_, i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 rounded-full transition-all duration-200"
            style={{ backgroundColor: i < c.dots ? c.color : `${c.color}20` }}
          />
        ))}
      </span>
      {c.label}
    </span>
  )
}
