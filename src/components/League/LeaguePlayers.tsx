import { useState, useEffect, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'

import { PlayerListEditable } from '../Player'
import BasicInput from '../shared/components/BasicInput'
import SimpleInputValidationError from '../shared/components/SimpleInputValidationError'
import { Player } from '../../types'
import { sortArrayOfObjects, validateSimpleInput } from '../shared/utils'
import { fetchLeaguePlayers } from '../../data'

// export async function fetchPlayers(leagueId): Promise<any> {
//   try {
//     const res = await fetch(`http://localhost:3001/api/players/${leagueId}`)
//     const players = await res.json()
//     console.log('players pre sort: ', players)
//     const sortedPlayers = sortArrayOfObjects(players, 'name')
//     console.log('players post sort: ', sortedPlayers)
//     return sortedPlayers
//   } catch (err) {
//     console.log('fetch players error: ', err)
//   }
// }

export default function LeaguePlayers(): JSX.Element {
  const [players, setPlayers] = useState<Player[]>([])
  const [newPlayerName, setNewPlayerName] = useState<string>('')
  const [inputValidationError, setInputValidationError] = useState<
    string | null
  >(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { id: leagueId } = useParams()

  useEffect(() => {
    refreshPlayersState()
  }, [])

  async function refreshPlayersState(): Promise<void> {
    const players = await fetchLeaguePlayers(leagueId)
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
        const players = await fetchLeaguePlayers(leagueId)
        setPlayers(players)
        setNewPlayerName('')
        inputRef.current && inputRef.current.focus()
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
      <span className="breadcrumb">
        <Link to={`/league/${leagueId}`}>League Home</Link>
        <span> / </span>
        League Players
      </span>

      {/* <h1 className="text-3xl font-bold">Players</h1> */}
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
