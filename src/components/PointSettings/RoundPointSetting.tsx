import { useState, useContext } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { RoundContext } from '../Round/RoundContainer'
import BasicInput from '../shared/components/BasicInput'
import PointScopeRadios, { round_key } from './PointScopeRadios'
import Checkbox from '../shared/components/Checkbox'
import {
  EditablePointSetting,
  defaultEditablePointSettingState,
} from './LeaguePointSetting'
import { selectAllInputText } from '../shared/utils'
import {
  deleteLeaguePointSetting,
  getPointSetting,
  removeRoundPointSetting,
  updatePointSetting,
} from '../../data'
import DeleteConfirmationModal from '../shared/components/DeleteConfirmationModal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAnglesRight } from '@fortawesome/free-solid-svg-icons'

type EditableRoundPointSetting = EditablePointSetting & {
  isLeagueSetting: boolean
}
const defaultState: EditableRoundPointSetting = {
  ...defaultEditablePointSettingState,
  isLeagueSetting: false,
}

export default function RoundPointSetting() {
  const location = useLocation()
  const { leagueId, roundId, pointSetting } = location.state
  const [updatedPointSetting, setUpdatedPointSetting] =
    useState<EditableRoundPointSetting>(() => pointSetting || defaultState)
  const updatedPointSettingScope = updatedPointSetting.scope
  const { id, name, value, isLeagueSetting, scope } = pointSetting
  const pointContextDescription = isLeagueSetting
    ? 'This is a league-wide point setting that applies to all rounds'
    : 'This is a custom point setting that only applies to this round'
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const navigate = useNavigate()
  const routeToNavigateToOnUpdate = `/league/${leagueId}/round/${roundId}/point-settings`
  const { pointSettings: roundPointSettings, refreshRoundState } =
    useContext(RoundContext)
  const pointIsActiveInRound = roundPointSettings.some((p) => p.id === id)

  //   TODO: add ability to only update league points for the round (currently it updates it for league)
  async function handleUpdatePointSetting(): Promise<void> {
    if (!updatedPointSetting.name) {
      toast.error('Point name is required')
      return
    }
    const res = await updatePointSetting(id, updatedPointSetting)
    if (res.ok) {
      toast.success('Point setting was successfully updated')
      navigate(routeToNavigateToOnUpdate, {
        replace: true,
      })
    }
  }

  async function handleDeletePointSetting(pointId) {
    const res = await deleteLeaguePointSetting(pointId)
    if (res.ok) {
      toast.success('Point setting was successfully deleted')
      refreshRoundState()
    }
  }

  async function removePointSettingFromRound(id) {
    const res = await removeRoundPointSetting(id, roundId)
    if (res.ok) {
      toast.success('League point deactivated for round')
      refreshRoundState()
      navigate(-1)
    }
  }

  function handleInputChange({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement>): void {
    setUpdatedPointSetting({ ...updatedPointSetting, [name]: value })
  }

  function handleRadioInputChange(e) {
    const updatedScope = e.target.value
    // const isNoScope = updatedScope === round_key
    setUpdatedPointSetting({
      ...updatedPointSetting,
      scope: updatedScope,
      // maxFrequencyPerScope: isNoScope
      //   ? 1
      //   : updatedPointSetting.maxFrequencyPerScope,
    })
  }

  // TODO: DRYify with other instances of nearly same function (e.g. AddPointSetting)
  // function handlePointMaxFrequencyInputChange({
  //   target,
  // }: React.ChangeEvent<HTMLInputElement>): void {
  //   const valueNum = +target.value
  //   setUpdatedPointSetting({
  //     ...updatedPointSetting,
  //     // maxFrequencyPerScope: valueNum > 0 ? valueNum : 1,
  //   })
  // }

  return (
    <div>
      <h3 className="page-title">Point Setting</h3>
      <div className="ta-center">
        <Link to={`/league/${leagueId}/round/${roundId}/point-settings`}>
          Round Point Settings <FontAwesomeIcon icon={faAnglesRight} />
        </Link>
      </div>

      <p className="ital mt-lg">{pointContextDescription}</p>
      {!isLeagueSetting && (
        <Checkbox
          id="updateRoundPointToLeague"
          containerClassName="mt-0"
          checked={Boolean(updatedPointSetting.isLeagueSetting)}
          label="Add to league point settings?"
          onChange={() =>
            setUpdatedPointSetting((ps) => ({
              ...updatedPointSetting,
              isLeagueSetting: !ps.isLeagueSetting,
            }))
          }
        />
      )}

      <BasicInput
        type="text"
        label="Point Name"
        name="name"
        onChange={handleInputChange}
        value={updatedPointSetting.name}
      />

      <BasicInput
        type="number"
        label="Point Value"
        name="value"
        value={updatedPointSetting.value}
        onChange={handleInputChange}
        onFocus={selectAllInputText}
      />

      <PointScopeRadios
        name="pointScope-radios-modal"
        onChange={handleRadioInputChange}
        selectedScope={updatedPointSetting.scope}
      />

      {/* TODO: make into component or fold into PointScopeRadios since it's currently used in 3 components */}
      {/* {updatedPointSettingScope !== round_key && (
        <BasicInput
          // disabled={updatedPointSetting.scope === round_key}
          type="number"
          min="1"
          // TODO: edit "Scope" to be Round or Hole depending on which option is selected?
          label="Max Frequency Per Scope"
          name="maxFrequencyPerScope"
          onChange={handlePointMaxFrequencyInputChange}
          value={updatedPointSetting.maxFrequencyPerScope ?? ''}
        />
      )} */}

      {showDeleteConfirmation && (
        <DeleteConfirmationModal
          modalTitle="Confirm Point Deletion"
          confirmationText={`Are you sure you want to delete ${name} from the league?`}
          buttonText="Delete"
          onConfirmDelete={() => handleDeletePointSetting(id)}
          toggleModalActive={() => setShowDeleteConfirmation(false)}
        />
      )}

      <button onClick={handleUpdatePointSetting}>Save</button>
      {isLeagueSetting && pointIsActiveInRound ? (
        <button onClick={() => removePointSettingFromRound(id)}>
          Deactivate for round
        </button>
      ) : (
        <button
          onClick={() => setShowDeleteConfirmation(true)}
          className="delete-button"
        >
          Delete
        </button>
      )}
    </div>
  )
}
