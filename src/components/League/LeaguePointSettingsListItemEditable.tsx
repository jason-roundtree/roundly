import { useState } from 'react'
import Modal from '../shared/components/Modal'
import BasicInput from '../shared/components/BasicInput'
import { PointSetting } from '../../types'
import { fetchPointSettings } from '../League/LeaguePointSettings'

// TODO: add same defaultState typing for LeaguePlayers?
// TODO: add other PointSetting fields from Types
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
  deletePointSetting,
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

  function handleEditingPoint(pointSetting) {
    setUpdatedPointSetting(pointSetting)
    setIsBeingEdited(true)
  }

  async function handleUpdatePointSetting(): Promise<void> {
    await updatePointSetting()
    refreshPointSettingsState()
    setIsBeingEdited(false)
    setUpdatedPointSetting(defaultState)
  }

  function handleInputChange({
    target: { name: tName, value: tValue },
  }: React.ChangeEvent<HTMLInputElement>): void {
    setUpdatedPointSetting({ ...updatedPointSetting, [tName]: tValue })
  }

  return (
    <>
      {isBeingEdited && (
        // TODO: implement shared component for edit and non-edit inputs? Also with PlayerListItem
        <Modal
          title="Edit Point Setting"
          closeModal={() => setIsBeingEdited(false)}
          deleteItemFn={() => deletePointSetting(id)}
        >
          <BasicInput
            twClasses={`${twEditInputs} w-72`}
            type="text"
            label="Point Name"
            name="name"
            onChange={handleInputChange}
            value={updatedPointSetting.name}
          />

          <BasicInput
            twClasses={`${twEditInputs} w-24 max-w-screen-sm`}
            type="number"
            label="Point Value"
            name="value"
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
          <button onClick={() => handleEditingPoint(pointSetting)}>Edit</button>
          <button onClick={() => deletePointSetting(id)}>Delete</button>
        </span>
      </li>
    </>
  )
}
