import React from 'react'

interface SelectProps {
  // options: string[]
  options: readonly Record<string, string>[]
  id: string
  label: string
  onChange(e): void
  description?: string
  name?: string
  value: string
}

export default function Select({
  options,
  id,
  label,
  onChange,
  description,
  name,
  value,
}: SelectProps) {
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      {description && <p>{description}</p>}
      <select name={name} id={id} onChange={onChange} value={value}>
        {options.map((option) => {
          return (
            <option key={option.id} value={option.value}>
              {option.value}
            </option>
          )
        })}
      </select>
    </div>
  )
}
