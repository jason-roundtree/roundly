import { useEffect, useState } from 'react'

import PlayerRoundPointsEarnedTableRow from './PlayerRoundPointsEarnedTableRow'
import './index.css'

export default function PlayerRoundPointsEarnedTable({ roundPointsEarned }) {
  console.log('roundPointsEarned', roundPointsEarned)
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
            <th>Quantity</th>
            <th>Hole</th>
          </tr>
        </thead>
        <tbody>
          {/* TODO: Currently roundPointsEarned contains separate rows when the same point is earned for the same hole but entered separately, should these be comined/reduced so that there's only one row per point earned on a hole? (or similarly for a round??) */}
          {roundPointsEarned.map(
            ({
              id,
              playerId,
              player,
              pointSettingId,
              point_setting,
              player_hole,
              frequency,
              playerHoleId,
            }) => {
              const { name, value, scope, maxFrequencyPerScope } = point_setting
              const { hole } = player_hole || {}
              return (
                // TODO: clean this up so not passing in so many props?
                <PlayerRoundPointsEarnedTableRow
                  id={id}
                  key={id}
                  name={name}
                  value={value}
                  scope={scope}
                  maxFrequencyPerScope={maxFrequencyPerScope}
                  hole={hole}
                  frequency={frequency}
                  playerId={playerId}
                  playerName={player.name}
                  playerHoleId={playerHoleId}
                  pointSettingId={pointSettingId}
                />
              )
            }
          )}
        </tbody>
      </table>
    </div>
  )
}
