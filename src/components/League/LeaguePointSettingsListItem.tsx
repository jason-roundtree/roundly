import { useState } from 'react'
import Modal from '../shared/Modal'
import BasicInput from '../shared/BasicInput'

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
  selectAllInputText,
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
        // TODO: implement shared component for edit and non-edit inputs? Also with PlayerListItem
        <Modal
          title="Edit Point Setting"
          closeModal={() => setIsBeingEdited(false)}
          deleteItemFn={() => deleteItemFromList(id, listName)}
        >
          <BasicInput
            twClasses={`${twEditInputs} w-72`}
            type="text"
            label="Point Type"
            name="pointType"
            onChange={handleInputChange}
            value={updatedPointSetting.pointType}
          />

          <BasicInput
            twClasses={`${twEditInputs} w-72`}
            type="number"
            label="Point Value"
            name="pointValue"
            value={updatedPointSetting.pointValue}
            onChange={handleInputChange}
            onFocus={selectAllInputText}
          />

          <button
            onClick={() =>
              handleUpdatePointSetting(id, listName, updatedPointSetting)
            }
          >
            Save
          </button>
        </Modal>
      )}

      {/* TODO: change to tqListItem */}
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
