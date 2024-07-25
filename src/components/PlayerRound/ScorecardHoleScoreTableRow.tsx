import React from 'react'

export default function ScorecardHoleScoreTableRow({
  holeScores,
  holeGroupScoreTotal,
  handleEditScore,
}) {
  return (
    <tr>
      {holeScores.map((hs) => {
        const { id, score, hole } = hs || {}
        return (
          <td
            id={id}
            key={hole}
            onClick={() => handleEditScore(id, hole, score)}
          >
            {score ? score : ''}
          </td>
        )
      })}
      {holeGroupScoreTotal ? <td key="total">{holeGroupScoreTotal}</td> : ''}
    </tr>
  )
}
