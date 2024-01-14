import { useEffect, useState } from 'react'
import { Link, useParams, useLocation } from 'react-router-dom'

import { Round } from '../../types'
import { fetchLeagueRounds } from '../../data'
import './RoundsList.css'

// TODO: rename to Rounds and create separate component for RoundsList
export default function RoundsList() {
  const [rounds, setRounds] = useState<Round[]>([])
  const { id: leagueId } = useParams()

  useEffect(() => {
    getLeagueRounds()
  }, [])

  async function getLeagueRounds() {
    const rounds = await fetchLeagueRounds(leagueId)
    setRounds(rounds)
  }

  return (
    <>
      <h2>Rounds</h2>
      <Link to={`/league/${leagueId}/create-round`} className="text-link mt-2">
        Create Round
      </Link>
      <ul>
        {rounds.map(({ id, name, location, date }) => {
          const dateFormatted = new Date(date).toLocaleDateString()
          return (
            <li key={id}>
              <div className="round-card">
                <p>{name}</p>
                <p>{dateFormatted.toString()}</p>
                {location && <p>{location}</p>}
              </div>
            </li>
          )
        })}
      </ul>
    </>
  )
}
