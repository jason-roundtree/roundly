import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'

import { PlayerListEditable, AddPlayer } from '../Player'
import { Player } from '../../types'
import { fetchLeaguePlayers } from '../../data'

export default function LeaguePlayers(): JSX.Element {
  const [players, setPlayers] = useState<Player[]>([])

  const { leagueId } = useParams()

  useEffect(() => {
    refreshPlayersState()
  }, [])

  async function refreshPlayersState(): Promise<void> {
    const players = await fetchLeaguePlayers(leagueId)
    setPlayers(players)
  }

  //   TODO: if keeping these move to a separate file
  const twEditInputs =
    'block border borderGray300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2'
  const twListItems =
    'max-w-fit rounded-lg my-1 mx-4 p-2 list-item editable-list-item'

  return (
    <>
      <Link to={`/league/${leagueId}`}>League Home</Link>

      <h2>League Players</h2>

      <AddPlayer refreshState={refreshPlayersState} />

      <PlayerListEditable
        listName="players"
        players={players}
        twEditInputs={twEditInputs}
        twListItems={twListItems}
        refreshPlayerState={refreshPlayersState}
      />
    </>
  )
}
