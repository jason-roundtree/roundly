import { useState, MouseEvent } from 'react'

import CheckboxButton from '../shared/components/CheckboxButton'

// TODO: consolidate with PlayerSelectable
export default function PointSelectable({
  name,
  value,
  id,
  toggleSelectedPoint,
  isSelected,
}: {
  name: string
  // TODO: remove undefined as it seems to be something weird from json data
  value: number | undefined
  id: string
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
