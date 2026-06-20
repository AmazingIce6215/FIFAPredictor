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
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <span className="relative flex h-2 w-2">
        <span
          className="absolute inline-flex h-full w-full animate-ping rounded-full bg-live-red opacity-75"
          style={{ animationDuration: '1.5s' }}
        />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-live-red shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
      </span>
      <span className="text-[10px] font-bold uppercase tracking-wider text-live-red">
        LIVE{minute ? ` ${minute}'` : ''}
      </span>
      {lastUpdated && (
        <span className="text-[9px] text-text-muted">· {lastUpdated}</span>
      )}
    </div>
  )
}
