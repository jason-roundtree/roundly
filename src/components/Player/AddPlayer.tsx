import { useState, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAnglesRight } from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-toastify'

import BasicInput from '../shared/components/BasicInput'
import { validateStringInput } from '../shared/utils'

export default function AddPlayer(): JSX.Element {
  const [newPlayerName, setNewPlayerName] = useState<string>('')
  const [showSuccessMsg, setShowSuccessMsg] = useState(false)
  const [showValidationError, setShowValidationError] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const { leagueId } = useParams()

  async function handleCreateLeaguePlayer(): Promise<void> {
    if (!newPlayerName) {
      toast.error('Player name is required')
      return
    }

    const newPlayer = {
      name: newPlayerName,
    }
    try {
      const res = await fetch(`http://localhost:3001/api/player/${leagueId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPlayer),
      })
      if (res.status === 409) {
        toast.error('Player name already exists in league')
      }
      if (res.ok) {
        setNewPlayerName('')
        toast.success('Player successfully created')
      }
      inputRef.current && inputRef.current.focus()
    } catch (err) {
      console.log('add player to league error: ', err)
    }
  }

  return (
    <>
      <h3 className="decrease-bottom-margin page-title">
        Add New Player to League
      </h3>

      <div className="ta-center">
        <Link to={`/league/${leagueId}/players`}>
          League Players <FontAwesomeIcon icon={faAnglesRight} />
        </Link>
      </div>

      <BasicInput
        type="text"
        name="playerName"
        label="Player Name"
        onChange={({ target }) => setNewPlayerName(target.value)}
        value={newPlayerName}
      />

      <button onClick={handleCreateLeaguePlayer}>Add Player</button>
    </>
  )
}
