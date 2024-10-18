import { useState, useEffect } from 'react'
import { PlayersWithPointTotals } from '../../Round/RoundScoring'
import { getRoundPlayerPointsEarnedTotal } from '../../../data'

export default function useGetAllPlayersRoundPointsEarnedTotals(
  players,
  roundId
): any {
  const [playersWithPointTotals, setPlayersWithPointTotals] = useState<
    Array<PlayersWithPointTotals>
  >([])

  useEffect(() => {
    generatePlayersWithPointTotals(players, roundId)
  }, [players, roundId])

  async function generatePlayersWithPointTotals(
    players,
    roundId
  ): Promise<void> {
    const playersWithPointTotals = await Promise.all(
      players.map(async (p) => {
        const res = await getRoundPlayerPointsEarnedTotal(p.id, roundId)
        console.log('RoundScoring getRoundPlayerPointsEarnedTotal res', res)
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
    setPlayersWithPointTotals(playersWithPointTotals)
  }

  return [playersWithPointTotals, generatePlayersWithPointTotals]
}
