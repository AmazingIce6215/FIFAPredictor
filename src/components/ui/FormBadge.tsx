import { getFormBadgeColor } from '@/lib/utils'

interface FormBadgeProps {
  results: ('W' | 'D' | 'L')[]
  className?: string
}

export default function FormBadge({ results, className = '' }: FormBadgeProps) {
  return (
    <div className={`flex gap-1 ${className}`}>
      {results.map((r, i) => (
        <span
          key={i}
          className={`inline-flex h-5 w-5 items-center justify-center rounded text-[10px] font-bold leading-none text-white ${getFormBadgeColor(r)}`}
        >
          {r}
        </span>
      ))}
    </div>
  )
}
