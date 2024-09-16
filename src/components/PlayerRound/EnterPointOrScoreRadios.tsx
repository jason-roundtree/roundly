import React from 'react'

import Radio from '../shared/components/Radio'
import styled from './EnterPointOrScoreRadios.module.css'

{
  /* TODO: style these large, and side-by-side on all but smallest of screens */
}
export default function EnterPointOrScoreRadios({
  showEnterPointForm,
  setShowEnterPointForm,
}) {
  return (
    <fieldset className={styled.radioContainer}>
      <legend>Enter point earned or score?</legend>
      <Radio
        id="enter-point-earned"
        value="enter-point-earned"
        name="enter-point-or-score-radios"
        label="Point Earned"
        onChange={() => setShowEnterPointForm(true)}
        checked={showEnterPointForm}
      />
      <Radio
        id="enter-hole-score"
        value="enter-hole-score"
        name="enter-point-or-score-radios"
        label="Hole Score"
        onChange={() => setShowEnterPointForm(false)}
        checked={!showEnterPointForm}
      />
    </fieldset>
  )
}
