import { getFormBadgeColor } from '@/lib/utils'

interface FormBadgeProps {
  results: ('W' | 'D' | 'L')[]
  className?: string
}

export default function FormBadge({ results, className = '' }: FormBadgeProps) {
  if (!results || results.length === 0) return null

  return (
    <div className={`flex gap-1 ${className}`}>
      {results.map((r, i) => (
        <span
          key={i}
          className={`inline-flex h-5 w-5 items-center justify-center rounded text-[9px] font-bold leading-none text-white/90 ${getFormBadgeColor(r)}`}
        >
          {r}
        </span>
      ))}
    </div>
  )
}
