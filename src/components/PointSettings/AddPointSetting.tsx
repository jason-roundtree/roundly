import { useRef, useState } from 'react'
import { useParams } from 'react-router-dom'

import BasicInput from '../shared/components/BasicInput'
import SimpleInputValidationError from '../shared/components/SimpleInputValidationError'
import {
  POINT_SCOPE_DESCRIPTION,
  POINT_SCOPE_SETTINGS,
  PointScopeKeys,
  PointScopeValues,
  getPointScopeKeyFromValue,
  getPointScopeValueFromKey,
  PointSetting,
} from '../../types'
import { validateSimpleInput } from '../shared/utils'
import { createLeaguePointSetting, createRoundPointSetting } from '../../data'
import RadioButton from '../shared/components/RadioButton'
import Select from '../shared/components/Select'

type NewPointSetting = Omit<PointSetting, 'id'>

const defaultNewPointState: NewPointSetting = {
  name: '',
  value: 0,
  scope: 'no_scope',
  maxFrequencyPerScope: 1,
  isLeagueSetting: false,
}

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

  async function handleCreatePointSetting(e) {
    e.preventDefault()
    if (
      !validateSimpleInput(newPoint.name, 'Point Name', setInputValidationError)
    ) {
      return
    } else {
      try {
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
    console.log('newPoint', newPoint)
    setNewPoint({ ...newPoint, [tName]: tValue })
  }

  function handleRadioInputChange(e) {
    console.log('e.target.id', e.target.id)
    const isLeagueSetting = e.target.id === 'league-setting'
    setNewPoint({ ...newPoint, isLeagueSetting: isLeagueSetting })
  }

  function handleSelectInputChange(e) {
    console.log('e.target.value', e.target.value)
    const selectedOption = getPointScopeKeyFromValue(
      e.target.value
    ) as PointScopeKeys
    console.log('selectedOption', selectedOption)
    setNewPoint({ ...newPoint, scope: selectedOption })
  }

  function selectAllInputText(e): void {
    e.target.select()
  }

  //   TODO: move to shared util function
  function pointContextCapitalized() {
    return pointContext[0].toUpperCase() + pointContext.slice(1)
  }

  return (
    <form>
      <h3 className="form-title">
        Add New Point to {pointContextCapitalized()}
      </h3>
      <BasicInput
        type="text"
        label="Point Name"
        name="name"
        onChange={handleInputChange}
        value={newPoint.name}
        inputRef={inputRef}
      />

      <BasicInput
        type="number"
        label="Point Value"
        name="value"
        value={newPoint.value}
        onChange={handleInputChange}
        onFocus={selectAllInputText}
      />

      <Select
        options={POINT_SCOPE_SETTINGS}
        id="point-scope"
        label="Point Scope"
        description={POINT_SCOPE_DESCRIPTION}
        onChange={handleSelectInputChange}
        value={getPointScopeValueFromKey(newPoint.scope) ?? ''}
      />

      {newPoint.scope !== 'no_scope' && (
        <BasicInput
          type="number"
          min="1"
          label="Max Frequency Per Scope"
          name="maxFrequencyPerScope"
          onChange={handleInputChange}
          value={newPoint.maxFrequencyPerScope ?? ''}
        />
      )}

      {pointContext === 'round' && (
        <fieldset className="round-point-radios">
          <legend>One-off or League Point Setting</legend>
          <RadioButton
            id="round-only"
            value="round-only"
            name="round-point-radio-buttons"
            label="One-off point setting for this round"
            onChange={handleRadioInputChange}
            checked={!newPoint.isLeagueSetting}
          />

          <RadioButton
            id="league-setting"
            value="league-setting"
            name="round-point-radio-buttons"
            label="Add to default point settings for league"
            onChange={handleRadioInputChange}
            checked={newPoint.isLeagueSetting}
          />
        </fieldset>
      )}

      <div className="form-submit">
        <button onClick={handleCreatePointSetting}>Add Point</button>
        <SimpleInputValidationError
          errorField={inputValidationError}
          errorMsgCode="MISSNG_VALUE"
        />
      </div>
    </form>
  )
}
