import { useContext, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAnglesRight } from '@fortawesome/free-solid-svg-icons'

import { RoundContext } from './RoundContainer'
import { useGetAllPlayersRoundPointsEarnedTotals } from '../shared/hooks'

import styles from './RoundHome.module.css'
import { sortArrayOfObjects } from '../shared/utils'

export default function RoundHome() {
  const { leagueId } = useParams()
  const { id: roundId, players, pointSettings } = useContext(RoundContext)

  // TODO: sort
  const [playersWithPointTotals] = useGetAllPlayersRoundPointsEarnedTotals(
    players,
    roundId
  )

  return (
    <>
      <h2 className="page-title">Round Home</h2>
      {/* <div className="centered-button">
        <Link to={`/league/${leagueId}/round/${roundId}/round-player-scoring`}>
          <button>Enter Point Earned / Score</button>
        </Link>
      </div> */}

      <h3 className={styles.editPageLinks}>
        <Link to={`/league/${leagueId}/round/${roundId}/scoring`}>
          SCORING <FontAwesomeIcon icon={faAnglesRight} />
        </Link>
      </h3>
      <ul className="summaryListContainer">
        {sortArrayOfObjects(
          playersWithPointTotals,
          'total_points',
          'DESC'
        )?.map((player) => {
          return (
            <li key={player.id}>
              <span>{player.name}</span>&nbsp;&nbsp;&nbsp;
              <span>{player.total_points}</span>
            </li>
          )
        })}
      </ul>

      <h3 className={styles.editPageLinks}>
        <Link to={`/league/${leagueId}/round/${roundId}/players`}>
          PLAYERS <FontAwesomeIcon icon={faAnglesRight} />
        </Link>
      </h3>

      <h3 className={styles.editPageLinks}>
        <Link to={`/league/${leagueId}/round/${roundId}/point-settings`}>
          POINT SETTINGS <FontAwesomeIcon icon={faAnglesRight} />
        </Link>
      </h3>
      <ul className="summaryListContainer">
        {pointSettings?.map((ps) => {
          return (
            <li key={ps.id}>
              <span>{ps.name}</span>&nbsp;&nbsp;&nbsp;
              <span>{ps.value}</span>
            </li>
          )
        })}
      </ul>
    </>
  )
}
