import { useContext, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { RoundContext } from './RoundDetailsContainer'
import DeleteConfirmationModal from '../shared/components/DeleteConfirmationModal'

export default function RoundDetails() {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const { leagueId } = useParams()
  const {
    id: roundId,
    players,
    pointSettings,
    handleDeleteRound,
  } = useContext(RoundContext)

  return (
    <>
      <Link
        to={`/league/${leagueId}/rounds/${roundId}/players`}
        className="text-link"
      >
        Players
      </Link>
      <ul>
        {players?.map((player) => {
          return <li key={player.id}>{player.name}</li>
        })}
      </ul>

      <Link
        to={`/league/${leagueId}/rounds/${roundId}/point-settings`}
        className="text-link"
      >
        Point Settings
      </Link>
      <ul>
        {pointSettings?.map((ps) => {
          return (
            <li key={ps.id}>
              <span>{ps.name}</span> / <span>{ps.value}</span>
            </li>
          )
        })}

        {/* TODO: */}
        <Link to={`#`} className="text-link">
          Scores
        </Link>
      </ul>

      <button onClick={() => setShowDeleteConfirmation((show) => !show)}>
        Delete Round
      </button>

      {showDeleteConfirmation && (
        <DeleteConfirmationModal
          modalTitle="Confirm Round Deletion"
          confirmationText="Are you sure you want to delete this round from the league?"
          buttonText="Delete"
          onConfirmDelete={handleDeleteRound}
          toggleModalActive={() => setShowDeleteConfirmation((show) => !show)}
        />
      )}
    </>
  )
}
