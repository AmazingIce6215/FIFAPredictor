import { NextResponse } from 'next/server'
import { searchPlayer } from '@/lib/thesportsdb'

export const dynamic = 'force-dynamic'
export const runtime = 'edge'

export async function GET(
  _request: Request,
  { params }: { params: { name: string } }
) {
  try {
    const player = await searchPlayer(params.name)
    if (!player) {
      return NextResponse.json({ error: 'Player not found', code: 404 }, { status: 404 })
    }

    return NextResponse.json({
      name: player.strPlayer,
      thumb: player.strThumb || null,
      nationality: player.strNationality || null,
      position: player.strPosition || null,
      team: player.strTeam || null,
      birthDate: player.dateBorn || null,
      description: player.strDescriptionEN || null,
    })
  } catch (error: any) {
    console.error('[api/player]', error)
    return NextResponse.json({ error: error.message, code: 500 }, { status: 500 })
  }
}
