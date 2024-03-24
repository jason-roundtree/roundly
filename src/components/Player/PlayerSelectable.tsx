import CheckboxButton from '../shared/components/CheckboxButton'

export default function PlayerSelectable({
  name,
  id,
  toggleSelectedPlayer,
  isSelected,
}: {
  name: string
  id: string
  twListItems: string
  toggleSelectedPlayer: () => void
  isSelected: boolean
}) {
  return (
    <CheckboxButton
      checked={isSelected}
      label={name}
      id={id}
      onChange={toggleSelectedPlayer}
    />
  )
}
