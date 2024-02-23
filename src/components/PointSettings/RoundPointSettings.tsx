import { useContext, useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'

import { RoundContext } from '../Round/RoundDetails'
import {
  createRoundPointSetting,
  deleteRoundPointSetting,
  fetchLeaguePointSettings,
  updateRoundPointSetting,
} from '../../data'
import RoundPointSettingsListItem from './RoundPointSettingsListItem'
import { PointSetting } from '../../types'
import AddPointSetting from './AddPointSetting'
import { sortArrayOfObjects } from '../shared/utils'

//   TODO: if keeping these move to a separate file
const twEditInputs =
  'block border borderGray300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2'
const twListItems =
  'max-w-fit rounded-lg my-1 mx-4 p-2 list-item editable-list-item'

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
  }, [])

  async function getLeaguePointSettings() {
    const leaguePlayers = await fetchLeaguePointSettings(leagueId)
    setLeaguePointSettings(leaguePlayers)
  }

  async function removePointSettingFromRound(pointSettingId) {
    await deleteRoundPointSetting(pointSettingId, roundId)
    refreshRoundState()
  }

  async function addPointSettingToRound(pointSettingId) {
    await createRoundPointSetting(pointSettingId, roundId)
    refreshRoundState()
  }

  // TODO: implement
  async function handleEditRoundPointSetting(pointSettingId) {
    console.log('pointSettingId:: ', pointSettingId)
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

      <Link
        to={`/league/${leagueId}/point-settings`}
        className="text-link mt-2"
      >
        League Point Settings
      </Link>

      <AddPointSetting refreshState={refreshRoundState} pointContext="round" />

      <p>Active Round Points</p>
      <ul className="mb-3 mt-5">
        {sortArrayOfObjects(roundPointSettings, 'name').map((pointSetting) => {
          return (
            <RoundPointSettingsListItem
              key={pointSetting.id}
              pointSetting={pointSetting}
              removePointSettingFromRound={removePointSettingFromRound}
              twEditInputs={twEditInputs}
              twListItems={twListItems}
              refreshState={refreshRoundState}
              selectAllInputText={selectAllInputText}
            />
          )
        })}
      </ul>

      <p>Inactive Round Points</p>
      <ul className="mb-3 mt-5">
        {getInactiveRoundPointSettings().map((pointSetting) => {
          return (
            <li key={pointSetting.id} className={twListItems}>
              <span>{pointSetting.name}</span>
              <span className="list-edit-buttons non-round-point-setting">
                <button onClick={() => addPointSettingToRound(pointSetting.id)}>
                  Add to Round
                </button>
              </span>
              {pointSetting.isLeagueSetting && <span>LPS</span>}
            </li>
          )
        })}
      </ul>
    </>
  )
}
