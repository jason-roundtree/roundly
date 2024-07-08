import { useState, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAnglesRight } from '@fortawesome/free-solid-svg-icons'

import BasicInput from '../shared/components/BasicInput'
import SimpleInputValidationError from '../shared/components/SimpleInputValidationError'
import { validateSimpleInput } from '../shared/utils'

export default function AddPlayer(): JSX.Element {
  const [newPlayerName, setNewPlayerName] = useState<string>('')
  const [showSuccessMsg, setShowSuccessMsg] = useState(false)
  const [inputValidationError, setInputValidationError] = useState<
    string | null
  >(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { leagueId } = useParams()

  async function handleCreateLeaguePlayer(): Promise<void> {
    if (
      !validateSimpleInput(
        newPlayerName,
        'Player Name',
        setInputValidationError
      )
    ) {
      return
    } else {
      const newPlayer = {
        name: newPlayerName,
      }
      try {
        const res = await fetch(
          `http://localhost:3001/api/player/${leagueId}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newPlayer),
          }
        )
        // const resJson = await res.json()

        setNewPlayerName('')
        setShowSuccessMsg(true)
        setTimeout(() => setShowSuccessMsg(false), 3000)
        inputRef.current && inputRef.current.focus()
      } catch (err) {
        console.log('add player to league error: ', err)
      }
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
          setInputValidationError(null)
          setShowSuccessMsg(false)
          setNewPlayerName(target.value)
        }}
        value={newPlayerName}
      />

      <div className="form-submit">
        <button onClick={handleCreateLeaguePlayer}>Add Player</button>
        <SimpleInputValidationError
          errorField={inputValidationError}
          errorMsgCode="MISSNG_VALUE"
        />
        {/* TODO: when changing to toasts, allow both success and error to show? */}
        {showSuccessMsg && !inputValidationError && (
          <p className="success-msg">Player Successfully Added</p>
        )}
      </div>
    </>
  )
}
