import { useState } from 'react'

import Modal from '../shared/components/Modal'
import BasicInput from '../shared/components/BasicInput'
import { PointScopes, PointSetting, scopeOptionValues } from '../../types'
import { fetchLeaguePointSettings, updatePointSetting } from '../../data'
import Select from '../shared/components/Select'
import DeleteConfirmationModal from '../shared/components/DeleteConfirmationModal'

// TODO: add same defaultState typing for LeaguePlayers?
// TODO: add other PointSetting fields from Types
interface EditablePointSetting {
  name: string
  value: string
  scope: string | null
}

const defaultState: EditablePointSetting = {
  name: '',
  value: '',
  scope: null,
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
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [updatedPointSetting, setUpdatedPointSetting] = useState(defaultState)
  const { id, name, value, scope } = pointSetting

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

  function handleSelectInputChange(e) {
    const selectedOption = e.target.value as PointScopes
    if (selectedOption !== '') {
      setUpdatedPointSetting({ ...updatedPointSetting, scope: selectedOption })
    }
  }

  function toggleShowDeleteConfirmation() {
    setShowDeleteConfirmation(!showDeleteConfirmation)
  }

  return (
    <>
      {isBeingEdited && (
        // TODO: move edit point and player modals to non-modal components
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

          <Select
            options={[...scopeOptionValues]}
            id="point-scope"
            label="Point Scope"
            description="Allows you to set the scope of the point so that it applies to each hole, or the round in general"
            onChange={handleSelectInputChange}
            value={updatedPointSetting.scope ?? ''}
          />

          <button onClick={handleUpdatePointSetting}>Save</button>
          <button
            onClick={() => setShowDeleteConfirmation(!showDeleteConfirmation)}
          >
            Delete
          </button>
        </Modal>
      )}

      {showDeleteConfirmation && (
        <DeleteConfirmationModal
          modalTitle="Confirm Point Deletion"
          confirmationText="Are you sure you want to delete this point from the league?"
          buttonText="Delete"
          onConfirmDelete={() => deleteLeaguePointSetting(id)}
          toggleModalActive={() =>
            setShowDeleteConfirmation(!showDeleteConfirmation)
          }
        />
      )}

      {/* TODO: change to tqListItem */}
      <li className={twListItems}>
        <span>{name}</span>
        <span>{value}</span>
        <span>{scope}</span>
        <span className="list-edit-buttons">
          <button onClick={() => handleEditingPoint(pointSetting)}>Edit</button>
          <button
            onClick={() => setShowDeleteConfirmation(!showDeleteConfirmation)}
          >
            Delete
          </button>
        </span>
      </li>
    </>
  )
}
