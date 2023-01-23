import { useState } from 'react'
import { PointSetting } from '../../types'

interface PointSettingsProps {
  pointsSettings: PointSetting[]
  deleteItemFromList: (id, listName) => void
  updateListItem: (id, listName, updatedItem) => void
  listName: string
}

interface EditableLeaguePointSetting {
  pointType: string
  pointValue: string
}

const defaultState: EditableLeaguePointSetting = {
  pointType: '',
  pointValue: '',
}

export default function LeaguePointsSettingsList({
  pointsSettings,
  listName,
  deleteItemFromList,
  updateListItem,
}: PointSettingsProps): JSX.Element {
  const [isBeingEdited, setIsBeingEdited] = useState(false)
  const [updatedPointSetting, setUpdatedPointSetting] = useState(defaultState)

  function handleInputChange({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement>): void {
    setUpdatedPointSetting({ ...updatedPointSetting, [name]: value })
  }

  function handleEditingState(pointSetting) {
    setUpdatedPointSetting(pointSetting)
    setIsBeingEdited(true)
  }

  function handleUpdatePointSetting(id, listName, updatedPointSetting) {
    updateListItem(id, listName, updatedPointSetting)
    setIsBeingEdited(false)
    setUpdatedPointSetting(defaultState)
  }

  return (
    <ul className="mb-3">
      {pointsSettings.map((pointSetting) => {
        const { id, pointType, pointValue } = pointSetting
        return (
          <li id={id} key={id}>
            <span className="editableListText">{pointType}</span>
            <span className="editableListPointValue">
              {isBeingEdited ? (
                <input
                  type="number"
                  name="pointValue"
                  value={updatedPointSetting.pointValue}
                  onChange={handleInputChange}
                />
              ) : (
                pointValue
              )}
            </span>
            <span>
              {!isBeingEdited && (
                <button onClick={() => handleEditingState(pointSetting)}>
                  Edit
                </button>
              )}
              {isBeingEdited && (
                <button
                  onClick={() =>
                    handleUpdatePointSetting(id, listName, updatedPointSetting)
                  }
                >
                  Save
                </button>
              )}
              <button onClick={() => deleteItemFromList(id, listName)}>
                Delete
              </button>
            </span>
          </li>
        )
      })}
    </ul>
  )
}
