import { useState, useContext } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { RoundContext } from '../Round/RoundContainer'
import BasicInput from '../shared/components/BasicInput'
import PointScopeRadios, { no_scope_key } from './PointScopeRadios'
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
    : 'This is a one-off point setting that only applies to this round'
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const navigate = useNavigate()
  const routeToNavigateToOnUpdate = `/league/${leagueId}/round/${roundId}/point-settings`
  //   const { refreshRoundState } = useContext(RoundContext)

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
      navigate(routeToNavigateToOnUpdate, {
        replace: true,
      })
    }
  }

  async function removePointSettingFromRound(id) {
    const res = await removeRoundPointSetting(id, roundId)
    if (res.ok) {
      toast.success('League point deactivated for round')
      navigate(routeToNavigateToOnUpdate, {
        replace: true,
      })
    }
  }

  function handleInputChange({
    target: { name: name, value: value },
  }: React.ChangeEvent<HTMLInputElement>): void {
    setUpdatedPointSetting({ ...updatedPointSetting, [name]: value })
  }

  function handleRadioInputChange(e) {
    const updatedScope = e.target.value
    const isNoScope = updatedScope === no_scope_key
    setUpdatedPointSetting({
      ...updatedPointSetting,
      scope: updatedScope,
      maxFrequencyPerScope: isNoScope
        ? 1
        : updatedPointSetting.maxFrequencyPerScope,
    })
  }

  // TODO: DRYify with other instances of nearly same function (e.g. AddPointSetting)
  function handlePointMaxFrequencyInputChange({
    target,
  }: React.ChangeEvent<HTMLInputElement>): void {
    const valueNum = +target.value
    setUpdatedPointSetting({
      ...updatedPointSetting,
      maxFrequencyPerScope: valueNum > 0 ? valueNum : 1,
    })
  }

  return (
    <div>
      <h3 className="page-title">Point Setting</h3>
      <p className="ital">{pointContextDescription}</p>
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
      {updatedPointSettingScope !== no_scope_key && (
        <BasicInput
          // disabled={updatedPointSetting.scope === no_scope_key}
          type="number"
          min="1"
          // TODO: edit "Scope" to be Round or Hole depending on which option is selected?
          label="Max Frequency Per Scope"
          name="maxFrequencyPerScope"
          onChange={handlePointMaxFrequencyInputChange}
          value={updatedPointSetting.maxFrequencyPerScope ?? ''}
        />
      )}

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
      {isLeagueSetting ? (
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
