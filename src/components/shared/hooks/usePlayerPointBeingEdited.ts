import { useState } from 'react'
import { PointScopes } from '../../../types'

export interface PointBeingEdited {
  // playerId: string
  pointSettingId: string
  pointEarnedId: string
  playerName: string
  originalHole?: number | string
  hole?: number | string
  pointName: string
  value: number | string
  // TODO: look into (string & {}) and remove it if it doesn't provide a benefit
  scope: PointScopes | (string & {})
  frequency: number
  originalFrequency: number
  maxFrequencyPerScope: number | null
}

const defaultPointEarnedBeingEditedState: PointBeingEdited = {
  playerName: '',
  originalHole: '',
  hole: '',
  originalFrequency: 1,
  frequency: 1,
  pointSettingId: '',
  pointEarnedId: '',
  pointName: '',
  value: '',
  scope: '',
  maxFrequencyPerScope: null,
}

export default function usePlayerPointBeingEdited(): any {
  const [pointEarnedBeingEdited, setPointEarnedBeingEdited] =
    useState<PointBeingEdited>(defaultPointEarnedBeingEditedState)

  return [
    pointEarnedBeingEdited,
    setPointEarnedBeingEdited,
    defaultPointEarnedBeingEditedState,
  ]
}
