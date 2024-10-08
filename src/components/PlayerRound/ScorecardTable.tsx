import React from 'react'

import { ScorecardTableHeadRow, ScorecardHoleScoreTableRow } from '.'
import { PlayerHoleScoreState } from '../shared/hooks/usePlayerHoleScoreBeingEdited'

export interface ScorecardMeta {
  numberOfHoles: number
  holeGroup: 'front-nine' | 'back-nine'
  holeGroupScoreTotal?: number
  holeScores: Array<PlayerHoleScoreState>
  handleOpenEditScoreModal?({
    playerHoleId,
    hole,
    score,
  }: PlayerHoleScoreState): void
}

export default function ScorecardTable({
  numberOfHoles,
  holeGroup,
  holeGroupScoreTotal,
  holeScores,
  handleOpenEditScoreModal,
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
          <ScorecardHoleScoreTableRow
            holeScores={holeScores}
            holeGroupScoreTotal={holeGroupScoreTotal}
            handleOpenEditScoreModal={handleOpenEditScoreModal}
          />
        </tbody>
      </table>
    </div>
  )
}
