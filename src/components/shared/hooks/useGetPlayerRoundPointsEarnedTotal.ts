import { useQuery } from '@tanstack/react-query'
import { getRoundPlayerPointsEarnedTotal } from '../../../data'

export default function useGetPlayerRoundPointsEarnedTotal(playerId, roundId) {
  return useQuery({
    queryKey: ['playerRoundPointsEarnedTotal', playerId, roundId],
    queryFn: async () => {
      if (!playerId) return 0
      const res = await getRoundPlayerPointsEarnedTotal(playerId, roundId)
      if (res.status === 200) {
        const { total_points } = await res.json()
        return total_points
      } else if (res.status === 204) {
        return 0
      } else {
        throw new Error('Failed to fetch player round points earned total')
      }
    },
    enabled: !!playerId && !!roundId,
    initialData: 0,
    retry: false,
  })
}
