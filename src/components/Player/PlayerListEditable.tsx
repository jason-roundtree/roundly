import { Player } from '../../types'
import { ListEditProps } from '../../types'
import { PlayerListItemEditable } from './'

export interface PlayerProps extends ListEditProps {
  players: Player[]
  refreshPlayerState?: () => void
}

export default function PlayersListEditable({
  players,
  refreshPlayerState,
}: PlayerProps) {
  return (
    <ul className="mb-3 mt-5">
      {players.map((player) => {
        return (
          <PlayerListItemEditable
            player={player}
            key={player.id}
            refreshPlayerState={refreshPlayerState}
          />
        )
      })}
    </ul>
  )
}
