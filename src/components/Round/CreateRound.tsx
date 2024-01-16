import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
// import { v4 as uuid } from 'uuid'

import { Player, PointSetting, Round } from '../../types'
import BasicInput from '../shared/components/BasicInput'
import PlayerListItemSelectable from '../Player/PlayerListItemSelectable'
import PointListItemSelectable from '../PointSettings/PointListItemSelectable'
import toggleStringItemInList from '../shared/hooks/useToggleStringItemInList'
import { fetchLeaguePlayers, fetchLeaguePointSettings } from '../../data'
import { validateSimpleInput } from '../shared/utils'
import SimpleInputValidationError from '../shared/components/SimpleInputValidationError'

interface RoundState {
  name: string
  location?: string
  date: string
}

export default function CreateRound() {
  const [roundState, setRoundState] = useState<RoundState>({
    name: '',
    location: '',
    date: '',
  })
  const [players, setPlayers] = useState<Player[]>([])
  const [pointSettings, setPointSettings] = useState<PointSetting[]>([])
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([])
  const [selectedPointSettings, setSelectedPointSettings] = useState<string[]>(
    []
  )
  const [inputValidationError, setInputValidationError] = useState<
    string | null
  >(null)
  const navigate = useNavigate()

  const { leagueId } = useParams()

  async function createRoundPointSettings(roundId) {
    for (const pointId of selectedPointSettings) {
      try {
        const response = await fetch(
          'http://localhost:3001/api/round-point-setting',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              pointSettingId: pointId,
              roundId: roundId,
            }),
          }
        )
        const res = await response.json()
        console.log('createRoundPointSettings res', res)
      } catch (err) {
        console.log('create round players error: ', err)
      }
    }
  }

  async function createRoundPlayers(roundId) {
    for (const playerId of selectedPlayers) {
      try {
        const response = await fetch('http://localhost:3001/api/player-round', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            playerId: playerId,
            roundId: roundId,
          }),
        })
        // const res = await response.json()
        // console.log('createRoundPlayers res', res)
      } catch (err) {
        console.log('createRoundPlayers error: ', err)
      }
    }
  }

  async function createRound() {
    try {
      const response = await fetch('http://localhost:3001/api/round', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...roundState,
          leagueId,
          date: roundState.date ? new Date(roundState.date) : new Date(),
        }),
      })

      const { id: roundId } = await response.json()
      await createRoundPlayers(roundId)
      await createRoundPointSettings(roundId)
    } catch (err) {
      console.log('create round error: ', err)
    }
  }

  useEffect(() => {
    const getPlayers = async () => {
      // TODO: also set all players active by default?
      const players = await fetchLeaguePlayers(leagueId)
      setPlayers(players)
    }

    const getPointSettings = async () => {
      const pointSettings = await fetchLeaguePointSettings(leagueId)
      const pointSettingsIds = pointSettings.map((ps) => ps.id)
      setPointSettings(pointSettings)
      setSelectedPointSettings(pointSettingsIds)
    }

    getPlayers()
    getPointSettings()
  }, [leagueId])

  async function handleSaveRound(e) {
    console.log('save round')
    e.preventDefault()
    if (
      !validateSimpleInput(
        roundState.name,
        'Round Name',
        setInputValidationError
      )
    ) {
      return
    }
    await createRound()
    navigate(`/league/${leagueId}/rounds`)
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
    <>
      <Link to={`/league/${leagueId}`}>League Home</Link>

      <form>
        <h2>Create Round</h2>

        {/* <h1 className="text-3xl font-bold">Create Round</h1> */}
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

        <label className="block mt-4 font-semibold">Players</label>
        <ul>
          {players.map(({ name, id }) => {
            const isSelected = selectedPlayers.includes(id)
            return (
              <PlayerListItemSelectable
                name={name}
                id={id}
                key={id}
                twListItems={twListItems}
                toggleSelectedPlayer={() =>
                  toggleStringItemInList(
                    id,
                    selectedPlayers,
                    setSelectedPlayers
                  )
                }
                isSelected={isSelected}
              />
            )
          })}
        </ul>

        <label className="block mt-2 font-semibold">Points</label>
        <p>You can edit and add round points after creating the round</p>
        <ul>
          {pointSettings.map(({ name, value, id }) => {
            const isSelected = selectedPointSettings.includes(id)
            return (
              <PointListItemSelectable
                name={name}
                value={value}
                id={id}
                key={id}
                twListItems={twListItems}
                toggleSelectedPoint={() =>
                  toggleStringItemInList(
                    id,
                    selectedPointSettings,
                    setSelectedPointSettings
                  )
                }
                isSelected={isSelected}
              />
            )
          })}
        </ul>

        {/* <div className="flex mt-6"> */}
        {/* TODO: add validation to ensure league name has been added */}
        <button onClick={handleSaveRound}>Create Round</button>
        <SimpleInputValidationError
          errorField={inputValidationError}
          errorMsgCode="MISSNG_VALUE"
        />
        {/* </div> */}
      </form>
    </>
  )
}
