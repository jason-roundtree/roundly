import { useEffect } from 'react'

import Select from '../shared/components/Select'
import { getSelectableOptions, sortArrayOfObjects } from '../shared/utils'
import { Player } from '../../types'

// TODO: type params and make playerFromRouter optional
// interface PlayerSelectInputProps {
//     players: Player[]
//     playerFromRouter:
//     selectedPlayer:
//     setSelectedPlayer: () => void
// }

export default function PlayerSelectInput({
  players,
  playerFromRouter,
  selectedPlayer,
  setSelectedPlayer,
}) {
  useEffect(() => {
    const initialPlayerName = playerFromRouter?.playerName || players[0]?.name
    const initialPlayerId = playerFromRouter?.playerId || players[0]?.id
    setSelectedPlayer({ id: initialPlayerId, name: initialPlayerName })
  }, [players, playerFromRouter])

  return (
    <Select
      options={getSelectableOptions(sortArrayOfObjects(players, 'name'))}
      id="roundPlayerScoreSelect"
      label="Player"
      // name="roundPlayerAddScore"
      value={selectedPlayer.name}
      onChange={(e) => {
        const playerName = e.target.value
        const _selectedPlayer = players.find(
          (player) => player.name === playerName
        ) as Player
        setSelectedPlayer({ id: _selectedPlayer.id, name: playerName })
      }}
    />
  )
}
