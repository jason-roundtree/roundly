import { Player } from '../../types'
import { ListEditProps } from '../../types'
import { PlayersListItem } from './'

export interface PlayerProps extends ListEditProps {
  players: Player[]
  twEditInputs: string
  twListItems: string
}

export default function PlayersList({
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
          <PlayersListItem
            player={player}
            className="max-w-fit rounded-lg my-1 mx-4 p-2 editable-list-item"
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
