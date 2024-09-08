import { useState } from 'react'

import Modal from '../shared/components/Modal'
import BasicInput from '../shared/components/BasicInput'
import Select from '../shared/components/Select'
import DeleteConfirmationModal from '../shared/components/DeleteConfirmationModal'
import { EditablePointSettingListItem, PointScopeRadios } from '.'
import { PointSetting } from '../../types'
import { fetchLeaguePointSettings, updatePointSetting } from '../../data'
import { no_scope_key } from './PointScopeRadios'
import { validateStringInput } from '../shared/utils'
import ValidationErrorMessage from '../shared/components/ValidationErrorMessage'

// TODO: add same defaultState typing for LeaguePlayers?
// TODO: add other PointSetting fields from Types

type EditablePointSetting = Omit<PointSetting, 'id' | 'value'> & {
  value: string
}

const defaultState: EditablePointSetting = {
  name: '',
  value: '',
  scope: no_scope_key,
  isLeagueSetting: true,
  maxFrequencyPerScope: null,
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
  const updatedPointSettingScope = updatedPointSetting.scope
  const { id, name, value, scope } = pointSetting
  const [showValidationError, setShowValidationError] = useState(false)

  function handleEditingPoint() {
    setUpdatedPointSetting(pointSetting)
    setIsBeingEdited(true)
  }

  async function handleUpdatePointSetting(e): Promise<void> {
    e.preventDefault()
    if (
      !validateStringInput(updatedPointSetting.name, setShowValidationError)
    ) {
      return
    }

    await updatePointSetting(id, updatedPointSetting)
    refreshState()
    setIsBeingEdited(false)
    setUpdatedPointSetting(defaultState)
    setShowValidationError(false)
  }

  function handleInputChange({
    target: { name: name, value: value },
  }: React.ChangeEvent<HTMLInputElement>): void {
    if (name === 'name') {
      setShowValidationError(false)
    }
    setUpdatedPointSetting({ ...updatedPointSetting, [name]: value })
  }

  function handleRadioInputChange(e) {
    const updatedScope = e.target.value
    const isNoScope = updatedScope === no_scope_key
    setUpdatedPointSetting({
      ...updatedPointSetting,
      scope: updatedScope,
      maxFrequencyPerScope: isNoScope
        ? 1
        : updatedPointSetting.maxFrequencyPerScope,
    })
  }

  function handleCloseModal() {
    setIsBeingEdited(false)
    setShowValidationError(false)
  }

  function EditPointSettingModalButtons(): JSX.Element {
    return (
      <form>
        <div id="modal-edit-buttons">
          <button onClick={handleUpdatePointSetting}>Save</button>
          <button onClick={() => setShowDeleteConfirmation((show) => !show)}>
            Delete
          </button>
        </div>
        <ValidationErrorMessage
          showErrorMsg={showValidationError}
          errorField="Point Name"
          errorMsgCode="MISSNG_VALUE"
        />
      </form>
    )
  }

  return (
    <>
      {isBeingEdited && (
        // TODO: move edit point and player modals to non-modal components
        <Modal
          title="Edit Point Setting"
          closeModal={handleCloseModal}
          renderButtons={() => <EditPointSettingModalButtons />}
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

          <PointScopeRadios
            name="leaguePointScope-radios-modal"
            onChange={handleRadioInputChange}
            selectedScope={updatedPointSettingScope}
          />

          {/* {updatedPointSettingScope !== 'no_scope' && ( */}
          <BasicInput
            // disabled={updatedPointSetting.scope === 'no_scope'}
            type="number"
            min="1"
            // TODO: edit "Scope" to be Round or Hole depending on which option is selected?
            label="Max Frequency Per Scope"
            name="maxFrequencyPerScope"
            onChange={handleInputChange}
            value={updatedPointSetting.maxFrequencyPerScope ?? ''}
          />
          {/* )} */}

          {/* <br />
          <button onClick={handleUpdatePointSetting}>Save</button>
          <button onClick={() => setShowDeleteConfirmation((show) => !show)}>
            Delete
          </button> */}
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
          modalTitle="Confirm Point Deletion"
          confirmationText={`Are you sure you want to delete ${name} from the league?`}
          buttonText="Delete"
          onConfirmDelete={() => deleteLeaguePointSetting(id)}
          toggleModalActive={() => setShowDeleteConfirmation((show) => !show)}
        />
      )}
    </>
  )
}
