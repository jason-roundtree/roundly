import React from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { PointSetting } from '../../types'
interface EditablePointSettingListItemProps {
  pointSetting: PointSetting
  pointEditRoute: string
  value: string
  onRemove(): void
  removeButtonText: string
}

export default function EditablePointSettingListItem({
  pointSetting,
  pointEditRoute,
  onRemove,
  removeButtonText,
}: EditablePointSettingListItemProps): JSX.Element {
  const { leagueId, roundId } = useParams()

  return (
    <li>
      <span className="list-point-name">{pointSetting.name}</span>
      <span className="list-point-value">{pointSetting.value}</span>
      <span className="list-edit-buttons">
        <Link
          // TODO: replace name with id?
          to={pointEditRoute}
          state={{ leagueId, roundId, pointSetting }}
        >
          <button>Edit</button>
        </Link>
        <button onClick={onRemove}>
          {/* TODO: add color key or icon to differentiate one-off round point */}
          {removeButtonText}
        </button>
      </span>
    </li>
  )
}
