import { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'

import {
  PlayerRoundPointsEarnedTable,
  PlayerRoundScorecard,
  ScorecardTable,
} from '.'
import './index.css'
import {
  getRoundPlayerPointsEarned,
  getRoundPlayerPointsEarnedTotal,
  getPlayerHoleScores,
  updatePlayerHoleScore,
} from '../../data'
import { getArrayOfNumbersTotal } from '../shared/utils'

interface PlayerHole {
  id: string
  playerId: string
  roundId: string
  hole: number
  score?: number
}

export default function PlayerRoundPointsEarned() {
  const [totalPoints, setTotalPoints] = useState<number | null>(null)
  const [roundPointsEarned, setRoundPointsEarned] = useState<[]>([])
  const [roundHoleData, setRoundHoleData] = useState<PlayerHole[]>([])
  const [roundHoleScores, setRoundHoleScores] = useState<Array<number>>([])
  const params = useParams()
  // TODO: why can't i destructure params above without TS complaining?
  const leagueId = params.leagueId as string
  const roundId = params.roundId as string
  const [searchParams] = useSearchParams()
  const playerName = searchParams.get('playerName') ?? ''
  const playerId = searchParams.get('playerId') ?? ''
  const frontNineScores = roundHoleScores.slice(0, 9)
  const frontNineTotal = getArrayOfNumbersTotal(frontNineScores)
  const backNineScores = roundHoleScores.slice(9)
  const backNineTotal = getArrayOfNumbersTotal(backNineScores)
  // TODO: remove once model is updated
  const holesInRound = 18

  useEffect(() => {
    getPlayerRoundTotalPoints()
    getPlayerRoundPointsEarned()
    getPlayerRoundHoleData()
  }, [playerId, roundId])

  useEffect(() => {
    mapScoresToState()
  }, [roundHoleData])

  async function getPlayerRoundTotalPoints() {
    const res = await getRoundPlayerPointsEarnedTotal(playerId, roundId)
    // TODO: handle error case differently so 404 is not being thrown when player is in round but has no points
    if (res.status === 200) {
      const { total_points } = await res.json()
      setTotalPoints(total_points)
    }
  }

  async function getPlayerRoundPointsEarned() {
    const res = await getRoundPlayerPointsEarned(playerId, roundId)
    // TODO: handle error case differently so 404 is not being thrown when player is in round but has no points
    if (res.status === 200) {
      const pointsEarned = await res.json()
      setRoundPointsEarned(pointsEarned)
    }
  }

  async function getPlayerRoundHoleData() {
    const res = await getPlayerHoleScores(playerId, roundId, true)
    if (res.status === 200) {
      const holeScores = await res.json()
      console.log('getPlayerRoundHoleData json', holeScores)
      setRoundHoleData(holeScores)
    }
  }

  function mapScoresToState() {
    const scores: Array<number> = Array.from(Array(holesInRound - 1), (_) => 0)
    for (const playerHole of roundHoleData) {
      const { score, hole } = playerHole as { score: number; hole: number }
      scores[hole - 1] = score
    }
    setRoundHoleScores(scores)
  }

  async function handleEditScore(hole) {
    console.log('handleEditScore')
    // const res = await updatePlayerHoleScore(19, null, roundId, +hole)
  }

  return (
    <>
      <h3 className="page-title">Player Round Scoring </h3>
      <h3 className="page-title">{playerName}</h3>

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
          <p className="cardTotal">{frontNineTotal + backNineTotal}</p>
        </div>
      </div>

      <PlayerRoundPointsEarnedTable
        roundPointsEarned={roundPointsEarned}
        getPlayerRoundPointsEarned={getPlayerRoundPointsEarned}
      />

      <p className="non-input-label">Scorecard</p>
      <ScorecardTable
        numberOfHoles={holesInRound / 2}
        holeGroup="front-nine"
        holeGroupScoreTotal={frontNineTotal}
        holeScores={frontNineScores}
        handleEditScore={handleEditScore}
      />
      <ScorecardTable
        numberOfHoles={holesInRound / 2}
        holeGroup="back-nine"
        holeGroupScoreTotal={backNineTotal}
        holeScores={backNineScores}
        handleEditScore={handleEditScore}
      />
    </>
  )
}
