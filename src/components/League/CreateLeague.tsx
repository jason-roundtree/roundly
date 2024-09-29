import { useState } from 'react'
// import { useNavigate } from 'react-router-dom'
import { BasicLeagueState } from '../../types'
import BasicInput from '../shared/components/BasicInput'

import './CreateLeague.css'
import { toast } from 'react-toastify'

export const defaultLeagueState: BasicLeagueState = {
  name: '',
  startDate: '',
  endDate: '',
}
// TODO: add Enter keypress event listeners for add player and pointType?
export default function CreateLeague() {
  const [league, setLeagueState] = useState(defaultLeagueState)
  const [showValidationError, setShowValidationError] = useState(false)

  function handleInputChange({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement>): void {
    setLeagueState({ ...league, [name]: value })
  }

  async function handleCreateLeague(e) {
    e.preventDefault()
    if (!league.name) {
      toast.error('League name is required')
      return
    }

    // TODO: validate that league name isn't already taken

    const leagueData = {
      name: league.name,
      startDate: league.startDate ? new Date(league.startDate) : new Date(),
      endDate: league.endDate ? new Date(league.endDate) : null,
    }
    console.log('create League, basic league state ', leagueData)
    try {
      const res = await fetch('http://localhost:3001/api/league', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leagueData),
      })
      const resJson = await res.json()
      console.log('resJson', resJson)
      if (res.ok) {
        setLeagueState(defaultLeagueState)
        toast.success('League has been created')
        window.location.href = `http://localhost:3000/league/${resJson.id}`
      }
    } catch (err) {
      console.log('create league error: ', err)
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

      <button onClick={handleCreateLeague}>Create League</button>
    </form>
  )
}
