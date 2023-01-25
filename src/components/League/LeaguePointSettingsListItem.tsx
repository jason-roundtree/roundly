import { useState } from 'react'

interface EditableLeaguePointSetting {
  pointType: string
  pointValue: string
}
const defaultState: EditableLeaguePointSetting = {
  pointType: '',
  pointValue: '',
}

export default function LeaguePointSettingsListItem({
  pointSetting,
  listName,
  updateListItem,
  deleteItemFromList,
}): JSX.Element {
  const [isBeingEdited, setIsBeingEdited] = useState(false)
  const [updatedPointSetting, setUpdatedPointSetting] = useState(defaultState)
  const { id, pointType, pointValue } = pointSetting

  function handleEditingState(pointSetting) {
    setUpdatedPointSetting(pointSetting)
    setIsBeingEdited(true)
  }

  function handleUpdatePointSetting(id, listName, updatedPointSetting) {
    updateListItem(id, listName, updatedPointSetting)
    setIsBeingEdited(false)
    setUpdatedPointSetting(defaultState)
  }

  //   TODO: move basic handleInputChange to shared hook
  function handleInputChange({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement>): void {
    setUpdatedPointSetting({ ...updatedPointSetting, [name]: value })
  }

  return (
    <li className="max-w-fit rounded-lg my-1 mx-4 p-2 editable-list-item">
      <span className="">
        {isBeingEdited ? (
          <input
            type="text"
            name="pointType"
            value={updatedPointSetting.pointType}
            onChange={handleInputChange}
          />
        ) : (
          pointType
        )}
      </span>

      <span className="">
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
          <button onClick={() => handleEditingState(pointSetting)}>Edit</button>
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
        <button onClick={() => deleteItemFromList(id, listName)}>Delete</button>
      </span>
    </li>
  )
}
