import { useRef, useState, useContext } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAnglesRight } from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-toastify'

import BasicInput from '../shared/components/BasicInput'
import { PointSetting } from '../../types'
import { capitalizeFirstLetter, selectAllInputText } from '../shared/utils'
import {
  createLeaguePointSetting,
  createRoundPointSetting,
  leaguePointSettingExists,
  roundPointSettingExists,
} from '../../data'
import Radio from '../shared/components/Radio'
import styles from './AddPointSetting.module.css'
import PointScopeRadios from './PointScopeRadios'
import { hole_key } from './PointScopeRadios'

// type NewPointSettingState = Omit<PointSetting, 'id' | 'value'> & {
//   value: string
// }
type NewPointSettingState = Omit<PointSetting, 'id'>

const defaultNewPointSettingState: NewPointSettingState = {
  name: '',
  value: 0,
  scope: hole_key,
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

  async function handleCreatePointSetting(e) {
    e.preventDefault()
    if (!newPointSetting.name) {
      toast.error('Point name is required')
      return
    }

    if (!newPointSetting.value) {
      toast.error('Point value is required')
      return
    }

    if (pointContext === 'league') {
      // TODO: move to function
      const leaguePointDoesExist = await leaguePointSettingExists({
        name: newPointSetting.name,
        leagueId,
      })
      console.log('leaguePointDoesExist-', leaguePointDoesExist)
      if (leaguePointDoesExist) {
        toast.error(
          `A point setting named "${newPointSetting.name}" already exists for this league. Please choose a different name.`
        )
        return
      } else {
        try {
          const res = await createLeaguePointSetting(newPointSetting, leagueId)
          if (res.ok) {
            setNewPointSetting(getDefaultPointSettingState(pointContext))
            toast.success('Point successfully added')
            inputRef.current && inputRef.current.focus()
          }
        } catch (err) {
          console.log('create league point setting error: ', err)
        }
      }
      return
    }

    if (pointContext === 'round') {
      const roundPointDoesExist = await roundPointSettingExists({
        name: newPointSetting.name,
        roundId,
      })
      console.log('roundPointDoesExist-', roundPointDoesExist)
      if (roundPointDoesExist) {
        toast.error(
          `A point setting named "${newPointSetting.name}" already exists for this round. Please choose a different name.`
        )
        return
      } else {
        // TODO: do each of the await calls also need try/catch? Or is it ok to catch at the end?
        try {
          // check if league point setting exists with indentical settings
          const leaguePointDoesExist = await leaguePointSettingExists({
            name: newPointSetting.name,
            leagueId,
            value: newPointSetting.value,
            scope: newPointSetting.scope,
          })
          console.log('leaguePointDoesExist-', leaguePointDoesExist)
          if (leaguePointDoesExist) {
            toast.error(
              `An identical point setting already exists for this league. Please adjust this round point setting or activate the existing point setting for this round.`
            )
            return
          } else {
            // create league point setting first, then add it to round point setting
            const res = await createLeaguePointSetting(
              newPointSetting,
              leagueId
            )
            if (res.ok) {
              const createdLeaguePoint = await res.json()
              const newRoundPointRes = await createRoundPointSetting(
                createdLeaguePoint.id,
                roundId
              )
              console.log('newRoundPointRes', {
                newRoundPointRes,
                data: await newRoundPointRes.json(),
              })
              if (newRoundPointRes.ok) {
                setNewPointSetting(getDefaultPointSettingState(pointContext))
                toast.success('Point successfully added')
              }
            }
          }
        } catch (err) {
          console.log('create round point setting error: ', err)
        }
      }
    }
  }

  function handlePointValueInputChange({
    target,
  }: React.ChangeEvent<HTMLInputElement>): void {
    setNewPointSetting({ ...newPointSetting, value: +target.value })
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
