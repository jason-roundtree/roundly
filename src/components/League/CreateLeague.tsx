import { useState } from 'react'
import { v4 as uuid } from 'uuid'
import { PointSetting, Player, ListObject } from '../../types'
import BasicInput from '../shared/components/BasicInput'
// import { PlayerListEditable } from '../../components/Player'
// import { LeaguePointSettingsListEditable } from '../../components/League'
import {
  updateObjectItemInList,
  removeObjectItemFromList,
} from '../shared/utils/'

import './CreateLeague.css'

interface BasicLeagueState {
  leagueName: string
  startDate: string
  endDate: string

  // pointType: string
  // pointValue: number
  // pointsSettings: PointSetting[]
  // dateInputFocused: boolean
}

const defaultState = {
  leagueName: '',
  startDate: '',
  endDate: '',
}
// TODO: add Enter keypress event listeners for add player and pointType?
export default function CreateLeague() {
  const [leagueState, setLeagueState] = useState<BasicLeagueState>({
    leagueName: '',
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
    setLeagueState({ ...leagueState, [name]: value })
  }

  async function handleSaveLeague(e) {
    e.preventDefault()
    const leagueData = {
      name: leagueState.leagueName,
      startDate: leagueState.startDate
        ? new Date(leagueState.startDate)
        : new Date(),
      endDate: leagueState.endDate ? new Date(leagueState.endDate) : null,
    }
    console.log('create League, basic league state ', leagueData)
    try {
      const response = await fetch('http://localhost:3001/api/leagues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leagueData),
      })
      const res = await response.json()
      console.log('res', res)
      setLeagueState(defaultState)
      window.location.href = `http://localhost:3000/leagues/${res.id}/players`
    } catch (err) {
      console.log('create league error: ', err)
    }
  }

  function deleteItemFromList(id, listName): void {
    console.log({ id, listName })
    const filteredState = removeObjectItemFromList(id, leagueState[listName])
    setLeagueState({
      ...leagueState,
      [listName]: filteredState,
    })
  }

  // TODO: create type for params and use here and in ListEditProps > updateListItem()
  function updateListItem(
    id: string,
    updatedItem: ListObject,
    listName: string
  ): void {
    console.log('x', { id, updatedItem, listName })
    const updatedList = updateObjectItemInList(
      id,
      leagueState[listName],
      updatedItem
    )
    setLeagueState({
      ...leagueState,
      [listName]: updatedList,
    })
  }

  // function addInputItemToList(e) {
  //   // e.preventDefault()
  //   const { inputItem, inputList } = e.target.dataset
  //   if (!leagueState[inputItem]) {
  //     setShowInputError({
  //       ...showInputError,
  //       [inputItem]: true,
  //     })
  //   } else {
  //     setShowInputError({
  //       ...showInputError,
  //       [inputItem]: false,
  //     })
  //     // TODO: make this function less generic so I don't need to do this check for pointType and do the funkyness with clearing state?
  //     const itemToAdd: {
  //       id: string
  //       [key: string]: string | number
  //     } = {
  //       id: uuid(),
  //       [inputItem]: leagueState[inputItem],
  //     }
  //     if (inputItem === 'pointType') {
  //       itemToAdd.pointValue = +leagueState.pointValue
  //     }
  //     const stateToClear = {}
  //     for (const key in itemToAdd) {
  //       if (key !== 'id') {
  //         if (typeof itemToAdd[key] === 'number') {
  //           stateToClear[key] = 0
  //         } else {
  //           stateToClear[key] = ''
  //         }
  //       }
  //     }
  //     setLeagueState({
  //       ...leagueState,
  //       [inputList]: [...leagueState[inputList], itemToAdd],
  //       // TODO: is it safe to clear input here? Safer to use previous leagueState?
  //       ...stateToClear,
  //     })
  //   }
  //   console.log('leagueState: ', leagueState)
  // }

  function selectAllInputText(e): void {
    e.target.select()
  }

  return (
    <form className="m-8 mx-auto max-w-screen-md" id="createLeague">
      <h1 className="text-3xl font-bold">Create New League</h1>
      <BasicInput
        type="text"
        name="leagueName"
        label="League Name"
        onChange={handleInputChange}
        value={leagueState.leagueName}
        twClasses={`${twEditInputs} w-72 max-w-screen-sm`}
        isRequired={true}
      />

      <BasicInput
        type="date"
        name="startDate"
        label="Start Date"
        onChange={handleInputChange}
        value={leagueState.startDate}
        twClasses={`${twEditInputs} w-64 max-w-md`}
        // isRequired={true}
      />

      <BasicInput
        type="date"
        name="endDate"
        label="End Date"
        onChange={handleInputChange}
        value={leagueState.endDate}
        twClasses={`${twEditInputs} w-64 max-w-md`}
        // isRequired={true}
      />

      <div>
        {/* <h2 className="text-xl font-bold mt-4">Players</h2>
        <BasicInput
          type="text"
          name="playerName"
          label="Name"
          onChange={handleInputChange}
          value={leagueState.playerName}
          twClasses={`${twEditInputs} w-72 max-w-screen-sm`}
          showEmptyInputError={showInputError.playerName}
        />

        <button
          data-input-item="playerName"
          data-input-list="players"
          onClick={addInputItemToList}
        >
          Add Player
        </button>

        <PlayerListEditable
          listName="players"
          players={leagueState.players}
          deleteItemFromList={deleteItemFromList}
          updateListItem={updateListItem}
          twEditInputs={twEditInputs}
          twListItems={twListItems}
        /> */}
      </div>

      <div>
        <h2 className="text-xl font-bold mt-4">Points Settings</h2>
        {/* TODO: Maybe put examples in a panel to free up some space? */}
        {/* <p>
          Add point types and assign point values (the value can be positive or
          negative). Examples of types of points you can use: Eagle, Birdie,
          Par, Bogey, Double Bogey, Mulligan, Break a Rule, Cursing, Slam Club,
          you can get creative...
        </p>

        <BasicInput
          type="text"
          label="Point Name"
          name="pointType"
          onChange={handleInputChange}
          value={leagueState.pointType}
          twClasses={`${twEditInputs} w-72 max-w-screen-sm`}
          showEmptyInputError={showInputError.pointType}
        />

        <BasicInput
          type="number"
          label="Point Value"
          name="pointValue"
          value={leagueState.pointValue}
          onChange={handleInputChange}
          twClasses={`${twEditInputs} w-24 max-w-screen-sm`}
          onFocus={selectAllInputText}
        /> */}

        {/* TODO: Setup call to post point type and then forward point id to settings page */}
        {/* TODO: Setup Combobox to allow quick selection of commonly used types? https://ui.reach.tech/combobox */}
        {/* <button
          data-input-item="pointType"
          data-input-list="pointsSettings"
          onClick={addInputItemToList}
        >
          Add Point
        </button>

        <LeaguePointSettingsListEditable
          listName="pointsSettings"
          pointsSettings={leagueState.pointsSettings}
          deleteItemFromList={deleteItemFromList}
          updateListItem={updateListItem}
          twEditInputs={twEditInputs}
          twListItems={twListItems}
          selectAllInputText={selectAllInputText}
        /> */}
      </div>

      <div className="flex">
        {/* TODO: add validation to ensure league name has been added */}
        <button className="mx-auto" onClick={handleSaveLeague}>
          Create League
        </button>
      </div>
    </form>
  )
}
