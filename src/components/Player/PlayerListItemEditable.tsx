import { useState } from 'react'
import Modal from '../shared/components/Modal'
import BasicInput from '../shared/components/BasicInput'
import { fetchPlayers } from '../League/LeaguePlayers'

interface EditablePlayer {
  name: string
}
const defaultState: EditablePlayer = {
  name: '',
}

// className="max-w-fit rounded-lg my-1 mx-4 p-2 editable-list-item"
export default function PlayerEditableListItem({
  player,
  listName,
  refreshPlayerState,
  twEditInputs,
  twListItems,
}) {
  const [updatedPlayer, setUpdatedPlayer] = useState(defaultState)
  const [isBeingEdited, setIsBeingEdited] = useState(false)
  const { id, name } = player

  async function updatePlayer() {
    try {
      const res = await fetch(`http://localhost:3001/api/players/${id}`, {
        method: 'PUT',
      })
      // const resJson = await res.json()
      // console.log('resJson', resJson)
      const players = await fetchPlayers()
      console.log('edited players', players)
    } catch (err) {
      console.log('update player error: ', err)
    }
  }

  function handleEditingState(name) {
    setUpdatedPlayer(name)
    setIsBeingEdited(true)
  }

  async function deletePlayer(id) {
    try {
      const res = await fetch(`http://localhost:3001/api/players/${id}`, {
        method: 'DELETE',
      })
      console.log('delete player res: ', res.json())
      refreshPlayerState()
    } catch (err) {
      console.log('delete player error: ', err)
    }
  }

  async function handleUpdatePlayer(id, updatedPlayer, listName) {
    await updatePlayer()
    refreshPlayerState()
    setUpdatedPlayer(defaultState)
    setIsBeingEdited(false)
  }

  function handleInputChange({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement>): void {
    setUpdatedPlayer({ ...updatedPlayer, [name]: value })
  }

  return (
    <li className={twListItems}>
      {isBeingEdited && (
        <Modal
          title="Update Player"
          closeModal={() => setIsBeingEdited(false)}
          // deleteItemFn={() => deleteItemFromList(id, listName)}
        >
          <BasicInput
            twClasses={`${twEditInputs} w-72`}
            type="text"
            label="Player Name"
            name="name"
            onChange={handleInputChange}
            value={updatedPlayer.name}
          />
          <button
            onClick={() => handleUpdatePlayer(id, listName, updatedPlayer)}
          >
            Save
          </button>
        </Modal>
      )}
      <span>{name}</span>
      <span className="list-edit-buttons">
        <button onClick={() => handleEditingState(player)}>Edit</button>
        <button onClick={() => deletePlayer(id)}>Delete</button>
      </span>
    </li>
  )
}
