import { useState, useRef } from 'react'
import { useParams } from 'react-router-dom'

import BasicInput from '../shared/components/BasicInput'
import SimpleInputValidationError from '../shared/components/SimpleInputValidationError'
import { validateSimpleInput } from '../shared/utils'

//   TODO: if keeping these move to a separate file
const twEditInputs =
  'block border borderGray300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2'

export default function AddPlayer({
  refreshState,
}: {
  refreshState: () => void
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
      <BasicInput
        type="text"
        name="playerName"
        label="Player Name"
        onChange={({ target }) => {
          setNewPlayerName(target.value)
        }}
        value={newPlayerName}
        twClasses={`${twEditInputs} w-72 max-w-screen-sm`}
      />

      <button onClick={handleCreateLeaguePlayer}>Add Player</button>
      <SimpleInputValidationError
        errorField={inputValidationError}
        errorMsgCode="MISSNG_VALUE"
      />
    </>
  )
}