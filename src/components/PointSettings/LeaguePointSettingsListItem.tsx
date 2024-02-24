import { useState } from 'react'

import Modal from '../shared/components/Modal'
import BasicInput from '../shared/components/BasicInput'
import { PointSetting } from '../../types'
import { fetchLeaguePointSettings, updatePointSetting } from '../../data'

// TODO: add same defaultState typing for LeaguePlayers?
// TODO: add other PointSetting fields from Types
interface EditablePointSetting {
  name: string
  value: string
}
const defaultState: EditablePointSetting = {
  name: '',
  value: '',
}

export default function LeaguePointSettingsListItem({
  pointSetting,
  deleteLeaguePointSetting,
  twEditInputs,
  twListItems,
  refreshState,
  selectAllInputText,
}): JSX.Element {
  const [isBeingEdited, setIsBeingEdited] = useState(false)
  const [updatedPointSetting, setUpdatedPointSetting] = useState(defaultState)
  const { id, name, value } = pointSetting

  function handleEditingPoint(pointSetting) {
    setUpdatedPointSetting(pointSetting)
    setIsBeingEdited(true)
  }

  async function handleUpdatePointSetting(): Promise<void> {
    await updatePointSetting(id, updatedPointSetting)
    refreshState()
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
          <button onClick={() => deleteLeaguePointSetting(id)}>
            Remove from League
          </button>
        </Modal>
      )}

      {/* TODO: change to tqListItem */}
      <li className={twListItems}>
        <span>{name}</span>
        <span>{value}</span>
        <span className="list-edit-buttons">
          <button onClick={() => handleEditingPoint(pointSetting)}>Edit</button>
          <button onClick={() => deleteLeaguePointSetting(id)}>
            Remove from League
          </button>
        </span>
      </li>
    </>
  )
}
