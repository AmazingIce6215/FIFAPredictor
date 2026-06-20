const BASE_URL = 'https://v3.football.api-sports.io'

async function fetchAPI<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'x-apisports-key': process.env.API_SPORTS_KEY || '',
    },
    next: { revalidate: 3600 },
  })

  if (!response.ok) {
    console.warn(`[api-sports] Error ${response.status} on ${endpoint}`)
    return { response: [] } as T
  }

  const data = await response.json()
  return data
}

export async function getTeamStatistics(teamId: number, season = 2026) {
  const data = await fetchAPI<any>(`/teams/statistics?league=1&season=${season}&team=${teamId}`)
  return data.response || null
}

export async function getMatchLineups(fixtureId: number) {
  const data = await fetchAPI<any>(`/fixtures/${fixtureId}/lineups`)
  return data.response || []
}

export async function getMatchInjuries(fixtureId: number) {
  const data = await fetchAPI<any>(`/injuries?fixture=${fixtureId}`)
  return data.response || []
}

export async function getTeamSquad(teamId: number) {
  const data = await fetchAPI<any>(`/players/squads?team=${teamId}`)
  return data.response || []
}
