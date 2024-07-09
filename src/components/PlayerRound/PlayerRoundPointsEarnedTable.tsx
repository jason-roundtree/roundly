import { useEffect, useState } from 'react'

import PlayerRoundPointsEarnedTableRow from './PlayerRoundPointsEarnedTableRow'
import './index.css'

export default function PlayerRoundPointsEarnedTable({ roundPointsEarned }) {
  if (!roundPointsEarned.length) {
    return null
  }
  return (
    <div className="tableContainer">
      <p className="non-input-label">Points Earned</p>
      <table className="pointsEarnedTable">
        <thead>
          <tr>
            <th>Point</th>
            <th>Value</th>
            <th>Hole</th>
          </tr>
        </thead>
        <tbody>
          {roundPointsEarned.map(
            ({ id, playerId, point_setting, player_hole }) => {
              const { name, value } = point_setting
              const { hole } = player_hole || {}
              return (
                <PlayerRoundPointsEarnedTableRow
                  id={id}
                  key={id}
                  name={name}
                  value={value}
                  hole={hole}
                  playerId={playerId}
                />
              )
            }
          )}
        </tbody>
      </table>
    </div>
  )
}
