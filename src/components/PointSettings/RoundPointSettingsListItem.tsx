import { useState } from 'react'
import { useParams } from 'react-router-dom'

import { EditablePointSettingDetailsItem } from '.'
import DeleteConfirmationModal from '../shared/components/DeleteConfirmationModal'
import { deleteLeaguePointSetting } from '../../data'
import { toast } from 'react-toastify'

export default function RoundPointSettingsListItem({
  pointSetting,
  removePointSettingFromRound,
  refreshState,
}): JSX.Element {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const { id, value, name, isLeagueSetting } = pointSetting
  const { leagueId, roundId } = useParams()

  function deactivatePointButtonText() {
    return isLeagueSetting ? 'Deactivate' : 'Delete'
  }

  async function handleDeletePointSetting(pointId) {
    const res = await deleteLeaguePointSetting(pointId)
    if (res.ok) {
      toast.success('Point setting was successfully deleted')
      refreshState()
      setShowDeleteConfirmation(false)
    }
  }

  function handleRemoveOrDeletePoint() {
    if (isLeagueSetting) {
      removePointSettingFromRound(id)
    } else {
      setShowDeleteConfirmation(true)
    }
  }

  return (
    <>
      <EditablePointSettingDetailsItem
        pointSetting={pointSetting}
        pointEditRoute={`/league/${leagueId}/round/${roundId}/point-settings/${encodeURIComponent(
          pointSetting.name
        )}`}
        value={value}
        onRemove={handleRemoveOrDeletePoint}
        removeButtonText={deactivatePointButtonText()}
      />

      {showDeleteConfirmation && (
        <DeleteConfirmationModal
          modalTitle="Confirm Point Deletion"
          confirmationText={`Are you sure you want to delete ${name}?`}
          buttonText="Delete"
          onConfirmDelete={() => handleDeletePointSetting(id)}
          toggleModalActive={() => setShowDeleteConfirmation(false)}
        />
      )}
    </>
  )
}
