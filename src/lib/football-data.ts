import { MatchData, StandingTable, TeamInfo } from './types'

const BASE_URL = 'https://api.football-data.org/v4'
const COMPETITION_CODE = 'WC'

async function fetchAPI<T>(endpoint: string, revalidate = 300): Promise<T> {
  const url = `${BASE_URL}${endpoint}`
  const response = await fetch(url, {
    headers: {
      'X-Auth-Token': process.env.FOOTBALL_DATA_API_KEY || '',
    },
    next: { revalidate },
  })

  if (!response.ok) {
    if (response.status === 429) {
      console.warn(`[football-data] Rate limited on ${endpoint}, returning empty`)
      return {} as T
    }
    throw new Error(`football-data.org error ${response.status}: ${response.statusText}`)
  }

  return response.json() as Promise<T>
}

export async function getAllMatches(revalidate = 300) {
  const data = await fetchAPI<{ matches: MatchData[] }>(
    `/competitions/${COMPETITION_CODE}/matches`,
    revalidate
  )
  return data.matches || []
}

export async function getMatchById(matchId: number, revalidate = 60) {
  const data = await fetchAPI<MatchData>(`/matches/${matchId}`, revalidate)
  return data
}

export async function getStandings(revalidate = 300) {
  const data = await fetchAPI<{ standings: StandingTable[] }>(
    `/competitions/${COMPETITION_CODE}/standings`,
    revalidate
  )
  return data.standings || []
}

export async function getAllTeams(revalidate = 3600) {
  const data = await fetchAPI<{ teams: TeamInfo[] }>(
    `/competitions/${COMPETITION_CODE}/teams`,
    revalidate
  )
  return data.teams || []
}

export async function getTeamMatches(teamId: number, limit = 10, revalidate = 300) {
  const data = await fetchAPI<{ matches: MatchData[] }>(
    `/teams/${teamId}/matches?limit=${limit}`,
    revalidate
  )
  return data.matches || []
}

export async function getTeamById(teamId: number) {
  const data = await fetchAPI<TeamInfo & { venue: string; coach: { name: string }; squad: any[] }>(
    `/teams/${teamId}`,
    3600
  )
  return data
}
