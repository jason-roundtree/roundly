import React from 'react'
import styles from './PlayerRoundPointsAndScoringSummary.module.css'

export default function PlayerRoundPointsAndScoringSummary({
  totalPoints,
  totalScoresEntered,
  frontNineTotal,
  backNineTotal,
}) {
  return (
    <div id="pointAndScoreSummaryCards">
      <div id="totalPoints">
        <p className="cardLabel">Total Points</p>
        <p className="cardTotal">{totalPoints || 0}</p>
      </div>
      <div id="totalScore">
        <p className="cardLabel">
          Total Score{' '}
          {!!totalScoresEntered && (
            <span id={styles.scoresEntered}>
              {/* TODO: move to top of page so it also encompasses points earned? */}
              (thru {totalScoresEntered}{' '}
              {totalScoresEntered > 1 ? 'holes' : 'hole'})
            </span>
          )}
        </p>
        <p className="cardTotal">{frontNineTotal + backNineTotal}</p>
      </div>
    </div>
  )
}
