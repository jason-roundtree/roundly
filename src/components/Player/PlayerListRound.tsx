import { useContext } from 'react'
import { useParams, useLocation } from 'react-router-dom'

import { RoundContext } from '../Round/RoundDetails'
import { deletePlayerFromRound } from '../../data'

//   TODO: if keeping these move to a separate file
const twEditInputs =
  'block border borderGray300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2'
const twListItems =
  'max-w-fit rounded-lg my-1 mx-4 p-2 list-item editable-list-item'

// TODO: set state to refresh so list updates on delete
export default function PlayerListRound(): JSX.Element {
  const { roundId } = useParams()
  const { players, refreshRoundState } = useContext(RoundContext)
  console.log('players: ', players)

  async function handleDeletePlayerFromRound(playerId, roundId) {
    await deletePlayerFromRound(playerId, roundId)
    refreshRoundState()
  }

  return (
    <>
      <h3>Players</h3>
      <ul>
        {players?.map(({ id: playerId, name }) => {
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
    </>
  )
}
