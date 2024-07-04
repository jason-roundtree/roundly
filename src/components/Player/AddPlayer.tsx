import { useState, useRef } from 'react'
import { useParams } from 'react-router-dom'

import BasicInput from '../shared/components/BasicInput'
import SimpleInputValidationError from '../shared/components/SimpleInputValidationError'
import { validateSimpleInput } from '../shared/utils'

export default function AddPlayer({
  refreshState,
}: {
  refreshState(): void
}): JSX.Element {
  const [newPlayerName, setNewPlayerName] = useState<string>('')
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

        refreshState()
        setNewPlayerName('')
        inputRef.current && inputRef.current.focus()
      } catch (err) {
        console.log('add player to league error: ', err)
      }
    }
  }

  return (
    <>
      <h3 className="secondary-page-title">Add New Player to League</h3>
      <BasicInput
        type="text"
        name="playerName"
        label="Player Name"
        onChange={({ target }) => {
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
      </div>
    </>
  )
}
