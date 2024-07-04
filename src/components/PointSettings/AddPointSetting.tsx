import { useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAnglesRight } from '@fortawesome/free-solid-svg-icons'

import BasicInput from '../shared/components/BasicInput'
import SimpleInputValidationError from '../shared/components/SimpleInputValidationError'
import { PointSetting } from '../../types'
import { pointContextCapitalized, validateSimpleInput } from '../shared/utils'
import { createLeaguePointSetting, createRoundPointSetting } from '../../data'
import Radio from '../shared/components/Radio'
import styles from './AddPointSetting.module.css'
import RoundPointScopeRadios from './RoundPointScopeRadios'

type NewPointSetting = Omit<PointSetting, 'id'>

const defaultNewPointState: NewPointSetting = {
  name: '',
  value: 0,
  scope: 'no_scope',
  maxFrequencyPerScope: 1,
  isLeagueSetting: false,
}

interface AddPointSettingProps {
  pointContext: 'round' | 'league'
}

export default function AddPointSetting({
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

        // refreshState()
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

  function handleRadioInputChange({ target: { name, value } }) {
    switch (name) {
      case 'isLeaguePoint-radios':
        setNewPoint({
          ...newPoint,
          isLeagueSetting: value === 'league-setting',
        })
        break
      case 'roundPointScope-radios-main':
        setNewPoint({ ...newPoint, scope: value })
        break
      default:
        console.log('no matching radio')
    }
  }

  function selectAllInputText(e): void {
    e.target.select()
  }

  return (
    <form>
      <h3 className="decreaseBottomMargin page-title">
        Add New Point to {pointContextCapitalized(pointContext)}
      </h3>
      <div className="linkContainerCentered">
        <Link to={`/league/${leagueId}/point-settings`}>
          League Point Settings <FontAwesomeIcon icon={faAnglesRight} />
        </Link>
      </div>

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

      <RoundPointScopeRadios
        name="roundPointScope-radios-main"
        onChange={handleRadioInputChange}
        selectedScope={newPoint.scope}
      />
      <BasicInput
        disabled={newPoint.scope === 'no_scope'}
        type="number"
        min="1"
        // TODO: edit "Scope" to be Round or Hole depending on which option is selected?
        label="Max Frequency Per Scope"
        name="maxFrequencyPerScope"
        onChange={handleInputChange}
        value={newPoint.maxFrequencyPerScope ?? ''}
      />

      {pointContext === 'round' && (
        <fieldset className={styles.roundPointRadios}>
          <legend>One-off or League Point Setting</legend>
          <Radio
            id="round-only"
            value="round-only"
            name="isLeaguePoint-radios"
            label="One-off point setting for this round"
            onChange={handleRadioInputChange}
            checked={!newPoint.isLeagueSetting}
          />

          <Radio
            id="league-setting"
            value="league-setting"
            name="isLeaguePoint-radios"
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
