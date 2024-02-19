import { useEffect, useState } from 'react'
import { Link, useParams, useLocation } from 'react-router-dom'

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
      <Link to={`/league/${leagueId}`}>League Home</Link>

      <h2>Rounds</h2>
      <Link to={`/league/${leagueId}/create-round`} className="text-link mt-2">
        Create Round
      </Link>
      <ul>
        {rounds.map((round) => {
          const { id: roundId, name, location, date } = round
          const dateFormatted = new Date(date).toLocaleDateString()
          return (
            <li key={roundId}>
              <Link to={`/league/${leagueId}/rounds/${roundId}`} state={round}>
                <div className={styles['round-card']}>
                  <p>{name}</p>
                  <p>{dateFormatted.toString()}</p>
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
