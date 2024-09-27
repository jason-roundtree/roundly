import { useState, useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'

import BasicInput from '../shared/components/BasicInput'
import { deletePlayerFromLeague, updatePlayer } from '../../data'
import DeleteConfirmationModal from '../shared/components/DeleteConfirmationModal'

interface EditablePlayer {
  name: string
}
const defaultState: EditablePlayer = {
  name: '',
}

export default function EditLeaguePlayer() {
  const location = useLocation()
  const { name, playerId } = location.state
  const [updatedPlayer, setUpdatedPlayer] = useState<EditablePlayer>(
    () => ({ name } || defaultState)
  )
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const navigate = useNavigate()
  console.log('playerFromLocation', { name, playerId })
  console.log('updatedPlayer', updatedPlayer)
  const { leagueId } = useParams()

  //   useEffect(() => {
  //     if (location.state) { setUpdatedPlayer(playerFromLocation.name) }
  //   }, [location.state])

  async function handleUpdatePlayer() {
    // TODO: if name is empty, show error
    if (!updatedPlayer.name) {
      toast.error('Player name is required')
      return
    }
    const updatePlayerRes = await updatePlayer(playerId, updatedPlayer)
    console.log('updatePlayerRes', updatePlayerRes)
    if (updatePlayerRes.ok) {
      toast.success('Player was successfully updated')
    }
    setUpdatedPlayer(defaultState)
  }

  async function handleDeletePlayer() {
    const deletePlayerRes = await deletePlayerFromLeague(playerId)
    console.log('deletePlayerRes', deletePlayerRes)
    if (deletePlayerRes.ok) {
      setUpdatedPlayer(defaultState)
      setShowDeleteConfirmation(false)
      navigate(`/league/${leagueId}/players/`, {
        replace: true,
      })
      toast.success('Player was successfully deleted')
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
      <div>Edit League Player</div>

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

      <ToastContainer position="bottom-left" autoClose={3000} />
    </>
  )
}
