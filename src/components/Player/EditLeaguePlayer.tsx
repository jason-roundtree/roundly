import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import BasicInput from '../shared/components/BasicInput'
import { deletePlayerFromLeague, updatePlayer } from '../../data'
import DeleteConfirmationModal from '../shared/components/DeleteConfirmationModal'

interface EditablePlayer {
  name: string
}
const defaultState: EditablePlayer = {
  name: '',
}

export default function EditLeaguePlayer(): JSX.Element {
  const location = useLocation()
  const { name, playerId, navigateBackTo } = location.state
  console.log('## name', name)
  const [updatedPlayer, setUpdatedPlayer] = useState<EditablePlayer>(
    () => ({ name } || 'asdasdasd')
  )
  console.log('## updatedPlayer name', updatedPlayer.name)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const navigate = useNavigate()

  async function handleUpdatePlayer() {
    if (!updatedPlayer.name) {
      toast.error('Player name is required')
      return
    }
    const updatePlayerRes = await updatePlayer(playerId, updatedPlayer)
    if (updatePlayerRes.ok) {
      toast.success('Player was successfully updated')
      navigate(navigateBackTo, {
        replace: true,
      })
    }
  }

  async function handleDeletePlayer() {
    const deletePlayerRes = await deletePlayerFromLeague(playerId)
    if (deletePlayerRes.ok) {
      setUpdatedPlayer(defaultState)
      setShowDeleteConfirmation(false)
      toast.success('Player was successfully deleted')
      navigate(navigateBackTo, {
        replace: true,
      })
    }
  }

  function handleInputChange({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement>): void {
    setUpdatedPlayer({ ...updatedPlayer, [name]: value })
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
      <button onClick={() => setShowDeleteConfirmation((show) => !show)}>
        Delete
      </button>

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
