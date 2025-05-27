import React from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAnglesRight, faSnowflake } from '@fortawesome/free-solid-svg-icons'

// import { quantityInputScopeManager } from '../shared/utils'
import { getPointScopeLabelFromKey, PointSetting } from '../../types'

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
  const {
    name,
    value,
    scope,
    // maxFrequencyPerScope,
    isLeagueSetting,
  } = pointSetting
  // const scopeAndMax =
  //   scope === 'no_scope'
  //     ? 'No limit'
  //     : `${maxFrequencyPerScope}x max per ${scope}`

  // const oneOffRoundPoint = !isLeagueSetting && 'One-off round point'

  return (
    <div className="editable-list-item point-setting-item">
      <span className="list-point-name">{name}</span>
      <span className="list-point-value">{value}</span>
      <span className="list-point-scope">
        {getPointScopeLabelFromKey(scope)}
      </span>
      <span className="list-point-round-point">
        {!isLeagueSetting && (
          <FontAwesomeIcon icon={faSnowflake} style={{ fontSize: '0.8rem' }} />
        )}
      </span>
      <span className="list-edit-buttons">
        <Link
          to={pointEditRoute}
          // replace
          state={{ leagueId, roundId, pointSetting }}
        >
          <button>Edit</button>
        </Link>
        <button onClick={onRemove}>{removeButtonText}</button>
      </span>
    </div>
  )
}
