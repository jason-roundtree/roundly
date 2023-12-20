import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { BasicLeagueState, Player, PointSetting } from '../../types'
import { defaultLeagueState } from '../League/CreateLeague'
import {
  fetchLeaguePointSettings,
  fetchLeaguePlayers,
  fetchBasicLeagueData,
} from '../../data'

export default function LeagueHome() {
  const [leagueData, setBasicLeagueData] =
    useState<BasicLeagueState>(defaultLeagueState)
  const [players, setPlayers] = useState<Player[]>([])
  const [pointSettings, setPointSettings] = useState<PointSetting[]>([])
  const { name, startDate, endDate } = leagueData
  const { id: leagueId } = useParams()

  useEffect(() => {
    getBasicLeagueData()
    getLeaguePlayers()
    getLeaguePointSettings()
  }, [])

  // TODO: add error checking to these?
  async function getLeaguePlayers() {
    const players = await fetchLeaguePlayers(leagueId)
    setPlayers(players)
  }

  async function getLeaguePointSettings() {
    const pointSettings = await fetchLeaguePointSettings(leagueId)
    setPointSettings(pointSettings)
  }

  async function getBasicLeagueData() {
    const leagueData = await fetchBasicLeagueData(leagueId)
    setBasicLeagueData(leagueData)
  }

  return (
    <>
      <h1 className="text-3xl font-bold">{name} - League Home</h1>
      <h2 className="text-xl font-bold mt-4">Players</h2>
      <ul>
        {players.map(({ id, name }) => {
          return <li key={id}>{name}</li>
        })}
      </ul>
      <Link to={`/league/${leagueId}/players`} className="text-link mt-4">
        Edit Players
      </Link>

      <h2 className="text-xl font-bold mt-4">Point Settings</h2>
      <ul>
        {pointSettings.map(({ id, name, value }) => {
          return (
            <li key={id}>
              {name} / {value}
            </li>
          )
        })}
      </ul>
      <Link
        to={`/league/${leagueId}/point-settings`}
        className="text-link mt-4"
      >
        Edit Point Settings
      </Link>

      <h2 className="text-xl font-bold mt-4">Rounds</h2>
      <Link to={`/league/${leagueId}/create-round`} className="text-link mt-4">
        Create Round
      </Link>

      <h2 className="text-xl font-bold mt-4">Standings</h2>
    </>
  )
}
