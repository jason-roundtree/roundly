import { useState, MouseEvent } from 'react'

export default function PlayerListItemSelectable({
  name,
  id,
  twListItems,
  toggleSelectedPlayer,
  isSelected,
}: {
  name: string
  id: string
  twListItems: string
  toggleSelectedPlayer: (id) => void
  isSelected: boolean
}) {
  return (
    <li
      key={id}
      className={`selectable-LI ${twListItems} ${isSelected && 'is-selected'}`}
      onClick={() => toggleSelectedPlayer(id)}
    >
      {name}
    </li>
  )
}
