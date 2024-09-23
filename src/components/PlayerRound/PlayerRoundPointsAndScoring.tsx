import { useEffect, useState, useRef, forwardRef } from 'react'
import { Link, useParams, useSearchParams, useLocation } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'

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
  updatePlayerPointEarned,
} from '../../data'
import {
  getPlayerPointEarnedQuantity,
  getScoreTotal,
  getTotalHoleScores,
  holeOrFrequencyHasChanged,
  mapScoresToState,
  ppeQuantityExceedsMax,
  quantityInputScopeManager,
  selectAllInputText,
} from '../shared/utils'
import Modal from '../shared/components/Modal'
import BasicInput from '../shared/components/BasicInput'
import { selectableHoles } from './PlayerRoundEnterScoring'
import { no_scope_key } from '../PointSettings/PointScopeRadios'
import {
  useGetPlayerRoundPointsEarned,
  useGetPlayerRoundPointsEarnedTotal,
  usePlayerPointBeingEdited,
} from '../shared/hooks'
import { PointBeingEdited } from '../shared/hooks/usePlayerPointBeingEdited'
import styles from './PlayerRoundPointsAndScoring.module.css'
import usePlayerHoleScoreBeingEdited, {
  PlayerHoleScoreState,
} from '../shared/hooks/usePlayerHoleScoreBeingEdited'

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

  const [roundHoleScoreData, setRoundHoleScoreData] = useState<PlayerHole[]>([])
  const [roundHoleScores, setRoundHoleScores] = useState<
    PlayerHoleScoreState[]
  >([])

  const [showEditScoreModal, setShowEditScoreModal] = useState(false)
  const [scoreBeingEdited, setScoreBeingEdited, defaultScoreBeingEditedState] =
    usePlayerHoleScoreBeingEdited()
  const { playerHoleId, hole, score } = scoreBeingEdited || {}

  const [roundPointsEarned, getPlayerRoundPointsEarned] =
    useGetPlayerRoundPointsEarned(playerId, roundId)
  const [showEditPointEarnedModal, setShowEditPointEarnedModal] =
    useState(false)
  const [
    pointEarnedBeingEdited,
    setPointEarnedBeingEdited,
    defaultPointEarnedBeingEditedState,
  ] = usePlayerPointBeingEdited()

  const [totalPoints, getPlayerRoundTotalPoints] =
    useGetPlayerRoundPointsEarnedTotal()

  const [frequencyIsActive, quantityInputLabel, maxFrequency] =
    quantityInputScopeManager(pointEarnedBeingEdited)

  const frontNineScores = roundHoleScores.slice(0, 9)
  const frontNineTotal = getScoreTotal(frontNineScores)
  const backNineScores = roundHoleScores.slice(9)
  const backNineTotal = getScoreTotal(backNineScores)
  const totalScoresEntered = getTotalHoleScores(roundHoleScores)

  // TODO: remove once model is updated
  const holesInRound = 18

  useEffect(() => {
    getPlayerRoundTotalPoints()
    getPlayerRoundPointsEarned()
    getPlayerRoundHoleScoreData()
  }, [playerId, roundId])

  useEffect(() => {
    setRoundHoleScores(mapScoresToState(holesInRound, roundHoleScoreData))
  }, [roundHoleScoreData])

  async function getPlayerRoundHoleScoreData() {
    const res = await getPlayerHoleScores(playerId, roundId, true)
    if (res.status === 200) {
      const holeScores = await res.json()
      console.log('getPlayerRoundHoleScoreData json', holeScores)
      setRoundHoleScoreData(holeScores)
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

  function handleEditPointEarnedModal(e, pointEarnedData: PointBeingEdited) {
    console.log('pointEarnedData: ', pointEarnedData)
    // TODO: handle this better so it's not dependent on class, which may change
    if (!e.target.classList.contains('deletePointEarned')) {
      setPointEarnedBeingEdited(pointEarnedData)
      setShowEditPointEarnedModal(true)
    }
  }

  // TODO: a better way to handle this where I don't need to check both round scores and round PPE to find playerHoleId? (e.g. maybe add playerHoleId to scorecard even for holes without score?)
  async function updateHoleScore(): Promise<void> {
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
      handleCloseModal()
      // TODO: handle logic and different messaging for if score was updated or created
      toast.success('Score was successfully added')
      getPlayerRoundHoleScoreData()
    }
  }

  async function deleteHoleScore() {
    const res = await updatePlayerHole(playerHoleId, { score: null })
    if (res.ok) {
      handleCloseModal()
      toast.success('Score was successfully deleted')
      getPlayerRoundHoleScoreData()
    }
  }

  async function handleUpdatePointEarned(e) {
    e.preventDefault()
    const {
      pointEarnedId,
      pointSettingId,
      originalFrequency,
      frequency,
      maxFrequencyPerScope,
      originalHole,
      hole,
      scope,
    } = pointEarnedBeingEdited

    const { anyValueHasChanged, holeHasChanged, frequencyHasChanged } =
      holeOrFrequencyHasChanged(
        originalFrequency,
        frequency,
        originalHole,
        hole
      )

    if (!anyValueHasChanged) {
      handleCloseModal()
      return
    }

    if (scope === 'round') {
      const ppeQuantityInRound = getPlayerPointEarnedQuantity(
        pointSettingId,
        roundPointsEarned,
        null,
        pointEarnedId
      )
      if (
        maxFrequencyPerScope &&
        ppeQuantityExceedsMax(
          frequency,
          ppeQuantityInRound,
          maxFrequencyPerScope
        )
      ) {
        // TODO: add validation error message
        console.log('PPE in round would be exceeded!!!')
        return
      }
    } else if (scope === 'hole' && hole) {
      const ppeQuantityInHole = getPlayerPointEarnedQuantity(
        pointSettingId,
        roundPointsEarned,
        hole,
        pointEarnedId
      )
      if (
        maxFrequencyPerScope &&
        ppeQuantityExceedsMax(
          frequency,
          ppeQuantityInHole,
          maxFrequencyPerScope
        )
      ) {
        // TODO: add validation error message
        console.log('PPE in hole would be exceeded!!!')
        return
      }
    }

    if (holeHasChanged) {
      const updatedholeData = {
        playerId: playerId,
        roundId: roundId,
        hole: hole ? +hole : null,
      }

      const getPlayerHoleRes = await getPlayerHole(updatedholeData)
      const getPlayerHoleResJson = await getPlayerHoleRes.json()
      let updatedPlayerHoleId = null
      if (getPlayerHoleRes.ok) {
        /** PlayerHole exists, so update PlayerPointEarned to point to it */
        updatedPlayerHoleId = getPlayerHoleResJson.id
      } else {
        /** PlayerHole doesn't exists, so create PlayerHole and update PlayerPointEarned to point to it */
        const createdPlayerHoleRes = await createOrFindPlayerHole(
          updatedholeData
        )
        // createdPlayerHoleResJson signature: [{PlayerHole}, created]
        const createdPlayerHoleResJson = await createdPlayerHoleRes.json()
        const { id } = createdPlayerHoleResJson[0]
        updatedPlayerHoleId = id
      }

      const updatePlayerPointEarnedRes = await updatePlayerPointEarned(
        pointEarnedId,
        { playerHoleId: updatedPlayerHoleId }
      )
      if (updatePlayerPointEarnedRes.ok) {
        handleCloseModal()
        toast.success('Point earned was successfully updated')
        getPlayerRoundPointsEarned()
      }
    }

    if (frequencyHasChanged) {
      const updatePlayerPointEarnedRes = await updatePlayerPointEarned(
        pointEarnedId,
        { frequency }
      )
      console.log('updatePlayerPointEarnedRes ', updatePlayerPointEarnedRes)
      if (updatePlayerPointEarnedRes.ok) {
        getPlayerRoundPointsEarned()
        handleCloseModal()
      }
    }
  }

  function handleCloseModal() {
    setShowEditScoreModal(false)
    setScoreBeingEdited(defaultScoreBeingEditedState)
    setShowEditPointEarnedModal(false)
    setPointEarnedBeingEdited(defaultPointEarnedBeingEditedState)
  }

  function EditHoleScoreButtons(): JSX.Element {
    return (
      <>
        <button onClick={updateHoleScore}>Save</button>
        {playerHoleId && <button onClick={deleteHoleScore}>Delete</button>}
      </>
    )
  }

  function EditPointEarnedButtons(): JSX.Element {
    return (
      <>
        {/* TODO: implement delete */}
        <button onClick={handleUpdatePointEarned}>Save</button>
        <button onClick={() => console.log('delete point earned')}>
          Delete
        </button>
      </>
    )
  }

  return (
    <>
      <h3 className="page-title">Player Round Scoring </h3>
      <h3 className="page-title">{playerName}</h3>

      <div className="centered-button">
        <Link
          to={`/league/${leagueId}/rounds/${roundId}/round-player-scoring`}
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

      <PlayerRoundPointsEarnedTable
        roundPointsEarned={roundPointsEarned}
        getPlayerRoundPointsEarned={getPlayerRoundPointsEarned}
        handleEditPointEarnedModal={handleEditPointEarnedModal}
      />

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
          <h3 className={styles.editPointEarnedStaticData}>
            Player: <span>{playerName}</span>
          </h3>

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

      {showEditPointEarnedModal && (
        <Modal
          title={`Edit Point Earned`}
          closeModal={handleCloseModal}
          renderButtons={() => <EditPointEarnedButtons />}
        >
          <h3 className={styles.editPointEarnedStaticData}>
            Player: <span>{pointEarnedBeingEdited.playerName}</span>
          </h3>
          <h3 className={styles.editPointEarnedStaticData}>
            Point:{' '}
            <span>
              {pointEarnedBeingEdited.pointName} {pointEarnedBeingEdited.value}
            </span>
          </h3>
          <form>
            <BasicInput
              type="number"
              min="1"
              max={
                frequencyIsActive && maxFrequency
                  ? maxFrequency.toString()
                  : null
              }
              name="point-earned-quantity"
              label={quantityInputLabel}
              value={pointEarnedBeingEdited.frequency ?? ''}
              onChange={(e) => {
                const valueNum = +e.target.value
                setPointEarnedBeingEdited({
                  ...pointEarnedBeingEdited,
                  frequency: valueNum > 0 ? valueNum : 1,
                })
              }}
              // onBlur={validateInputFrequencyAgainstPointSetting}
              disabled={!frequencyIsActive}
            />

            <label htmlFor="hole-select">Hole</label>
            <select
              id="hole-select"
              value={pointEarnedBeingEdited.hole}
              onChange={(e) => {
                const val = e.target.value
                const holeIsSelected = val !== ''
                setPointEarnedBeingEdited({
                  ...pointEarnedBeingEdited,
                  hole: holeIsSelected ? +val : val,
                })
              }}
            >
              {selectableHoles()}
            </select>
          </form>
        </Modal>
      )}

      <ToastContainer position="bottom-left" autoClose={3000} />
    </>
  )
}
