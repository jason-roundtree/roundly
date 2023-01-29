import { useState } from 'react'
import Modal from '../shared/Modal'
import BasicInput from '../shared/BasicInput'

interface EditablePlayer {
  playerName: string
}
const defaultState: EditablePlayer = {
  playerName: '',
}

export default function PlayersListItem({
  player,
  listName,
  updateListItem,
  deleteItemFromList,
  twEditInputs,
  twListItems,
}) {
  const [updatedPlayer, setUpdatedPlayer] = useState(defaultState)
  const [isBeingEdited, setIsBeingEdited] = useState(false)
  const { id, playerName } = player

  function handleEditingState(playerName) {
    setUpdatedPlayer(playerName)
    setIsBeingEdited(true)
  }

  function handleUpdatePlayer(id, listName, updatedPlayer) {
    updateListItem(id, listName, updatedPlayer)
    setIsBeingEdited(false)
    setUpdatedPlayer(defaultState)
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
          <div>
            <BasicInput
              twClasses={`${twEditInputs} w-72`}
              type="text"
              label="Player Name"
              name="playerName"
              onChange={handleInputChange}
              value={updatedPlayer.playerName}
            />
            <button
              onClick={() => handleUpdatePlayer(id, listName, updatedPlayer)}
            >
              Save
            </button>
          </div>
        </Modal>
      )}
      <span>{playerName}</span>
      <span className="list-edit-buttons">
        <button onClick={() => handleEditingState(player)}>Edit</button>
        <button onClick={() => deleteItemFromList(id, listName)}>Delete</button>
      </span>
    </li>
  )
}
