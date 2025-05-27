import { useState } from 'react'
import { PointScopes } from '../../../types'

export interface PointBeingEdited {
  // playerId: string
  pointEarnedId: string
  pointSettingId: string
  pointName: string
  playerName: string
  originalHole?: number | string
  hole?: number | string
  originalQuantity: number
  quantity: number
  value: number | string
  // TODO: look into (string & {}) and remove it if it doesn't provide a benefit
  scope: PointScopes | (string & {})
  // maxFrequencyPerScope: number | null
}

const defaultPointEarnedBeingEditedState: PointBeingEdited = {
  pointEarnedId: '',
  pointSettingId: '',
  pointName: '',
  playerName: '',
  originalHole: '',
  hole: '',
  // TODO: change these to `quantityEarned` and `originalQuantityEarned`
  originalQuantity: 1,
  quantity: 1,
  value: '',
  scope: '',
  // maxFrequencyPerScope: null,
}

// TODO: type
// TOTO: change name to usePlayerPointEarnedBeingEdited
export default function usePlayerPointBeingEdited(
  initialState = defaultPointEarnedBeingEditedState
): any {
  const [pointEarnedBeingEdited, setPointEarnedBeingEdited] =
    useState<PointBeingEdited>(initialState)

  return [
    pointEarnedBeingEdited,
    setPointEarnedBeingEdited,
    defaultPointEarnedBeingEditedState,
  ]
}
