import { useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'

import Select from '../shared/components/Select'
import BasicInput from '../shared/components/BasicInput'
import {
  ppeQuantityExceedsMax,
  getPlayerPointEarnedQuantity,
  getSelectableOptions,
  quantityInputScopeManager,
} from '../shared/utils'
import { PointScopes, PointSetting } from '../../types'
import { no_scope_key } from '../PointSettings/PointScopeRadios'
import {
  createOrFindPlayerHole,
  createRoundPlayerPointEarned,
} from '../../data'

interface PointSettingEarnedState {
  id: string
  name: string
  maxFrequencyPerScope: number | null
  value: string | number
  // TODO: look into (string & {}) and remove it if it doesn't provide a benefit
  scope: PointScopes | (string & {})
}

const defaultSelectedPointEarnedState: PointSettingEarnedState = {
  id: '',
  name: '',
  maxFrequencyPerScope: null,
  value: '',
  scope: '',
}

// TODO: type
export default function EnterPointEarned({
  pointSettings,
  roundPointsEarned,
  selectedHole,
  selectedPlayer,
  roundId,
}) {
  const [selectedPointEarned, setSelectedPointEarned] = useState(
    defaultSelectedPointEarnedState
  )
  const [pointEarnedFrequency, setPointEarnedFrequency] = useState(1)
  const playerId = selectedPlayer.id
  const {
    id: pointSettingId,
    scope,
    maxFrequencyPerScope,
  } = selectedPointEarned
  console.log('selectedPointEarned >> ', selectedPointEarned)
  // TODO: move this to be managed by state and useEffect?
  const [frequencyIsActive, quantityInputLabel, maxFrequency] =
    quantityInputScopeManager(selectedPointEarned)
  console.log('maxFrequency <<<<< ', maxFrequency)

  function handleUpdatePointEarnedState(e) {
    // TODO: reimplement
    // setShowOneInputRequiredError(false)
    const pointName = e.target.value
    if (!pointName) {
      setSelectedPointEarned(defaultSelectedPointEarnedState)
    } else {
      const pointSetting = pointSettings.find(
        (point) => point.name === pointName
      ) as PointSetting
      setSelectedPointEarned({
        id: pointSetting.id,
        name: pointName,
        maxFrequencyPerScope: pointSetting.maxFrequencyPerScope,
        value: pointSetting.value,
        scope: pointSetting.scope,
      })
    }
  }

  function clearState() {
    setSelectedPointEarned(defaultSelectedPointEarnedState)
    setPointEarnedFrequency(1)
  }

  async function handleSubmitPointEarned() {
    console.log('handleSubmitPointEarned')

    // TODO: move all validation to separate validation function? Just move max frequency stuff?
    if (!selectedPointEarned.name) {
      toast.error('Please select a point setting')
      return
    }
    // TODO: Aside from type checking that maxFrequencyPerScope is not null when passing to max checked, does it matter if I check maxFrequencyPerScope or scope here?
    // if (scope !== no_scope_key) {
    // TODO: add something that shows or warns if same point has already been entered for hole??
    if (maxFrequencyPerScope) {
      const holeToValidateAgainst = scope === 'hole' ? +selectedHole : null
      const ppeTotal = getPlayerPointEarnedQuantity(
        pointSettingId,
        roundPointsEarned,
        holeToValidateAgainst,
        null
      )
      console.log('ppeTotal', ppeTotal)
      if (
        ppeQuantityExceedsMax(
          pointEarnedFrequency,
          ppeTotal,
          maxFrequencyPerScope
        )
      ) {
        // TODO: change this to not auto-remove?
        toast.error(
          'Quantity entered would exceed maximum. Please enter a lower quantity.'
        )
        return
      }
    }

    const pointEarnedData = {
      playerId: playerId,
      pointSettingId: pointSettingId,
      roundId: roundId,
      playerHoleId: undefined,
      frequency: pointEarnedFrequency,
    }
    if (selectedHole) {
      const holeData = {
        playerId: playerId,
        hole: +selectedHole,
        roundId: roundId,
      }
      const playerHoleRes = await createOrFindPlayerHole(holeData)
      if (playerHoleRes.ok) {
        const [playerHole, created] = await playerHoleRes.json()
        pointEarnedData.playerHoleId = playerHole.id
      } else {
        // TODO: some error message here?
        return
      }
    }

    const pointEarnedRes = await createRoundPlayerPointEarned(pointEarnedData)
    if (pointEarnedRes.ok) {
      toast.success('Point successfully created')
      clearState()
    } else {
      // TODO: some error message here?
      return
    }
  }

  return (
    <>
      <Select
        options={[
          { id: 'noPointSelected', value: '' },
          ...getSelectableOptions(pointSettings),
        ]}
        id="point-type-select"
        label="Point Earned"
        // name="roundPlayerAddPointEarnedAndOrScore"
        value={`${selectedPointEarned.name}`}
        onChange={handleUpdatePointEarnedState}
        // const index = e.target.selectedIndex;
        // const el = e.target.childNodes[index]
        // const option =  el.getAttribute('id');
      />

      <BasicInput
        type="number"
        min="1"
        max={frequencyIsActive && maxFrequency ? maxFrequency.toString() : null}
        name="point-earned-quantity"
        label={quantityInputLabel}
        value={pointEarnedFrequency}
        onChange={(e) => {
          const valueNum = +e.target.value
          setPointEarnedFrequency(valueNum > 0 ? valueNum : 1)
        }}
        // onBlur={validateInputFrequencyAgainstPointSetting}
        disabled={!frequencyIsActive}
      />

      <button onClick={handleSubmitPointEarned}>Add Point Earned</button>

      <ToastContainer position="bottom-left" autoClose={3000} />
    </>
  )
}
