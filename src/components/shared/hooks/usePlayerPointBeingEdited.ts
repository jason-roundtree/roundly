import { useQuery } from '@tanstack/react-query'
import { getPlayerPointEarnedById } from '../../../data/player-point-earned'
import { PointScopes } from '../../../types'

export interface PointBeingEdited {
  pointEarnedId: string
  pointSettingId: string
  pointName: string
  // playerName: string
  originalHole?: number | string
  hole?: number | string
  originalQuantity: number
  quantity: number
  value: number | string
  scope: PointScopes | (string & {})
}

const defaultPointEarnedBeingEditedState: PointBeingEdited = {
  pointEarnedId: '',
  pointSettingId: '',
  pointName: '',
  // playerName: '',
  originalHole: '',
  hole: '',
  originalQuantity: 1,
  quantity: 1,
  value: '',
  scope: '',
}

// TODO: type
// TOTO: change name to usePlayerPointEarnedBeingEdited
export default function usePlayerPointBeingEdited(pointEarnedId?: string) {
  const {
    data: originalPointEarned = defaultPointEarnedBeingEditedState,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['playerPointEarned', pointEarnedId],
    queryFn: () =>
      pointEarnedId
        ? getPlayerPointEarnedById(pointEarnedId)
        : defaultPointEarnedBeingEditedState,
    enabled: !!pointEarnedId,
    // retry: false,
    // staleTime: 0,
  })
  console.log('originalPointEarned', originalPointEarned)
  return [
    originalPointEarned,
    isLoading,
    isError,
    refetch,
    defaultPointEarnedBeingEditedState,
  ]
}
