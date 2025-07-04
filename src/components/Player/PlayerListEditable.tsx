import { Player } from '../../types'
import { ListEditProps } from '../../types'
import { PlayerListItemEditable } from './'

export interface PlayerProps extends ListEditProps {
  players: Player[]
  refreshLeaguePlayersState?(): void
}

export default function PlayersListEditable({
  players,
  refreshLeaguePlayersState,
}: PlayerProps) {
  return (
    <ul className="editable-list--players">
      {players.map((player) => {
        return (
          <PlayerListItemEditable
            player={player}
            key={player.id}
            refreshLeaguePlayersState={refreshLeaguePlayersState}
          />
        )
      })}
    </ul>
  )
}
