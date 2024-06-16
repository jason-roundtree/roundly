import React from 'react'

interface EditablePointSettingListItemProps {
  name: string
  value: string
  onEdit(pointSetting): void
  onRemove(): void
  removeButtonText: string
}

export default function EditablePointSettingListItem({
  name,
  value,
  onEdit,
  onRemove,
  removeButtonText,
}: EditablePointSettingListItemProps): JSX.Element {
  return (
    <li>
      <span className="list-point-name">{name}</span>
      <span className="list-point-value">{value}</span>
      <span className="list-edit-buttons">
        <button onClick={onEdit}>Edit</button>
        <button onClick={onRemove}>
          {/* TODO: add color key or icon to differentiate one-off round point */}
          {removeButtonText}
        </button>
      </span>
    </li>
  )
}
