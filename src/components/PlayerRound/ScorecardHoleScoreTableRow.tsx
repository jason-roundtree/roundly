import React from 'react'

export default function ScorecardHoleScoreTableRow({
  holeScores,
  holeGroupScoreTotal,
  handleEditScore,
}) {
  return (
    <tr>
      {holeScores.map((hs) => {
        const { playerHoleId, score, hole } = hs || {}
        return (
          <td
            id={playerHoleId}
            key={hole}
            onClick={() => handleEditScore({ playerHoleId, hole, score })}
          >
            {score ? score : ''}
          </td>
        )
      })}
      {holeGroupScoreTotal ? <td key="total">{holeGroupScoreTotal}</td> : ''}
    </tr>
  )
}
