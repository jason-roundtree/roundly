import React, { useState } from 'react'
import { Round } from '../../types'
import BasicInput from '../shared/components/BasicInput'
import useHandleInputChange from '../shared/hooks/useHandleInputChange'

interface RoundState {
  name: string
  location?: string
  date: string
  players: string[]
  pointSettings: string[]
}

export default function CreateRound() {
  const [roundState, setRoundState] = useState<RoundState>({
    name: '',
    location: '',
    date: '',
    players: [],
    pointSettings: [],
  })

  //   TODO: if keeping these move to a separate file
  const twEditInputs =
    'block border borderGray300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2'
  const twListItems = 'max-w-fit rounded-lg my-1 mx-4 p-2 editable-list-item'

  function handleInputChange({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement>): void {
    setRoundState({ ...roundState, [name]: value })
  }

  return (
    <div className="m-8 mx-auto max-w-screen-md" id="createLeague">
      <h1 className="text-3xl font-bold">Create Round</h1>
      <BasicInput
        type="text"
        label="Round Name"
        name="name"
        value={roundState.name}
        onChange={handleInputChange}
        twClasses={`${twEditInputs} w-72 max-w-screen-sm`}
        isRequired={true}
      />
      <BasicInput
        type="text"
        label="Location"
        name="location"
        value={roundState.location || ''}
        onChange={handleInputChange}
        twClasses={`${twEditInputs} w-72 max-w-screen-sm`}
        isRequired={false}
      />
      <BasicInput
        type="date"
        label="Date"
        name="date"
        value={roundState.date}
        onChange={handleInputChange}
        twClasses={`${twEditInputs} w-64 max-w-md`}
        isRequired={false}
      />
    </div>
  )
}
