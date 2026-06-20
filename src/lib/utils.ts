import { COUNTRY_TO_CODE } from './country-codes'
import { TeamInfo } from './types'

const COUNTRY_ALIASES: Record<string, string> = {
  'USA': 'us',
  'Korea Republic': 'kr',
  'IR Iran': 'ir',
  "Côte d'Ivoire": 'ci',
  'DR Congo': 'cd',
  'Russia': 'ru',
  'Czech Republic': 'cz',
}

export function getCountryCode(countryName: string): string {
  if (!countryName) return 'xx'
  const direct = COUNTRY_TO_CODE[countryName]
  if (direct) return direct
  const alias = COUNTRY_ALIASES[countryName]
  if (alias) return alias
  const lower = countryName.toLowerCase()
  for (const [key, code] of Object.entries(COUNTRY_TO_CODE)) {
    if (key.toLowerCase() === lower) return code
  }
  for (const [key, code] of Object.entries(COUNTRY_ALIASES)) {
    if (key.toLowerCase() === lower) return code
  }
  return 'xx'
}

export function getFlagUrl(countryName: string): string {
  const code = getCountryCode(countryName)
  return `https://flagcdn.com/w80/${code}.png`
}

export function getTeamFlagSrc(team: TeamInfo): string {
  if (team.crest) return team.crest
  return getFlagUrl(team.country || team.name)
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }
  return date.toLocaleDateString('en-US', options)
}

export function formatTime(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  })
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'IN_PLAY':
    case 'PAUSED':
      return 'var(--live-red)'
    case 'FINISHED':
      return 'var(--text-secondary)'
    default:
      return 'var(--gold)'
  }
}

export function getStageLabel(stage: string): string {
  const stageMap: Record<string, string> = {
    GROUP_STAGE: 'Group Stage',
    ROUND_OF_32: 'Round of 32',
    ROUND_OF_16: 'Round of 16',
    QUARTER_FINALS: 'Quarter-finals',
    SEMI_FINALS: 'Semi-finals',
    THIRD_PLACE: 'Third Place',
    FINAL: 'Final',
  }
  return stageMap[stage] || stage
}

export function calcFormScore(form: ('W' | 'D' | 'L')[]): number {
  let score = 0
  form.forEach((result, i) => {
    const weight = 1 + (form.length - i) * 0.2
    if (result === 'W') score += 3 * weight
    else if (result === 'D') score += 1 * weight
  })
  return Math.round(score * 10) / 10
}

export function getFormBadgeColor(result: 'W' | 'D' | 'L'): string {
  switch (result) {
    case 'W': return 'bg-form-win'
    case 'D': return 'bg-form-draw'
    case 'L': return 'bg-form-loss'
  }
}

export function isLive(status: string): boolean {
  return status === 'IN_PLAY' || status === 'PAUSED'
}

export function getWinnerLabel(winner: string | null): string {
  if (!winner) return ''
  if (winner === 'HOME_TEAM') return 'Home'
  if (winner === 'AWAY_TEAM') return 'Away'
  return 'Draw'
}

export function truncate(str: string, len: number): string {
  if (str.length <= len) return str
  return str.slice(0, len) + '...'
}

export function getConfidenceColor(confidence: string): string {
  switch (confidence) {
    case 'HIGH': return 'var(--win-green)'
    case 'MEDIUM': return 'var(--gold)'
    case 'LOW': return 'var(--live-red)'
    default: return 'var(--text-secondary)'
  }
}

export const STAGE_ORDER = [
  'GROUP_STAGE',
  'ROUND_OF_32',
  'ROUND_OF_16',
  'QUARTER_FINALS',
  'SEMI_FINALS',
  'THIRD_PLACE',
  'FINAL',
]

export function getStageProgress(currentStage: string): number {
  const idx = STAGE_ORDER.indexOf(currentStage)
  if (idx === -1) return 0
  return Math.round((idx / (STAGE_ORDER.length - 1)) * 100)
}

export function getTournamentDay(): number {
  const start = new Date('2026-06-11')
  const now = new Date()
  const diff = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  return Math.max(0, diff) + 1
}
