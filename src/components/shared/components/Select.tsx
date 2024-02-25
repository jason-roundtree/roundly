import React from 'react'

interface SelectProps {
  options: string[]
  id: string
  label: string
  onChange: (e) => void
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
      <label htmlFor={id} className="block mt-4 font-semibold">
        {label}
      </label>
      <p>{description}</p>
      <select name={name} id={id} onChange={onChange} value={value}>
        {options.map((option) => {
          return (
            <option key={option} value={option}>
              {option}
            </option>
          )
        })}
      </select>
    </div>
  )
}
