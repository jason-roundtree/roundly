import { useState } from 'react'

import { PointScopeRadios } from '.'
import Modal from '../shared/components/Modal'
import BasicInput from '../shared/components/BasicInput'
import { EditablePointSettingListItem } from '.'
import { PointSetting } from '../../types'
import { fetchLeaguePointSettings, updatePointSetting } from '../../data'
import Checkbox from '../shared/components/Checkbox'
import { no_scope_key } from './PointScopeRadios'
import ValidationErrorMessage from '../shared/components/ValidationErrorMessage'
import { validateStringInput } from '../shared/utils'

// TODO: add same defaultState typing for LeaguePlayers?
// TODO: add other PointSetting fields from Types
type EditablePointSetting = Omit<PointSetting, 'id' | 'value'> & {
  value: string
}

const defaultState: EditablePointSetting = {
  name: '',
  value: '',
  scope: no_scope_key,
  isLeagueSetting: false,
  maxFrequencyPerScope: null,
}

export default function RoundPointSettingsListItem({
  pointSetting,
  removePointSettingFromRound,
  refreshState,
  selectAllInputText,
}): JSX.Element {
  const [isBeingEdited, setIsBeingEdited] = useState(false)
  const [updatedPointSetting, setUpdatedPointSetting] = useState(defaultState)
  const updatedPointSettingScope = updatedPointSetting.scope
  const { id, name, value, isLeagueSetting, scope } = pointSetting
  const [showValidationError, setShowValidationError] = useState(false)

  function handleEditingPoint() {
    setUpdatedPointSetting(pointSetting)
    setIsBeingEdited(true)
  }

  async function handleUpdatePointSetting(): Promise<void> {
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
    setUpdatedPointSetting({ ...updatedPointSetting, [name]: value })
  }

  // TODO: DRYify with other instances of nearly same function (e.g. LeaguePointSettingListItem, AddPointSetting)
  function handlePointMaxFrequencyInputChange({
    target,
  }: React.ChangeEvent<HTMLInputElement>): void {
    const valueNum = +target.value
    setUpdatedPointSetting({
      ...updatedPointSetting,
      maxFrequencyPerScope: valueNum > 0 ? valueNum : 1,
    })
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

  function modalTitle() {
    return isLeagueSetting
      ? 'Edit Default League Point'
      : 'Edit One-off Round Point'
  }

  function deactivatePointButtonText() {
    return isLeagueSetting ? 'Deactivate' : 'Delete'
  }

  function EditPointSettingModalButtons(): JSX.Element {
    return (
      <>
        <div id="modal-edit-buttons">
          <button onClick={handleUpdatePointSetting}>Save</button>
          <button onClick={() => removePointSettingFromRound(id)}>
            {deactivatePointButtonText()}
          </button>
        </div>
        <ValidationErrorMessage
          showErrorMsg={showValidationError}
          errorField="Point Name"
          errorMsgCode="MISSNG_VALUE"
        />
      </>
    )
  }

  function handleCloseModal() {
    setIsBeingEdited(false)
    setShowValidationError(false)
  }

  return (
    <>
      {isBeingEdited && (
        // TODO: implement shared component for edit and non-edit inputs? Also with PlayerListItem
        <Modal
          title={modalTitle()}
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
            name="pointScope-radios-modal"
            onChange={handleRadioInputChange}
            selectedScope={updatedPointSetting.scope}
          />

          {/* TODO: make into component or fold into PointScopeRadios since it's currently used in 3 components */}
          {updatedPointSettingScope !== no_scope_key && (
            <BasicInput
              // disabled={updatedPointSetting.scope === no_scope_key}
              type="number"
              min="1"
              // TODO: edit "Scope" to be Round or Hole depending on which option is selected?
              label="Max Frequency Per Scope"
              name="maxFrequencyPerScope"
              onChange={handlePointMaxFrequencyInputChange}
              value={updatedPointSetting.maxFrequencyPerScope ?? ''}
            />
          )}

          {!isLeagueSetting && (
            <Checkbox
              id="updateRoundPointToLeague"
              checked={Boolean(updatedPointSetting.isLeagueSetting)}
              label="Add to league point settings?"
              onChange={() =>
                setUpdatedPointSetting((ps) => ({
                  ...updatedPointSetting,
                  isLeagueSetting: !ps.isLeagueSetting,
                }))
              }
            />
          )}
          {/* TODO: add remove point from league if isLeagueSetting */}
        </Modal>
      )}

      <EditablePointSettingListItem
        name={name}
        value={value}
        onEdit={handleEditingPoint}
        // TODO: Add delete confirmation modal?
        onRemove={() => removePointSettingFromRound(id)}
        removeButtonText={deactivatePointButtonText()}
      />
    </>
  )
}
