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

const defaultNewPointState: PointSetting = {
  id: uuid(),
  pointType: '',
  pointValue: 0,
  scope: 'hole',
  maxFrequencyPerScope: 1,
}

// TODO: move add point form to modal
// TODO: add empty field validation
// TODO: add function that selects whole number input?
// TODO: clear inputs once new point has been added

export default function LeaguePointSettings() {
  const pointSettingsData = points as Array<PointSetting>
  type PointSettings = typeof pointSettingsData
  const [pointSettings, setPointSettings] =
    useState<PointSettings>(pointSettingsData)

  const [newPoint, setNewPoint] = useState(defaultNewPointState)

  function handleDeleteItemFromList(id: string) {
    const updatedList = removeObjectItemFromList(id, pointSettings)
    setPointSettings(updatedList as PointSettings)
  }

  function handleUpdateListItem(id: string, updatedItem: ListObject) {
    const updatedList = updateObjectItemInList(id, pointSettings, updatedItem)
    setPointSettings(updatedList as PointSettings)
  }

  function handleInputChange({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement>): void {
    setNewPoint({ ...newPoint, [name]: value })
  }

  function addInputItemToList() {
    setPointSettings([...pointSettings, newPoint])
  }

  //   TODO: if keeping these move to a separate file
  const twEditInputs =
    'block border borderGray300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2'
  const twListItems =
    'max-w-fit rounded-lg my-1 mx-4 p-2 list-item editable-list-item'

  return (
    <>
      <div>League Point Settings</div>

      <BasicInput
        type="text"
        label="Point Name"
        name="pointType"
        onChange={handleInputChange}
        value={newPoint.pointType}
        twClasses={`${twEditInputs} w-72 max-w-screen-sm`}
        // showEmptyInputError={showInputError.pointType}
      />

      <BasicInput
        type="number"
        label="Point Value"
        name="pointValue"
        value={newPoint.pointValue}
        onChange={handleInputChange}
        twClasses={`${twEditInputs} w-24 max-w-screen-sm`}
        // onFocus={selectAllInputText}
      />

      <button
        data-input-item="pointType"
        data-input-list="pointsSettings"
        onClick={addInputItemToList}
      >
        Add Point
      </button>

      <LeaguePointSettingsListEditable
        listName="pointsSettings"
        pointsSettings={pointSettings}
        deleteItemFromList={handleDeleteItemFromList}
        updateListItem={handleUpdateListItem}
        twEditInputs={twEditInputs}
        twListItems={twListItems}
        // selectAllInputText={selectAllInputText}
      />
    </>
  )
}
