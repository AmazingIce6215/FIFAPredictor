import { NextResponse } from 'next/server'
import { getTeamById, getTeamMatches } from '@/lib/football-data'
import { getFlagUrl } from '@/lib/utils'

export const dynamic = 'force-dynamic'
export const runtime = 'edge'

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const teamId = parseInt(params.id, 10)

    const [team, matches] = await Promise.all([
      getTeamById(teamId),
      getTeamMatches(teamId, 10),
    ])

    const flagUrl = getFlagUrl(team.country || team.name)

    return NextResponse.json({
      team,
      matches,
      flagUrl,
    })
  } catch (error: any) {
    console.error('[api/team]', error)
    return NextResponse.json({ error: error.message, code: 500 }, { status: 500 })
  }
}
