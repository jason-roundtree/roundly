import { useEffect, useState } from 'react'
import { Link, useParams, useLocation } from 'react-router-dom'

import { Round } from '../../types'
import { fetchLeagueRounds } from '../../data'
import './Rounds.css'

export default function Rounds() {
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
        {rounds.map((round) => {
          const { id, name, location, date } = round
          const dateFormatted = new Date(date).toLocaleDateString()
          return (
            <li key={id}>
              <Link to={`/rounds/${id}`} state={{ ...round }}>
                <div className="round-card">
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
