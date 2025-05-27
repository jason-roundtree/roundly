import { useState } from 'react'
import { toast } from 'react-toastify'

import BasicInput from '../shared/components/BasicInput'
import { createOrFindPlayerHole, updatePlayerHole } from '../../data'
import { PlayerHole } from '../../types'

export default function EnterHoleScore({
  selectedHole,
  selectedPlayer,
  roundId,
}) {
  const [holeScore, setHoleScore] = useState<number | null>(null)
  console.log('holeScore', holeScore)
  const playerId = selectedPlayer.id

  function handleUpdateHoleScoreState(e) {
    setHoleScore(+e.target.value)
  }

  function clearState() {
    setHoleScore(null)
  }

  async function handleSubmitScore() {
    if (!selectedHole) {
      toast.error('Please select a hole')
      return
    }
    if (holeScore === null) {
      toast.error('Please enter a score for the hole')
      return
    }

    // interface EnterPlayerHole extends PlayerHole {
    //   score: number | null
    // }
    const holeData: PlayerHole = {
      playerId: playerId,
      hole: +selectedHole,
      roundId: roundId,
      score: null, // check this doesn't break logic of POST route
    }
    // TODO: should I change this to only check if PlayerHole exists so logic below is more readable? Currently, regardless of if the PlayerHole exists or not it's getting created before score is created or updated so the paths below only really exist for checking if userConfirmsUpdate and we need to show a confirmation that the score was updated vs created
    const playerHoleRes = await createOrFindPlayerHole(holeData)
    if (playerHoleRes.ok) {
      const [playerHole, created] = await playerHoleRes.json()
      holeData.score = holeScore
      let scoreIsBeingUpdated = false

      if (playerHole.score && playerHole.score !== holeScore) {
        /* hole score already exists */
        // TODO: update to a modal or something other than window.confirm
        const userConfirmsUpdate = window.confirm(
          'Player already has a score for this hole. Do you want to update it?'
        )
        if (userConfirmsUpdate) {
          scoreIsBeingUpdated = true
        } else {
          return
        }
      }
      const updatedPlayerHoleScoreRes = await updatePlayerHole(
        playerHole.id,
        holeData
      )
      if (updatedPlayerHoleScoreRes.ok) {
        toast.success(
          `Score successfully ${scoreIsBeingUpdated ? 'updated' : 'added'}`
        )
        clearState()
      }
    }
  }

  return (
    <>
      <BasicInput
        type="number"
        min="0"
        name="hole-score"
        label="Hole Score"
        value={holeScore ?? ''}
        onChange={handleUpdateHoleScoreState}
      />

      <button onClick={handleSubmitScore}>Add Hole Score</button>
    </>
  )
}
