import { useEffect, useState, useContext } from 'react'
import { useParams, Link } from 'react-router-dom'

import { RoundContext } from '../Round/RoundDetails'
import {
  deletePlayerFromRound,
  fetchLeaguePlayers,
  createRoundPlayer,
} from '../../data'
import { Player } from '../../types'
import { sortArrayOfObjects } from '../shared/utils'

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
      <h3>Round Players</h3>
      <Link to={`/league/${leagueId}/players`} className="text-link mt-2">
        League Players
      </Link>

      {/* TODO: if keeping separate lists for round and non-round players, create shared component for lists */}
      {/* TODO: make lists look separated */}
      <p>Active Round Players</p>
      <ul>
        {sortArrayOfObjects(roundPlayers, 'name')?.map(
          ({ id: playerId, name }) => {
            return (
              <li key={playerId} className={twListItems}>
                <span>{name}</span>
                <span className="list-edit-buttons">
                  <button
                    onClick={() =>
                      handleDeletePlayerFromRound(playerId, roundId)
                    }
                  >
                    Remove From Round
                  </button>
                </span>
              </li>
            )
          }
        )}
      </ul>

      <br />
      <p>Inactive Round Players</p>
      <ul>
        {getInactiveRoundPlayers().map((player) => {
          return (
            <li key={player.id} className={twListItems}>
              <span>{player.name}</span>
              <span className="list-edit-buttons non-round-player">
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
    </>
  )
}
