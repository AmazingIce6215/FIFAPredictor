import { NextResponse } from 'next/server'
import { getMatchById } from '@/lib/football-data'
import { generateMatchPrediction } from '@/lib/groq-predict'

export const dynamic = 'force-dynamic'
export const maxDuration = 30

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { matchId, homeTeamId, awayTeamId, isLive } = body

    if (!matchId) {
      return NextResponse.json({ error: 'matchId is required', code: 400 }, { status: 400 })
    }

    const matchData = await getMatchById(parseInt(matchId, 10), isLive ? 60 : 300)
    if (!matchData) {
      return NextResponse.json({ error: 'Match not found', code: 404 }, { status: 404 })
    }

    const prediction = await generateMatchPrediction(matchId, matchData)
    if (!prediction) {
      return NextResponse.json({ error: 'AI prediction failed', code: 503 }, { status: 503 })
    }

    return NextResponse.json({
      prediction,
      matchData,
      generatedAt: new Date().toISOString(),
      isLive: isLive || false,
    })
  } catch (error: any) {
    console.error('[api/predict]', error)
    return NextResponse.json({ error: error.message, code: 500 }, { status: 500 })
  }
}
