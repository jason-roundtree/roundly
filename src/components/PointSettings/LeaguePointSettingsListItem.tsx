import { useState } from 'react'

import DeleteConfirmationModal from '../shared/components/DeleteConfirmationModal'
import { EditablePointSettingDetailsItem } from '.'
import { toast } from 'react-toastify'

// TODO: add same defaultState typing for LeaguePlayers?
// TODO: add other PointSetting fields from Types

export default function LeaguePointSettingsListItem({
  pointSetting,
  handleDeletePointSetting,
  leagueId,
}): JSX.Element {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const { id, name, value } = pointSetting

  return (
    <>
      <EditablePointSettingDetailsItem
        pointEditRoute={`/league/${leagueId}/point-settings/${encodeURIComponent(
          pointSetting.name
        )}`}
        pointSetting={pointSetting}
        value={value}
        onRemove={() => setShowDeleteConfirmation((show) => !show)}
        removeButtonText="Delete"
      />

      {showDeleteConfirmation && (
        <DeleteConfirmationModal
          modalTitle="Confirm Point Deletion"
          confirmationText={`Are you sure you want to delete ${name} from the league?`}
          buttonText="Delete"
          onConfirmDelete={() => handleDeletePointSetting(id)}
          toggleModalActive={() => setShowDeleteConfirmation((show) => !show)}
        />
      )}
    </>
  )
}
