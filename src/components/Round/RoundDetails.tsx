import { useContext, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAnglesRight } from '@fortawesome/free-solid-svg-icons'

import { RoundContext } from './RoundDetailsContainer'
import DeleteConfirmationModal from '../shared/components/DeleteConfirmationModal'
import styles from './RoundDetails.module.css'

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
      <p className={styles['edit-page-links']}>
        <Link to={`/league/${leagueId}/rounds/${roundId}/players`}>
          PLAYERS <FontAwesomeIcon icon={faAnglesRight} />
        </Link>
      </p>
      <ul>
        {players?.map((player) => {
          return <li key={player.id}>{player.name}</li>
        })}
      </ul>
      <p className={styles['edit-page-links']}>
        <Link to={`/league/${leagueId}/rounds/${roundId}/point-settings`}>
          POINT SETTINGS <FontAwesomeIcon icon={faAnglesRight} />
        </Link>
      </p>
      <ul>
        {pointSettings?.map((ps) => {
          return (
            <li key={ps.id}>
              <span>{ps.name}</span> / <span>{ps.value}</span>
            </li>
          )
        })}

        {/* TODO: */}
        <p className={styles['edit-page-links']}>
          <Link to={`#`}>
            SCORES <FontAwesomeIcon icon={faAnglesRight} />
          </Link>
        </p>
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
