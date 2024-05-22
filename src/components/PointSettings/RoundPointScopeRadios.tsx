import React from 'react'

import Radio from '../shared/components/Radio'
import { POINT_SCOPE_DESCRIPTION } from '../../types'
import styles from './RoundPointScopeRadios.module.css'

export default function RoundPointScopeRadios({ onChange, selectedScope }) {
  return (
    <>
      <fieldset className={styles.roundPointScopeRadios}>
        <legend>Point Scope</legend>
        <p>Allows you to restrict where the point can be earned</p>
        <Radio
          id="no_scope"
          value="no_scope"
          name="roundPointScope-radios"
          label="No scope"
          onChange={onChange}
          checked={selectedScope === 'no_scope'}
        />
        <Radio
          id="hole"
          value="hole"
          name="roundPointScope-radios"
          label="Earned by hole"
          onChange={onChange}
          checked={selectedScope === 'hole'}
        />
        <Radio
          id="round"
          value="round"
          name="roundPointScope-radios"
          label="Earned by round"
          onChange={onChange}
          checked={selectedScope === 'round'}
        />
      </fieldset>
    </>
  )
}
