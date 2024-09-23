import { useState, useContext } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'

import { RoundContext } from '../Round/RoundDetailsContainer'
import DeleteConfirmationModal from '../shared/components/DeleteConfirmationModal'
import { deletePlayerPointEarned } from '../../data'
import { PointSetting } from '../../types'

import styles from './PlayerRoundPointsEarnedTableRow.module.css'
import { PointBeingEdited } from '../shared/hooks/usePlayerPointBeingEdited'

interface PlayerRoundPointsEarnedTableRow {
  id: string
  name: string
  value: number
  hole?: number
  frequency: number
  scope: PointSetting['scope']
  maxFrequencyPerScope: number
  playerId?: string
  playerName: string
  playerHoleId: string
  pointSettingId: string
  getPlayerRoundPointsEarned: () => void
  handleEditPointEarnedModal: (e: any, pointData: PointBeingEdited) => void
}

export default function PlayerRoundPointsEarnedTableRow({
  id,
  name,
  value,
  hole,
  frequency,
  scope,
  maxFrequencyPerScope,
  playerId,
  playerName,
  playerHoleId,
  pointSettingId,
  getPlayerRoundPointsEarned,
  handleEditPointEarnedModal,
}: PlayerRoundPointsEarnedTableRow): JSX.Element {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  // const params = useParams()
  // TODO: why can't i destructure params above without TS complaining?
  // const leagueId = params.leagueId as string
  // const roundId = params.roundId as string
  // const [searchParams] = useSearchParams()
  // const playerName = searchParams.get('playerName') ?? ''
  // TODO: should i use prop or param here?
  // const playerId = searchParams.get('playerId') ?? ''

  async function handleDeletePointEarned() {
    const res = await deletePlayerPointEarned(id)
    console.log('handleDeletePointEarned res ', res)
    if (res.ok) {
      setShowDeleteConfirmation(false)
      getPlayerRoundPointsEarned()
    }
  }

  function getdeleteConfirmationText(): JSX.Element {
    return (
      <>
        {/* <p>Are you sure you want to delete this point?</p> */}
        <div className={`${styles.pointSummary} taCenter`}>
          <p>
            <b>Player:</b> {playerName}
          </p>
          <p>
            <b>Point:</b> {name}
          </p>
          {/* {hole && <p>Hole: {hole}</p>} */}
          <p>
            <b>Hole:</b> {hole ? hole : 'No associated hole'}
          </p>
          <p>
            <b>Value:</b> {value}
          </p>
          <p>
            <b>Quantity:</b> {frequency}
          </p>
        </div>
      </>
    )
  }

  return (
    <>
      {!showDeleteConfirmation ? null : (
        <DeleteConfirmationModal
          // modalTitle="Delete Player Point Earned"
          modalTitle="Are you sure you want to delete this point?"
          confirmationText={getdeleteConfirmationText()}
          buttonText="Delete"
          toggleModalActive={() => setShowDeleteConfirmation((show) => !show)}
          onConfirmDelete={handleDeletePointEarned}
        />
      )}
      <tr
        id={id}
        onClick={(e) =>
          handleEditPointEarnedModal(e, {
            pointEarnedId: id,
            pointName: name,
            pointSettingId,
            scope,
            // playerHoleId,
            playerName,
            value,
            originalHole: hole ?? '',
            hole: hole ?? '',
            originalFrequency: frequency,
            frequency,
            maxFrequencyPerScope,
          })
        }
      >
        <td>{name}</td>
        <td>{value}</td>
        <td>{frequency}</td>
        <td>{hole ?? ''}</td>
        {/* <td>
          <Link
            to={`/league/${leagueId}/rounds/${roundId}/edit-player-point-earned?playerId=${playerId}&playerName=${encodeURIComponent(
              playerName
            )}`}
          >
            Edit
          </Link>
        </td> */}
        {/* TODO: pass and call getPlayerRoundTotalPoints when delete is successful */}
        <td
          onClick={() => setShowDeleteConfirmation(true)}
          className="tableDataAction deletePointEarned"
        >
          Delete
        </td>
      </tr>
    </>
  )
}
