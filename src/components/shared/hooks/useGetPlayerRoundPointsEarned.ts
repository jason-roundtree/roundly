import { useQuery } from '@tanstack/react-query'
import { getRoundPlayerPointsEarnedByPlayer } from '../../../data'

export default function useGetPlayerRoundPointsEarned(playerId, roundId) {
  return useQuery({
    queryKey: ['playerRoundPointsEarned', playerId, roundId],
    queryFn: async () => {
      if (!playerId) return []
      const res = await getRoundPlayerPointsEarnedByPlayer(playerId, roundId)
      if (res.status === 200) {
        return await res.json()
      } else if (res.status === 204) {
        return []
      } else {
        throw new Error('Failed to fetch player round points earned')
      }
    },
    enabled: !!playerId && !!roundId,
    initialData: [],
    retry: false,
    // staleTime: 0,
    // refetchOnMount: 'always',
  })
}
