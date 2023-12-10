import { useEffect, useState } from 'react'
import { BasicLeagueState, Player } from '../../types'
import { defaultLeagueState } from '../League/CreateLeague'

const leagueId = window.location.pathname.split('/')[2]
console.log('leagueId', leagueId)

export default function LeagueHome() {
  const [leagueData, setLeagueData] =
    useState<BasicLeagueState>(defaultLeagueState)
  const [playersData, setPlayersData] = useState<Player[]>([])
  const { name, startDate, endDate } = leagueData

  useEffect(() => {
    getLeagueData()
    getLeaguePlayerData()
  }, [])

  async function getLeagueData() {
    try {
      const res = await fetch(`http://localhost:3001/api/league/${leagueId}`)
      const leagueData = await res.json()
      console.log('get league data res: ', leagueData)
      setLeagueData(leagueData)
    } catch (err) {
      console.log('get league data error: ', err)
    }
  }

  async function getLeaguePlayerData() {
    try {
      const res = await fetch(`http://localhost:3001/api/players/${leagueId}`)
      const playersData = await res.json()
      console.log('get players data res: ', playersData)
      setPlayersData(playersData)
    } catch (err) {
      console.log('get league data error: ', err)
    }
  }
  return (
    <>
      <h1 className="text-3xl font-bold">{name} - League Home</h1>

      <h2 className="text-xl font-bold mt-4">Players</h2>
      <ul>
        {playersData.map(({ id, name }) => {
          return <li key={id}>{name}</li>
        })}
      </ul>

      <h2 className="text-xl font-bold mt-4">Point Settings</h2>
      <h2 className="text-xl font-bold mt-4">Rounds</h2>
      <h2 className="text-xl font-bold mt-4">Standings</h2>
    </>
  )
}
