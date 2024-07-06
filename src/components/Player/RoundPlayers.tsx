import { useEffect, useState, useContext } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAnglesRight } from '@fortawesome/free-solid-svg-icons'

import { RoundContext } from '../Round/RoundDetailsContainer'
import {
  deletePlayerFromRound,
  fetchLeaguePlayers,
  createRoundPlayer,
} from '../../data'
import { Player } from '../../types'
import { sortArrayOfObjects } from '../shared/utils'
import styles from './RoundPlayers.module.css'

// TODO: set state to refresh so list updates on delete
export default function RoundPlayers(): JSX.Element {
  const [leaguePlayers, setLeaguePlayers] = useState<Player[]>([])
  const { players: roundPlayers, refreshRoundState } = useContext(RoundContext)
  console.log('roundPlayers: ', roundPlayers)
  const { leagueId, roundId } = useParams()

  useEffect(() => {
    getLeaguePlayers()
  }, [])

  async function getLeaguePlayers() {
    const leaguePlayers = await fetchLeaguePlayers(leagueId)
    setLeaguePlayers(leaguePlayers)
  }

  async function handleDeletePlayerFromRound(playerId, roundId) {
    await deletePlayerFromRound(playerId, roundId)
    refreshRoundState()
  }

  async function handleAddPlayerToRound(playerId, roundId) {
    await createRoundPlayer(playerId, roundId)
    refreshRoundState()
  }

  function getInactiveRoundPlayers() {
    const nonRoundPlayers = leaguePlayers?.filter(({ id: leaguePlayerId }) => {
      return roundPlayers.every((roundPlayer) => {
        return roundPlayer.id !== leaguePlayerId
      })
    })
    return nonRoundPlayers
  }

  return (
    <>
      <h3 className="decrease-bottom-margin page-title">Round Players</h3>
      <div className="linkContainerCentered">
        <Link to={`/league/${leagueId}/players`}>
          League Players <FontAwesomeIcon icon={faAnglesRight} />
        </Link>
      </div>

      {/* TODO: if keeping separate lists for round and non-round players, create shared component for lists */}
      {/* TODO: make lists look separated */}
      <p className="non-input-label">Active Round Players</p>
      <ul className="editable-list--players">
        {roundPlayers.length ? (
          sortArrayOfObjects(roundPlayers, 'name')?.map(
            ({ id: playerId, name }) => {
              return (
                <li key={playerId}>
                  <span>{name}</span>
                  <span className="list-edit-buttons">
                    <button
                      onClick={() =>
                        handleDeletePlayerFromRound(playerId, roundId)
                      }
                    >
                      Deactivate
                    </button>
                  </span>
                </li>
              )
            }
          )
        ) : (
          <p className="indented-text-small">No active players</p>
        )}
      </ul>

      <p className="non-input-label">Inactive Round Players</p>
      <ul className="editable-list--players">
        {roundPlayers.length < leaguePlayers.length ? (
          getInactiveRoundPlayers().map((player) => {
            return (
              <li key={player.id}>
                <span>{player.name}</span>
                <span className="list-edit-buttons non-round-player">
                  <button
                    onClick={() => handleAddPlayerToRound(player.id, roundId)}
                  >
                    Activate
                  </button>
                </span>
              </li>
            )
          })
        ) : (
          <p className="indented-text-small">All players are active</p>
        )}
      </ul>
    </>
  )
}
