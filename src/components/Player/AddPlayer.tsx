import { useState, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAnglesRight } from '@fortawesome/free-solid-svg-icons'

import BasicInput from '../shared/components/BasicInput'
import ValidationErrorMessage from '../shared/components/ValidationErrorMessage'
import { validateStringInput } from '../shared/utils'

export default function AddPlayer(): JSX.Element {
  const [newPlayerName, setNewPlayerName] = useState<string>('')
  const [showSuccessMsg, setShowSuccessMsg] = useState(false)
  const [showValidationError, setShowValidationError] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const { leagueId } = useParams()

  async function handleCreateLeaguePlayer(): Promise<void> {
    if (!validateStringInput(newPlayerName, setShowValidationError)) {
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
      // const resJson = await res.json()

      setNewPlayerName('')
      setShowSuccessMsg(true)
      setTimeout(() => setShowSuccessMsg(false), 3000)
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

      <div className="linkContainerCentered">
        <Link to={`/league/${leagueId}/players`}>
          League Players <FontAwesomeIcon icon={faAnglesRight} />
        </Link>
      </div>

      <BasicInput
        type="text"
        name="playerName"
        label="Player Name"
        onChange={({ target }) => {
          setShowValidationError(false)
          setShowSuccessMsg(false)
          setNewPlayerName(target.value)
        }}
        value={newPlayerName}
      />

      <div className="form-submit">
        <button onClick={handleCreateLeaguePlayer}>Add Player</button>
        <ValidationErrorMessage
          showErrorMsg={showValidationError}
          errorMsgCode="MISSNG_VALUE"
          errorField="Player Name"
        />
        {/* TODO: when changing to toasts, allow both success and error to show? */}
        {showSuccessMsg && !showValidationError && (
          <p className="success-msg">Player Successfully Added</p>
        )}
      </div>
    </>
  )
}
