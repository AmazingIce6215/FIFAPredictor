import { getConfidenceColor } from '@/lib/utils'

interface ConfidenceTagProps {
  confidence: 'HIGH' | 'MEDIUM' | 'LOW'
}

export default function ConfidenceTag({ confidence }: ConfidenceTagProps) {
  const color = getConfidenceColor(confidence)
  const labels = { HIGH: 'High confidence', MEDIUM: 'Medium confidence', LOW: 'Low confidence' }
  const dots = { HIGH: 3, MEDIUM: 2, LOW: 1 }

  return (
    <span
      className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider transition-colors duration-200"
      style={{
        color,
        backgroundColor: `${color}12`,
        border: `1px solid ${color}25`,
      }}
    >
      <span className="flex gap-0.5">
        {[...Array(3)].map((_, i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 rounded-full transition-all duration-200"
            style={{
              backgroundColor: i < dots[confidence] ? color : `${color}20`,
            }}
          />
        ))}
      </span>
      {labels[confidence]}
    </span>
  )
}
