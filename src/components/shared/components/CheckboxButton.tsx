import React from 'react'

import { CheckboxProps } from './Checkbox'
import styles from './CheckboxButton.module.css'

export default function CheckboxButton({
  checked,
  label,
  id,
  value,
  onChange,
}: CheckboxProps) {
  return (
    <label
      htmlFor={id}
      className={`${styles.checkboxButton} ${checked ? 'is-selected' : ''}`}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        value={value}
        hidden
        onChange={onChange}
      />
      {label}
    </label>
  )
}
