import { useRef, useState, useContext } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAnglesRight } from '@fortawesome/free-solid-svg-icons'

import BasicInput from '../shared/components/BasicInput'
import { PointSetting } from '../../types'
import { pointContextCapitalized, validateStringInput } from '../shared/utils'
import { createLeaguePointSetting, createRoundPointSetting } from '../../data'
import Radio from '../shared/components/Radio'
import styles from './AddPointSetting.module.css'
import RoundPointScopeRadios from './RoundPointScopeRadios'
import { no_scope_key } from './RoundPointScopeRadios'
import ValidationErrorMessage from '../shared/components/ValidationErrorMessage'
import { RoundContext } from '../Round/RoundDetailsContainer'

type NewPointSetting = Omit<PointSetting, 'id'>

const defaultNewPointSettingState: NewPointSetting = {
  name: '',
  value: 0,
  scope: no_scope_key,
  maxFrequencyPerScope: 1,
  isLeagueSetting: false,
}

interface AddPointSettingProps {
  pointContext: 'round' | 'league'
}

export default function AddPointSetting({
  pointContext,
}: AddPointSettingProps): JSX.Element {
  const [newPointSetting, setNewPointSetting] = useState(
    defaultNewPointSettingState
  )
  console.log('newPointSetting', newPointSetting)
  const [showNameValidationError, setShowNameValidationError] = useState(false)
  const [showMaxFrequencyError, setShowMaxFrequencyError] = useState(false)
  const [showSuccessMsg, setShowSuccessMsg] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const { leagueId, roundId } = useParams()
  const { refreshRoundState } = useContext(RoundContext)

  async function handleCreatePointSetting(e) {
    e.preventDefault()
    const maxFrequency = newPointSetting.maxFrequencyPerScope
    const pointName = newPointSetting.name
    // TODO: move this to function and also run it on blur
    if (pointName && maxFrequency && maxFrequency < 1) {
      setShowMaxFrequencyError(true)
      return
    }
    if (!validateStringInput(pointName, setShowNameValidationError)) {
      return
    }

    try {
      const newPointSettingCopy = { ...newPointSetting }
      if (pointContext === 'league') {
        newPointSettingCopy.isLeagueSetting = true
      }

      const leaguePointJson = await createLeaguePointSetting(
        leagueId,
        newPointSettingCopy
      )
      const { id: pointId } = leaguePointJson

      // TODO: should i just use roundId param instead?
      if (pointContext === 'round') {
        const roundPointJson = await createRoundPointSetting(pointId, roundId)
        console.log('roundPointJson JSON', roundPointJson)
        refreshRoundState()
      }

      setNewPointSetting(defaultNewPointSettingState)
      setShowSuccessMsg(true)
      setTimeout(() => setShowSuccessMsg(false), 3000)
      inputRef.current && inputRef.current.focus()
    } catch (err) {
      console.log('create point setting error: ', err)
    }
  }
  function handlePointValueInputChange({
    target,
  }: React.ChangeEvent<HTMLInputElement>): void {
    setNewPointSetting({ ...newPointSetting, value: +target.value })
  }

  function handleInputChange({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement>): void {
    setShowSuccessMsg(false)
    if (name === 'name') {
      setShowNameValidationError(false)
    }
    if (name === 'maxFrequencyPerScope' && +value > 0) {
      setShowMaxFrequencyError(false)
    }
    setNewPointSetting({ ...newPointSetting, [name]: value })
  }

  function handleRadioInputChange({ target: { name, value } }) {
    setShowSuccessMsg(false)
    switch (name) {
      case 'isLeaguePoint-radios':
        setNewPointSetting({
          ...newPointSetting,
          isLeagueSetting: value === 'league-setting',
        })
        break
      case 'roundPointScope-radios':
        const updatedScope = value
        const isNoScope = updatedScope === no_scope_key
        setNewPointSetting({
          ...newPointSetting,
          scope: value,
          maxFrequencyPerScope: isNoScope
            ? 1
            : newPointSetting.maxFrequencyPerScope,
        })
        setShowMaxFrequencyError(false)
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
      <h3 className="decrease-bottom-margin page-title">
        Create New {pointContextCapitalized(pointContext)} Point
      </h3>
      <div className="taCenter">
        <Link to={`/league/${leagueId}/point-settings`}>
          League Point Settings <FontAwesomeIcon icon={faAnglesRight} />
        </Link>
      </div>

      {pointContext === 'round' && (
        <fieldset className={styles.roundPointRadios}>
          <legend>One-off or League Point Setting</legend>
          <Radio
            id="round-only"
            value="round-only"
            name="isLeaguePoint-radios"
            label="One-off point setting for this round"
            onChange={handleRadioInputChange}
            checked={!newPointSetting.isLeagueSetting}
          />

          <Radio
            id="league-setting"
            value="league-setting"
            name="isLeaguePoint-radios"
            label="Add to default point settings for league"
            onChange={handleRadioInputChange}
            checked={newPointSetting.isLeagueSetting}
          />
        </fieldset>
      )}

      <BasicInput
        type="text"
        label="Point Name"
        name="name"
        onChange={handleInputChange}
        value={newPointSetting.name}
        inputRef={inputRef}
      />

      <BasicInput
        type="number"
        label="Point Value"
        name="value"
        value={newPointSetting.value}
        onChange={handlePointValueInputChange}
        onFocus={selectAllInputText}
      />

      <RoundPointScopeRadios
        name="roundPointScope-radios"
        onChange={handleRadioInputChange}
        selectedScope={newPointSetting.scope}
      />
      <BasicInput
        disabled={newPointSetting.scope === 'no_scope'}
        type="number"
        min="1"
        // TODO: edit "Scope" to be Round or Hole depending on which option is selected?
        label="Max Frequency Per Scope"
        name="maxFrequencyPerScope"
        onChange={handleInputChange}
        value={newPointSetting.maxFrequencyPerScope ?? ''}
      />

      <div className="form-submit">
        <button onClick={handleCreatePointSetting}>Add Point</button>
        <ValidationErrorMessage
          showErrorMsg={showNameValidationError}
          errorMsgCode="MISSNG_VALUE"
          errorField="Point Name"
        />
        <ValidationErrorMessage
          showErrorMsg={showMaxFrequencyError}
          errorMsgCode="MINIMUM_FREQUENCY_OF_ONE"
        />
        {showSuccessMsg && !showNameValidationError && (
          <p className="success-msg">Point Successfully Added</p>
        )}
      </div>
    </form>
  )
}
