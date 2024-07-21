import React from 'react'

import { ScorecardTableHead, ScorecardHoleScoreTableRow } from '.'

export interface ScorecardMeta {
  numberOfHoles: number
  holeGroup: 'front-nine' | 'back-nine'
  holeGroupScoreTotal?: number
  holeScores: number[]
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
        <ScorecardTableHead
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
