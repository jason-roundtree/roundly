import { useState, useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import BasicInput from '../shared/components/BasicInput'
import { deletePlayerFromLeague, updatePlayer } from '../../data'
import DeleteConfirmationModal from '../shared/components/DeleteConfirmationModal'
import usePlayerById from '../shared/hooks/usePlayerById'

interface EditablePlayer {
  name: string
}
const defaultState: EditablePlayer = {
  name: '',
}

export default function EditLeaguePlayer(): JSX.Element {
  const { playerId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  // TODO: define navigate path here instead of parent component?
  const { navigateTo } = location.state || {}
  const { data: player, isLoading, isError, refetch } = usePlayerById(playerId)

  const [updatedPlayer, setUpdatedPlayer] =
    useState<EditablePlayer>(defaultState)

  useEffect(() => {
    if (player && player.name) {
      setUpdatedPlayer({ name: player.name })
    }
  }, [player])

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)

  async function handleUpdatePlayer() {
    if (!updatedPlayer.name) {
      toast.error('Player name is required')
      return
    }
    const updatePlayerRes = await updatePlayer(playerId, updatedPlayer)
    if (updatePlayerRes.ok) {
      toast.success('Player was successfully updated')
      refetch()
      navigate(navigateTo)
    }
  }

  async function handleDeletePlayer() {
    const deletePlayerRes = await deletePlayerFromLeague(playerId)
    if (deletePlayerRes.ok) {
      setUpdatedPlayer(defaultState)
      setShowDeleteConfirmation(false)
      toast.success('Player was successfully deleted')
      // TODO: do something to handle deleted player from showing up when going back after deleting
      navigate(navigateTo, {})
    }
  }

  function handleInputChange({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement>): void {
    setUpdatedPlayer({ ...updatedPlayer, [name]: value })
  }

  if (isError || !player) {
    return <p>Player does not exist</p>
  }
  return (
    <>
      {/* TODO: update title */}
      <h3 className="page-title">Edit League Player</h3>

      <BasicInput
        type="text"
        label="Player Name"
        name="name"
        onChange={handleInputChange}
        value={updatedPlayer.name}
      />

      <button onClick={() => handleUpdatePlayer()}>Save</button>
      <button
        onClick={() => setShowDeleteConfirmation((show) => !show)}
        className="delete-button"
      >
        Delete
      </button>

      {showDeleteConfirmation && (
        <DeleteConfirmationModal
          modalTitle="Confirm Player Deletion"
          confirmationText={`Are you sure you want to delete ${updatedPlayer.name} from the league?`}
          buttonText="Delete"
          onConfirmDelete={handleDeletePlayer}
          toggleModalActive={() => setShowDeleteConfirmation((show) => !show)}
        />
      )}
    </>
  )
}
