export interface TeamInfo {
  id: number
  name: string
  shortName: string
  tla: string
  crest: string
  country: string
  countryCode: string
  group?: string
  fifaRanking?: number
}

export interface MatchData {
  id: number
  competition: { name: string }
  season: { id: number; startDate: string; endDate: string }
  utcDate: string
  status: 'SCHEDULED' | 'TIMED' | 'IN_PLAY' | 'PAUSED' | 'FINISHED' | 'POSTPONED' | 'CANCELLED'
  matchday: number
  stage: string
  group: string | null
  homeTeam: TeamInfo
  awayTeam: TeamInfo
  score: {
    winner: 'HOME_TEAM' | 'AWAY_TEAM' | 'DRAW' | null
    duration: 'REGULAR' | 'EXTRA_TIME' | 'PENALTIES'
    fullTime: { home: number | null; away: number | null }
    halfTime: { home: number | null; away: number | null }
    extraTime?: { home: number | null; away: number | null }
    penalties?: { home: number | null; away: number | null }
  }
  odds?: { msg: string }
  referees?: { id: number; name: string; type: string }[]
}

export interface StandingTable {
  stage: string
  type: string
  group: string | null
  table: StandingEntry[]
}

export interface StandingEntry {
  position: number
  team: TeamInfo
  playedGames: number
  won: number
  draw: number
  lost: number
  points: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
  form: ('W' | 'D' | 'L')[] | null
}

export interface LiveMatchData {
  minute: number
  score: { home: number; away: number }
  status: string
  events: MatchEvent[]
}

export interface MatchEvent {
  id: number
  minute: number
  type: 'GOAL' | 'YELLOW_CARD' | 'RED_CARD' | 'SUBSTITUTION' | 'PENALTY'
  team: 'home' | 'away'
  player: { name: string }
  assist?: { name: string }
  score?: { home: number; away: number }
}

export interface TeamSeasonStats {
  goalsFor: number
  goalsAgainst: number
  cleanSheets: number
  shotsOnTarget: number
  passAccuracy: number
  possession: number
  keyPlayers: string[]
  tournamentGoals: number
  tournamentAssists: number
}

export interface TeamFormData {
  last5: ('W' | 'D' | 'L')[]
  weightedScore: number
  results: MatchData[]
}

export interface HeadToHead {
  total: number
  homeWins: number
  awayWins: number
  draws: number
  lastResult: string
  homeGoals: number
  awayGoals: number
}

export interface PredictionResult {
  homeWinProbability: number
  drawProbability: number
  awayWinProbability: number
  confidence: 'HIGH' | 'MEDIUM' | 'LOW'
  predictedScore: { home: number; away: number }
  keyFactors: { factor: string; favors: 'home' | 'away' | 'neutral'; impact: 'HIGH' | 'MEDIUM' | 'LOW' }[]
  reasoning: string
  formAnalysis: { homeFormRating: number; awayFormRating: number; comment: string }
  riskFactors: string[]
  recommendedBet: string
  predictionVersion: 'live' | 'pre-match'
  liveContext: string | null
}

export interface SquadPlayer {
  id: number
  name: string
  position: string
  shirtNumber: number
  nationality: string
  thumb?: string
}

export interface LineupData {
  formation: string
  startingXI: { player: { id: number; name: string; position: string; number: number } }[]
  substitutes: { player: { id: number; name: string; position: string; number: number } }[]
  coach: { id: number; name: string }
}

export interface PlayerBio {
  name: string
  thumb: string
  nationality: string
  position: string
  team: string
  birthDate: string
  description: string
}

export interface TeamDetail {
  id: number
  name: string
  shortName: string
  tla: string
  crest: string
  country: string
  countryCode: string
  group: string | null
  venue: string
  coach: { name: string }
  squad: SquadPlayer[]
  logoUrl?: string
}
