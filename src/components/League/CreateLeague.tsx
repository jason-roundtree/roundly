import { useState } from 'react'
// import { useNavigate } from 'react-router-dom'
import { BasicLeagueState } from '../../types'
import BasicInput from '../shared/components/BasicInput'

import './CreateLeague.css'
import SimpleInputValidationError from '../shared/components/SimpleInputValidationError'
import { validateSimpleInput } from '../shared/utils'

export const defaultLeagueState: BasicLeagueState = {
  name: '',
  startDate: '',
  endDate: '',
}
// TODO: add Enter keypress event listeners for add player and pointType?
export default function CreateLeague() {
  const [league, setLeagueState] = useState(defaultLeagueState)
  // TODO: should validation state be moved to validateSimpleInput and turned into custom hook?
  const [inputValidationError, setInputValidationError] = useState<
    string | null
  >(null)

  function handleInputChange({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement>): void {
    setLeagueState({ ...league, [name]: value })
  }

  async function handleCreateLeague(e) {
    e.preventDefault()
    if (
      !validateSimpleInput(league.name, 'League Name', setInputValidationError)
    ) {
      return
    } else {
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
  }

  return (
    <form id="createLeague">
      <h1 className="">Create New League</h1>
      <BasicInput
        type="text"
        name="name"
        label="League Name"
        onChange={handleInputChange}
        value={league.name}
      />

      <BasicInput
        type="date"
        name="startDate"
        label="Start Date"
        onChange={handleInputChange}
        value={league.startDate}
      />

      <BasicInput
        type="date"
        name="endDate"
        label="End Date"
        onChange={handleInputChange}
        value={league.endDate}
      />

      <div className="form-submit">
        {/* TODO: add validation to ensure league name has been added */}
        <button className="" onClick={handleCreateLeague}>
          Create League
        </button>
        <SimpleInputValidationError
          errorField={inputValidationError}
          errorMsgCode="MISSNG_VALUE"
        />
      </div>
    </form>
  )
}
