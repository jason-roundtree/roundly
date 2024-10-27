import React from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { PointSetting } from '../../types'
import { quantityInputScopeManager } from '../shared/utils'
interface EditablePointSettingListItemProps {
  pointSetting: PointSetting
  pointEditRoute: string
  value: string
  onRemove(): void
  removeButtonText: string
}

// TODO: Add something for if one-off round point
export default function EditablePointSettingListItem({
  pointSetting,
  pointEditRoute,
  // TODO: remove these if still unused
  onRemove,
  removeButtonText,
}: EditablePointSettingListItemProps): JSX.Element {
  const { leagueId, roundId } = useParams()
  const { name, value, scope, maxFrequencyPerScope, isLeagueSetting } =
    pointSetting
  const scopeAndMax =
    scope === 'no_scope'
      ? 'No limit'
      : `${maxFrequencyPerScope}x max per ${scope}`

  const oneOffRoundPoint = !isLeagueSetting && 'One-off round point'

  return (
    <li>
      <span className="list-point-name">{name}</span>
      <span className="list-point-value">{value}</span>
      <span className="list-point-round-point">{oneOffRoundPoint}</span>
      <span className="list-point-scope-and-frequency">{scopeAndMax}</span>
      <span className="list-edit-buttons">
        <Link
          // TODO: replace name with id?
          to={pointEditRoute}
          state={{ leagueId, roundId, pointSetting }}
        >
          <button>Edit</button>
        </Link>
        {/* <button onClick={onRemove}> */}
        {/* TODO: add color key or icon to differentiate one-off round point */}
        {/* {removeButtonText} */}
        {/* </button> */}
      </span>
    </li>
  )
}
