import { Player } from '../../types'
import { ListEditProps } from '../../types'
import { PlayerListItemEditable } from './'

export interface PlayerProps extends ListEditProps {
  players: Player[]
  refreshPlayerState: () => void
  twEditInputs?: string
  twListItems?: string
}

export default function PlayersListEditable({
  players,
  refreshPlayerState,
  twEditInputs,
  twListItems,
}: PlayerProps) {
  return (
    <ul className="mb-3 mt-5">
      {players.map((player) => {
        return (
          <PlayerListItemEditable
            player={player}
            key={player.id}
            refreshPlayerState={refreshPlayerState}
            twEditInputs={twEditInputs}
            twListItems={twListItems}
          />
        )
      })}
    </ul>
  )
}
