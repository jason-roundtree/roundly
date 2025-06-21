import { Link, useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAnglesRight } from '@fortawesome/free-solid-svg-icons'
import { useQuery } from '@tanstack/react-query'

import { LeaguePointSettingsListItem } from '.'
import { PointSetting } from '../../types'
import { fetchLeaguePointSettings, deleteLeaguePointSetting } from '../../data'
import { toast } from 'react-toastify'

export default function LeaguePointSettings(): JSX.Element {
  const { leagueId } = useParams()

  const {
    data: pointSettings = [],
    isLoading,
    isError,
    refetch: refetchLeaguePointSettings,
  } = useQuery({
    queryKey: ['leaguePointSettings', leagueId],
    queryFn: () => fetchLeaguePointSettings(leagueId),
    enabled: !!leagueId,
  })

  async function handleDeletePointSetting(pointId) {
    console.log('sdfdsfsd')
    const res = await deleteLeaguePointSetting(pointId)
    if (res.ok) {
      toast.success('Point setting was successfully deleted')
      refetchLeaguePointSettings()
    }
  }

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error loading league point settings.</div>

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
              handleDeletePointSetting={handleDeletePointSetting}
              leagueId={leagueId}
            />
          )
        })}
      </ul>
    </>
  )
}
