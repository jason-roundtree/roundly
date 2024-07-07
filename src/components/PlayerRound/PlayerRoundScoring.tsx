import { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'

import { PlayerRoundPointsEarnedTable, PlayerRoundScorecard } from '.'
import './index.css'
import {
  getRoundPlayerPointsEarned,
  getRoundPlayerPointsEarnedTotal,
} from '../../data'

export default function PlayerRoundPointsEarned() {
  const [totalPoints, setTotalPoints] = useState<number | null>(null)
  const [roundPointsEarned, setRoundPointsEarned] = useState<[]>([])
  const params = useParams()
  // TODO: why can't i destructure params above without TS complaining?
  const leagueId = params.leagueId as string
  const roundId = params.roundId as string
  const [searchParams] = useSearchParams()
  const playerName = searchParams.get('playerName') ?? ''
  const playerId = searchParams.get('playerId') ?? ''

  useEffect(() => {
    getAndSetRoundTotalPoints()
    getAndSetRoundPointsEarned()
  }, [playerId, roundId])

  async function getAndSetRoundTotalPoints() {
    const res = await getRoundPlayerPointsEarnedTotal(playerId, roundId)
    console.log('res', res)
    // TODO: handle error case differently so 404 is not being thrown when player is in round but has no points
    if (res.status === 200) {
      const { total_points } = await res.json()
      setTotalPoints(total_points)
    }
  }

  async function getAndSetRoundPointsEarned() {
    const res = await getRoundPlayerPointsEarned(playerId, roundId)
    console.log('res', res)
    // TODO: handle error case differently so 404 is not being thrown when player is in round but has no points
    if (res.status === 200) {
      const pointsEarnedJson = await res.json()
      console.log('getAndSetRoundPointsEarned json', pointsEarnedJson)
      setRoundPointsEarned(pointsEarnedJson)
    }
  }

  return (
    <>
      <h3 className="page-title">Player Round Scoring - {playerName}</h3>

      <div className="centered-button">
        <Link
          to={`/league/${leagueId}/rounds/${roundId}/round-player-scoring?playerId=${playerId}&playerName=${encodeURIComponent(
            playerName
          )}`}
        >
          <button>Enter Point Earned / Score</button>
        </Link>
      </div>

      <div id="pointAndScoreSummaryCards">
        <div id="totalPoints">
          <p className="cardLabel">Total Points</p>
          <p className="cardTotal">{totalPoints || 0}</p>
        </div>
        <div id="totalScore">
          <p className="cardLabel">Total Score</p>
          <p className="cardTotal">71</p>
        </div>
      </div>

      <PlayerRoundPointsEarnedTable pointsEarned={roundPointsEarned} />
      <PlayerRoundScorecard />
    </>
  )
}
