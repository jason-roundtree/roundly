import { useRef, useState } from 'react'
import { useParams } from 'react-router-dom'

import BasicInput from '../shared/components/BasicInput'
import SimpleInputValidationError from '../shared/components/SimpleInputValidationError'
import { PointSetting } from '../../types'
import { validateSimpleInput } from '../shared/utils'
import { createLeaguePointSetting, createRoundPointSetting } from '../../data'

type NewPointSetting = Omit<PointSetting, 'id'>

const defaultNewPointState: NewPointSetting = {
  name: '',
  value: 0,
  scope: 'hole',
  maxFrequencyPerScope: 1,
  isLeagueSetting: false,
}

//   TODO: if keeping these move to a separate file
const twEditInputs =
  'block border borderGray300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2'

interface AddPointSettingProps {
  refreshState: () => void
  pointContext: 'round' | 'league'
}

export default function AddPointSetting({
  refreshState,
  pointContext,
}: AddPointSettingProps): JSX.Element {
  const [newPoint, setNewPoint] = useState(defaultNewPointState)
  const [inputValidationError, setInputValidationError] = useState<
    string | null
  >(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { leagueId, roundId } = useParams()

  async function handleCreatePointSetting() {
    if (
      !validateSimpleInput(newPoint.name, 'Point Name', setInputValidationError)
    ) {
      return
    } else {
      try {
        console.log('newPoint.isLeagueSetting: ', newPoint.isLeagueSetting)
        const newPointCopy = { ...newPoint }
        if (pointContext === 'league') {
          newPointCopy.isLeagueSetting = true
        }

        const leaguePointJson = await createLeaguePointSetting(
          leagueId,
          newPointCopy
        )
        const { id: pointId } = leaguePointJson

        // TODO: should i just use roundId param instead?
        if (pointContext === 'round') {
          const roundPointJson = await createRoundPointSetting(pointId, roundId)
          console.log('roundPointJson JSON', roundPointJson)
        }

        refreshState()
        setNewPoint(defaultNewPointState)
        inputRef.current && inputRef.current.focus()
      } catch (err) {
        console.log('create point setting error: ', err)
      }
    }
  }

  // TODO: move basic handleInputChange to shared hook
  function handleInputChange({
    target: { name: tName, value: tValue },
  }: React.ChangeEvent<HTMLInputElement>): void {
    setNewPoint({ ...newPoint, [tName]: tValue })
  }

  function handleCheckboxInputChange(e) {
    setNewPoint({ ...newPoint, isLeagueSetting: e.target.checked })
  }

  function selectAllInputText(e): void {
    e.target.select()
  }

  function pointContextCapitalized() {
    return pointContext[0].toUpperCase() + pointContext.slice(1)
  }

  return (
    <div>
      <p>Add New Point to {pointContextCapitalized()}</p>
      <BasicInput
        type="text"
        label="Point Name"
        name="name"
        onChange={handleInputChange}
        value={newPoint.name}
        twClasses={`${twEditInputs} w-72 max-w-screen-sm`}
        inputRef={inputRef}
      />

      <BasicInput
        type="number"
        label="Point Value"
        name="value"
        value={newPoint.value}
        onChange={handleInputChange}
        twClasses={`${twEditInputs} w-24 max-w-screen-sm`}
        onFocus={selectAllInputText}
      />

      {pointContext === 'round' && (
        <div className="checkbox-container">
          <input
            type="checkbox"
            id="point-context"
            onChange={handleCheckboxInputChange}
            checked={newPoint.isLeagueSetting}
          />
          <label htmlFor="point-context">
            Also add to league point settings
          </label>
          <br />
        </div>
      )}

      <button onClick={handleCreatePointSetting}>Add Point</button>
      <SimpleInputValidationError
        errorField={inputValidationError}
        errorMsgCode="MISSNG_VALUE"
      />
    </div>
  )
}
