import React from 'react'

export default function Input({ type, name, label, onChange, value }) {
    return (
        <>
            <label htmlFor={name}>{label}</label>
            <input
                className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-10/12 p-2.5"
                type={type}
                name={name}
                onChange={onChange}
                value={value}
            />
        </>
    )
}
