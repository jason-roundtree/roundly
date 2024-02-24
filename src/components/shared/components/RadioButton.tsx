import React from 'react'

interface RadioButtonProps {
  label: string
  checked?: boolean
  onChange: (e) => void
  value: string
  id: string
  name: string
}

export default function RadioButton({
  label,
  checked,
  onChange,
  value,
  id,
  name,
}: RadioButtonProps): JSX.Element {
  return (
    <label htmlFor={id}>
      <input
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
