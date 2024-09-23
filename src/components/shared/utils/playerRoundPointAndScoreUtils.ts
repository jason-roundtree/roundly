import { PlayerHoleScoreState } from '../hooks/usePlayerHoleScoreBeingEdited'

// TODO: is there a way to change to general purpose function or a small library that does something similar?
export function holeOrFrequencyHasChanged(
  originalFrequency,
  frequency,
  originalHole,
  hole
): {
  frequencyHasChanged: boolean
  holeHasChanged: boolean
  anyValueHasChanged: boolean
} {
  const hasChanged = {
    frequencyHasChanged: false,
    holeHasChanged: false,
    anyValueHasChanged: false,
  }
  if (originalFrequency !== frequency) {
    hasChanged.frequencyHasChanged = true
    hasChanged.anyValueHasChanged = true
  }
  if (originalHole !== hole) {
    hasChanged.holeHasChanged = true
    hasChanged.anyValueHasChanged = true
  }
  console.log('$$$$$ hasChanged ^^^^^', hasChanged)
  return hasChanged
}

export function mapScoresToState(holesInRound, roundHoleScoreData) {
  const holeScoreData: Array<PlayerHoleScoreState> = Array.from(
    Array(holesInRound),
    (_, i) => ({
      playerHoleId: '',
      hole: i + 1,
      score: null,
    })
  )
  for (const playerHole of roundHoleScoreData) {
    const { score, hole, id: playerHoleId } = playerHole
    const holeToAddScore = holeScoreData[hole - 1]
    holeScoreData[hole - 1] = {
      ...holeToAddScore,
      playerHoleId,
      score,
    } as PlayerHoleScoreState
  }
  return holeScoreData
}
