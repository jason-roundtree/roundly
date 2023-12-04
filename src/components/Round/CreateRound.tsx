import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Round } from '../../types'
import BasicInput from '../shared/components/BasicInput'
import PlayerListItemSelectable from '../Player/PlayerListItemSelectable'
import PointListItemSelectable from '../Round/PointListItemSelectable'
import players from '../../players-data.json'
import points from '../../point-settings-data.json'

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
  const [selectedPoints, setSelectedPoints] = useState<Array<string>>([])
  console.log('selectedPoints: ', selectedPoints)
  // TODO: pass league down or add it to URL params?
  const leagueId = 'dummyLeagueID'

  function handleSaveRound() {
    console.log('save round')
  }

  // TODO: DRYify points and players lists
  function handleToggleSelectPlayer(id: string): void {
    if (!selectedPlayers.includes(id)) {
      setSelectedPlayers([...selectedPlayers, id])
    } else {
      setSelectedPlayers(selectedPlayers.filter((playerId) => playerId !== id))
    }
  }
  function handleToggleSelectPoint(id: string): void {
    if (!selectedPoints.includes(id)) {
      setSelectedPoints([...selectedPoints, id])
    } else {
      setSelectedPoints(selectedPoints.filter((pointId) => pointId !== id))
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
    'max-w-fit rounded-lg my-1 mx-1 p-1 inline-block rounded-sm border-solid border-2 border-indigo-600'

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

      <label className="block mt-4 font-semibold">Add Players</label>
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

      <label className="block mt-4 font-semibold">Points</label>
      <Link to={`/league/${leagueId}/point-settings`}>Edit Points</Link>
      <ul>
        {points.map((point) => {
          const isSelected = selectedPoints.includes(point.id)
          return (
            <PointListItemSelectable
              name={point.pointType}
              weight={point.pointValue}
              id={point.id}
              twListItems={twListItems}
              toggleSelectedPoint={handleToggleSelectPoint}
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
