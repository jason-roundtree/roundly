import React from 'react'

import styles from './Radio.module.css'

interface RadioProps {
  label: string
  checked?: boolean
  onChange: (e) => void
  value: string
  id: string
  name: string
}

export default function Radio({
  label,
  checked,
  onChange,
  value,
  id,
  name,
}: RadioProps): JSX.Element {
  return (
    <label
      htmlFor={id}
      className={`${styles.radioLabel} ${checked ? 'is-selected' : ''}`}
    >
      <input
        className={styles.radioBox}
        type="radio"
        checked={checked}
        onChange={onChange}
        value={value}
        id={id}
        name={name}
      />
      {label}
    </label>
  )
}
