import { useState } from 'react'

import Modal from '../shared/components/ModalContainer'
import BasicInput from '../shared/components/BasicInput'
import { updatePlayer, deletePlayerFromLeague } from '../../data'
import DeleteConfirmationModal from '../shared/components/DeleteConfirmationModal'

interface EditablePlayer {
  name: string
}
const defaultState: EditablePlayer = {
  name: '',
}

export default function PlayerEditableListItem({ player, refreshPlayerState }) {
  const [updatedPlayer, setUpdatedPlayer] = useState(defaultState)
  const [isBeingEdited, setIsBeingEdited] = useState(false)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const { id: playerId, name } = player

  function handleEditingState(name) {
    setUpdatedPlayer(name)
    setIsBeingEdited(true)
  }

  async function handleUpdatePlayer() {
    await updatePlayer(playerId, updatedPlayer)
    refreshPlayerState()
    setUpdatedPlayer(defaultState)
    setIsBeingEdited(false)
  }

  async function handleDeletePlayer() {
    await deletePlayerFromLeague(playerId)
    refreshPlayerState()
  }

  function handleInputChange({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement>): void {
    setUpdatedPlayer({ ...updatedPlayer, [name]: value })
  }

  return (
    <>
      <li>
        {isBeingEdited && (
          <Modal
            title="Update Player"
            closeModal={() => setIsBeingEdited(false)}
          >
            <BasicInput
              type="text"
              label="Player Name"
              name="name"
              onChange={handleInputChange}
              value={updatedPlayer.name}
            />
            <button onClick={() => handleUpdatePlayer()}>Save</button>
          </Modal>
        )}
        <span>{name}</span>
        <span className="list-edit-buttons">
          <button onClick={() => handleEditingState(player)}>Update</button>
          <button onClick={() => setShowDeleteConfirmation((show) => !show)}>
            Delete From League
          </button>
        </span>
      </li>

      {showDeleteConfirmation && (
        <DeleteConfirmationModal
          modalTitle="Confirm Player Deletion"
          confirmationText="Are you sure you want to delete this player from the league?"
          buttonText="Delete"
          onConfirmDelete={handleDeletePlayer}
          toggleModalActive={() => setShowDeleteConfirmation((show) => !show)}
        />
      )}
    </>
  )
}
