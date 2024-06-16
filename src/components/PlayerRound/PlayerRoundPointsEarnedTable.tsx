import React from 'react'

import PlayerRoundPointsEarnedTableRow from './PlayerRoundPointsEarnedTableRow'
import './index.css'

export default function PlayerRoundPointsEarnedTable() {
  return (
    <div className="tableContainer">
      <p className="nonInputLabel">Points Earned</p>
      <table className="pointsEarnedTable">
        <thead>
          <tr>
            <th>Point</th>
            <th>Value</th>
            <th>Hole</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Birdie</td>
            <td>5</td>
            <td>2</td>
          </tr>

          <tr>
            <td>Bogey</td>
            <td>-2</td>
            <td>4</td>
          </tr>

          <tr>
            <td>Swear</td>
            <td>-5</td>
            <td>7</td>
          </tr>

          <tr>
            <td>Over Double Bogey</td>
            <td>-10</td>
            <td>7</td>
          </tr>

          <tr>
            <td>Up and down from bunker</td>
            <td>10</td>
            <td>9</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
