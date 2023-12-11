import { useState, useEffect } from 'react'
import { PlayerListEditable } from '../Player'
import BasicInput from '../shared/components/BasicInput'
import SimpleInputValidationError, {
  ErrorMsgCodes,
} from '../shared/components/SimpleInputValidationError'
import { Player } from '../../types'
import { sortArrayOfObjects, validateSimpleInput } from '../shared/utils'

const leagueId = window.location.pathname.split('/')[2]
console.log('leagueId', leagueId)

export async function fetchPlayers() {
  try {
    const res = await fetch(`http://localhost:3001/api/players/${leagueId}`)
    const players = await res.json()
    console.log('players pre sort: ', players)
    const sortedPlayers = sortArrayOfObjects(players, 'name')
    console.log('players post sort: ', sortedPlayers)
    return sortedPlayers
  } catch (err) {
    console.log('fetch players error: ', err)
  }
}

export default function LeaguePlayers(): JSX.Element {
  // TODO: correct way to initiate state when array can be empty?
  const [players, setPlayers] = useState<Player[]>([])
  const [newPlayerName, setNewPlayerName] = useState<string>('')
  const [inputValidationError, setInputValidationError] = useState<
    string | null
  >(null)

  useEffect(() => {
    refreshPlayersState()
  }, [])

  async function refreshPlayersState(): Promise<void> {
    const players = await fetchPlayers()
    setPlayers(players)
  }

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
        const players = await fetchPlayers()
        setPlayers(players)
        setNewPlayerName('')
      } catch (err) {
        console.log('add player to league error: ', err)
      }
    }
  }

  //   TODO: if keeping these move to a separate file
  const twEditInputs =
    'block border borderGray300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2'
  const twListItems =
    'max-w-fit rounded-lg my-1 mx-4 p-2 list-item editable-list-item'

  return (
    <div>
      <h1 className="text-3xl font-bold">Players</h1>
      <BasicInput
        type="text"
        name="playerName"
        label="Player Name"
        onChange={({ target }) => {
          // setInputValidationError(null)
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

      <PlayerListEditable
        listName="players"
        players={players}
        twEditInputs={twEditInputs}
        twListItems={twListItems}
        refreshPlayerState={refreshPlayersState}
      />
    </div>
  )
}
