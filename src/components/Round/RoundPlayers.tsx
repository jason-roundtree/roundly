import { useEffect, useState, useContext } from 'react'
import { useParams, Link } from 'react-router-dom'

import { RoundContext } from './RoundDetails'
import {
  deletePlayerFromRound,
  fetchLeaguePlayers,
  createRoundPlayer,
} from '../../data'
import { Player } from '../../types'

//   TODO: if keeping these move to a separate file
const twListItems =
  'max-w-fit rounded-lg my-1 mx-4 p-2 list-item editable-list-item'

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
      <h3>Players</h3>
      <Link to={`/league/${leagueId}/players`} className="text-link mt-2">
        League Players
      </Link>

      {/* TODO: if keeping separate lists for round and non-round players, create shared component for lists */}
      {/* TODO: make lists look separated */}
      {/* TODO: sort active round players  */}
      <ul>
        {roundPlayers?.map(({ id: playerId, name }) => {
          return (
            <li key={playerId} className={twListItems}>
              <span>{name}</span>
              <span className="list-edit-buttons">
                <button
                  onClick={() => handleDeletePlayerFromRound(playerId, roundId)}
                >
                  Remove From Round
                </button>
              </span>
            </li>
          )
        })}
      </ul>

      <ul>
        {getInactiveRoundPlayers().map((player) => {
          return (
            <li key={player.id} className={twListItems}>
              <span>{player.name}</span>
              <span className="list-edit-buttons not-round-player">
                <button
                  onClick={() => handleAddPlayerToRound(player.id, roundId)}
                >
                  Add to Round
                </button>
              </span>
            </li>
          )
        })}
      </ul>

      {/* <ul>
        {leaguePlayers?.map(({ id: leaguePlayerId, name }) => {
          const isNotRoundPlayer = roundPlayers.every(
            (roundPlayer) => roundPlayer.id !== leaguePlayerId
          )
          if (isNotRoundPlayer) {
            return (
              <li key={leaguePlayerId} className={twListItems}>
                <span>{name}</span>
                <span className="list-edit-buttons not-round-player">
                  <button
                    onClick={() =>
                      handleDeletePlayerFromRound(leaguePlayerId, roundId)
                    }
                  >
                    Add to Round
                  </button>
                </span>
              </li>
            )
          }
        })}
      </ul> */}
    </>
  )
}
