import { useQuery } from '@tanstack/react-query'
import { fetchLeaguePlayers } from '../../../data'
import { Player } from '../../../types'

export default function useLeaguePlayers(leagueId?: string) {
  return useQuery<Player[]>({
    queryKey: ['leaguePlayers', leagueId],
    queryFn: () => (leagueId ? fetchLeaguePlayers(leagueId) : []),
    enabled: !!leagueId,
  })
}
