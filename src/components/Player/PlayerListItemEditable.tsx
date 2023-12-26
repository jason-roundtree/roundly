import { useState } from 'react'

import Modal from '../shared/components/Modal'
import BasicInput from '../shared/components/BasicInput'
import { updatePlayer, deletePlayer } from '../../data'

interface EditablePlayer {
  name: string
}
const defaultState: EditablePlayer = {
  name: '',
}

export default function PlayerEditableListItem({
  player,
  refreshPlayerState,
  twEditInputs,
  twListItems,
}) {
  const [updatedPlayer, setUpdatedPlayer] = useState(defaultState)
  const [isBeingEdited, setIsBeingEdited] = useState(false)
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

  async function handleDeletePlayer(playerId) {
    await deletePlayer(playerId)
    refreshPlayerState()
  }

  function handleInputChange({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement>): void {
    setUpdatedPlayer({ ...updatedPlayer, [name]: value })
  }

  return (
    <li className={twListItems}>
      {isBeingEdited && (
        <Modal title="Update Player" closeModal={() => setIsBeingEdited(false)}>
          <BasicInput
            twClasses={`${twEditInputs} w-72`}
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
        <button onClick={() => handleEditingState(player)}>Edit</button>
        <button onClick={() => handleDeletePlayer(player.id)}>Delete</button>
      </span>
    </li>
  )
}
