import { useEffect, useState } from 'react'
import { getRoundPlayerPointsEarnedTotal } from '../../../data'

export default function useGetPlayerRoundPointsEarnedTotal(): any {
  const [totalPoints, setTotalPoints] = useState<number | null>(null)

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
