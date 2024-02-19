import React from 'react'

type TextDateOrNumber = 'text' | 'date' | 'number'

// TODO: WTF am I even doing here with T extends TextDateOrNumber and why is using T for inputRef seem to be the only way TS doesn't get mad there? Look for a generic input hook/library?
interface BasicInputProps<T extends TextDateOrNumber> {
  type: T
  name: string
  label: string
  value: string | number
  twClasses?: string
  // showEmptyInputError?: boolean
  // isRequired?: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onFocus?: (e: React.ChangeEvent<HTMLInputElement>) => void
  inputRef?: T
}

export default function BasicInput({
  type,
  name,
  label,
  value,
  twClasses,
  // showEmptyInputError,
  // isRequired,
  onChange,
  onFocus,
  inputRef,
}: BasicInputProps<typeof type>): JSX.Element {
  return (
    <>
      <label htmlFor={name} className="block mt-4 font-semibold">
        {label}
      </label>
      <input
        className={`${twClasses}`}
        type={type}
        name={name}
        onChange={onChange}
        value={value}
        // required={isRequired}
        onFocus={onFocus}
        ref={inputRef}
      />
      {/* {showEmptyInputError && (
        <p className="text-red-400 ml-2">Please fill out this field</p>
      )} */}
    </>
  )
}