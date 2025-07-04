import { useState, useEffect } from 'react'
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAnglesRight } from '@fortawesome/free-solid-svg-icons'

import DeleteConfirmationModal from '../shared/components/DeleteConfirmationModal'
import BasicInput from '../shared/components/BasicInput'
import styles from './EditPointEarned.module.css'
import {
  useGetPlayerRoundPointsEarned,
  usePlayerPointBeingEdited,
} from '../shared/hooks'
import { holeOrQuantityHasChanged } from '../shared/utils'
import { selectableHoles } from '../Round/HoleSelectInput'
import {
  checkPlayerPointEarnedOnHole,
  createOrFindPlayerHole,
  deletePlayerPointEarned,
  getPlayerHole,
  updatePlayerPointEarned,
} from '../../data'
import { useQueryClient } from '@tanstack/react-query'

export default function EditPointEarned() {
  const navigate = useNavigate()
  const params = useParams()
  const leagueId = params.leagueId as string
  const roundId = params.roundId as string
  const location = useLocation()
  const { pointEarnedId } = location.state

  const [
    originalPointEarned,
    isPointEarnedLoading,
    isPointEarnedError,
    refetchPointEarned,
  ] = usePlayerPointBeingEdited(pointEarnedId)
  console.log('RRRRR originalPointEarned', originalPointEarned)

  const { playerId, quantity, playerName } = originalPointEarned || {}
  const { hole } = originalPointEarned?.hole || {}
  const {
    name: pointName,
    scope,
    value,
    id: pointSettingId,
    isLeagueSetting,
  } = originalPointEarned?.pointSetting || {}

  // TODO: is this needed?
  // const {
  //   data: playerRoundPointsEarned = [],
  //   refetch: refetchPlayerRoundPointsEarned,
  //   isLoading: isPlayerRoundPointsEarnedLoading,
  //   isError: isPlayerRoundPointsEarnedError,
  // } = useGetPlayerRoundPointsEarned(playerId, roundId)

  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
    useState(false)
  const queryClient = useQueryClient()

  // Local state for editing fields
  const [editedPoint, setEditedPoint] = useState(() => ({
    quantity: quantity,
    hole: hole,
  }))

  // Sync local state when fetched data changes
  useEffect(() => {
    setEditedPoint({
      quantity: quantity,
      hole: hole,
    })
  }, [originalPointEarned, hole, quantity])

  function navigateToPlayerRoundPointsEarned() {
    navigate(`/league/${leagueId}/round/${roundId}/player-scoring/${playerId}`)
  }

  async function handleUpdatePointEarned(e) {
    e.preventDefault()

    const { anyValueHasChanged, holeHasChanged, quantityHasChanged } =
      holeOrQuantityHasChanged(
        quantity,
        editedPoint.quantity,
        hole,
        editedPoint.hole
      )

    if (!anyValueHasChanged) {
      navigate(-1)
      return
    }

    if (holeHasChanged) {
      const updatedholeData = {
        hole: editedPoint.hole ? +editedPoint.hole : null,
        playerId,
        roundId,
      }

      const getPlayerHoleRes = await getPlayerHole(updatedholeData)
      const getPlayerHoleResJson = await getPlayerHoleRes.json()
      let updatedPlayerHoleId = null
      if (getPlayerHoleRes.ok) {
        // TODO: move to function
        if (scope === 'hole') {
          const checkPlayerPointEarnedOnHoleRes =
            await checkPlayerPointEarnedOnHole({
              playerId,
              pointSettingId,
              roundId,
              hole: editedPoint.hole,
            })

          if (checkPlayerPointEarnedOnHoleRes.status === 200) {
            toast.error(
              `Player has already earned ${pointName} for hole ${hole}`
            )
            return
          }
        }

        /** update PlayerPointEarned to point to PlayerHole */
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
        await queryClient.invalidateQueries({
          queryKey: ['playerRoundPointsEarned', playerId, roundId],
        })
        toast.success('Hole was successfully updated')
        navigateToPlayerRoundPointsEarned()
      }
    }

    if (quantityHasChanged) {
      const updatePlayerPointEarnedRes = await updatePlayerPointEarned(
        pointEarnedId,
        { quantity: editedPoint.quantity }
      )
      if (updatePlayerPointEarnedRes.ok) {
        await queryClient.invalidateQueries({
          queryKey: ['playerRoundPointsEarned', playerId, roundId],
        })
        toast.success('Quantity was successfully updated')
        navigateToPlayerRoundPointsEarned()
      }
    }
  }

  async function deletePointEarned() {
    const res = await deletePlayerPointEarned(pointEarnedId)
    if (res.ok) {
      // await refetchPlayerRoundPointsEarned()
      setShowDeleteConfirmationModal(false)
      toast.success('Point was successfully deleted')
      navigateToPlayerRoundPointsEarned()
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
            <b>Point:</b> {pointName}
          </p>
          <p>
            <b>Hole:</b> {hole ? hole : 'No associated hole'}
          </p>
          <p>
            <b>Value:</b> {value}
          </p>
          <p>
            <b>Quantity:</b> {quantity}
          </p>
        </div>
      </>
    )
  }

  if (isPointEarnedError || !originalPointEarned) {
    return <p>Point Earned does not exist</p>
  }
  return (
    <>
      <h3 className="decrease-bottom-margin page-title">
        {playerName} - Edit Point Earned
      </h3>
      <div className="ta-center">
        <Link
          to={`/league/${leagueId}/round/${roundId}/player-scoring/${playerName}`}
        >
          Back to {playerName}'s Round Scoring{' '}
          <FontAwesomeIcon icon={faAnglesRight} />
        </Link>
      </div>
      <div className="ta-center">
        <Link to={`/league/${leagueId}/round/${roundId}/scoring`}>
          Round Scoring Home <FontAwesomeIcon icon={faAnglesRight} />
        </Link>
      </div>

      <h4 className={styles.editPointEarnedStaticData}>
        Point:{' '}
        <span>
          {pointName} {value}
        </span>
      </h4>
      <form>
        {scope === 'no_scope' && (
          <BasicInput
            type="number"
            min="1"
            name="point-earned-quantity"
            label="Quantity"
            value={editedPoint.quantity ?? ''}
            onChange={(e) => {
              const valueNum = +e.target.value
              setEditedPoint((prev) => ({
                ...prev,
                quantity: valueNum > 0 ? valueNum : 1,
              }))
            }}
          />
        )}

        <label htmlFor="hole-select">Hole</label>
        <select
          id="hole-select"
          value={editedPoint.hole}
          onChange={(e) => {
            const val = e.target.value
            const holeIsSelected = val !== ''
            setEditedPoint((prev) => ({
              ...prev,
              hole: holeIsSelected ? +val : val,
            }))
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
