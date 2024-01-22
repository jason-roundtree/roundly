import { useContext } from 'react'
import { useParams, useLocation } from 'react-router-dom'

import { RoundContext } from '../Round/RoundDetails'
import { deleteRoundPointSetting } from '../../data'

//   TODO: if keeping these move to a separate file
const twEditInputs =
  'block border borderGray300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2'
const twListItems =
  'max-w-fit rounded-lg my-1 mx-4 p-2 list-item editable-list-item'

export default function RoundPointSettings() {
  const { roundId } = useParams()
  const { pointSettings, refreshRoundState } = useContext(RoundContext)
  console.log('pointSettings: ', pointSettings)

  async function handleDeleteRoundPointSetting(pointId, roundId) {
    const roundPointSetting = { pointId, roundId }
    await deleteRoundPointSetting(roundPointSetting)
    refreshRoundState()
  }

  return (
    <>
      <h3>PointSettings</h3>
      <ul>
        {pointSettings?.map((ps) => {
          return (
            <li key={ps.id} className={twListItems}>
              <span>{ps.name}</span>
              <span>{ps.value}</span>
              <span className="list-edit-buttons">
                <button>Edit Round Point</button>
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
