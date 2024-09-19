import { useEffect, useState } from 'react'
import { getRoundPlayerPointsEarnedByPlayer } from '../../../data'

// TODO: type
// TODO: does this make sense to have as custom hook or should it be general function?
// TODO: use in PlayerRoundScoring
export default function useGetPlayerPointsEarnedInRound(playerId, roundId) {
  const [playerRoundPointsEarned, setPlayerRoundPointsEarned] = useState([])
  console.log('useGetPlayerPointsEarnedInRound ', { playerId, roundId })
  useEffect(() => {
    if (playerId) {
      getPlayerRoundPointsEarned()
    }
  }, [playerId])

  async function getPlayerRoundPointsEarned() {
    const res = await getRoundPlayerPointsEarnedByPlayer(playerId, roundId)
    console.log('useGetPlayerPointsEarnedInRound res: ', res)
    if (res.status === 200) {
      const roundPointsEarned = await res.json()
      console.log('player roundPointsEarned: ', roundPointsEarned)
      setPlayerRoundPointsEarned(roundPointsEarned)
    }
    // TODO: also send back array or message to confirm result is actually empty instead of relying on 204 status?
    else if (res.status === 204) {
      setPlayerRoundPointsEarned([])
    }
  }

  // TODO: should this return something else if array is empty or if playerId
  return playerRoundPointsEarned
}
