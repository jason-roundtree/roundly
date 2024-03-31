import { useState } from 'react'

import Modal from '../shared/components/ModalContainer'
import BasicInput from '../shared/components/BasicInput'
import Select from '../shared/components/Select'
import DeleteConfirmationModal from '../shared/components/DeleteConfirmationModal'
import { EditablePointSettingListItem } from '.'
import {
  POINT_SCOPE_DESCRIPTION,
  POINT_SCOPE_SETTINGS,
  PointScopeKeys,
  PointScopeValues,
  PointSetting,
  getPointScopeKeyFromValue,
  getPointScopeValueFromKey,
} from '../../types'
import { fetchLeaguePointSettings, updatePointSetting } from '../../data'

// TODO: add same defaultState typing for LeaguePlayers?
// TODO: add other PointSetting fields from Types

type EditablePointSetting = Omit<PointSetting, 'id' | 'value'> & {
  value: string
}

const defaultState: EditablePointSetting = {
  name: '',
  value: '',
  scope: 'no_scope',
  isLeagueSetting: true,
  maxFrequencyPerScope: 1,
}

export default function LeaguePointSettingsListItem({
  pointSetting,
  deleteLeaguePointSetting,
  refreshState,
  selectAllInputText,
}): JSX.Element {
  const [isBeingEdited, setIsBeingEdited] = useState(false)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [updatedPointSetting, setUpdatedPointSetting] = useState(defaultState)
  const { id, name, value, scope } = pointSetting

  function handleEditingPoint() {
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
    const selectedOption = getPointScopeKeyFromValue(
      e.target.value
    ) as PointScopeKeys
    console.log('selectedOption', selectedOption)
    setUpdatedPointSetting({ ...updatedPointSetting, scope: selectedOption })
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
            type="text"
            label="Point Name"
            name="name"
            onChange={handleInputChange}
            value={updatedPointSetting.name}
          />
          <BasicInput
            type="number"
            label="Point Value"
            name="value"
            value={updatedPointSetting.value}
            onChange={handleInputChange}
            onFocus={selectAllInputText}
          />
          <Select
            options={POINT_SCOPE_SETTINGS}
            id="point-scope"
            label="Point Scope"
            // description={POINT_SCOPE_DESCRIPTION}
            onChange={handleSelectInputChange}
            value={getPointScopeValueFromKey(updatedPointSetting.scope) ?? ''}
          />
          {updatedPointSetting.scope !== 'no_scope' && (
            <BasicInput
              type="number"
              min="1"
              label="Max Frequency Per Scope"
              name="maxFrequencyPerScope"
              onChange={handleInputChange}
              value={updatedPointSetting.maxFrequencyPerScope ?? ''}
            />
          )}
          <button onClick={handleUpdatePointSetting}>Save</button>
          <button onClick={() => setShowDeleteConfirmation((show) => !show)}>
            Delete
          </button>
        </Modal>
      )}

      <EditablePointSettingListItem
        name={name}
        value={value}
        onEdit={handleEditingPoint}
        onRemove={() => setShowDeleteConfirmation((show) => !show)}
        removeButtonText="Delete"
      />

      {showDeleteConfirmation && (
        <DeleteConfirmationModal
          modalTitle={`Confirm Point Deletion: ${name}`}
          confirmationText="Are you sure you want to delete this point from the league?"
          buttonText="Delete"
          onConfirmDelete={() => deleteLeaguePointSetting(id)}
          toggleModalActive={() => setShowDeleteConfirmation((show) => !show)}
        />
      )}
    </>
  )
}
