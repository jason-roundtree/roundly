import { useState, MouseEvent } from 'react'

export default function PointListItemSelectable({
  name,
  weight,
  id,
  twListItems,
  toggleSelectedPoint,
  isSelected,
}: {
  name: string
  weight: number
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
      {name} {weight}
    </li>
  )
}
