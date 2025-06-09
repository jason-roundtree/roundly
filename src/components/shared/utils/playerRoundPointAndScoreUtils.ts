import { PlayerHoleScoreState } from '../hooks/usePlayerHoleScoreBeingEdited'

// TODO: is there a way to change to general purpose function or a small library that does something similar?
export function holeOrQuantityHasChanged(
  originalQuantity,
  quantity,
  originalHole,
  hole
): {
  quantityHasChanged: boolean
  holeHasChanged: boolean
  anyValueHasChanged: boolean
} {
  const hasChanged = {
    quantityHasChanged: false,
    holeHasChanged: false,
    anyValueHasChanged: false,
  }
  if (originalQuantity !== quantity) {
    hasChanged.quantityHasChanged = true
    hasChanged.anyValueHasChanged = true
  }
  if (originalHole !== hole) {
    hasChanged.holeHasChanged = true
    hasChanged.anyValueHasChanged = true
  }
  return hasChanged
}

export function mapScoresToState(holesInRound, roundHoleScoreData) {
  const holeScoreData: Array<PlayerHoleScoreState> = Array.from(
    Array(holesInRound),
    (_, i) => ({
      playerHoleId: '',
      hole: i + 1,
      score: '',
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
