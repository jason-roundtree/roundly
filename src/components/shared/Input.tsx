import React from 'react'

type TextDateOrNumber = 'text' | 'date' | 'number'

interface BasicInput<T extends TextDateOrNumber> {
    type: T
    // type: string
    name: string
    label: string
    value: string | number
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    maxWidth?: string
    showEmptyInputError?: boolean
    isRequired?: boolean
}

export default function Input({
    type,
    name,
    label,
    onChange,
    value,
    maxWidth = '',
    showEmptyInputError,
    isRequired,
}: BasicInput<typeof type>): JSX.Element {
    console.log('showEmptyInputError', showEmptyInputError)
    return (
        <>
            <label htmlFor={name}>{label}</label>
            <input
                className={`border borderGray300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${maxWidth}`}
                type={type}
                name={name}
                onChange={onChange}
                value={value}
                required={isRequired}
            />
            {showEmptyInputError && <p>Please fill out this field</p>}
        </>
    )
}
