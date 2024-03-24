import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'

import { PlayerListEditable, AddPlayer } from '.'
import { Player } from '../../types'
import { fetchLeaguePlayers } from '../../data'

export default function LeaguePlayers(): JSX.Element {
  const [players, setPlayers] = useState<Player[]>([])

  const { leagueId } = useParams()

  useEffect(() => {
    refreshPlayersState()
  }, [])

  async function refreshPlayersState(): Promise<void> {
    const players = await fetchLeaguePlayers(leagueId)
    setPlayers(players)
  }

  return (
    <>
      <Link to={`/league/${leagueId}`}>League Home</Link>

      <h2>League Players</h2>

      <AddPlayer refreshState={refreshPlayersState} />

      <PlayerListEditable
        players={players}
        refreshPlayerState={refreshPlayersState}
      />
    </>
  )
}
