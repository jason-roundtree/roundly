import { useEffect, useState, useRef, forwardRef } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'

import { PlayerRoundPointsEarnedTable, ScorecardTable } from '.'
import './index.css'
import {
  getRoundPlayerPointsEarnedByPlayer,
  getRoundPlayerPointsEarnedTotal,
  getPlayerHoleScores,
  getPlayerHole,
  updatePlayerHole,
  createOrFindPlayerHole,
  updatePlayerPointEarned,
} from '../../data'
import {
  getPPEQuantityInHole,
  getPPEQuantityInRound,
  getScoreTotal,
  getTotalHoleScores,
  quantityInputScopeManager,
  selectAllInputText,
} from '../shared/utils'
import Modal from '../shared/components/Modal'
import BasicInput from '../shared/components/BasicInput'
import styles from './PlayerRoundScoring.module.css'
import { NumberOrNull, PointScopes, PointSetting } from '../../types'
import { selectableHoles } from './PlayerRoundEnterScoring'

interface PlayerHole {
  id: string
  playerId: string
  roundId: string
  hole: number
  score?: number
}

export interface PlayerHoleScoreState {
  playerHoleId: string | ''
  score: NumberOrNull
  hole: NumberOrNull
}

export interface PointBeingEdited {
  // playerId: string
  pointSettingId: string
  pointEarnedId: string
  playerName: string
  originalHole?: number | string
  hole?: number | string
  pointName: string
  value: number | string
  // TODO: look into (string & {}) and remove it if it doesn't provide a benefit
  scope: PointScopes | (string & {})
  frequency: number
  originalFrequency: number
  maxFrequencyPerScope: number
}

// TODO: change null to string here and in type?
const defaultScoreBeingEditedState: PlayerHoleScoreState = {
  playerHoleId: '',
  score: null,
  hole: null,
}

const defaultPointEarnedBeingEditedState: PointBeingEdited = {
  // playerHoleId: '',
  // playerId: '',
  originalHole: '',
  pointSettingId: '',
  playerName: '',
  pointEarnedId: '',
  hole: '',
  pointName: '',
  value: '',
  scope: '',
  frequency: 1,
  originalFrequency: 1,
  maxFrequencyPerScope: 1,
}

export default function PlayerRoundPointsEarned() {
  const [totalPoints, setTotalPoints] = useState<number | null>(null)
  const [roundPointsEarned, setRoundPointsEarned] = useState<any[]>([])
  const [roundHoleScoreData, setRoundHoleScoreData] = useState<PlayerHole[]>([])
  console.log('%$%$%$ roundHoleScoreData', roundHoleScoreData)
  const [roundHoleScores, setRoundHoleScores] = useState<
    PlayerHoleScoreState[]
  >([])
  const [showEditScoreModal, setShowEditScoreModal] = useState(false)
  const [scoreBeingEdited, setScoreBeingEdited] = useState<
    Omit<PlayerHoleScoreState, 'hole'> & { hole: number | null }
  >(defaultScoreBeingEditedState)
  const [showEditPointEarnedModal, setShowEditPointEarnedModal] =
    useState(false)
  const [pointEarnedBeingEdited, setPointEarnedBeingEdited] =
    useState<PointBeingEdited>(defaultPointEarnedBeingEditedState)
  console.log('%$%$%$%% pointEarnedBeingEdited', pointEarnedBeingEdited)
  const { playerHoleId, hole, score } = scoreBeingEdited || {}
  const [frequencyIsActive, quantityInputLabel, maxFrequency] =
    quantityInputScopeManager(pointEarnedBeingEdited)

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

  // TODO: remove once model is updated
  const holesInRound = 18

  useEffect(() => {
    getPlayerRoundTotalPoints()
    getPlayerRoundPointsEarned()
    getPlayerRoundHoleScoreData()
  }, [playerId, roundId])

  useEffect(() => {
    mapScoresToState()
  }, [roundHoleScoreData])

  async function getPlayerRoundTotalPoints() {
    const res = await getRoundPlayerPointsEarnedTotal(playerId, roundId)
    // TODO: handle error case differently so 404 is not being thrown when player is in round but has no points
    if (res.status === 200) {
      const { total_points } = await res.json()
      setTotalPoints(total_points)
    }
  }

  async function getPlayerRoundPointsEarned() {
    const res = await getRoundPlayerPointsEarnedByPlayer(playerId, roundId)
    console.log('getRoundPlayerPointsEarned res: ', res)
    if (res.status === 200) {
      const roundPointsEarned = await res.json()
      console.log('roundPointsEarned----: ', roundPointsEarned)
      setRoundPointsEarned(roundPointsEarned)
    }
    // TODO: also send back array or message to confirm result is actually empty instead of relying on 204 status?
    else if (res.status === 204) {
      setRoundPointsEarned([])
    }
  }

  async function getPlayerRoundHoleScoreData() {
    const res = await getPlayerHoleScores(playerId, roundId, true)
    if (res.status === 200) {
      const holeScores = await res.json()
      console.log('getPlayerRoundHoleScoreData json', holeScores)
      setRoundHoleScoreData(holeScores)
    }
  }

  function mapScoresToState() {
    const holeScoreData: Array<PlayerHoleScoreState> = Array.from(
      Array(holesInRound),
      (_, i) => ({
        playerHoleId: '',
        hole: i + 1,
        score: null,
      })
    )
    for (const playerHole of roundHoleScoreData) {
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
    setScoreBeingEdited({ ...scoreBeingEdited, score: +e.target.value })
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

  // TODO: add success message
  // TODO: clean-up mess of checking both round scores and round PPE to find playerHoleId (e.g. maybe add playerHoleId to scorecard even for holes without score )
  async function updateHoleScore(): Promise<void> {
    let updateSuccessful = false
    let localPlayerHoleId = playerHoleId
    console.log('localPlayerHoleId --------> ', localPlayerHoleId)
    if (!localPlayerHoleId) {
      const getPlayerHoleRes = await getPlayerHole({ playerId, roundId, hole })
      console.log('updateHoleScore getPlayerHoleRes', getPlayerHoleRes)
      const getPlayerHoleResJson = await getPlayerHoleRes.json()
      if (getPlayerHoleRes.ok) {
        localPlayerHoleId = getPlayerHoleResJson.id
      }
    }

    console.log('localPlayerHoleId', localPlayerHoleId)
    if (localPlayerHoleId) {
      const res = await updatePlayerHole(localPlayerHoleId, { score })
      console.log('updatePlayerHole score res', res)
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
      console.log('create playerHole res: ', playerHoleRes)
      if (playerHoleRes.ok) {
        updateSuccessful = true
      }
    }
    console.log('updateSuccessful: ', updateSuccessful)
    if (updateSuccessful) {
      handleCloseModal()
      getPlayerRoundHoleScoreData()
    }
  }

  async function deleteHoleScore() {
    const res = await updatePlayerHole(playerHoleId, { score: null })
    if (res.ok) {
      handleCloseModal()
      getPlayerRoundHoleScoreData()
    }
  }

  // TODO: test this more to make sure it's working correctly
  function ppeQuantityExceedsMax(
    inputQuantity: number,
    totalQuantityInRound: number,
    maxFrequencyPerScope: number,
    scope: Omit<PointScopes, 'no_scope'>
  ) {
    return inputQuantity + totalQuantityInRound > maxFrequencyPerScope
  }

  function editableStateHasChanged(
    originalFrequency,
    frequency,
    originalHole,
    hole
  ): {
    frequencyHasChanged: boolean
    holeHasChanged: boolean
    anyValueHasChanged: boolean
  } {
    // TODO: simplify if you still don't check specific values
    const hasChanged = {
      frequencyHasChanged: false,
      holeHasChanged: false,
      anyValueHasChanged: false,
    }
    if (originalFrequency !== frequency) {
      hasChanged.frequencyHasChanged = true
      hasChanged.anyValueHasChanged = true
    }
    if (originalHole !== hole) {
      hasChanged.holeHasChanged = true
      hasChanged.anyValueHasChanged = true
    }
    console.log('$$$$$ hasChanged ^^^^^', hasChanged)
    return hasChanged
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
      editableStateHasChanged(originalFrequency, frequency, originalHole, hole)

    if (!anyValueHasChanged) {
      handleCloseModal()
      return
    }

    if (scope === 'round') {
      const ppeQuantityInRound = getPPEQuantityInRound(
        pointSettingId,
        roundPointsEarned,
        pointEarnedBeingEdited
      )
      if (
        ppeQuantityExceedsMax(
          frequency,
          ppeQuantityInRound,
          maxFrequencyPerScope,
          'round'
        )
      ) {
        // TODO: add validation error message
        console.log('PPE in round would be exceeded!!!')
        return
      }
    } else if (scope === 'hole' && hole) {
      const ppeQuantityInHole = getPPEQuantityInHole(
        pointSettingId,
        hole,
        roundPointsEarned,
        pointEarnedBeingEdited
      )
      if (
        ppeQuantityExceedsMax(
          frequency,
          ppeQuantityInHole,
          maxFrequencyPerScope,
          'round'
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
      console.log('>> getPlayerHoleRes', getPlayerHoleRes)
      const getPlayerHoleResJson = await getPlayerHoleRes.json()
      let updatedPlayerHoleId = null
      if (getPlayerHoleRes.ok) {
        // PlayerHole exists, so update PlayerPointEarned to point to it
        updatedPlayerHoleId = getPlayerHoleResJson.id
      } else {
        // PlayerHole doesn't exists, so create PlayerHole and update PlayerPointEarned to point to it
        const createdPlayerHoleRes = await createOrFindPlayerHole(
          updatedholeData
        )
        // createdPlayerHoleResJson signature: [{PlayerHole}, created]
        const createdPlayerHoleResJson = await createdPlayerHoleRes.json()
        console.log('createdPlayerHoleResJson +_+_', createdPlayerHoleRes)
        const { id } = createdPlayerHoleResJson[0]
        updatedPlayerHoleId = id
      }
      const updatePlayerPointEarnedRes = await updatePlayerPointEarned(
        pointEarnedId,
        { playerHoleId: updatedPlayerHoleId }
      )
      console.log('>> updatePlayerPointEarnedRes', updatePlayerPointEarnedRes)
      if (updatePlayerPointEarnedRes.ok) {
        getPlayerRoundPointsEarned()
        handleCloseModal()
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
        {score && playerHoleId && (
          <button onClick={deleteHoleScore}>Delete</button>
        )}
      </>
    )
  }

  function EditPointEarnedButtons(): JSX.Element {
    return (
      <>
        {/* TODO: implement save and delete */}
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
            type="number"
            label="Hole Score"
            name="score"
            value={scoreBeingEdited.score ?? ''}
            onChange={handleInputChange}
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
                frequencyIsActive
                  ? pointEarnedBeingEdited.maxFrequencyPerScope.toString()
                  : '1'
              }
              name="point-earned-quantity"
              label={quantityInputLabel}
              value={pointEarnedBeingEdited.frequency ?? ''}
              onChange={(e) => {
                setPointEarnedBeingEdited({
                  ...pointEarnedBeingEdited,
                  frequency: +e.target.value,
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
    </>
  )
}
