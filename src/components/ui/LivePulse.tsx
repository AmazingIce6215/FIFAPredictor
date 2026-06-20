'use client'

interface LivePulseProps {
  status: string
  minute?: number
  className?: string
  lastUpdated?: string
}

export default function LivePulse({ status, minute, className = '', lastUpdated }: LivePulseProps) {
  const isLive = status === 'IN_PLAY' || status === 'PAUSED'
  if (!isLive) return null

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-live-red opacity-60" style={{ animationDuration: '2s' }} />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-live-red shadow-[0_0_8px_rgba(229,62,62,0.6)]" />
      </span>
      <span className="text-xs font-bold uppercase tracking-wider text-live-red">
        Live{minute ? ` ${minute}'` : ''}
      </span>
      {lastUpdated && (
        <span className="text-[10px] text-text-muted">{lastUpdated}</span>
      )}
    </div>
  )
}
