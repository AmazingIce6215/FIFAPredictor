import { NextResponse } from 'next/server'
import { getAllMatches } from '@/lib/football-data'

export const dynamic = 'force-dynamic'
export const runtime = 'edge'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const stage = searchParams.get('stage')

    let matches = await getAllMatches(60)

    if (status) {
      const statuses = status.split(',')
      matches = matches.filter((m) => statuses.includes(m.status))
    }

    if (stage) {
      matches = matches.filter((m) => m.stage === stage)
    }

    matches.sort((a, b) => new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime())

    return NextResponse.json({ matches, count: matches.length })
  } catch (error: any) {
    console.error('[api/matches]', error)
    return NextResponse.json({ error: error.message, code: 500 }, { status: 500 })
  }
}
