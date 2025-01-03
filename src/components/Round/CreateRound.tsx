import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
// import { v4 as uuid } from 'uuid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAnglesRight } from '@fortawesome/free-solid-svg-icons'

import { Player, PointSetting, Round } from '../../types'
import BasicInput from '../shared/components/BasicInput'
import PlayerListItemSelectable from '../Player/PlayerSelectable'
import { PointSelectable } from '../PointSettings'
import {
  createRoundPointSetting,
  fetchLeaguePlayers,
  fetchLeaguePointSettings,
  createRoundPlayer,
} from '../../data'
import styles from './CreateRound.module.css'
import { toggleStringItemInList } from '../shared/utils'
import Checkbox from '../shared/components/Checkbox'
import { toast } from 'react-toastify'

export interface RoundState {
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
  const [pointSettings, setPointSettings] = useState<PointSetting[]>([])
  const [selectedPointSettings, setSelectedPointSettings] = useState<string[]>(
    []
  )
  const [players, setPlayers] = useState<Player[]>([])
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([])
  const [allPlayersAreSelected, setAllPlayersAreSelected] = useState(false)
  const navigate = useNavigate()
  const { leagueId } = useParams()

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

  useEffect(() => {
    selectedPlayers.length < players.length && setAllPlayersAreSelected(false)
  }, [selectedPlayers])

  // TODO: better of handling return?
  async function createRoundPointSettings(roundId): Promise<string[]> {
    const failedRequests: string[] = []
    for (const pointId of selectedPointSettings) {
      const res = await createRoundPointSetting(pointId, roundId)
      if (!res.ok) {
        failedRequests.push(pointId)
      }
    }
    return failedRequests
  }
  // TODO: better of handling return?
  async function createRoundPlayers(roundId): Promise<string[]> {
    const failedRequests: string[] = []
    for (const playerId of selectedPlayers) {
      const res = await createRoundPlayer(playerId, roundId)
      if (!res.ok) {
        failedRequests.push(playerId)
      }
    }
    return failedRequests
  }

  async function createRound() {
    try {
      const response = await fetch('http://localhost:3001/api/round', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...roundState,
          leagueId,
          date: roundState.date,
        }),
      })

      const { id: roundId } = await response.json()
      const createRoundPlayerFailures = await createRoundPlayers(roundId)
      const createRoundPointSettingsFailures = await createRoundPointSettings(
        roundId
      )
      if (
        !createRoundPlayerFailures.length &&
        !createRoundPointSettingsFailures.length
      ) {
        toast.success('Round successfully created')
      }
    } catch (err) {
      console.log('create round error: ', err)
    }
  }

  async function handleSaveRound(e) {
    e.preventDefault()
    let validationFailed = false
    if (!roundState.name && !roundState.location) {
      toast.error('Round name or location is required')
      validationFailed = true
    }
    if (!roundState.date) {
      toast.error('Date is required')
      validationFailed = true
    }
    if (validationFailed) return

    const res = await createRound()
    console.log('createRound res', res)
    navigate(`/league/${leagueId}/rounds`)
  }

  function handleInputChange({
    target: { name: name, value: value },
  }: React.ChangeEvent<HTMLInputElement>): void {
    setRoundState({ ...roundState, [name]: value })
  }

  function toggleAllPlayersAreSelected() {
    const areActiveUpdated = !allPlayersAreSelected
    setAllPlayersAreSelected(areActiveUpdated)

    if (areActiveUpdated) {
      const activePlayerIds: string[] = []
      for (const player of players) {
        activePlayerIds.push(player.id)
      }
      setSelectedPlayers(activePlayerIds)
    } else {
      setSelectedPlayers([])
    }
  }

  return (
    <>
      <Link to={`/league/${leagueId}`} className="leagueHomeLink">
        League Home
        <FontAwesomeIcon icon={faAnglesRight} />
      </Link>

      <form>
        <h2 className="ta-center">Create Round</h2>

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

        <Checkbox
          checked={allPlayersAreSelected}
          onChange={toggleAllPlayersAreSelected}
          label="Activate all players"
          id="activate-all-round-players"
          containerClassName={styles.plainCheckbox}
        />

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
        <p className="ital">
          You can add and edit points once the round is created
        </p>
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
        </div>
      </form>
    </>
  )
}
