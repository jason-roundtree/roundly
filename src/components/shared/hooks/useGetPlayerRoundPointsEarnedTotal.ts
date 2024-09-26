import { useEffect, useState } from 'react'
import { getRoundPlayerPointsEarnedTotal } from '../../../data'

// TODO: type
export default function useGetPlayerRoundPointsEarnedTotal(
  playerId,
  roundId
): any {
  const [totalPoints, setTotalPoints] = useState<number | null>(null)

  useEffect(() => {
    if (playerId) {
      getPlayerRoundTotalPoints(playerId, roundId)
    }
  }, [playerId])

  async function getPlayerRoundTotalPoints(playerId, roundId) {
    // TODO: rename getRoundPlayerPointsEarnedTotal for consistency with other names
    const res = await getRoundPlayerPointsEarnedTotal(playerId, roundId)
    // TODO: handle error case differently so 404 is not being thrown when player is in round but has no points
    if (res.status === 200) {
      const { total_points } = await res.json()
      setTotalPoints(total_points)
    }
  }

  return [totalPoints, getPlayerRoundTotalPoints]
}
