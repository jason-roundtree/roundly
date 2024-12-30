import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAnglesRight } from '@fortawesome/free-solid-svg-icons'

import { EditablePointSettingDetailsItem, LeaguePointSettingsListItem } from '.'
import { PointSetting } from '../../types'
import { fetchLeaguePointSettings, deleteLeaguePointSetting } from '../../data'
import { toast } from 'react-toastify'

export default function LeaguePointSettings(): JSX.Element {
  const [pointSettings, setPointSettings] = useState<PointSetting[]>([])
  const [detailsAreBulkToggledOn, setDetailsAreBulkToggledOn] = useState(false)

  const { leagueId } = useParams()

  useEffect(() => {
    refreshPointSettingsState()
  }, [])

  useEffect(() => {
    const detailsToggles = Array.from(document.querySelectorAll('details'))
    for (const t of detailsToggles) {
      t.open = detailsAreBulkToggledOn
    }
  }, [detailsAreBulkToggledOn])

  async function refreshPointSettingsState(): Promise<void> {
    const pointSettings = await fetchLeaguePointSettings(leagueId)
    setPointSettings(pointSettings)
  }

  async function handleDeletePointSetting(pointId) {
    const res = await deleteLeaguePointSetting(pointId)
    if (res.ok) {
      toast.success('Point setting was successfully deleted')
      refreshPointSettingsState()
    }
  }

  return (
    <>
      <Link to={`/league/${leagueId}`} className="leagueHomeLink">
        League Home
        <FontAwesomeIcon icon={faAnglesRight} />
      </Link>

      <h2 className="page-title">League Point Settings</h2>

      <div className="centered-button">
        <Link to={`/league/${leagueId}/new-point`}>
          <button>Create New League Point</button>
        </Link>
      </div>

      <button
        className="toggle-button"
        onClick={() => setDetailsAreBulkToggledOn((s) => !s)}
      >
        {/* {detailsAreBulkToggledOn ? 'Collapse' : 'Expand'} All Point Details */}
        Toggle all point details
      </button>

      <ul className="editable-list--points">
        {pointSettings.map((pointSetting) => {
          return (
            <LeaguePointSettingsListItem
              key={pointSetting.id}
              pointSetting={pointSetting}
              handleDeletePointSetting={handleDeletePointSetting}
              leagueId={leagueId}
            />
          )
        })}
      </ul>
    </>
  )
}
