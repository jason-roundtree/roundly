import { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'

import { Round, Player } from '../../types'
import { fetchRound } from '../../data'

export default function RoundSummary(): JSX.Element {
  const [players, setPlayers] = useState<Player[]>([])
  const { state } = useLocation()
  const { id: roundId } = useParams()

  useEffect(() => {
    getRoundData()
  }, [])

  async function getRoundData() {
    const roundData = await fetchRound(roundId)
    console.log('XXXX roundData', roundData)
    const { players } = roundData
    setPlayers(players)
  }

  const dateFormatted = new Date(state.date).toLocaleDateString()
  return (
    <>
      <h2>Round</h2>
      <h3>{state.name}</h3>
      <h3>{state.location && state.location}</h3>
      <h3>{dateFormatted}</h3>
      <ul>
        {players.map(({ id, name }) => {
          return <li key={id}>{name}</li>
        })}
      </ul>
    </>
  )
}
