const BASE_URL = 'https://www.thesportsdb.com/api/v1/json/3'

export async function searchTeam(teamName: string) {
  try {
    const response = await fetch(
      `${BASE_URL}/searchteams.php?t=${encodeURIComponent(teamName)}`,
      { next: { revalidate: 86400 } }
    )
    const data = await response.json()
    return data.teams?.[0] || null
  } catch (e) {
    console.warn('[thesportsdb] searchTeam error:', e)
    return null
  }
}

export async function searchPlayer(playerName: string) {
  try {
    const response = await fetch(
      `${BASE_URL}/searchplayers.php?p=${encodeURIComponent(playerName)}`,
      { next: { revalidate: 86400 } }
    )
    const data = await response.json()
    return data.player?.[0] || null
  } catch (e) {
    console.warn('[thesportsdb] searchPlayer error:', e)
    return null
  }
}
