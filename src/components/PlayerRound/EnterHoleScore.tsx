import { useState } from 'react'
import BasicInput from '../shared/components/BasicInput'

export default function EnterHoleScore() {
  const [holeScore, setHoleScore] = useState<number | null>(null)

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

  function handleSubmitScore() {
    console.log('handleSubmitScore')
    // TODO:
    /***
     * if hole is selected {
     *   if PlayerHole exists {
     *     if score exists {
     *       if user confirms score should be updated {
     *         update score
     *       }
     *     } else {
     *       add score
     *     }
     *   } else {
     *     create PlayerHole and add score
     *   }
     * } else {
     *   show validation error that hole needs to be selected
     * }
     */
    // - if hole is selected {
    //
    // }
    // --- then
    // ----- if PlayerHole exists
    // -
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
