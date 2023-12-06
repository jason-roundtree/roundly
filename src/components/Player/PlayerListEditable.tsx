import { Player } from '../../types'
import { ListEditProps } from '../../types'
import { PlayerListItemEditable } from '.'

export interface PlayerProps extends ListEditProps {
  players: Player[]
  onUpdatePlayer: () => void
  twEditInputs?: string
  twListItems?: string
}

export default function PlayersListEditable({
  players,
  listName,
  // deleteItemFromList,
  // updateListItem,
  onUpdatePlayer,
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
            // updateListItem={updateListItem}
            // deleteItemFromList={deleteItemFromList}
            onUpdatePlayer={onUpdatePlayer}
            listName={listName}
            twEditInputs={twEditInputs}
            twListItems={twListItems}
          />
        )
      })}
    </ul>
  )
}
