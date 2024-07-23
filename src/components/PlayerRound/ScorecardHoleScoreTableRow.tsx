import React from 'react'

export default function ScorecardHoleScoreTableRow({
  holeScores,
  holeGroupScoreTotal,
  handleEditScore,
}) {
  return (
    <tr>
      {holeScores.map((score, i) => {
        return (
          <td key={i} onClick={() => handleEditScore(i + 1)}>
            {score ? score : ''}
          </td>
        )
      })}
      {holeGroupScoreTotal && <td key="total">{holeGroupScoreTotal}</td>}
    </tr>
  )
}
