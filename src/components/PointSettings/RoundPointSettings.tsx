import { useContext, useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'

import { RoundContext } from '../Round/RoundDetailsContainer'
import {
  createRoundPointSetting,
  removeRoundPointSetting,
  fetchLeaguePointSettings,
  updatePointSetting,
} from '../../data'
import RoundPointSettingsListItem from './RoundPointSettingsListItem'
import { PointSetting } from '../../types'
import AddPointSetting from './AddPointSetting'
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
  console.log('roundPointSettings: ', roundPointSettings)

  useEffect(() => {
    getLeaguePointSettings()
    getInactiveRoundPointSettings()
  }, [roundPointSettings])

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

  function selectAllInputText(e): void {
    e.target.select()
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

      {/* TODO: make this round/league agnostic? */}
      <div className="primary-centered-button">
        <Link to={`/league/${leagueId}/rounds/${roundId}/new-point`}>
          <button>Create New Round Point</button>
        </Link>
      </div>

      {/* <Link to={`/league/${leagueId}/point-settings`} className="text-link">
        League Point Settings
      </Link> */}

      <p className="non-input-label">Active Round Points</p>
      <ul className="editable-list--points">
        {roundPointSettings.length ? (
          sortArrayOfObjects(roundPointSettings, 'name').map((pointSetting) => {
            return (
              <RoundPointSettingsListItem
                key={pointSetting.id}
                pointSetting={pointSetting}
                removePointSettingFromRound={removePointSettingFromRound}
                refreshState={refreshRoundState}
                selectAllInputText={selectAllInputText}
              />
            )
          })
        ) : (
          <p className="indented-text-small">No active points</p>
        )}
      </ul>

      <p className="non-input-label">Inactive Round Points</p>
      {/* TODO: add edit button to inactive points? If not then probably change this className */}
      <ul className="editable-list--points">
        {inactivePointSettings.length ? (
          inactivePointSettings.map((pointSetting) => {
            return (
              <li key={pointSetting.id}>
                <span className="list-point-name">{pointSetting.name}</span>
                <span className="list-point-value">{pointSetting.value}</span>
                <span className="list-edit-buttons non-round-point-setting">
                  <button
                    onClick={() => addPointSettingToRound(pointSetting.id)}
                  >
                    Activate
                  </button>
                </span>
              </li>
            )
          })
        ) : (
          <p className="indented-text-small">All points are active</p>
        )}
      </ul>
    </>
  )
}
