import { useEffect, useState } from 'react'
import { Link, useParams, useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAnglesRight } from '@fortawesome/free-solid-svg-icons'

import { Round } from '../../types'
import { fetchLeagueRounds } from '../../data'
import styles from './Rounds.module.css'

export default function Rounds() {
  const [rounds, setRounds] = useState<Round[]>([])
  const { leagueId } = useParams()

  useEffect(() => {
    getLeagueRounds()
  }, [])

  async function getLeagueRounds() {
    const rounds = await fetchLeagueRounds(leagueId)
    setRounds(rounds)
  }

  return (
    <>
      <Link to={`/league/${leagueId}`} className="leagueHomeLink">
        League Home
        <FontAwesomeIcon icon={faAnglesRight} />
      </Link>

      <h2 className="page-title">Rounds</h2>
      <div className="centered-button">
        <Link to={`/league/${leagueId}/create-round`} id={styles.createRound}>
          <button>Create Round</button>
        </Link>
      </div>

      <ul id={styles.roundCards}>
        {rounds.map((round) => {
          const { id: roundId, name, location, date } = round
          return (
            <li key={roundId}>
              <Link to={`/league/${leagueId}/round/${roundId}`} state={round}>
                <div className={styles.roundCard}>
                  <p>{name}</p>
                  <p>{date}</p>
                  {location && <p>{location}</p>}
                </div>
              </Link>
            </li>
          )
        })}
      </ul>
    </>
  )
}
