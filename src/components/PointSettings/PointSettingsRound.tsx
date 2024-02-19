import { useContext } from 'react'
import { useParams, useLocation } from 'react-router-dom'

import { AddPointSetting } from '../PointSettings'
import { RoundContext } from '../Round/RoundDetails'
import { deleteRoundPointSetting } from '../../data'

//   TODO: if keeping these move to a separate file
const twEditInputs =
  'block border borderGray300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2'
const twListItems =
  'max-w-fit rounded-lg my-1 mx-4 p-2 list-item editable-list-item'

export default function RoundPointSettings() {
  const params = useParams()
  // TODO: why can't i destructure params above without TS complaining?
  const leagueId = params.leagueId as string
  const roundId = params.roundId as string

  const { pointSettings, refreshRoundState } = useContext(RoundContext)
  console.log('pointSettings: ', pointSettings)

  async function handleDeleteRoundPointSetting(pointSettingId, roundId) {
    await deleteRoundPointSetting(pointSettingId, roundId)
    refreshRoundState()
  }

  async function handleEditRoundPointSetting(pointSettingId, roundId) {
    console.log('pointSettingId:: ', pointSettingId)
    console.log('roundId:: ', roundId)
  }

  return (
    <>
      <h3>PointSettings</h3>

      {/* TODO: setup ability to turn on exising league points that weren't initially activated for the round */}
      <p>Edit Round Points</p>

      <AddPointSetting refreshState={refreshRoundState} pointContext="round" />

      <ul>
        {pointSettings?.map((ps) => {
          return (
            <li key={ps.id} className={twListItems}>
              <span>{ps.name}</span>
              <span>{ps.value}</span>
              <span className="list-edit-buttons">
                <button
                  onClick={() => handleEditRoundPointSetting(ps.id, roundId)}
                >
                  Edit Round Point
                </button>
                <button
                  onClick={() => handleDeleteRoundPointSetting(ps.id, roundId)}
                >
                  Remove From Round
                </button>
              </span>
            </li>
          )
        })}
      </ul>
    </>
  )
}
