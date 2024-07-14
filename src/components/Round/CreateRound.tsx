import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
// import { v4 as uuid } from 'uuid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAnglesRight } from '@fortawesome/free-solid-svg-icons'

import { Player, PointSetting, Round } from '../../types'
import BasicInput from '../shared/components/BasicInput'
import PlayerListItemSelectable from '../Player/PlayerSelectable'
import { PointSelectable } from '../PointSettings'
import toggleStringItemInList from '../shared/hooks/useToggleStringItemInList'
import {
  createRoundPointSetting,
  fetchLeaguePlayers,
  fetchLeaguePointSettings,
  createRoundPlayer,
} from '../../data'
import styles from './CreateRound.module.css'
import ValidationErrorMessage from '../shared/components/ValidationErrorMessage'
import { validateStringInput } from '../shared/utils'

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
  const [showValidationError, setShowValidationError] = useState(false)
  const navigate = useNavigate()
  const { leagueId } = useParams()

  async function createRoundPointSettings(roundId) {
    for (const pointId of selectedPointSettings) {
      const res = await createRoundPointSetting(pointId, roundId)
    }
  }

  async function createRoundPlayers(roundId) {
    for (const playerId of selectedPlayers) {
      const res = await createRoundPlayer(playerId, roundId)
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
    e.preventDefault()
    if (!validateStringInput(roundState.name, setShowValidationError)) {
      return
    }
    await createRound()
    navigate(`/league/${leagueId}/rounds`)
  }

  function handleInputChange({
    target: { name: name, value: value },
  }: React.ChangeEvent<HTMLInputElement>): void {
    if (name === 'name') {
      setShowValidationError(false)
    }
    setRoundState({ ...roundState, [name]: value })
  }

  return (
    <>
      <Link to={`/league/${leagueId}`} className="leagueHomeLink">
        League Home
        <FontAwesomeIcon icon={faAnglesRight} />
      </Link>

      <form>
        <h2>Create Round</h2>

        <BasicInput
          type="text"
          label="Round Name"
          name="name"
          value={roundState.name}
          onChange={handleInputChange}
        />
        <BasicInput
          type="text"
          label="Location"
          name="location"
          value={roundState.location || ''}
          onChange={handleInputChange}
        />
        <BasicInput
          type="date"
          label="Date"
          name="date"
          value={roundState.date}
          onChange={handleInputChange}
        />

        {/* TODO: add select/de-select all */}
        <label>Active Round Players</label>
        <div className={styles.createRoundSelectables}>
          {players.map(({ name, id }) => {
            const isSelected = selectedPlayers.includes(id)
            return (
              <PlayerListItemSelectable
                name={name}
                id={id}
                key={id}
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
        </div>

        <label>Active Round Points</label>
        <p>You can edit and add one-off points once the round is created</p>
        <div className={styles.createRoundSelectables}>
          {pointSettings.map(({ name, value, id }) => {
            const isSelected = selectedPointSettings.includes(id)
            return (
              <PointSelectable
                name={name}
                value={value}
                id={id}
                key={id}
                isSelected={isSelected}
                toggleSelectedPoint={() => {
                  toggleStringItemInList(
                    id,
                    selectedPointSettings,
                    setSelectedPointSettings
                  )
                }}
              />
            )
          })}
        </div>

        {/* TODO: add validation to ensure league name has been added */}
        <div className="form-submit">
          <button onClick={handleSaveRound}>Create Round</button>
          <ValidationErrorMessage
            showErrorMsg={showValidationError}
            errorField="Round Name"
            errorMsgCode="MISSNG_VALUE"
          />
        </div>
      </form>
    </>
  )
}
