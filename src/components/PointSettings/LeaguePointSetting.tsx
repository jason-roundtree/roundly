import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import BasicInput from '../shared/components/BasicInput'
import { PointSetting } from '../../types'
import PointScopeRadios, { no_scope_key } from './PointScopeRadios'
import { selectAllInputText } from '../shared/utils'
import { deleteLeaguePointSetting, updatePointSetting } from '../../data'
import { toast } from 'react-toastify'
import DeleteConfirmationModal from '../shared/components/DeleteConfirmationModal'

export type EditablePointSetting = Omit<PointSetting, 'value'> & {
  value: string
}
export const defaultEditablePointSettingState: EditablePointSetting = {
  id: '',
  name: '',
  value: '',
  scope: no_scope_key,
  isLeagueSetting: true,
  maxFrequencyPerScope: null,
}

export default function LeaguePointSetting() {
  const location = useLocation()
  const { leagueId, pointSetting } = location.state
  const [updatedPointSetting, setUpdatedPointSetting] =
    useState<EditablePointSetting>(
      () => pointSetting || defaultEditablePointSettingState
    )
  const { scope: updatedPointSettingScope, id } = updatedPointSetting
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const navigate = useNavigate()

  async function handleUpdatePointSetting(e): Promise<void> {
    e.preventDefault()
    if (!updatedPointSetting.name) {
      toast.error('Point name is required')
      return
    }

    const res = await updatePointSetting(id, updatedPointSetting)
    if (res.ok) {
      toast.success('Point setting was successfully updated')
      navigate(`/league/${leagueId}/point-settings`, {
        replace: true,
      })
    }
  }

  async function handleDeletePointSetting(pointId) {
    const res = await deleteLeaguePointSetting(pointId)
    if (res.ok) {
      toast.success('Point setting was successfully deleted')
      navigate(`/league/${leagueId}/point-settings`, {
        replace: true,
      })
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

  // TODO: DRYify with other instances of nearly same function (e.g. AddPointSetting)
  function handlePointMaxFrequencyInputChange({
    target,
  }: React.ChangeEvent<HTMLInputElement>): void {
    const valueNum = +target.value
    setUpdatedPointSetting({
      ...updatedPointSetting,
      maxFrequencyPerScope: valueNum > 0 ? valueNum : 1,
    })
  }

  return (
    <div>
      <h2 className="page-title">League Point Setting</h2>

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

      {showDeleteConfirmation && (
        <DeleteConfirmationModal
          modalTitle="Confirm Point Deletion"
          confirmationText={`Are you sure you want to delete ${updatedPointSetting.name} from the league?`}
          buttonText="Delete"
          onConfirmDelete={() => handleDeletePointSetting(id)}
          toggleModalActive={() => setShowDeleteConfirmation(false)}
        />
      )}

      <button onClick={handleUpdatePointSetting}>Save</button>
      <button
        onClick={() => setShowDeleteConfirmation(true)}
        className="delete-button"
      >
        Delete
      </button>
    </div>
  )
}
