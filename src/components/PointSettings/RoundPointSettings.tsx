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

  const params = useParams()
  // TODO: why can't i destructure params above without TS complaining?
  const leagueId = params.leagueId as string
  const roundId = params.roundId as string

  const { pointSettings: roundPointSettings, refreshRoundState } =
    useContext(RoundContext)
  console.log('roundPointSettings: ', roundPointSettings)

  useEffect(() => {
    getLeaguePointSettings()
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
    return nonRoundPointSettings
  }

  return (
    <>
      <h3>Round Point Settings</h3>

      <Link to={`/league/${leagueId}/point-settings`} className="text-link">
        League Point Settings
      </Link>

      <AddPointSetting refreshState={refreshRoundState} pointContext="round" />

      <p>Active Round Points</p>
      <ul className="editable-list-item">
        {sortArrayOfObjects(roundPointSettings, 'name').map((pointSetting) => {
          return (
            <RoundPointSettingsListItem
              key={pointSetting.id}
              pointSetting={pointSetting}
              removePointSettingFromRound={removePointSettingFromRound}
              refreshState={refreshRoundState}
              selectAllInputText={selectAllInputText}
            />
          )
        })}
      </ul>

      <p>Inactive Round Points</p>
      <ul className="">
        {getInactiveRoundPointSettings().map((pointSetting) => {
          return (
            <li key={pointSetting.id}>
              <span>{pointSetting.name}</span>
              <span>{pointSetting.value}</span>
              <span className="list-edit-buttons non-round-point-setting">
                <button onClick={() => addPointSettingToRound(pointSetting.id)}>
                  Activate
                </button>
              </span>
            </li>
          )
        })}
      </ul>
    </>
  )
}
