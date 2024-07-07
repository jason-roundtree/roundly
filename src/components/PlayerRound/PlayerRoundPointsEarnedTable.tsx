import { useEffect, useState } from 'react'

import PlayerRoundPointsEarnedTableRow from './PlayerRoundPointsEarnedTableRow'
import './index.css'

export default function PlayerRoundPointsEarnedTable({ pointsEarned }) {
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
          {pointsEarned.map(({ id, playerId, point_setting }) => {
            const { name, value } = point_setting
            return (
              <PlayerRoundPointsEarnedTableRow
                id={id}
                name={name}
                value={value}
                playerId={playerId}
              />
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
