import { useQuery } from '@tanstack/react-query'
import { fetchRound } from '../../../data'

export function useRound(roundId?: string) {
  return useQuery({
    queryKey: ['round', roundId],
    queryFn: () => fetchRound(roundId),
    enabled: !!roundId,
  })
}
