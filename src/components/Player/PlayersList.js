import React from 'react'

// interface PlayerListProps {
//   players: Player[]
// }

export default function PlayersList({ players }) {
  return (
    <ul>
      {players.map(p => {
        return (
          <li key={p}>
            {p}
          </li>
        )
      })}
    </ul>
  )
}
