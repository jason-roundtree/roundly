import { useState } from 'react'
import Modal from '../shared/Modal'

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
  twEditInputs,
  twListItems,
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
    <>
      {isBeingEdited && (
        <Modal title="Edit Point Setting">
          <div>
            <label htmlFor="pointType">Point Type</label>
            <input
              className={`${twEditInputs} w-72`}
              type="text"
              name="pointType"
              value={updatedPointSetting.pointType}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label htmlFor="pointType">Point Value</label>
            <input
              className={`${twEditInputs} w-24`}
              type="number"
              name="pointValue"
              value={updatedPointSetting.pointValue}
              onChange={handleInputChange}
            />
          </div>

          <button
            onClick={() =>
              handleUpdatePointSetting(id, listName, updatedPointSetting)
            }
          >
            Save
          </button>
        </Modal>
      )}
      <li className={twListItems}>
        <span>{pointType}</span>
        <span>{pointValue}</span>
        <span className="list-edit-buttons">
          <button onClick={() => handleEditingState(pointSetting)}>Edit</button>
          <button onClick={() => deleteItemFromList(id, listName)}>
            Delete
          </button>
        </span>
      </li>
    </>
  )
}
