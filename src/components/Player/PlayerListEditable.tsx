import { Player } from '../../types'
import { ListEditProps } from '../../types'
import { PlayerListItemEditable } from '.'

export interface PlayerProps extends ListEditProps {
  players: Player[]
  refreshPlayerState: () => void
  twEditInputs?: string
  twListItems?: string
}

export default function PlayersListEditable({
  players,
  listName,
  refreshPlayerState,
  twEditInputs,
  twListItems,
}: PlayerProps) {
  return (
    <ul className="mb-3">
      {players.map((player) => {
        return (
          <PlayerListItemEditable
            player={player}
            key={player.id}
            refreshPlayerState={refreshPlayerState}
            listName={listName}
            twEditInputs={twEditInputs}
            twListItems={twListItems}
          />
        )
      })}
    </ul>
  )
}
