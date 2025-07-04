import { useQuery } from '@tanstack/react-query'
import { getPlayerById } from '../../../data/player'

export default function usePlayerById(playerId?: string) {
  return useQuery({
    queryKey: ['player', playerId],
    queryFn: () => (playerId ? getPlayerById(playerId) : null),
    enabled: !!playerId,
    retry: false,
  })
}
