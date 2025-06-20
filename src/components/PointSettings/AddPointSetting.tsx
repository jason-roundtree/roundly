import { useRef, useState, useContext } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAnglesRight } from '@fortawesome/free-solid-svg-icons'

import BasicInput from '../shared/components/BasicInput'
import { PointSetting } from '../../types'
import { capitalizeFirstLetter, selectAllInputText } from '../shared/utils'
import { createLeaguePointSetting, createRoundPointSetting } from '../../data'
import Radio from '../shared/components/Radio'
import styles from './AddPointSetting.module.css'
import PointScopeRadios from './PointScopeRadios'
import { hole_key } from './PointScopeRadios'
// import { RoundContext } from '../Round/RoundContainer'
import { toast } from 'react-toastify'

type NewPointSettingState = Omit<PointSetting, 'id' | 'value'> & {
  value: string
}

const defaultNewPointSettingState: NewPointSettingState = {
  name: '',
  value: '',
  scope: hole_key,
  // maxFrequencyPerScope: null,
  isLeagueSetting: true,
}

function getDefaultPointSettingState(pointContext) {
  return {
    ...defaultNewPointSettingState,
    isLeagueSetting: pointContext === 'league' ? true : false,
  }
}

export default function AddPointSetting({
  pointContext,
}: {
  pointContext: 'round' | 'league'
}): JSX.Element {
  const [newPointSetting, setNewPointSetting] = useState(
    getDefaultPointSettingState(pointContext)
  )
  const inputRef = useRef<HTMLInputElement>(null)
  const { leagueId, roundId } = useParams() as {
    leagueId: string
    roundId: string
  }
  // const { refreshRoundState } = useContext(RoundContext)

  async function handleCreatePointSetting(e) {
    e.preventDefault()
    if (!newPointSetting.name) {
      toast.error('Point name is required')
      return
    }

    try {
      const res = await createLeaguePointSetting(
        leagueId,
        newPointSetting,
        roundId
      )

      if (res.status === 409) {
        toast.error(
          `A point setting named "${newPointSetting.name}" already exists for this round`
        )
        return
      }

      const leaguePointJson = await res.json()
      const { id: pointId } = leaguePointJson
      // TODO: should i just use roundId param instead?
      if (pointContext === 'round') {
        await createRoundPointSetting(pointId, roundId)
      }

      if (res.ok) {
        setNewPointSetting(getDefaultPointSettingState(pointContext))
        toast.success('Point successfully added')
      }
      inputRef.current && inputRef.current.focus()
    } catch (err) {
      console.log('create point setting error: ', err)
    }
  }

  function handlePointValueInputChange({
    target,
  }: React.ChangeEvent<HTMLInputElement>): void {
    setNewPointSetting({ ...newPointSetting, value: target.value })
  }

  function handleInputChange({
    target,
  }: React.ChangeEvent<HTMLInputElement>): void {
    const { name, value } = target
    setNewPointSetting({
      ...newPointSetting,
      [name]: value,
    })
  }

  function handleRadioInputChange({ target: { name, value } }) {
    switch (name) {
      case 'isLeaguePoint-radios':
        setNewPointSetting({
          ...newPointSetting,
          isLeagueSetting: value === 'league-setting',
        })
        break
      case 'pointScope-radios':
        setNewPointSetting({
          ...newPointSetting,
          scope: value,
        })
        break
      default:
        console.log('no matching radio')
    }
  }

  return (
    <form>
      <h3 className="page-title">
        Create New {capitalizeFirstLetter(pointContext)} Point
      </h3>
      <div className="ta-center">
        <Link to={`/league/${leagueId}/point-settings`}>
          League Point Settings <FontAwesomeIcon icon={faAnglesRight} />
        </Link>
      </div>

      <div className="ta-center">
        {pointContext === 'round' && (
          <Link to={`/league/${leagueId}/round/${roundId}/point-settings`}>
            Round Point Settings <FontAwesomeIcon icon={faAnglesRight} />
          </Link>
        )}
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
        ref={inputRef}
      />

      <BasicInput
        type="number"
        label="Point Value"
        name="value"
        value={newPointSetting.value}
        onChange={handlePointValueInputChange}
        onFocus={selectAllInputText}
      />

      <PointScopeRadios
        name="pointScope-radios"
        onChange={handleRadioInputChange}
        selectedScope={newPointSetting.scope}
      />

      <div className="form-submit">
        <button onClick={handleCreatePointSetting}>Add Point</button>
      </div>
    </form>
  )
}
