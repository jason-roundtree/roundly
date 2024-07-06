import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAnglesRight } from '@fortawesome/free-solid-svg-icons'

import { AddPointSetting, LeaguePointSettingsListItem } from '.'
import { PointSetting } from '../../types'
import { fetchLeaguePointSettings, deleteLeaguePointSetting } from '../../data'

export default function LeaguePointSettings(): JSX.Element {
  const [pointSettings, setPointSettings] = useState<PointSetting[]>([])

  const { leagueId } = useParams()

  useEffect(() => {
    refreshPointSettingsState()
  }, [])

  async function refreshPointSettingsState(): Promise<void> {
    const pointSettings = await fetchLeaguePointSettings(leagueId)
    setPointSettings(pointSettings)
  }

  async function handleDeletePointSetting(pointId) {
    await deleteLeaguePointSetting(pointId)
    refreshPointSettingsState()
  }

  function selectAllInputText(e): void {
    e.target.select()
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

      <ul className="editable-list--points">
        {pointSettings.map((pointSetting) => {
          return (
            <LeaguePointSettingsListItem
              key={pointSetting.id}
              pointSetting={pointSetting}
              deleteLeaguePointSetting={handleDeletePointSetting}
              refreshState={refreshPointSettingsState}
              selectAllInputText={selectAllInputText}
            />
          )
        })}
      </ul>
    </>
  )
}
