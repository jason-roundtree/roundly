import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAnglesRight } from '@fortawesome/free-solid-svg-icons'

import { PlayerListEditable, AddPlayer } from '.'
import { Player } from '../../types'
import { fetchLeaguePlayers } from '../../data'
import useLeaguePlayers from '../shared/hooks/useLeaguePlayers'

export default function LeaguePlayers(): JSX.Element {
  const { leagueId } = useParams()

  const {
    data: players = [],
    isLoading,
    isError,
    refetch: refreshLeaguePlayersState,
  } = useLeaguePlayers(leagueId)

  return (
    <>
      <Link to={`/league/${leagueId}`} className="leagueHomeLink">
        League Home
        <FontAwesomeIcon icon={faAnglesRight} />
      </Link>

      <h2 className="page-title">League Players</h2>

      <div className="centered-button">
        <Link to={`/league/${leagueId}/new-player`}>
          <button>Add New Player to League</button>
        </Link>
      </div>

      <PlayerListEditable
        players={players}
        refreshLeaguePlayersState={refreshLeaguePlayersState}
      />
    </>
  )
}
