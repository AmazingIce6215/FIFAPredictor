'use client'

import useSWR from 'swr'

interface PredictionRequest {
  matchId: string
  homeTeamId: number
  awayTeamId: number
  isLive?: boolean
}

interface PredictionResponse {
  prediction: any
  matchData: any
  homeTeam: any
  awayTeam: any
  h2h: any
  generatedAt: string
  isLive: boolean
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function usePrediction(
  params: PredictionRequest | null,
  dedupingInterval = 300000
) {
  const { data, error, isLoading } = useSWR<PredictionResponse>(
    params ? ['/api/predict', params] : null,
    () =>
      fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      }).then((r) => r.json()),
    {
      dedupingInterval,
      revalidateOnFocus: false,
    }
  )

  return {
    prediction: data?.prediction ?? null,
    matchData: data?.matchData ?? null,
    homeTeam: data?.homeTeam ?? null,
    awayTeam: data?.awayTeam ?? null,
    isLoading,
    isError: !!error,
  }
}
