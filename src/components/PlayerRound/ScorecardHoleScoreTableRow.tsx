import React from 'react'

export default function ScorecardHoleScoreTableRow({ holeScores }) {
  console.log('holeScores', holeScores)
  return (
    <tr>
      {holeScores.map((score, i) => {
        return <td key={i}>{score}</td>
      })}
    </tr>
  )
}
