import React from 'react'
import EditableListItem from '../../components/shared/EditableListItem'

// interface PlayerListProps {
//   players: Player[]
// }

export default function PlayersList({ players, listName, deleteItemFromList }) {
  return (
    <ul className="mb-3">
      {players.map(({ id, playerName }) => {
        return (
          <EditableListItem
            id={id}
            key={id}
            text={playerName}
            deleteItemFromList={deleteItemFromList}
            listName={listName}
          />
        )
      })}
    </ul>
  )
}
