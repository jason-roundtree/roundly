import React, { useState } from 'react'
import { v4 as uuid } from 'uuid'
import { LeaguePointSettingsListEditable } from '../../components/League'
import {
  updateObjectItemInList,
  removeObjectItemFromList,
} from '../shared/utils'
import { ListObject, PointSetting } from '../../types'
import BasicInput from '../shared/components/BasicInput'

import points from '../../point-settings-data.json'

const defaultNewPointState = {
  // id: uuid(),
  name: '',
  value: 0,
  scope: 'hole',
  maxFrequencyPerScope: 1,
}

// TODO: move add point form to modal
// TODO: add empty field validation
// TODO: add function that selects whole number input?
// TODO: clear inputs once new point has been added

export default function LeaguePointSettings() {
  // const pointSettingsData = points as Array<PointSetting>
  // type PointSettings = typeof pointSettingsData
  // const [pointSettings, setPointSettings] =
  //   useState<PointSettings>(pointSettingsData)
  const [newPoint, setNewPoint] = useState(defaultNewPointState)

  // const [showInputError, setShowInputError] = useState({
  //   name: false,
  //   maxFrequencyPerScope: false,
  // })

  async function handleCreatePointSetting(e) {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:3001/api/point-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPoint),
      })
      const res = await response.json()
      console.log('res', res)
      setNewPoint(defaultNewPointState)
      // window.location.href = `http://localhost:3000/leagues/${res.id}/players`
    } catch (err) {
      console.log('create point setting error: ', err)
    }
  }

  function handleInputChange({
    target: { name: tName, value: tValue },
  }: React.ChangeEvent<HTMLInputElement>): void {
    setNewPoint({ ...newPoint, [tName]: tValue })
  }

  // if (!newPoint[tName]) {
  //   setShowInputError({
  //     ...showInputError,
  //     [tName]: true,
  //   })
  // } else {
  //   setShowInputError({
  //     ...showInputError,
  //     [tName]: false,
  //   })
  // if (!newPoint.name) {
  //   setShowInputError(true)
  //   return
  // }
  // setPointSettings([...pointSettings, newPoint])

  function selectAllInputText(e): void {
    e.target.select()
  }

  //   TODO: if keeping these move to a separate file
  const twEditInputs =
    'block border borderGray300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2'
  const twListItems =
    'max-w-fit rounded-lg my-1 mx-4 p-2 list-item editable-list-item'

  return (
    <form>
      <div>League Point Settings</div>

      <BasicInput
        type="text"
        label="Point Name"
        name="name"
        onChange={handleInputChange}
        value={newPoint.name}
        twClasses={`${twEditInputs} w-72 max-w-screen-sm`}
        // showEmptyInputError={showInputError.name}
      />

      <BasicInput
        type="number"
        label="Point Value"
        name="value"
        value={newPoint.value}
        onChange={handleInputChange}
        twClasses={`${twEditInputs} w-24 max-w-screen-sm`}
        onFocus={selectAllInputText}
      />

      <button
        data-input-item="pointName"
        data-input-list="pointsSettings"
        onClick={handleCreatePointSetting}
      >
        Add Point
      </button>

      {/* <LeaguePointSettingsListEditable
        listName="pointsSettings"
        pointsSettings={pointSettings}
        deleteItemFromList={handleDeleteItemFromList}
        updateListItem={handleUpdateListItem}
        twEditInputs={twEditInputs}
        twListItems={twListItems}
        // selectAllInputText={selectAllInputText}
      /> */}
    </form>
  )
}
