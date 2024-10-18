import { useState } from 'react'
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAnglesRight } from '@fortawesome/free-solid-svg-icons'

import { RoundState } from './CreateRound'
import BasicInput from '../shared/components/BasicInput'
import { toast } from 'react-toastify'
import { formatDateForInput } from '../shared/utils'

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
  const { leagueId, roundId } = useParams()
  const navigate = useNavigate()

  async function updateRound(e) {
    e.preventDefault()
    try {
      const res = await fetch(`http://localhost:3001/api/round/${roundId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...roundState,
          date: roundState.date ? new Date(roundState.date) : new Date(),
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
    setRoundState({ ...roundState, [name]: value })
  }

  return (
    <>
      <form>
        <h3 className="ta-center">Edit Basic Round Info</h3>
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
          label="Location"
          name="location"
          value={roundState.location || ''}
          onChange={handleInputChange}
        />
        <BasicInput
          type="date"
          label="Date"
          name="date"
          // value={new Date(roundState.date).toISOString().slice(0, 10)}
          value={formatDateForInput(roundState.date)}
          onChange={handleInputChange}
        />

        <button onClick={updateRound}>Save</button>
      </form>
    </>
  )
}
