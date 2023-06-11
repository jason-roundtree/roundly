import { Player } from '../../types'
import { ListEditProps } from '../../types'
import { PlayerListItemEditable } from '.'

export interface PlayerProps extends ListEditProps {
  players: Player[]
  twEditInputs?: string
  twListItems?: string
}

export default function PlayersListEditable({
  players,
  listName,
  deleteItemFromList,
  updateListItem,
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
            updateListItem={updateListItem}
            deleteItemFromList={deleteItemFromList}
            listName={listName}
            twEditInputs={twEditInputs}
            twListItems={twListItems}
          />
        )
      })}
    </ul>
  )
}
