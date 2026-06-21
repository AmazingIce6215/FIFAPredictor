import { NextResponse } from 'next/server'
import { getMatchById } from '@/lib/football-data'
import { generateMatchPrediction } from '@/lib/groq-predict'

export const dynamic = 'force-dynamic'
export const maxDuration = 30

export async function GET(
  _request: Request,
  { params }: { params: { matchId: string } }
) {
  try {
    const matchId = parseInt(params.matchId, 10)

    const match = await getMatchById(matchId, 30)
    if (!match) {
      return NextResponse.json({ error: 'Match not found', code: 404 }, { status: 404 })
    }

    const isLive = match.status === 'IN_PLAY' || match.status === 'PAUSED'

    const liveData = {
      minute: isLive ? Math.floor(Math.random() * 90) + 1 : 0,
      score: {
        home: match.score.fullTime.home ?? 0,
        away: match.score.fullTime.away ?? 0,
      },
      status: match.status,
      events: [],
    }

    const prediction = await generateMatchPrediction(params.matchId, match, liveData)
    if (!prediction) {
      return NextResponse.json({ error: 'AI prediction failed', code: 503 }, { status: 503 })
    }

    return NextResponse.json({
      match: liveData,
      prediction,
      previousPrediction: null,
      generatedAt: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error('[api/live]', error)
    return NextResponse.json({ error: error.message, code: 500 }, { status: 500 })
  }
}
