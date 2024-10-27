import { useEffect, useState } from 'react'
import { Link, useParams, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'

import {
  PlayerRoundPointsAndScoringSummary,
  PlayerRoundPointsEarnedTable,
  ScorecardTable,
} from '.'
import './index.css'
import {
  getPlayerHoleScores,
  getPlayerHole,
  updatePlayerHole,
  createOrFindPlayerHole,
} from '../../data'
import {
  getScoreTotal,
  getTotalHoleScores,
  mapScoresToState,
  selectAllInputText,
} from '../shared/utils'
import Modal from '../shared/components/Modal'
import BasicInput from '../shared/components/BasicInput'
import {
  useGetPlayerRoundPointsEarned,
  useGetPlayerRoundPointsEarnedTotal,
} from '../shared/hooks'
import usePlayerHoleScoreBeingEdited, {
  PlayerHoleScoreState,
} from '../shared/hooks/usePlayerHoleScoreBeingEdited'
import styles from './PlayerRoundPointsAndScoring.module.css'

// TODO: somehow combine with PlayerHole interface in types?
interface PlayerHole {
  id: string
  playerId: string
  roundId: string
  hole: number
  score?: number
}

export default function PlayerRoundPointsAndScoring() {
  const params = useParams()
  // TODO: why can't i destructure params above without TS complaining?
  const leagueId = params.leagueId as string
  const roundId = params.roundId as string
  const {
    state: { playerName, playerId },
  } = useLocation()

  const [roundPointsEarned] = useGetPlayerRoundPointsEarned(playerId, roundId)
  const [totalPoints] = useGetPlayerRoundPointsEarnedTotal(playerId, roundId)

  const [roundHoleScoreData, setRoundHoleScoreData] = useState<PlayerHole[]>([])
  const [roundHoleScores, setRoundHoleScores] = useState<
    PlayerHoleScoreState[]
  >([])
  const [showEditScoreModal, setShowEditScoreModal] = useState(false)
  const [scoreBeingEdited, setScoreBeingEdited, defaultScoreBeingEditedState] =
    usePlayerHoleScoreBeingEdited()
  const { playerHoleId, hole, score } = scoreBeingEdited || {}

  const frontNineScores = roundHoleScores.slice(0, 9)
  const frontNineTotal = getScoreTotal(frontNineScores)
  const backNineScores = roundHoleScores.slice(9)
  const backNineTotal = getScoreTotal(backNineScores)
  const totalScoresEntered = getTotalHoleScores(roundHoleScores)

  // TODO: remove once model is updated
  const holesInRound = 18

  useEffect(() => {
    getPlayerRoundHoleScoreData()
  }, [playerId])

  useEffect(() => {
    setRoundHoleScores(mapScoresToState(holesInRound, roundHoleScoreData))
  }, [roundHoleScoreData])

  async function getPlayerRoundHoleScoreData() {
    const res = await getPlayerHoleScores(playerId, roundId, true)
    if (res.status === 200) {
      const holeScores = await res.json()
      setRoundHoleScoreData(holeScores)
    }
    if (res.status === 204) {
      setRoundHoleScoreData([])
    }
  }

  function handleUpdateHoleScoreState(e) {
    const inputValue = e.target.value
    if (inputValue < 1) {
      // setScoreBeingEdited({ ...scoreBeingEdited, score: null })
      return
    } else {
      setScoreBeingEdited({ ...scoreBeingEdited, score: +e.target.value })
    }
  }

  function handleOpenEditScoreModal({
    playerHoleId,
    hole,
    score,
  }: PlayerHoleScoreState) {
    setScoreBeingEdited({ playerHoleId, hole, score: score ? +score : null })
    setShowEditScoreModal(true)
  }

  // TODO: a better way to handle this where I don't need to check both round scores and round PPE to find playerHoleId? (e.g. maybe add playerHoleId to scorecard even for holes without score?)
  async function updateHoleScore(): Promise<void> {
    if (!score) {
      handleCloseModal()
      return
    }

    let scoreUpdateSuccessful = false
    let _playerHoleId = playerHoleId
    if (!playerHoleId) {
      /** A score doesn't exist for selected hole so check PlayerHole table in case any PlayerPointEarned exist for that hole */
      const getPlayerHoleRes = await getPlayerHole({ playerId, roundId, hole })
      const getPlayerHoleResJson = await getPlayerHoleRes.json()
      if (getPlayerHoleRes.ok) {
        _playerHoleId = getPlayerHoleResJson.id
      }
    }

    if (_playerHoleId) {
      /** PlayerHole exists so add score to it */
      const res = await updatePlayerHole(_playerHoleId, { score })
      if (res.ok) {
        scoreUpdateSuccessful = true
      }
    } else {
      /** No PlayerHole exists for hole so create it and add score */
      const playerHoleRes = await createOrFindPlayerHole({
        playerId,
        roundId,
        hole,
        score,
      })
      if (playerHoleRes.ok) {
        scoreUpdateSuccessful = true
      }
    }

    if (scoreUpdateSuccessful) {
      await getPlayerRoundHoleScoreData()
      handleCloseModal()
      // TODO: handle logic and different messaging for if score was updated or created
      toast.success('Score was successfully added')
    }
  }

  async function deleteHoleScore() {
    const res = await updatePlayerHole(playerHoleId, { score: null })
    if (res.ok) {
      await getPlayerRoundHoleScoreData()
      handleCloseModal()
      toast.success('Score was successfully deleted')
    }
  }

  function handleCloseModal() {
    setShowEditScoreModal(false)
    setScoreBeingEdited(defaultScoreBeingEditedState)
  }

  function EditHoleScoreButtons(): JSX.Element {
    return (
      <>
        <button onClick={updateHoleScore}>Save</button>
        {playerHoleId && (
          <button onClick={deleteHoleScore} className="delete-button">
            Delete
          </button>
        )}
      </>
    )
  }

  return (
    <>
      <h3 className="page-title">Player Round Points & Scorecard</h3>
      <h3 className="ta-center">{playerName}</h3>

      <div className="centered-button">
        <Link
          to={`/league/${leagueId}/round/${roundId}/round-player-scoring`}
          state={{ playerId, playerName }}
        >
          <button>Enter Point Earned / Score</button>
        </Link>
      </div>

      <PlayerRoundPointsAndScoringSummary
        totalPoints={totalPoints}
        totalScoresEntered={totalScoresEntered}
        frontNineTotal={frontNineTotal}
        backNineTotal={backNineTotal}
      />

      <PlayerRoundPointsEarnedTable roundPointsEarned={roundPointsEarned} />

      <p className="non-input-label">Scorecard</p>
      <ScorecardTable
        numberOfHoles={holesInRound / 2}
        holeGroup="front-nine"
        holeGroupScoreTotal={frontNineTotal}
        holeScores={frontNineScores}
        handleOpenEditScoreModal={handleOpenEditScoreModal}
      />
      <ScorecardTable
        numberOfHoles={holesInRound / 2}
        holeGroup="back-nine"
        holeGroupScoreTotal={backNineTotal}
        holeScores={backNineScores}
        handleOpenEditScoreModal={handleOpenEditScoreModal}
      />

      {showEditScoreModal && (
        <Modal
          title={`Edit Hole ${scoreBeingEdited.hole} Score`}
          closeModal={handleCloseModal}
          renderButtons={() => <EditHoleScoreButtons />}
        >
          <h3 className={styles.playerName}>{playerName}</h3>

          <BasicInput
            min="1"
            type="number"
            label="Hole Score"
            name="score"
            value={scoreBeingEdited.score ?? ''}
            onChange={handleUpdateHoleScoreState}
            onFocus={selectAllInputText}
          />
        </Modal>
      )}
    </>
  )
}
