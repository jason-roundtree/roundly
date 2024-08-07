import { useEffect, useState, useRef, forwardRef } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'

import { PlayerRoundPointsEarnedTable, ScorecardTable } from '.'
import './index.css'
import {
  getRoundPlayerPointsEarned,
  getRoundPlayerPointsEarnedTotal,
  getPlayerHoleScores,
  updatePlayerHoleScore,
  createOrFindPlayerHole,
} from '../../data'
import {
  getScoreTotal,
  getTotalHoleScores,
  selectAllInputText,
} from '../shared/utils'
import Modal from '../shared/components/Modal'
import BasicInput from '../shared/components/BasicInput'
import styles from './PlayerRoundScoring.module.css'

interface PlayerHole {
  id: string
  playerId: string
  roundId: string
  hole: number
  score?: number
}

export interface PlayerHoleScoreState {
  playerHoleId: string | null
  score: number | null
  hole: number
}

const defaultScoreBeingEditedState = {
  playerHoleId: null,
  score: null,
  hole: null,
}

export default function PlayerRoundPointsEarned() {
  const [totalPoints, setTotalPoints] = useState<number | null>(null)
  const [roundPointsEarned, setRoundPointsEarned] = useState<[]>([])
  const [roundHoleData, setRoundHoleData] = useState<PlayerHole[]>([])
  const [roundHoleScores, setRoundHoleScores] = useState<
    PlayerHoleScoreState[]
  >([])
  const [showModal, setShowModal] = useState(false)
  const [scoreBeingEdited, setScoreBeingEdited] = useState<
    Omit<PlayerHoleScoreState, 'hole'> & { hole: number | null }
  >(defaultScoreBeingEditedState)

  const params = useParams()
  // TODO: why can't i destructure params above without TS complaining?
  const leagueId = params.leagueId as string
  const roundId = params.roundId as string
  const [searchParams] = useSearchParams()
  const playerName = searchParams.get('playerName') ?? ''
  const playerId = searchParams.get('playerId') ?? ''
  const frontNineScores = roundHoleScores.slice(0, 9)
  const frontNineTotal = getScoreTotal(frontNineScores)
  const backNineScores = roundHoleScores.slice(9)
  const backNineTotal = getScoreTotal(backNineScores)
  const totalScoresEntered = getTotalHoleScores(roundHoleScores)
  console.log('totalScoresEntered', totalScoresEntered)
  const { playerHoleId, hole, score } = scoreBeingEdited || {}
  // TODO: remove once model is updated
  const holesInRound = 18

  console.log('XXXXX roundHoleScores ', roundHoleScores)
  console.log('$$$$$ handleEditScore scoreBeingEdited: ', scoreBeingEdited)

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
    const holeScoreData: Array<PlayerHoleScoreState> = Array.from(
      Array(holesInRound),
      (_, i) => ({
        playerHoleId: null,
        hole: i + 1,
        score: null,
      })
    )
    for (const playerHole of roundHoleData) {
      const { score, hole, id: playerHoleId } = playerHole
      const holeToAddScore = holeScoreData[hole - 1]
      holeScoreData[hole - 1] = {
        ...holeToAddScore,
        playerHoleId,
        score,
      } as PlayerHoleScoreState
    }
    setRoundHoleScores(holeScoreData)
  }

  function handleInputChange(e) {
    setScoreBeingEdited({ ...scoreBeingEdited, score: e.target.value })
  }

  function handleEditScore({
    playerHoleId,
    hole,
    score,
  }: PlayerHoleScoreState) {
    setScoreBeingEdited({ playerHoleId, hole, score })
    setShowModal(true)
  }

  // TODO: add success message
  async function updateHoleScore(): Promise<void> {
    let updateSuccessful = false
    if (playerHoleId) {
      const res = await updatePlayerHoleScore(playerHoleId, score)
      console.log('updatePlayerHoleScore res', res)
      if (res.ok) {
        updateSuccessful = true
      }
    } else {
      const playerHoleRes = await createOrFindPlayerHole({
        playerId,
        roundId,
        hole,
        score,
      })
      console.log('playerHoleRes: ', playerHoleRes)
      if (playerHoleRes.ok) {
        updateSuccessful = true
      }
      // const [playerHole, created] = await playerHoleRes.json()
      // if (!created) {
      //   const playerHoleId = playerHole.id as string
      //   const res = await updatePlayerHoleScore(playerHoleId, score)
      //   if (res.ok) {
      //     updateSuccessful = true
      //   }
      // }
    }
    console.log('updateSuccessful: ', updateSuccessful)
    if (updateSuccessful) {
      handleCloseModal()
      getPlayerRoundHoleData()
    }
  }

  async function deleteHoleScore() {
    const res = await updatePlayerHoleScore(playerHoleId, null)
    if (res.ok) {
      handleCloseModal()
      getPlayerRoundHoleData()
    }
  }

  function handleCloseModal() {
    setShowModal(false)
    setScoreBeingEdited(defaultScoreBeingEditedState)
  }

  function EditHoleScoreButtons(): JSX.Element {
    return (
      <>
        <button onClick={updateHoleScore}>Save</button>
        {score && playerHoleId && (
          <button onClick={deleteHoleScore}>Delete</button>
        )}
      </>
    )
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

      {showModal && (
        <Modal
          title={`Edit Hole ${scoreBeingEdited.hole} Score`}
          closeModal={handleCloseModal}
          renderButtons={() => <EditHoleScoreButtons />}
        >
          <BasicInput
            type="number"
            label="Hole Score"
            name="score"
            value={scoreBeingEdited.score ?? ''}
            onChange={handleInputChange}
            onFocus={selectAllInputText}
          />
        </Modal>
      )}
    </>
  )
}
