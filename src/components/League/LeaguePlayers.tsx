import { useState, useEffect } from 'react'
import { v4 as uuid } from 'uuid'
import BasicInput from '../shared/components/BasicInput'
import { PlayerListEditable } from '../Player'
import { Player } from '../../types'
import { sortArrayOfObjects } from '../shared/utils'

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
  const [showInputError, setShowInputError] = useState<boolean>(false)
  console.log('players', players)

  useEffect(() => {
    refreshPlayersState()
  }, [])

  async function refreshPlayersState(): Promise<void> {
    const players = await fetchPlayers()
    setPlayers(players)
  }

  async function handleCreateLeaguePlayer(e): Promise<void> {
    e.preventDefault()
    if (!newPlayerName) {
      setShowInputError(true)
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
      const players = await fetchPlayers()
      setPlayers(players)
      setNewPlayerName('')
    } catch (err) {
      console.log('add player to league error: ', err)
    }
  }

  //   TODO: if keeping these move to a separate file
  const twEditInputs =
    'block border borderGray300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2'
  const twListItems =
    'max-w-fit rounded-lg my-1 mx-4 p-2 list-item editable-list-item'

  return (
    <form>
      <h1 className="text-3xl font-bold">Players</h1>
      <BasicInput
        type="text"
        name="playerName"
        label="Name"
        onChange={({ target }) => {
          setShowInputError(false)
          setNewPlayerName(target.value)
        }}
        value={newPlayerName}
        twClasses={`${twEditInputs} w-72 max-w-screen-sm`}
      />

      <button
        data-input-item="playerName"
        data-input-list="players"
        onClick={handleCreateLeaguePlayer}
      >
        Add Player
      </button>

      <PlayerListEditable
        listName="players"
        players={players}
        twEditInputs={twEditInputs}
        twListItems={twListItems}
        refreshPlayerState={refreshPlayersState}
      />
    </form>
  )
}
