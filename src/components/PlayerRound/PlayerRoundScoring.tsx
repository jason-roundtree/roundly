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
} from '../../data'

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
  const [roundHoleScores, setRoundHoleScores] = useState<PlayerHole[]>([])
  const [roundHoleScoresFormatted, setRoundHoleScoresFormatted] = useState<
    Array<number | undefined>
  >([])
  const params = useParams()
  // TODO: why can't i destructure params above without TS complaining?
  const leagueId = params.leagueId as string
  const roundId = params.roundId as string
  const [searchParams] = useSearchParams()
  const playerName = searchParams.get('playerName') ?? ''
  const playerId = searchParams.get('playerId') ?? ''

  // TODO: remove once model is updated
  const holesInRound = 18

  useEffect(() => {
    getPlayerRoundTotalPoints()
    getPlayerRoundPointsEarned()
    getPlayerRoundHoleScores()
  }, [playerId, roundId])

  useEffect(() => {
    mapScoresToState()
  }, [roundHoleScores])

  async function getPlayerRoundTotalPoints() {
    const res = await getRoundPlayerPointsEarnedTotal(playerId, roundId)
    console.log('getPlayerRoundTotalPoints res', res)
    // TODO: handle error case differently so 404 is not being thrown when player is in round but has no points
    if (res.status === 200) {
      const { total_points } = await res.json()
      setTotalPoints(total_points)
    }
  }

  async function getPlayerRoundPointsEarned() {
    const res = await getRoundPlayerPointsEarned(playerId, roundId)
    console.log('getPlayerRoundPointsEarned res', res)
    // TODO: handle error case differently so 404 is not being thrown when player is in round but has no points
    if (res.status === 200) {
      const pointsEarnedJson = await res.json()
      console.log('getPlayerRoundPointsEarned json', pointsEarnedJson)
      setRoundPointsEarned(pointsEarnedJson)
    }
  }

  async function getPlayerRoundHoleScores() {
    const res = await getPlayerHoleScores(playerId, roundId, true)
    console.log('getPlayerRoundPointsEarned res', res)
    if (res.status === 200) {
      const holeScoresResJson = await res.json()
      console.log('getPlayerRoundHoleScores json', holeScoresResJson)
      setRoundHoleScores(holeScoresResJson)
    }
  }

  function mapScoresToState() {
    const scoresFormatted: Array<undefined | number> = Array.from(
      Array(holesInRound - 1)
    )
    console.log('### roundHoleScores ##', roundHoleScores)
    for (const playerHole of roundHoleScores) {
      const { score, hole } = playerHole
      scoresFormatted[hole - 1] = score
    }
    console.log('scoresFormatted $$$$', scoresFormatted)
    setRoundHoleScoresFormatted(scoresFormatted)
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
          <p className="cardTotal">71</p>
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
        holeGroupScoreTotal={36}
        holeScores={roundHoleScoresFormatted.slice(0, 9)}
      />
      <ScorecardTable
        numberOfHoles={holesInRound / 2}
        holeGroup="back-nine"
        holeGroupScoreTotal={40}
        holeScores={roundHoleScoresFormatted.slice(9)}
      />
    </>
  )
}
