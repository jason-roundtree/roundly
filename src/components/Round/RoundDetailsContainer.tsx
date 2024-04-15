import { useEffect, useState, createContext } from 'react'
import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom'

import { Round, Player, PointSetting } from '../../types'
import { fetchRound, deleteRound } from '../../data'
import styles from './RoundDetailsContainer.module.css'

const RoundContextDefault = {
  id: '',
  name: '',
  location: '',
  date: '',
  players: [] as Player[],
  pointSettings: [] as PointSetting[],
  refreshRoundState: () => {},
  handleDeleteRound: () => {},
}

type RoundContextDefaultType = typeof RoundContextDefault

export const RoundContext = createContext(
  RoundContextDefault as RoundContextDefaultType
)

export default function RoundDetailsContainer(): JSX.Element {
  const [roundData, setRoundData] = useState(RoundContextDefault)
  const { id, name, location, date, players, pointSettings } = roundData
  const { roundId, leagueId } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    refreshRoundState()
  }, [])

  async function handleDeleteRound() {
    await deleteRound(roundId)
    navigate(`/league/${leagueId}/rounds`)
  }

  async function refreshRoundState() {
    const roundData = await fetchRound(roundId)
    setRoundData(roundData)
  }

  const dateFormatted = new Date(date).toLocaleDateString()
  return (
    <RoundContext.Provider
      value={{
        id,
        name,
        location,
        date: dateFormatted,
        players,
        pointSettings,
        refreshRoundState,
        handleDeleteRound,
      }}
    >
      <Link to={`/league/${leagueId}`}>League Home</Link>
      {/* TODO: add link bavk to round details */}
      <div id={styles.basicRoundInfo}>
        <h2>Round</h2>
        <p>{name}</p>
        <p>{location && location}</p>
        <p>{dateFormatted}</p>
      </div>

      <Outlet />
    </RoundContext.Provider>
  )
}
