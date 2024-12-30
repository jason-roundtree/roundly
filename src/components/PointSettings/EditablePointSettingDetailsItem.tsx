import React from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { PointSetting } from '../../types'
import { quantityInputScopeManager } from '../shared/utils'

interface EditablePointSettingItemProps {
  pointSetting: PointSetting
  pointEditRoute: string
  value: string
  onRemove(): void
  removeButtonText: string
}

// TODO: Add something for if one-off round point
export default function EditablePointSettingDetailsItem({
  pointSetting,
  pointEditRoute,
  // TODO: remove these if still unused
  onRemove,
  removeButtonText,
}: EditablePointSettingItemProps): JSX.Element {
  const { leagueId, roundId } = useParams()
  const { name, value, scope, maxFrequencyPerScope, isLeagueSetting } =
    pointSetting
  const scopeAndMax =
    scope === 'no_scope'
      ? 'No limit'
      : `${maxFrequencyPerScope}x max per ${scope}`

  const oneOffRoundPoint = !isLeagueSetting && 'One-off round point'

  return (
    <details>
      <summary>
        <span className="list-point-name">{name}</span>
        <span className="list-point-value">{value}</span>
        <span className="list-edit-buttons">
          <Link
            // TODO: replace name with id?
            to={pointEditRoute}
            state={{ leagueId, roundId, pointSetting }}
          >
            <button>Edit</button>
          </Link>
          <button onClick={onRemove}>{removeButtonText}</button>
        </span>
      </summary>
      <div className="details-body">
        <p className="list-point-round-point">{oneOffRoundPoint}</p>
        <p className="list-point-scope-and-frequency">{scopeAndMax}</p>
      </div>
    </details>
  )
}
