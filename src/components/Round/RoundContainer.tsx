import { useEffect, useState, createContext } from 'react'
import { Link, Outlet, useMatch, useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAnglesRight, faEdit } from '@fortawesome/free-solid-svg-icons'

import { Round, Player, PointSetting } from '../../types'
import { fetchRound } from '../../data'
import styles from './RoundContainer.module.css'
import { sortArrayOfObjects } from '../shared/utils'

const RoundContextDefault = {
  id: '',
  name: '',
  location: '',
  date: '',
  players: [] as Player[],
  pointSettings: [] as PointSetting[],
  refreshRoundState: () => {},
  leagueId: '',
}

type RoundContextDefaultType = typeof RoundContextDefault

export const RoundContext = createContext(
  RoundContextDefault as RoundContextDefaultType
)

export default function RoundContainer(): JSX.Element {
  const [roundData, setRoundData] = useState(RoundContextDefault)
  const { id, name, location, date, players, pointSettings } = roundData || {}
  const { roundId, leagueId } = useParams() as Record<string, string>
  const isRoundHomePage = useMatch('/league/:id/round/:id')
  const sortedPlayers = sortArrayOfObjects(players, 'name')

  useEffect(() => {
    refreshRoundState()
  }, [])

  async function refreshRoundState() {
    const roundData = await fetchRound(roundId)
    console.log('refreshRoundState roundData', roundData)
    setRoundData(roundData)
  }

  return (
    <RoundContext.Provider
      value={{
        id,
        name,
        location,
        date,
        players: sortedPlayers,
        pointSettings,
        refreshRoundState,
        leagueId,
      }}
    >
      <Link to={`/league/${leagueId}`} className="leagueHomeLink">
        League Home
        <FontAwesomeIcon icon={faAnglesRight} />
      </Link>

      <div id={styles.basicRoundInfo}>
        <Link to={`/league/${leagueId}/round/${roundId}`}>
          <h2 id={styles.basicRoundInfoTitle}>Round</h2>
          {date && (
            <>
              <p>
                <span>Date:</span> {date}
              </p>
              {/* <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span> */}
            </>
          )}

          {location && (
            <>
              <p>
                <span>Course:</span> {location}
              </p>
              {/* <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span> */}
            </>
          )}

          {name && (
            <>
              <p>
                <span>Round Name:</span> {name}
              </p>
            </>
          )}
        </Link>
        {isRoundHomePage && (
          <Link to="edit-round-info" state={{ name, location, date }}>
            <p className={styles.editBasicRoundInfo}>
              <FontAwesomeIcon icon={faEdit} className={styles.editIcon} />
              Edit Round
            </p>
          </Link>
        )}
      </div>

      <Outlet />
    </RoundContext.Provider>
  )
}
