import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { deletePlayerFromLeague } from '../../data'
import DeleteConfirmationModal from '../shared/components/DeleteConfirmationModal'

export default function PlayerEditableListItem({
  player,
  refreshLeaguePlayersState,
}) {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const { id: playerId, name } = player
  console.log('PlayerEditableListItem player', player)
  const { leagueId } = useParams()
  const navigate = useNavigate()

  async function handleDeletePlayer() {
    const deletePlayerRes = await deletePlayerFromLeague(playerId)
    if (deletePlayerRes.ok) {
      setShowDeleteConfirmation(false)
      toast.success('Player was successfully deleted')
      refreshLeaguePlayersState()
    }
  }

  return (
    <>
      <li className="editable-list-item">
        <span>{name}</span>
        <span className="list-edit-buttons">
          <button
            onClick={() =>
              navigate(`/league/${leagueId}/edit-player/${playerId}`, {
                state: {
                  name,
                  playerId,
                  navigateTo: `/league/${leagueId}/players/`,
                },
              })
            }
          >
            Edit
          </button>
        </span>
      </li>

      {showDeleteConfirmation && (
        <DeleteConfirmationModal
          modalTitle="Confirm Player Deletion"
          confirmationText={`Are you sure you want to delete ${name} from the league?`}
          buttonText="Delete"
          onConfirmDelete={handleDeletePlayer}
          toggleModalActive={() => setShowDeleteConfirmation((show) => !show)}
        />
      )}
    </>
  )
}
