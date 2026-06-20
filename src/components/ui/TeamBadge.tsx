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
  const flagUrl = getFlagUrl(country)

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-shrink-0" style={{ width: dim, height: dim }}>
        <Image
          src={flagUrl}
          alt={country}
          width={dim}
          height={dim}
          className="rounded object-contain"
          unoptimized
        />
      </div>
      <div className="flex flex-col">
        <span
          className={`font-display font-bold text-text-primary leading-tight ${
            size === 'lg' ? 'text-2xl' : size === 'md' ? 'text-sm' : 'text-xs'
          }`}
        >
          {name.toUpperCase()}
        </span>
        {size === 'lg' && (
          <span className="text-[11px] font-medium text-text-secondary uppercase tracking-wider">
            {country}
          </span>
        )}
      </div>
    </div>
  )
}
