import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAnglesRight } from '@fortawesome/free-solid-svg-icons'

import { BasicLeagueState, Player, PointSetting, Round } from '../../types'
import { defaultLeagueState } from '../League/CreateLeague'
import {
  fetchLeaguePointSettings,
  fetchLeaguePlayers,
  fetchBasicLeagueData,
  fetchLeagueRounds,
} from '../../data'
import styles from './LeagueHome.module.css'

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
      <div className="ta-center">
        <h1>{name}</h1>
        <h2>League Home</h2>
      </div>

      <h3 className={styles.editPageLinks}>
        <Link to={`/league/${leagueId}/rounds`}>
          ROUNDS <FontAwesomeIcon icon={faAnglesRight} />
        </Link>
      </h3>
      <ul className="summaryListContainer">
        {rounds.map(({ id, name, location, date }) => {
          const dateFormatted = new Date(date).toLocaleDateString()
          return (
            <li key={id}>
              {name} &nbsp;&nbsp;-&nbsp;&nbsp; {dateFormatted}
            </li>
          )
        })}
      </ul>

      <h3 className={styles.editPageLinks}>
        <Link to={`/league/${leagueId}/players`}>
          PLAYERS <FontAwesomeIcon icon={faAnglesRight} />
        </Link>
      </h3>
      <ul className="summaryListContainer">
        {players.map(({ id, name }) => {
          return <li key={id}>{name}</li>
        })}
      </ul>

      <h3 className={styles.editPageLinks}>
        <Link to={`/league/${leagueId}/point-settings`}>
          POINT SETTINGS <FontAwesomeIcon icon={faAnglesRight} />
        </Link>
      </h3>
      <ul className="summaryListContainer">
        {pointSettings.map(({ id, name, value }) => {
          return (
            <li key={id}>
              {name}&nbsp;&nbsp;&nbsp;{value}
            </li>
          )
        })}
      </ul>

      <h3 className={styles.editPageLinks}>
        STANDINGS <FontAwesomeIcon icon={faAnglesRight} />
      </h3>
    </>
  )
}
