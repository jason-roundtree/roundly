import React from 'react'

type TextDateOrNumber = 'text' | 'date' | 'number'

interface BasicInputProps<T extends TextDateOrNumber> {
  type: T
  // type: string
  name: string
  label: string
  value: string | number
  twClasses?: string
  showEmptyInputError?: boolean
  isRequired?: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onFocus?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function BasicInput({
  type,
  name,
  label,
  onChange,
  value,
  twClasses,
  showEmptyInputError,
  onFocus,
  isRequired,
}: BasicInputProps<typeof type>): JSX.Element {
  return (
    <>
      <label htmlFor={name} className="block mt-2 font-semibold">
        {label}
      </label>
      <input
        className={`border borderGray300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 ${twClasses}`}
        type={type}
        name={name}
        onChange={onChange}
        value={value}
        required={isRequired}
        onFocus={onFocus}
      />
      {showEmptyInputError && (
        <p className="text-red-400 ml-2">Please fill out this field</p>
      )}
    </>
  )
}
