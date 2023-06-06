import React, { useState, MouseEvent } from 'react'
import { Round } from '../../types'
import BasicInput from '../shared/components/BasicInput'
import PlayerListItemSelectable from '../Player/PlayerListItemSelectable'
import useHandleInputChange from '../shared/hooks/useHandleInputChange'
const players = require('../players-data.json')

interface RoundState {
  name: string
  location?: string
  date: string
  players: string[]
  pointSettings: string[]
}

export default function CreateRound() {
  const [roundState, setRoundState] = useState<RoundState>({
    name: '',
    location: '',
    date: '',
    players: [],
    pointSettings: [],
  })

  const [selectedPlayers, setSelectedPlayers] = useState<Array<string>>([])
  console.log('selectedPlayers: ', selectedPlayers)

  function handleSaveRound() {
    console.log('save round')
  }

  function handleToggleSelectPlayer(id: string): void {
    if (!selectedPlayers.includes(id)) {
      setSelectedPlayers([...selectedPlayers, id])
    } else {
      setSelectedPlayers(selectedPlayers.filter((playerId) => playerId !== id))
    }
  }

  function handleInputChange({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement>): void {
    setRoundState({ ...roundState, [name]: value })
  }

  //   TODO: if keeping these move to a separate file
  const twEditInputs =
    'block border borderGray300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2'
  const twListItems =
    'max-w-fit rounded-lg my-1 mx-1 p-2 inline-block rounded-sm border-solid border-2 border-indigo-600'

  return (
    <div className="m-8 mx-auto max-w-screen-md" id="createRound">
      <h1 className="text-3xl font-bold">Create Round</h1>
      <BasicInput
        type="text"
        label="Round Name"
        name="name"
        value={roundState.name}
        onChange={handleInputChange}
        twClasses={`${twEditInputs} w-72 max-w-screen-sm`}
        isRequired={true}
      />
      <BasicInput
        type="text"
        label="Location"
        name="location"
        value={roundState.location || ''}
        onChange={handleInputChange}
        twClasses={`${twEditInputs} w-72 max-w-screen-sm`}
        isRequired={false}
      />
      <BasicInput
        type="date"
        label="Date"
        name="date"
        value={roundState.date}
        onChange={handleInputChange}
        twClasses={`${twEditInputs} w-64 max-w-md`}
        isRequired={false}
      />

      <label className="block mt-2 font-semibold">Add Players</label>
      <ul>
        {players.map((player) => {
          const isSelected = selectedPlayers.includes(player.id)
          return (
            <PlayerListItemSelectable
              name={player.name}
              id={player.id}
              twListItems={twListItems}
              toggleSelectedPlayer={handleToggleSelectPlayer}
              isSelected={isSelected}
            />
          )
        })}
      </ul>

      <div className="flex mt-6">
        {/* TODO: add validation to ensure league name has been added */}
        <button className="mx-auto" onSubmit={handleSaveRound}>
          Create Round
        </button>
      </div>
    </div>
  )
}
