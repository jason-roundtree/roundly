import React from 'react'

import Radio from '../shared/components/Radio'
import {
  getPointScopeLabelFromKey,
  POINT_SCOPE_DESCRIPTION,
  POINT_SCOPE_SETTINGS,
} from '../../types'
import styles from './PointScopeRadios.module.css'

export const no_scope_key = POINT_SCOPE_SETTINGS[0].key
export const hole_key = POINT_SCOPE_SETTINGS[1].key
export const round_key = POINT_SCOPE_SETTINGS[2].key

export default function PointScopeRadios({ onChange, selectedScope, name }) {
  return (
    <>
      <fieldset className={styles.pointScopeRadios}>
        <legend>Point Scope</legend>
        <p className="ital">{POINT_SCOPE_DESCRIPTION}</p>
        <Radio
          id={`${hole_key}-${name}`}
          value={hole_key}
          name={name}
          label={getPointScopeLabelFromKey(hole_key)}
          onChange={onChange}
          checked={selectedScope === hole_key}
        />
        <Radio
          id={`${round_key}-${name}`}
          value={round_key}
          name={name}
          label={getPointScopeLabelFromKey(round_key)}
          onChange={onChange}
          checked={selectedScope === round_key}
        />
        <Radio
          id={`${no_scope_key}-${name}`}
          value={no_scope_key}
          name={name}
          label={getPointScopeLabelFromKey(no_scope_key)}
          onChange={onChange}
          checked={selectedScope === no_scope_key}
        />
      </fieldset>
    </>
  )
}
