import { useState } from 'react'
import Modal from '../shared/components/Modal'
import BasicInput from '../shared/components/BasicInput'
import { PointSetting } from '../../types'
import { fetchPointSettings } from '../League/LeaguePointSettings'

// TODO: add same defaultState typing for LeaguePlayers?
interface EditableLeaguePointSetting {
  name: string
  value: string
}
const defaultState: EditableLeaguePointSetting = {
  name: '',
  value: '',
}

export default function LeaguePointSettingsListItem({
  pointSetting,
  listName,
  // updateListItem,
  deleteItemFromList,
  twEditInputs,
  twListItems,
  refreshPointSettingsState,
  selectAllInputText,
}): JSX.Element {
  const [isBeingEdited, setIsBeingEdited] = useState(false)
  const [updatedPointSetting, setUpdatedPointSetting] = useState(defaultState)
  const { id, name, value } = pointSetting

  async function updatePointSetting() {
    try {
      const res = await fetch(`http://localhost:3001/api/point-setting/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPointSetting),
      })
      // const resJson = await res.json()
      // console.log('resJson', resJson)
      const points = await fetchPointSettings()
      console.log('edited points', points)
    } catch (err) {
      console.log('update player error: ', err)
    }
  }

  function handleEditingState(pointSetting) {
    setUpdatedPointSetting(pointSetting)
    setIsBeingEdited(true)
  }

  async function handleUpdatePointSetting(): Promise<void> {
    await updatePointSetting()
    refreshPointSettingsState()
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
            value={updatedPointSetting.name}
          />

          <BasicInput
            twClasses={`${twEditInputs} w-24 max-w-screen-sm`}
            type="number"
            label="Point Value"
            name="pointValue"
            value={updatedPointSetting.value}
            onChange={handleInputChange}
            onFocus={selectAllInputText}
          />

          <button onClick={handleUpdatePointSetting}>Save</button>
        </Modal>
      )}

      {/* TODO: change to tqListItem */}
      <li className={twListItems}>
        <span>{name}</span>
        <span>{value}</span>
        <span className="list-edit-buttons">
          {/* TODO: why does modal close immediately? */}
          {/* TODO: why does modal close immediately? */}
          {/* TODO: why does modal close immediately? */}
          <button onClick={() => handleEditingState(pointSetting)}>Edit</button>
          {/* TODO: re-implement delete to match player delete */}
          {/* TODO: re-implement delete to match player delete */}
          {/* TODO: re-implement delete to match player delete */}
          <button onClick={() => deleteItemFromList(id)}>Delete</button>
        </span>
      </li>
    </>
  )
}
