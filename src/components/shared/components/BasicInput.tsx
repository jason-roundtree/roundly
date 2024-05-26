import { isDisabled } from '@testing-library/user-event/dist/utils'
import React from 'react'

type TextDateOrNumber = 'text' | 'date' | 'number'

// TODO: WTF am I even doing here with T extends TextDateOrNumber and why does using T for inputRef seem to be the only way TS doesn't get mad there? Look for a generic input hook/library?
interface BasicInputProps<T extends TextDateOrNumber> {
  type: T
  name: string
  label: string
  value: string | number
  min?: string
  max?: string
  // showEmptyInputError?: boolean
  // isRequired?: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onFocus?: (e: React.ChangeEvent<HTMLInputElement>) => void
  inputRef?: T
  // className?: string
  disabled?: boolean
}

export default function BasicInput({
  type,
  name,
  label,
  value,
  // showEmptyInputError,
  // isRequired,
  onChange,
  onFocus,
  inputRef,
  min,
  max,
  disabled,
}: BasicInputProps<typeof type>): JSX.Element {
  return (
    <>
      <label htmlFor={name} className={disabled ? 'isDisabled' : ''}>
        {label}
      </label>
      <input
        type={type}
        name={name}
        onChange={onChange}
        value={value}
        min={min}
        // required={isRequired}
        onFocus={onFocus}
        ref={inputRef}
        disabled={disabled}
      />
    </>
  )
}
