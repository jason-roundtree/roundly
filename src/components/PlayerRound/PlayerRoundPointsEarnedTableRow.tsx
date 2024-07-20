import { useState, useContext } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'

import { RoundContext } from '../Round/RoundDetailsContainer'
import DeleteConfirmationModal from '../shared/components/DeleteConfirmationModal'
import { deletePlayerPointEarned } from '../../data'
interface PlayerRoundPointsEarnedRow {
  id: string
  name: string
  value: number
  hole?: number
  frequency?: number
  playerId: string
  getAndSetRoundPointsEarned: () => void
}

export default function PlayerRoundPointsEarnedTableRow({
  id,
  name,
  value,
  hole,
  frequency,
  playerId,
  getAndSetRoundPointsEarned,
}: PlayerRoundPointsEarnedRow): JSX.Element {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const { refreshRoundState } = useContext(RoundContext)
  const params = useParams()
  // TODO: why can't i destructure params above without TS complaining?
  const leagueId = params.leagueId as string
  const roundId = params.roundId as string
  const [searchParams] = useSearchParams()
  const playerName = searchParams.get('playerName') ?? ''
  // TODO: should i use prop or param here?
  // const playerId = searchParams.get('playerId') ?? ''

  async function handleDeletePointEarned() {
    const res = await deletePlayerPointEarned(id)
    console.log('handleDeletePointEarned res ', res)
    if (res.ok) {
      setShowDeleteConfirmation(false)
      getAndSetRoundPointsEarned()
      // refreshRoundState()
    }
  }

  function getdeleteConfirmationText(): JSX.Element {
    return (
      <>
        <p>Are you sure you want to delete this point?</p>
        <div className="taCenter">
          <p>Type: {name}</p>
          <p>Value: {value}</p>
          <p>Quantity: {frequency}</p>
          <p>Hole: {hole ?? ''}</p>
        </div>
      </>
    )
  }

  return (
    <>
      {!showDeleteConfirmation ? null : (
        <DeleteConfirmationModal
          modalTitle="Delete Player Point Earned"
          confirmationText={getdeleteConfirmationText()}
          buttonText="Delete"
          toggleModalActive={() => setShowDeleteConfirmation((show) => !show)}
          onConfirmDelete={handleDeletePointEarned}
        />
      )}
      <tr id={id}>
        <td>{name}</td>
        <td>{value}</td>
        <td>{frequency}</td>
        <td>{hole ?? ''}</td>
        <td>
          <Link
            to={`/league/${leagueId}/rounds/${roundId}/edit-player-scoring?playerId=${playerId}&playerName=${encodeURIComponent(
              playerName
            )}`}
          >
            Edit
          </Link>
        </td>
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
