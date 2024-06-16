import React from 'react'

export default function PlayerRoundPointsEarnedTableRow({
  id,
  name,
  value,
  hole,
  playerId,
}): JSX.Element {
  return (
    <tr key={id} id={id}>
      <td>{name}</td>
      <td>{value}</td>
      <td>{hole}</td>
    </tr>
  )
}
