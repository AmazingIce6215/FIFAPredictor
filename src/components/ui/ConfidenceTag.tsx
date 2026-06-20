import { getConfidenceColor } from '@/lib/utils'

interface ConfidenceTagProps {
  confidence: 'HIGH' | 'MEDIUM' | 'LOW'
}

export default function ConfidenceTag({ confidence }: ConfidenceTagProps) {
  const color = getConfidenceColor(confidence)

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider"
      style={{
        color,
        backgroundColor: `${color}15`,
        border: `1px solid ${color}30`,
      }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: color }}
      />
      {confidence} Confidence
    </span>
  )
}
