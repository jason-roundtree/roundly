import React from 'react'

import { ScorecardTableHeadRow, ScorecardHoleScoreTableRow } from '.'

export interface ScorecardMeta {
  numberOfHoles: number
  holeGroup: 'front-nine' | 'back-nine'
  holeGroupScoreTotal?: number
  holeScores: Array<number | undefined>
}

export default function ScorecardTable({
  numberOfHoles,
  holeGroup,
  holeGroupScoreTotal,
  holeScores,
}: ScorecardMeta) {
  return (
    <div className="tableContainer">
      <table className="scorecardTable">
        <ScorecardTableHeadRow
          numberOfHoles={numberOfHoles}
          holeGroup={holeGroup}
          holeGroupScoreTotal={holeGroupScoreTotal}
        />
        <tbody>
          <ScorecardHoleScoreTableRow holeScores={holeScores} />
        </tbody>
      </table>
    </div>
  )
}
