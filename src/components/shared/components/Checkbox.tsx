import React from 'react'

interface CheckboxProps {
  checked: boolean
  label: string
  id: string
  value?: string
}

// TODO: unused and still needs work
export default function Checkbox({ checked, label, id, value }: CheckboxProps) {
  return (
    <div>
      <input type="checkbox" checked={checked} value={value} />
      <label htmlFor={id}>{label}</label>
    </div>
  )
}
