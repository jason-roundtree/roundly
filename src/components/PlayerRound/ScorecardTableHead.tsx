import { useState } from 'react'
import { getIncrementalHoleNumbers } from '../shared/utils'

export default function ScorecardTableHead({
  numberOfHoles,
  holeGroup,
  holeGroupScoreTotal,
}) {
  const startNumber = holeGroup === 'back-nine' ? 10 : 1
  const holeNumberList = getIncrementalHoleNumbers(numberOfHoles, startNumber)
  if (holeGroupScoreTotal) {
    switch (holeGroup) {
      case 'front-nine':
        holeNumberList.splice(9, 0, 'Out')
        break
      case 'back-nine':
        holeNumberList.splice(9, 0, 'In')
        break
    }
  }

  return (
    <thead>
      <tr>
        {holeNumberList.map((h) => (
          <th>{h}</th>
        ))}
      </tr>
    </thead>
  )
}
