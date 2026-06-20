import { NextResponse } from 'next/server'
import { getStandings } from '@/lib/football-data'

export const dynamic = 'force-dynamic'
export const runtime = 'edge'

export async function GET() {
  try {
    const standings = await getStandings(300)
    return NextResponse.json({ standings })
  } catch (error: any) {
    console.error('[api/standings]', error)
    return NextResponse.json({ error: error.message, code: 500 }, { status: 500 })
  }
}
