import React from 'react'
import EditableListItem from '../../components/shared/EditableListItem'

// interface PointSettingsProps {
//   players: PointType[]
// }

export default function LeaguePointsSettingsList({ pointSettings, listName, deleteItemFromList }) {
  console.log('pointSettings', pointSettings)
  return (
    <ul className="mb-3">
      {pointSettings.map(({ id, pointType }) => {
        return (
          <EditableListItem
            id={id}
            text={pointType}
            deleteItemFromList={deleteItemFromList}
            listName={listName}
          />
        )
      })}
    </ul>
  )
}

