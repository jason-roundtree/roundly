import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { BasicLeagueState, Player, PointSetting, Round } from '../../types'
import { defaultLeagueState } from '../League/CreateLeague'
import {
  fetchLeaguePointSettings,
  fetchLeaguePlayers,
  fetchBasicLeagueData,
  fetchLeagueRounds,
} from '../../data'

export default function LeagueHome() {
  const [leagueData, setBasicLeagueData] =
    useState<BasicLeagueState>(defaultLeagueState)
  const [players, setPlayers] = useState<Player[]>([])
  const [pointSettings, setPointSettings] = useState<PointSetting[]>([])
  const [rounds, setRounds] = useState<Round[]>([])

  const { name, startDate, endDate } = leagueData
  const { leagueId } = useParams()

  useEffect(() => {
    getBasicLeagueData()
    getLeaguePlayers()
    getLeaguePointSettings()
    getLeagueRounds()
  }, [leagueId])

  // TODO: add error checking to these types of functions throughout app
  // TODO: add error checking to these types of functions throughout app
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

  async function getLeagueRounds() {
    const rounds = await fetchLeagueRounds(leagueId)
    setRounds(rounds)
  }

  return (
    <>
      <h1>{name} - League Home</h1>
      <h2>
        <Link to={`/league/${leagueId}/players`}>Players</Link>
      </h2>
      <ul>
        {players.map(({ id, name }) => {
          return <li key={id}>{name}</li>
        })}
      </ul>

      <h2>
        <Link to={`/league/${leagueId}/point-settings`}>Point Settings</Link>
      </h2>
      <ul>
        {pointSettings.map(({ id, name, value }) => {
          return (
            <li key={id}>
              {name} / {value}
            </li>
          )
        })}
      </ul>

      <h2>
        <Link to={`/league/${leagueId}/rounds`}>Rounds</Link>
      </h2>
      <ul>
        {rounds.map(({ id, name, location, date }) => {
          return <li key={id}>{name}</li>
        })}
      </ul>

      <h2>Standings</h2>
    </>
  )
}
