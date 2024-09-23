import { useState } from 'react'
import { NumberOrNull } from '../../../types'

export interface PlayerHoleScoreState {
  playerHoleId: string | ''
  score: NumberOrNull
  hole: NumberOrNull
}

// TODO: change null to string here and in type?
const defaultScoreBeingEditedState: PlayerHoleScoreState = {
  playerHoleId: '',
  score: null,
  hole: null,
}

export default function usePlayerHoleScoreBeingEdited(): any {
  const [scoreBeingEdited, setScoreBeingEdited] = useState<
    Omit<PlayerHoleScoreState, 'hole'> & { hole: number | null }
  >(defaultScoreBeingEditedState)

  return [scoreBeingEdited, setScoreBeingEdited, defaultScoreBeingEditedState]
}
