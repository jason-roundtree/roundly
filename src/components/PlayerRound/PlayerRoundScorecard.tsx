import React from 'react'

export default function PlayerRoundScorecard() {
  return (
    <div className="tableContainer">
      <p className="nonInputLabel">Scorecard</p>
      <table className="scorecardTable">
        <thead>
          <tr>
            <th>1</th>
            <th>2</th>
            <th>3</th>
            <th>4</th>
            <th>5</th>
            <th>6</th>
            <th>7</th>
            <th>8</th>
            <th>9</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>4</td>
            <td>3</td>
            <td>6</td>
            <td>5</td>
            <td>5</td>
            <td>4</td>
            <td>7</td>
            <td>3</td>
            <td>5</td>
            <td>45</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
