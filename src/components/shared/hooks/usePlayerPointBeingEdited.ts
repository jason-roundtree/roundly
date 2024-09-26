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
  originalFrequency: number
  frequency: number
  value: number | string
  // TODO: look into (string & {}) and remove it if it doesn't provide a benefit
  scope: PointScopes | (string & {})
  maxFrequencyPerScope: number | null
}

const defaultPointEarnedBeingEditedState: PointBeingEdited = {
  pointEarnedId: '',
  pointSettingId: '',
  pointName: '',
  playerName: '',
  originalHole: '',
  hole: '',
  // TODO: change these to `quantityEarned` and `originalQuantityEarned`
  originalFrequency: 1,
  frequency: 1,
  value: '',
  scope: '',
  maxFrequencyPerScope: null,
}

// TODO: type
export default function usePlayerPointBeingEdited(): any {
  const [pointEarnedBeingEdited, setPointEarnedBeingEdited] =
    useState<PointBeingEdited>(defaultPointEarnedBeingEditedState)

  return [
    pointEarnedBeingEdited,
    setPointEarnedBeingEdited,
    defaultPointEarnedBeingEditedState,
  ]
}
