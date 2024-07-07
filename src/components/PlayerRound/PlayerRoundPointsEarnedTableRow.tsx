import React from 'react'

interface PlayerRoundPointsEarnedRow {
  id: string
  name: string
  value: number
  hole?: number
  playerId: string
}

export default function PlayerRoundPointsEarnedTableRow({
  id,
  name,
  value,
  hole,
  playerId,
}: PlayerRoundPointsEarnedRow): JSX.Element {
  return (
    <tr key={id} id={id}>
      <td>{name}</td>
      <td>{value}</td>
      <td>{hole ?? ''}</td>
    </tr>
  )
}
