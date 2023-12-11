import { useState } from 'react'
import { BasicLeagueState, PointSetting, Player, ListObject } from '../../types'
import BasicInput from '../shared/components/BasicInput'

import './CreateLeague.css'

export const defaultLeagueState = {
  name: '',
  startDate: '',
  endDate: '',
}
// TODO: add Enter keypress event listeners for add player and pointType?
export default function CreateLeague() {
  const [league, setLeagueState] = useState<BasicLeagueState>({
    name: '',
    startDate: '',
    endDate: '',

    // pointType: '',
    // pointValue: 0,
    // pointsSettings: [],
    // dateInputFocused: false,
  })
  // const [showInputError, setShowInputError] = useState<PreSubmitValidation>({
  //   pointType: false,
  //   playerName: false,
  // })

  //   TODO: if keeping these move to a separate file
  const twEditInputs =
    'block border borderGray300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2'
  const twListItems =
    'max-w-fit rounded-lg my-1 mx-4 p-2 list-item editable-list-item'

  function handleInputChange({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement>): void {
    console.log('asdasdas')
    setLeagueState({ ...league, [name]: value })
  }

  async function handleCreateLeague(e) {
    e.preventDefault()
    const leagueData = {
      name: league.name,
      startDate: league.startDate ? new Date(league.startDate) : new Date(),
      endDate: league.endDate ? new Date(league.endDate) : null,
    }
    console.log('create League, basic league state ', leagueData)
    try {
      const response = await fetch('http://localhost:3001/api/league', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leagueData),
      })
      const res = await response.json()
      console.log('res', res)
      setLeagueState(defaultLeagueState)
      window.location.href = `http://localhost:3000/league/${res.id}`
    } catch (err) {
      console.log('create league error: ', err)
    }
  }

  return (
    <form id="createLeague">
      <h1 className="text-3xl font-bold">Create New League</h1>
      <BasicInput
        type="text"
        name="name"
        label="League Name"
        onChange={handleInputChange}
        value={league.name}
        twClasses={`${twEditInputs} w-72 max-w-screen-sm`}
      />

      <BasicInput
        type="date"
        name="startDate"
        label="Start Date"
        onChange={handleInputChange}
        value={league.startDate}
        twClasses={`${twEditInputs} w-64 max-w-md`}
      />

      <BasicInput
        type="date"
        name="endDate"
        label="End Date"
        onChange={handleInputChange}
        value={league.endDate}
        twClasses={`${twEditInputs} w-64 max-w-md`}
      />

      <div className="flex">
        {/* TODO: add validation to ensure league name has been added */}
        <button className="mx-auto" onClick={handleCreateLeague}>
          Create League
        </button>
      </div>
    </form>
  )
}
