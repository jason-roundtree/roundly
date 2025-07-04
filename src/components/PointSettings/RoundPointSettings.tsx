import { useContext, useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAnglesRight, faSnowflake } from '@fortawesome/free-solid-svg-icons'

import { RoundContext } from '../Round/RoundContainer'
import {
  createRoundPointSetting,
  removeRoundPointSetting,
  fetchLeaguePointSettings,
} from '../../data'
import RoundPointSettingsListItem from './RoundPointSettingsListItem'
import { getPointScopeLabelFromKey, PointSetting } from '../../types'
import { sortArrayOfObjects } from '../shared/utils'

export default function RoundPointSettings(): JSX.Element {
  const [leaguePointSettings, setLeaguePointSettings] = useState<
    PointSetting[]
  >([])
  const [inactivePointSettings, setInactivePointSettings] = useState<
    PointSetting[]
  >([])

  const params = useParams()
  // TODO: why can't i destructure params above without TS complaining?
  const leagueId = params.leagueId as string
  const roundId = params.roundId as string

  const { pointSettings: roundPointSettings, refreshRoundState } =
    useContext(RoundContext)

  useEffect(() => {
    // TODO: why is this necessary when going back in browser after new point entry?
    refreshRoundState()
  }, [])

  useEffect(() => {
    getLeaguePointSettings()
  }, [roundPointSettings])

  useEffect(() => {
    getInactiveRoundPointSettings()
  }, [leaguePointSettings])

  async function getLeaguePointSettings() {
    const leaguePointSettings = await fetchLeaguePointSettings(leagueId)
    setLeaguePointSettings(leaguePointSettings)
  }

  async function removePointSettingFromRound(pointSettingId) {
    await removeRoundPointSetting(pointSettingId, roundId)
    refreshRoundState()
  }

  async function addPointSettingToRound(pointSettingId) {
    await createRoundPointSetting(pointSettingId, roundId)
    refreshRoundState()
  }

  function getInactiveRoundPointSettings() {
    const nonRoundPointSettings = leaguePointSettings?.filter(
      ({ id: leaguePointSettingId }) => {
        return roundPointSettings.every((roundPointSetting) => {
          return roundPointSetting.id !== leaguePointSettingId
        })
      }
    )
    setInactivePointSettings(nonRoundPointSettings)
  }

  return (
    <>
      <h3 className="page-title">Round Point Settings</h3>
      <div className="ta-center">
        <Link to={`/league/${leagueId}/point-settings`}>
          League Point Settings
          <FontAwesomeIcon icon={faAnglesRight} />
        </Link>
      </div>
      {/* TODO: make this round/league agnostic? */}
      <div className="centered-button">
        <Link to={`/league/${leagueId}/round/${roundId}/new-point`}>
          <button>Create New Round Point</button>
        </Link>
      </div>
      <p className="non-input-label">Active</p>
      {roundPointSettings.length ? (
        <p style={{ fontSize: '0.8rem' }}>
          <FontAwesomeIcon icon={faSnowflake} /> = Custom round point
        </p>
      ) : (
        ''
      )}

      <ul className="editable-list--points">
        {roundPointSettings.length ? (
          sortArrayOfObjects(roundPointSettings, 'name').map((pointSetting) => {
            return (
              <RoundPointSettingsListItem
                key={pointSetting.id}
                pointSetting={pointSetting}
                removePointSettingFromRound={removePointSettingFromRound}
                refreshState={refreshRoundState}
              />
            )
          })
        ) : (
          <p className="indented-text-small">No active points</p>
        )}
      </ul>
      <p className="non-input-label">Inactive</p>
      {/* TODO: add edit button to inactive points? If not then probably change this className */}
      <ul className="editable-list--points">
        {inactivePointSettings.length ? (
          inactivePointSettings.map((pointSetting) => {
            {
              /* TODO: make this into component/incorporate it with RoundPointSettingsListItem? */
            }
            const {
              scope,
              // maxFrequencyPerScope,
            } = pointSetting

            return (
              <div
                key={pointSetting.id}
                className="editable-list-item point-setting-item"
              >
                <span className="list-point-name">{pointSetting.name}</span>
                <span className="list-point-value">{pointSetting.value}</span>
                <span className="list-point-scope">
                  {getPointScopeLabelFromKey(scope)}
                </span>

                <span className="list-edit-buttons non-round-point-setting">
                  <button
                    onClick={() => addPointSettingToRound(pointSetting.id)}
                  >
                    Activate
                  </button>
                </span>
              </div>
            )
          })
        ) : (
          <p className="indented-text-small">All league points are active</p>
        )}
      </ul>
    </>
  )
}
