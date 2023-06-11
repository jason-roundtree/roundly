import React, { useState } from 'react'
import { LeaguePointSettingsListEditable } from '../../components/League'
import updateObjectItemInList from '../shared/utils/updateObjectItemInList'
import removeObjectItemFromList from '../shared/utils/removeObjectItemFromList'
import { ListObject } from '../../types'
const points = require('../../point-settings-data.json')

export default function LeaguePointSettings() {
  const [pointSettings, setPointSettings] = useState(points)

  function handleDeleteItemFromList(id: string) {
    const updatedList = removeObjectItemFromList(id, pointSettings)
    setPointSettings(updatedList)
  }

  function handleUpdateListItem(id: string, updatedItem: ListObject) {
    console.log('handleUpdateListItem: ', { id, updatedItem })
    const updatedList = updateObjectItemInList(id, pointSettings, updatedItem)
    setPointSettings(updatedList)
  }

  //   TODO: if keeping these move to a separate file
  const twEditInputs =
    'block border borderGray300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2'
  const twListItems =
    'max-w-fit rounded-lg my-1 mx-4 p-2 list-item editable-list-item'

  return (
    <>
      <div>League Point Settings</div>

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
