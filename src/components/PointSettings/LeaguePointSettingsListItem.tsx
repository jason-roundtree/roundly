import { useState } from 'react'

import Modal from '../shared/components/Modal'
import BasicInput from '../shared/components/BasicInput'
import Select from '../shared/components/Select'
import DeleteConfirmationModal from '../shared/components/DeleteConfirmationModal'
import { EditablePointSettingListItem, RoundPointScopeRadios } from '.'
import { PointSetting } from '../../types'
import { fetchLeaguePointSettings, updatePointSetting } from '../../data'
import SimpleInputValidationError from '../shared/components/SimpleInputValidationError'
import { validateSimpleInput } from '../shared/utils'

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
  const [inputValidationError, setInputValidationError] = useState<
    string | null
  >(null)

  function handleEditingPoint() {
    setUpdatedPointSetting(pointSetting)
    setIsBeingEdited(true)
  }

  async function handleUpdatePointSetting(): Promise<void> {
    if (
      !validateSimpleInput(
        updatedPointSetting.name,
        'Point Name',
        setInputValidationError
      )
    ) {
      return
    } else {
      await updatePointSetting(id, updatedPointSetting)
      refreshState()
      setIsBeingEdited(false)
      setUpdatedPointSetting(defaultState)
    }
  }

  function handleInputChange({
    target: { name: tName, value: tValue },
  }: React.ChangeEvent<HTMLInputElement>): void {
    setUpdatedPointSetting({ ...updatedPointSetting, [tName]: tValue })
  }

  function handleRadioInputChange(e) {
    setUpdatedPointSetting({ ...updatedPointSetting, scope: e.target.value })
  }

  function EditPointSettingModalButtons(): JSX.Element {
    return (
      <>
        <div id="modal-edit-buttons">
          <button onClick={handleUpdatePointSetting}>Save</button>
          <button onClick={() => setShowDeleteConfirmation((show) => !show)}>
            Delete
          </button>
        </div>
        <SimpleInputValidationError
          errorField={inputValidationError}
          errorMsgCode="MISSNG_VALUE"
        />
      </>
    )
  }

  return (
    <>
      {isBeingEdited && (
        // TODO: move edit point and player modals to non-modal components
        <Modal
          title="Edit Point Setting"
          closeModal={() => setIsBeingEdited(false)}
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

          <RoundPointScopeRadios
            name="leaguePointScope-radios-modal"
            onChange={handleRadioInputChange}
            selectedScope={updatedPointSetting.scope}
          />
          <BasicInput
            disabled={updatedPointSetting.scope === 'no_scope'}
            type="number"
            min="1"
            // TODO: edit "Scope" to be Round or Hole depending on which option is selected?
            label="Max Frequency Per Scope"
            name="maxFrequencyPerScope"
            onChange={handleInputChange}
            value={updatedPointSetting.maxFrequencyPerScope ?? ''}
          />

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
