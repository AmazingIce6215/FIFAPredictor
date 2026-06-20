import Image from 'next/image'
import { getFlagUrl } from '@/lib/utils'

interface TeamBadgeProps {
  name: string
  crest?: string
  country: string
  size?: 'sm' | 'md' | 'lg'
}

export default function TeamBadge({ name, crest, country, size = 'md' }: TeamBadgeProps) {
  const dimensions = { sm: 24, md: 36, lg: 64 }
  const dim = dimensions[size]
  const src = crest || getFlagUrl(country)

  return (
    <div className="flex items-center gap-2.5">
      <div className="relative flex-shrink-0" style={{ width: dim, height: dim }}>
        <Image
          src={src}
          alt={country || name}
          width={dim}
          height={dim}
          className="rounded object-contain ring-1 ring-border/30"
          unoptimized
        />
      </div>
      <div className="flex flex-col">
        <span
          className={`font-display font-bold text-text-primary leading-tight tracking-wide ${
            size === 'lg' ? 'text-2xl' : size === 'md' ? 'text-base' : 'text-xs'
          }`}
        >
          {name}
        </span>
        {size === 'lg' && (
          <span className="text-[10px] font-medium text-text-muted uppercase tracking-wider">
            {country}
          </span>
        )}
      </div>
    </div>
  )
}
