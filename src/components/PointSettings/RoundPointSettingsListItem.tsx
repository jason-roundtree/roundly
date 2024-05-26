import { useState } from 'react'

import { RoundPointScopeRadios } from '.'
import Modal from '../shared/components/Modal'
import BasicInput from '../shared/components/BasicInput'
import { EditablePointSettingListItem } from '.'
import { PointSetting } from '../../types'
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

  function handleRadioInputChange(e) {
    setUpdatedPointSetting({ ...updatedPointSetting, scope: e.target.value })
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
        <button onClick={handleUpdatePointSetting}>Save</button>
        <button onClick={() => removePointSettingFromRound(id)}>
          {deactivatePointButtonText()}
        </button>
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

          {/* <button onClick={handleUpdatePointSetting}>Save</button>
          <button onClick={() => removePointSettingFromRound(id)}>
            {deactivatePointButtonText()}
          </button> */}
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
