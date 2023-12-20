import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Player, PointSetting, Round } from '../../types'
import BasicInput from '../shared/components/BasicInput'
import PlayerListItemSelectable from '../Player/PlayerListItemSelectable'
import PointListItemSelectable from '../Round/PointListItemSelectable'
import toggleStringItemInList from '../shared/hooks/useToggleStringItemInList'
import { fetchLeaguePlayers, fetchLeaguePointSettings } from '../../data'

interface RoundState {
  name: string
  location?: string
  date: string
  // players: string[]
  // pointSettings: string[]
}

export default function CreateRound() {
  const [roundState, setRoundState] = useState<RoundState>({
    name: '',
    location: '',
    date: '',
    // players: [],
    // pointSettings: [],
  })
  const [players, setPlayers] = useState<Player[]>([])
  const [pointSettings, setPointSettings] = useState<PointSetting[]>([])
  console.log('pointSettings: ', pointSettings)

  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([])
  console.log('selectedPlayers: ', selectedPlayers)

  const [selectedPoints, setSelectedPoints] = useState<string[]>([])
  console.log('selectedPoints: ', selectedPoints)

  // TODO: pass league down or add it to URL params?
  const { id: leagueId } = useParams()

  useEffect(() => {
    const getPlayers = async () => {
      const players = await fetchLeaguePlayers(leagueId)
      setPlayers(players)
    }
    const getPointSettings = async () => {
      const pointSettings = await fetchLeaguePointSettings(leagueId)
      setPointSettings(pointSettings)
    }
    getPlayers()
    getPointSettings()
  }, [leagueId])

  // TODO: create api calls and routes
  function handleSaveRound() {
    console.log('save round')
  }

  function handleToggleSelectPlayer(id: string): void {
    toggleStringItemInList(id, selectedPlayers, setSelectedPlayers)
  }

  function handleToggleSelectPoint(id: string): void {
    toggleStringItemInList(id, selectedPoints, setSelectedPoints)
  }

  function handleInputChange({
    target: { name: tName, value: tValue },
  }: React.ChangeEvent<HTMLInputElement>): void {
    setRoundState({ ...roundState, [tName]: tValue })
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
      />
      <BasicInput
        type="text"
        label="Location"
        name="location"
        value={roundState.location || ''}
        onChange={handleInputChange}
        twClasses={`${twEditInputs} w-72 max-w-screen-sm`}
      />
      <BasicInput
        type="date"
        label="Date"
        name="date"
        value={roundState.date}
        onChange={handleInputChange}
        twClasses={`${twEditInputs} w-64 max-w-md`}
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
        {pointSettings.map(({ name, value, id }) => {
          const isSelected = selectedPoints.includes(id)
          return (
            <PointListItemSelectable
              name={name}
              value={value}
              id={id}
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
