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
      <span>
        {isBeingEdited ? (
          <>
            {/* <label htmlFor="playerName" className="block mt-2 font-semibold">
              Name
            </label> */}
            <input
              className={`${twEditInputs} w-72`}
              type="text"
              name="playerName"
              value={updatedPlayer.playerName}
              onChange={handleInputChange}
            />
          </>
        ) : (
          playerName
        )}
      </span>
      <span className="list-edit-buttons">
        {!isBeingEdited && (
          <button onClick={() => handleEditingState(player)}>Edit</button>
        )}
        {isBeingEdited && (
          <button
            onClick={() => handleUpdatePlayer(id, listName, updatedPlayer)}
          >
            Save
          </button>
        )}
        <button onClick={() => deleteItemFromList(id, listName)}>Delete</button>
      </span>
    </li>
  )
}
