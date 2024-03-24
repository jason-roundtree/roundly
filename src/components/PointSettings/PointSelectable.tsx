import { useState, MouseEvent } from 'react'

import CheckboxButton from '../shared/components/CheckboxButton'

export default function PointSelectable({
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
  toggleSelectedPoint: () => void
  isSelected: boolean
}) {
  const labelText = `${name} ${value}`
  return (
    <CheckboxButton
      checked={isSelected}
      label={labelText}
      id={id}
      onChange={toggleSelectedPoint}
    />
  )
}
