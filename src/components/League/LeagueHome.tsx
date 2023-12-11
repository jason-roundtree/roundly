import { useEffect, useState } from 'react'
import { BasicLeagueState, Player, PointSetting } from '../../types'
import { defaultLeagueState } from '../League/CreateLeague'

const leagueId = window.location.pathname.split('/')[2]
console.log('leagueId', leagueId)

export default function LeagueHome() {
  const [leagueData, setBasicLeagueData] =
    useState<BasicLeagueState>(defaultLeagueState)
  const [players, setPlayers] = useState<Player[]>([])
  const [pointSettings, setPointSettings] = useState<PointSetting[]>([])
  const { name, startDate, endDate } = leagueData

  useEffect(() => {
    getBasicLeagueData()
    getLeaguePlayers()
    getLeaguePointSettings()
  }, [])

  async function getBasicLeagueData() {
    try {
      const res = await fetch(`http://localhost:3001/api/league/${leagueId}`)
      const leagueData = await res.json()
      console.log('get league data res: ', leagueData)
      setBasicLeagueData(leagueData)
    } catch (err) {
      console.log('get league data error: ', err)
    }
  }

  async function getLeaguePlayers() {
    try {
      const res = await fetch(`http://localhost:3001/api/players/${leagueId}`)
      const players = await res.json()
      console.log('get players data res: ', players)
      setPlayers(players)
    } catch (err) {
      console.log('get league data error: ', err)
    }
  }

  async function getLeaguePointSettings() {
    try {
      const res = await fetch(
        `http://localhost:3001/api/point-settings/${leagueId}`
      )
      const pointSettings = await res.json()
      console.log('get pointSettings data res: ', pointSettings)
      setPointSettings(pointSettings)
    } catch (err) {
      console.log('get league data error: ', err)
    }
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

      <h2 className="text-xl font-bold mt-4">Rounds</h2>
      <h2 className="text-xl font-bold mt-4">Standings</h2>
    </>
  )
}
