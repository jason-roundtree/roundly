import { useQuery } from '@tanstack/react-query'
import { getRoundPlayerPointsEarnedTotal } from '../../../data'

export default function useGetAllPlayersRoundPointsEarnedTotals(
  players,
  roundId
): any {
  return useQuery({
    queryKey: [
      'playersWithPointTotals',
      roundId,
      players?.map((p) => p.id).join(','),
    ],
    queryFn: async () => {
      if (!players || !roundId) return []
      const playersWithPointTotals = await Promise.all(
        players.map(async (p) => {
          const res = await getRoundPlayerPointsEarnedTotal(p.id, roundId)
          if (res.status === 200) {
            const { total_points } = await res.json()
            return {
              ...p,
              total_points: total_points,
            }
          } else {
            return {
              ...p,
              total_points: 0,
            }
          }
        })
      )
      return playersWithPointTotals
    },
    enabled: !!players?.length && !!roundId,
  })
}
