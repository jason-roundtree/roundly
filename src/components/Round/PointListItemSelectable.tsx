import { useState, MouseEvent } from 'react'

export default function PointListItemSelectable({
  name,
  value,
  id,
  twListItems,
  toggleSelectedPoint,
  isSelected,
}: {
  name: string
  // TODO: remove undefined as it seems to be something weird from json data
  value: number | undefined
  id: string
  twListItems: string
  toggleSelectedPoint: (id) => void
  isSelected: boolean
}) {
  return (
    <li
      key={id}
      className={`selectable-LI ${twListItems} ${isSelected && 'is-selected'}`}
      onClick={() => toggleSelectedPoint(id)}
    >
      {name} {value}
    </li>
  )
}
