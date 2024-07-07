import { useState } from 'react'

import { RoundPointScopeRadios } from '.'
import Modal from '../shared/components/Modal'
import BasicInput from '../shared/components/BasicInput'
import { EditablePointSettingListItem } from '.'
import { PointSetting } from '../../types'
import { fetchLeaguePointSettings, updatePointSetting } from '../../data'
import SimpleInputValidationError from '../shared/components/SimpleInputValidationError'
import Checkbox from '../shared/components/Checkbox'
import { validateSimpleInput } from '../shared/utils'
import { no_scope_key } from './RoundPointScopeRadios'

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
  maxFrequencyPerScope: 1,
}

export default function RoundPointSettingsListItem({
  pointSetting,
  removePointSettingFromRound,
  refreshState,
  selectAllInputText,
}): JSX.Element {
  const [isBeingEdited, setIsBeingEdited] = useState(false)
  const [updatedPointSetting, setUpdatedPointSetting] = useState(defaultState)
  const { id, name, value, isLeagueSetting, scope } = pointSetting
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
    target: { name: name, value: value },
  }: React.ChangeEvent<HTMLInputElement>): void {
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
        // TODO: implement shared component for edit and non-edit inputs? Also with PlayerListItem
        <Modal
          title={modalTitle()}
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
            name="roundPointScope-radios-modal"
            onChange={handleRadioInputChange}
            selectedScope={updatedPointSetting.scope}
          />
          {/* TODO: make into component or fold into RoundPointScopeRadios since it's currently used in 3 components */}
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
