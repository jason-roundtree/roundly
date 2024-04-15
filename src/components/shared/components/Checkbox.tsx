import React from 'react'

export interface CheckboxProps {
  checked: boolean
  label: string
  id: string
  onChange: (e) => void
  value?: string
}

// TODO: unused (except for interface) and still needs work. Maybe just make CheckboxButton use this and style it differently
export default function Checkbox({
  checked,
  label,
  id,
  onChange,
  value,
}: CheckboxProps) {
  return (
    <div>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        value={value}
        onChange={onChange}
      />
      <label htmlFor={id}>{label}</label>
    </div>
  )
}
