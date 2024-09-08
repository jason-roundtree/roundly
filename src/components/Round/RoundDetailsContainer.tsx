import { useEffect, useState, createContext } from 'react'
import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAnglesRight } from '@fortawesome/free-solid-svg-icons'

import { Round, Player, PointSetting } from '../../types'
import { fetchRound, deleteRound } from '../../data'
import styles from './RoundDetailsContainer.module.css'
import { sortArrayOfObjects } from '../shared/utils'

const RoundContextDefault = {
  id: '',
  name: '',
  location: '',
  date: '',
  players: [] as Player[],
  pointSettings: [] as PointSetting[],
  refreshRoundState: () => {},
  handleDeleteRound: () => {},
  leagueId: '',
}

type RoundContextDefaultType = typeof RoundContextDefault

export const RoundContext = createContext(
  RoundContextDefault as RoundContextDefaultType
)

export default function RoundDetailsContainer(): JSX.Element {
  const [roundData, setRoundData] = useState(RoundContextDefault)
  const { id, name, location, date, players, pointSettings } = roundData || {}
  const { roundId, leagueId } = useParams() as Record<string, string>
  const navigate = useNavigate()

  const sortedPlayers = sortArrayOfObjects(players, 'name')
  const dateFormatted = new Date(date).toLocaleDateString()

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

  return (
    <RoundContext.Provider
      value={{
        id,
        name,
        location,
        date: dateFormatted,
        players: sortedPlayers,
        pointSettings,
        refreshRoundState,
        handleDeleteRound,
        leagueId,
      }}
    >
      <Link to={`/league/${leagueId}`} className="leagueHomeLink">
        League Home
        <FontAwesomeIcon icon={faAnglesRight} />
      </Link>
      {/* TODO: add link bavk to round details */}
      <Link to={`/league/${leagueId}/rounds/${roundId}`} className="">
        <div id={styles.basicRoundInfo}>
          <p id={styles.basicRoundInfoTitle}>Round -&nbsp;</p>
          {name && (
            <>
              <p>{name}</p>
              <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
            </>
          )}
          {location && (
            <>
              <p>{location}</p>
              <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
            </>
          )}
          <p>{dateFormatted}</p>
        </div>
      </Link>

      <Outlet />
    </RoundContext.Provider>
  )
}
