import { useState, useEffect } from 'react'
import {
  useParams,
  useLocation,
  useSearchParams,
  useNavigation,
  useNavigate,
} from 'react-router-dom'

import DeleteConfirmationModal from '../shared/components/DeleteConfirmationModal'
import BasicInput from '../shared/components/BasicInput'
import styles from './EditPointEarned.module.css'
import {
  useGetPlayerRoundPointsEarned,
  usePlayerPointBeingEdited,
} from '../shared/hooks'
import {
  getPlayerPointEarnedQuantity,
  holeOrFrequencyHasChanged,
  ppeQuantityExceedsMax,
  quantityInputScopeManager,
} from '../shared/utils'
import { selectableHoles } from './PlayerRoundEnterScoring'
import {
  createOrFindPlayerHole,
  deletePlayerPointEarned,
  getPlayerHole,
  updatePlayerPointEarned,
} from '../../data'
import { toast } from 'react-toastify'

export default function EditPointEarned() {
  const navigate = useNavigate()
  const params = useParams()
  const leagueId = params.leagueId as string
  const roundId = params.roundId as string
  const location = useLocation()
  console.log('location *****', location)
  const {
    pointEarnedId,
    pointSettingId,
    pointName,
    playerId,
    playerName,
    originalHole,
    hole,
    originalFrequency,
    frequency,
    value,
    scope,
    maxFrequencyPerScope,
  } = location.state

  const [
    pointEarnedBeingEdited,
    setPointEarnedBeingEdited,
    defaultPointEarnedBeingEditedState,
  ] = usePlayerPointBeingEdited({
    pointEarnedId,
    pointSettingId,
    pointName,
    playerName,
    originalHole,
    hole,
    originalFrequency,
    frequency,
    value,
    scope,
    maxFrequencyPerScope,
  })
  console.log('@@@@@ pointEarnedBeingEdited @@@@@@ ', pointEarnedBeingEdited)
  const [frequencyIsActive, quantityInputLabel, maxFrequency] =
    quantityInputScopeManager(pointEarnedBeingEdited)
  const [roundPointsEarned, getPlayerRoundPointsEarned] =
    useGetPlayerRoundPointsEarned(playerId, roundId)
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
    useState(false)

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
      navigate(-1)
      return
    }

    // TODO: check this refactoring is working
    if (maxFrequencyPerScope) {
      const holeToValidateAgainst = scope === 'hole' ? +hole : null
      const ppeTotal = getPlayerPointEarnedQuantity(
        pointSettingId,
        roundPointsEarned,
        holeToValidateAgainst,
        null
      )
      console.log('ppeTotal', ppeTotal)
      if (ppeQuantityExceedsMax(frequency, ppeTotal, maxFrequencyPerScope)) {
        // TODO: change this to not auto-remove?
        toast.error(
          'Quantity entered would exceed maximum. Please enter a lower quantity.'
        )
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
        getPlayerRoundPointsEarned()
        // handleCloseModal()
        // TODO: change message to say hole was updated?
        toast.success('Point earned was successfully updated')
      }
    }

    if (frequencyHasChanged) {
      const updatePlayerPointEarnedRes = await updatePlayerPointEarned(
        pointEarnedId,
        { frequency }
      )
      if (updatePlayerPointEarnedRes.ok) {
        getPlayerRoundPointsEarned()
        // handleCloseModal()
        // TODO: change message to say quantity was updated?
        toast.success('Point earned was successfully updated')
      }
    }
  }

  async function deletePointEarned() {
    const res = await deletePlayerPointEarned(
      pointEarnedBeingEdited.pointEarnedId
    )
    if (res.ok) {
      getPlayerRoundPointsEarned()
      setShowDeleteConfirmationModal(false)
      setPointEarnedBeingEdited(defaultPointEarnedBeingEditedState)
      toast.success('Point was successfully deleted')
      navigate(
        `/league/${leagueId}/round/${roundId}/player-scoring/${playerName}`,
        {
          replace: true,
          state: { playerName, playerId },
        }
      )
    }
  }

  function getDeleteConfirmationText(): JSX.Element {
    return (
      <>
        {/* <p>Are you sure you want to delete this point?</p> */}
        {/* TODO: add style back */}
        {/* <div className={`${styles.pointSummary} ta-center`}> */}
        <div className={``}>
          <p>
            <b>Player:</b> {playerName}
          </p>
          <p>
            <b>Point:</b> {pointEarnedBeingEdited.pointName}
          </p>
          <p>
            <b>Hole:</b> {hole ? hole : 'No associated hole'}
          </p>
          <p>
            <b>Value:</b> {pointEarnedBeingEdited.value}
          </p>
          <p>
            <b>Quantity:</b> {pointEarnedBeingEdited.frequency}
          </p>
        </div>
      </>
    )
  }

  return (
    <>
      <h3 className="page-title">Edit Player Point Earned</h3>
      <h3 className="ta-center">{playerName}</h3>

      <h4 className={styles.editPointEarnedStaticData}>
        Point:{' '}
        <span>
          {pointEarnedBeingEdited.pointName} {pointEarnedBeingEdited.value}
        </span>
      </h4>
      <form>
        <BasicInput
          type="number"
          min="1"
          max={
            frequencyIsActive && maxFrequency ? maxFrequency.toString() : null
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

        <button onClick={handleUpdatePointEarned} type="button">
          Save
        </button>
        <button
          onClick={() => setShowDeleteConfirmationModal(true)}
          type="button"
          className="delete-button"
        >
          Delete
        </button>
      </form>

      {showDeleteConfirmationModal && (
        <DeleteConfirmationModal
          // modalTitle="Delete Player Point Earned"
          modalTitle="Are you sure you want to delete this point?"
          confirmationText={getDeleteConfirmationText()}
          buttonText="Delete"
          toggleModalActive={() => setShowDeleteConfirmationModal(false)}
          onConfirmDelete={deletePointEarned}
        />
      )}
    </>
  )
}
