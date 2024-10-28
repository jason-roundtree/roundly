import { useState } from 'react'
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAnglesRight } from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-toastify'

import { RoundState } from './CreateRound'
import BasicInput from '../shared/components/BasicInput'
import DeleteConfirmationModal from '../shared/components/DeleteConfirmationModal'
import { deleteRound } from '../../data'

export default function EditRoundInfo() {
  const routerLocation = useLocation()
  const { name, location, date } = routerLocation.state || {}
  const [roundState, setRoundState] = useState<RoundState>(
    () =>
      ({ name, location, date } || {
        name: '',
        location: '',
        date: '',
      })
  )
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const { leagueId, roundId } = useParams()
  const navigate = useNavigate()

  async function updateRound(e) {
    e.preventDefault()
    let validationFailed = false
    if (!roundState.name && !roundState.location) {
      toast.error('Round name or location is required')
      validationFailed = true
    }
    if (!roundState.date) {
      toast.error('Date is required')
      validationFailed = true
    }
    if (validationFailed) return

    try {
      const res = await fetch(`http://localhost:3001/api/round/${roundId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...roundState,
          date: roundState.date,
        }),
      })
      console.log('update round res: ', res)
      if (res.ok) {
        toast.success('Round successfully updated')
        navigate(`/league/${leagueId}/round/${roundId}`, {
          replace: true,
        })
      }
    } catch (err) {
      console.log('update round error: ', err)
    }
  }

  function handleInputChange({
    target: { name: name, value: value },
  }: React.ChangeEvent<HTMLInputElement>): void {
    console.log('value', value)
    setRoundState({ ...roundState, [name]: value })
  }

  async function handleDeleteRound() {
    await deleteRound(roundId)
    navigate(`/league/${leagueId}/rounds`)
  }

  return (
    <>
      <form>
        <h3 className="ta-center">Edit Round</h3>
        <div className="ta-center">
          <Link to={`/league/${leagueId}/round/${roundId}`}>
            Round Home <FontAwesomeIcon icon={faAnglesRight} />
          </Link>
        </div>

        <BasicInput
          type="text"
          label="Round Name"
          name="name"
          value={roundState.name}
          onChange={handleInputChange}
        />
        <BasicInput
          type="text"
          label="Course"
          name="location"
          value={roundState.location || ''}
          onChange={handleInputChange}
        />
        <BasicInput
          type="date"
          label="Date"
          name="date"
          value={roundState.date}
          onChange={handleInputChange}
        />

        <button onClick={updateRound}>Save</button>
      </form>

      <button
        onClick={() => setShowDeleteConfirmation((show) => !show)}
        className="delete-button"
      >
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
