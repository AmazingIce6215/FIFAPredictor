'use client'

import useSWR from 'swr'
import { LiveMatchData, PredictionResult } from '@/lib/types'

interface LiveMatchResponse {
  match: LiveMatchData
  prediction: PredictionResult
  previousPrediction?: PredictionResult
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function useLiveMatch(matchId: string) {
  const { data, error, isLoading, mutate } = useSWR<LiveMatchResponse>(
    matchId ? `/api/live/${matchId}` : null,
    fetcher,
    {
      refreshInterval: matchId ? 60000 : undefined,
      revalidateOnFocus: false,
    }
  )

  return {
    liveData: data?.match ?? null,
    prediction: data?.prediction ?? null,
    previousPrediction: data?.previousPrediction ?? null,
    isLoading,
    isError: !!error,
    mutate,
  }
}
