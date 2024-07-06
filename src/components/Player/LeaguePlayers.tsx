import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAnglesRight } from '@fortawesome/free-solid-svg-icons'

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
      <Link to={`/league/${leagueId}`} className="leagueHomeLink">
        League Home
        <FontAwesomeIcon icon={faAnglesRight} />
      </Link>

      <h2 className="page-title">League Players</h2>

      <div className="centered-button">
        <Link to={`/league/${leagueId}/new-player`}>
          <button>Add New League Player</button>
        </Link>
      </div>

      <PlayerListEditable
        players={players}
        refreshPlayerState={refreshPlayersState}
      />
    </>
  )
}
