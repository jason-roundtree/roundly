import React from 'react'
import { Link, useParams } from 'react-router-dom'

import { PlayerRoundPointsEarnedTable, PlayerRoundScorecard } from '.'
import './index.css'

export default function PlayerRoundPointsEarned() {
  const { leagueId, roundId, playerId } = useParams()

  return (
    <>
      <h3 className="page-title">Player Round Scoring</h3>

      <div id="enterPointEarned">
        <Link
          to={`/league/${leagueId}/rounds/${roundId}/${playerId}/enter-point`}
        >
          <button>Enter Point Earned / Score</button>
        </Link>
      </div>

      <div id="pointAndScoreSummaryCards">
        <div id="totalPoints">
          <p className="cardLabel">Total Points</p>
          <p className="cardTotal">30</p>
        </div>
        <div id="totalScore">
          <p className="cardLabel">Total Score</p>
          <p className="cardTotal">71</p>
        </div>
      </div>

      <PlayerRoundPointsEarnedTable />
      <PlayerRoundScorecard />
    </>
  )
}
