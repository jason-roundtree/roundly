import CheckboxButton from '../shared/components/CheckboxButton'

// TODO: rename this to differentiate between PlayerSelectInput?
export default function PlayerSelectable({
  name,
  id,
  toggleSelectedPlayer,
  isSelected,
}: {
  name: string
  id: string
  toggleSelectedPlayer(): void
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
