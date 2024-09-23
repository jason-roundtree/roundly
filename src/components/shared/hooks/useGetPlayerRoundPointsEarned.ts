import { useEffect, useState } from 'react'
import { getRoundPlayerPointsEarnedByPlayer } from '../../../data'

// TODO: type
// TODO: does this make sense to have as custom hook or should it be general function?
export default function useGetPlayerRoundPointsEarned(playerId, roundId): any {
  const [roundPointsEarned, setRoundPointsEarned] = useState<any[]>([])

  useEffect(() => {
    if (playerId) {
      getPlayerRoundPointsEarned()
    }
  }, [playerId])

  async function getPlayerRoundPointsEarned(): Promise<void> {
    // TODO: rename getRoundPlayerPointsEarnedByPlayer for consistency with other names
    const res = await getRoundPlayerPointsEarnedByPlayer(playerId, roundId)
    console.log('useGetPlayerRoundPointsEarned res: ', res)
    if (res.status === 200) {
      const rpe = await res.json()
      setRoundPointsEarned(rpe)
    }
    // TODO: also send back array or message to confirm result is actually empty instead of relying on 204 status?
    else if (res.status === 204) {
      setRoundPointsEarned([])
    }
  }

  // TODO: should this return something else if array is empty
  // TODO: is it ok to return the getPlayerRoundPointsEarned function
  return [roundPointsEarned, getPlayerRoundPointsEarned]
}
