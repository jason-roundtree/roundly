import React from 'react'

type TextDateOrNumber = 'text' | 'date' | 'number'

// TODO: WTF am I even doing here with T extends TextDateOrNumber?
interface BasicInputProps<T extends TextDateOrNumber> {
  type: T
  name: string
  label: string
  value: string | number
  min?: string
  max?: string | null
  // isRequired?: boolean
  onChange(e: React.ChangeEvent<HTMLInputElement>): void
  onFocus?(e: React.ChangeEvent<HTMLInputElement>): void
  onBlur?(e: React.ChangeEvent<HTMLInputElement>): void
  // className?: string
  disabled?: boolean
  placeholder?: string
}

const BasicInput = React.forwardRef<HTMLInputElement, BasicInputProps<any>>(
  function BasicInput(
    {
      type,
      name,
      label,
      value,
      // isRequired,
      onChange,
      onFocus,
      onBlur,
      min,
      max,
      disabled,
      placeholder,
    },
    ref
  ): JSX.Element {
    return (
      <>
        <label htmlFor={name}>{label}</label>
        <input
          type={type}
          name={name}
          onChange={onChange}
          value={value}
          min={min}
          max={max ? max : undefined}
          // required={isRequired}
          onFocus={onFocus}
          onBlur={onBlur}
          ref={ref}
          disabled={disabled}
          placeholder={placeholder}
        />
      </>
    )
  }
)
BasicInput.displayName = 'BasicInput'

export default BasicInput
