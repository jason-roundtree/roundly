import { useState } from 'react'
import BasicInput from '../shared/components/BasicInput'
import { createOrFindPlayerHole, updatePlayerHole } from '../../data'
import { PlayerHole } from '../../types'

export default function EnterHoleScore({
  selectedHole,
  selectedPlayer,
  roundId,
}) {
  const [holeScore, setHoleScore] = useState<number | null>(null)
  const playerId = selectedPlayer.id

  function handleUpdateHoleScoreState(e) {
    // TODO: reimplement
    // setShowOneInputRequiredError(false)
    const inputValue = e.target.value
    if (inputValue < 1) {
      // setHoleScore(null)
      return
    } else {
      setHoleScore(+inputValue)
    }
  }

  function clearState() {
    setHoleScore(null)
  }

  async function handleSubmitScore() {
    if (!selectedHole) {
      console.log('you must select a hole!🕳️')
      return
    }
    if (!holeScore) {
      console.log('you must enter a score!#️⃣')
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
      console.log('playerHole: ', { playerHole, created })
      holeData.score = holeScore
      let scoreSuccesfullyEnteredMessage = 'The hole score has been created'
      if (playerHole.score && playerHole.score !== holeScore) {
        // TODO: show confirm to confirm user wants to update score
        const userConfirmsUpdate = window.confirm(
          'This player already has a score for this hole. Are you sure you wan to update the score?'
        )
        if (userConfirmsUpdate) {
          console.log('this is where the update score call would be 👻')
          // TODO: ultimately add check for score is was actually updated
          scoreSuccesfullyEnteredMessage = 'The hole score has been updated'
        }
      }
      console.log('holeData with score', holeData)
      const updatedPlayerHoleScoreRes = await updatePlayerHole(
        playerHole.id,
        holeData
      )
      console.log('updatedPlayerHoleScoreRes', updatedPlayerHoleScoreRes)
      if (updatedPlayerHoleScoreRes.ok) {
        // TODO: show confirmation
        console.log(
          'scoreSuccesfullyEnteredMessage: ',
          scoreSuccesfullyEnteredMessage
        )
        clearState()
      }
    }
  }

  return (
    <>
      <BasicInput
        type="number"
        min="1"
        name="hole-score"
        label="Hole Score"
        value={holeScore ? holeScore : ''}
        onChange={handleUpdateHoleScoreState}
      />

      <button onClick={handleSubmitScore}>Add Hole Score</button>
    </>
  )
}
