import React from 'react'

import Radio from '../shared/components/Radio'
import { POINT_SCOPE_DESCRIPTION, POINT_SCOPE_SETTINGS } from '../../types'
import styles from './RoundPointScopeRadios.module.css'

const no_scope_key = POINT_SCOPE_SETTINGS[0].key
const hole_key = POINT_SCOPE_SETTINGS[1].key
const round = POINT_SCOPE_SETTINGS[2].key

export default function RoundPointScopeRadios({
  onChange,
  selectedScope,
  name,
}) {
  return (
    <>
      <fieldset className={styles.roundPointScopeRadios}>
        <legend>Point Scope</legend>
        <p>{POINT_SCOPE_DESCRIPTION}</p>
        <Radio
          id={`${no_scope_key}-${name}`}
          value={no_scope_key}
          name={name}
          label={POINT_SCOPE_SETTINGS[0].label}
          onChange={onChange}
          checked={selectedScope === no_scope_key}
        />
        <Radio
          id={`${hole_key}-${name}`}
          value={hole_key}
          name={name}
          label={POINT_SCOPE_SETTINGS[1].label}
          onChange={onChange}
          checked={selectedScope === hole_key}
        />
        <Radio
          id={`${round}-${name}`}
          value={round}
          name={name}
          label={POINT_SCOPE_SETTINGS[2].label}
          onChange={onChange}
          checked={selectedScope === round}
        />
      </fieldset>
    </>
  )
}
