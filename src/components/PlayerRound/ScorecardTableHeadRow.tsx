import { useState } from 'react'
import { getIncrementalHoleNumbers } from '../shared/utils'

export default function ScorecardTableHeadRow({
  numberOfHoles,
  holeGroup,
  holeGroupScoreTotal,
}) {
  const startNumber = holeGroup === 'back-nine' ? 10 : 1
  const scorecardHeader = getIncrementalHoleNumbers(numberOfHoles, startNumber)
  switch (holeGroup) {
    case 'front-nine':
      scorecardHeader.splice(9, 0, 'Out')
      break
    case 'back-nine':
      scorecardHeader.splice(9, 0, 'In')
      break
  }

  return (
    <thead>
      <tr>
        {scorecardHeader.map((h) => (
          <th key={h}>{h}</th>
        ))}
      </tr>
    </thead>
  )
}
