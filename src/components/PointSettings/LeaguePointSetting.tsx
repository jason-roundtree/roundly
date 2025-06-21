import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'

import BasicInput from '../shared/components/BasicInput'
import { PointSetting } from '../../types'
import PointScopeRadios, { no_scope_key } from './PointScopeRadios'
import { selectAllInputText } from '../shared/utils'
import { deleteLeaguePointSetting, updatePointSetting } from '../../data'
import { toast } from 'react-toastify'
import DeleteConfirmationModal from '../shared/components/DeleteConfirmationModal'
import { usePointSetting } from '../shared/hooks/usePointSetting'

// TODO: move this to types.ts and use it in round point setting
export type EditablePointSetting = Omit<PointSetting, 'value'> & {
  value: string
}
export const defaultEditablePointSettingState: EditablePointSetting = {
  id: '',
  name: '',
  value: '',
  scope: no_scope_key,
  isLeagueSetting: true,
}

export default function LeaguePointSetting() {
  const location = useLocation()
  const { leagueId, pointSettingId } = location.state

  const {
    data: pointSetting,
    isLoading,
    isError,
  } = usePointSetting(pointSettingId)

  const [updatedPointSetting, setUpdatedPointSetting] =
    useState<EditablePointSetting>(
      () => pointSetting || defaultEditablePointSettingState
    )

  useEffect(() => {
    if (pointSetting) {
      setUpdatedPointSetting(pointSetting)
    }
  }, [pointSetting])

  console.log('updatedPointSetting: $$$', updatedPointSetting)

  const { scope: updatedPointSettingScope, id } = updatedPointSetting
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  async function handleUpdatePointSetting(e): Promise<void> {
    e.preventDefault()
    if (!updatedPointSetting.name) {
      toast.error('Point name is required')
      return
    }

    const res = await updatePointSetting(id, updatedPointSetting)
    if (res.ok) {
      toast.success('Point setting was successfully updated')
      navigate(-1)
    }
  }

  async function handleDeletePointSetting(pointId) {
    const res = await deleteLeaguePointSetting(pointId)
    if (res.ok) {
      toast.success('Point setting was successfully deleted')
      queryClient.invalidateQueries({
        queryKey: ['leaguePointSettings', leagueId],
      })
      navigate(-1)
    }
  }

  function handleInputChange({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement>): void {
    setUpdatedPointSetting({ ...updatedPointSetting, [name]: value })
  }

  function handleRadioInputChange(e) {
    const updatedScope = e.target.value
    // const isNoScope = updatedScope === no_scope_key
    setUpdatedPointSetting({
      ...updatedPointSetting,
      scope: updatedScope,
    })
  }

  if (isError) {
    return <p>Point setting does not exist</p>
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
