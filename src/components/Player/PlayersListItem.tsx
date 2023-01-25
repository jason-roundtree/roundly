import { useState } from 'react'

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
    <li className="max-w-fit rounded-lg my-1 mx-4 p-2 editable-list-item">
      <span>
        {isBeingEdited ? (
          <input
            type="text"
            name="playerName"
            value={updatedPlayer.playerName}
            onChange={handleInputChange}
          />
        ) : (
          playerName
        )}
      </span>
      {!isBeingEdited && (
        <button onClick={() => handleEditingState(player)}>Edit</button>
      )}
      {isBeingEdited && (
        <button onClick={() => handleUpdatePlayer(id, listName, updatedPlayer)}>
          Save
        </button>
      )}
      <button onClick={() => deleteItemFromList(id, listName)}>Delete</button>
    </li>
  )
}
