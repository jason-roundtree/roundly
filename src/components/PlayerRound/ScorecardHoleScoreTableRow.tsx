import React from 'react'

export default function ScorecardHoleScoreTableRow({
  holeScores,
  holeGroupScoreTotal,
  handleOpenEditScoreModal,
}) {
  return (
    <tr>
      {holeScores.map((hs) => {
        const { playerHoleId, score, hole } = hs || {}
        return (
          <td
            id={playerHoleId}
            key={hole}
            onClick={() =>
              handleOpenEditScoreModal({ playerHoleId, hole, score })
            }
          >
            {score ? score : ''}
          </td>
        )
      })}
      {<td key="total">{holeGroupScoreTotal ? holeGroupScoreTotal : ''}</td>}
    </tr>
  )
}
