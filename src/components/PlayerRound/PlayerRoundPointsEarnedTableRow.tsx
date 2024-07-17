import React from 'react'

interface PlayerRoundPointsEarnedRow {
  id: string
  name: string
  value: number
  hole?: number
  frequency?: number
  playerId: string
}

export default function PlayerRoundPointsEarnedTableRow({
  id,
  name,
  value,
  hole,
  frequency,
  playerId,
}: PlayerRoundPointsEarnedRow): JSX.Element {
  return (
    <tr id={id}>
      <td>{name}</td>
      <td>{value}</td>
      <td>{frequency}</td>
      <td>{hole ?? ''}</td>
    </tr>
  )
}
