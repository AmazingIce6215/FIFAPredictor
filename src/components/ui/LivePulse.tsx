'use client'

interface LivePulseProps {
  status: string
  minute?: number
  className?: string
}

export default function LivePulse({ status, minute, className = '' }: LivePulseProps) {
  const isLive = status === 'IN_PLAY' || status === 'PAUSED'
  if (!isLive) return null

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-live-red opacity-75" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-live-red live-pulse" />
      </span>
      <span className="text-xs font-semibold uppercase tracking-wider text-live-red">
        Live{minute ? ` ${minute}'` : ''}
      </span>
    </div>
  )
}
