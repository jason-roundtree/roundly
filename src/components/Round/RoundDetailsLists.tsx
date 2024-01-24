import { useContext } from 'react'
import { Link, useParams } from 'react-router-dom'

import { RoundContext } from './RoundDetails'

export default function RoundDetailsLists() {
  const { leagueId } = useParams()
  const { id: roundId, players, pointSettings } = useContext(RoundContext)

  return (
    <>
      <Link
        to={`/league/${leagueId}/rounds/${roundId}/players`}
        className="text-link mt-2"
      >
        Players
      </Link>
      <ul>
        {players?.map((player) => {
          return <li key={player.id}>{player.name}</li>
        })}
      </ul>

      <Link
        to={`/league/${leagueId}/rounds/${roundId}/point-settings`}
        className="text-link mt-2"
      >
        Point Settings
      </Link>
      <ul>
        {pointSettings?.map((ps) => {
          return (
            <li key={ps.id}>
              <span>{ps.name}</span> / <span>{ps.value}</span>
            </li>
          )
        })}

        {/* TODO: */}
        <Link to={`#`} className="text-link mt-2">
          Scores
        </Link>
      </ul>
    </>
  )
}
