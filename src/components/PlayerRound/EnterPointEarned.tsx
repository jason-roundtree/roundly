import { useState } from 'react'

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

interface PointEarnedState {
  id: string
  name: string
  maxFrequencyPerScope: number | null
  value: string | number
  // TODO: look into (string & {}) and remove it if it doesn't provide a benefit
  scope: PointScopes | (string & {})
}

const defaultSelectedPointEarnedState: PointEarnedState = {
  id: '',
  name: '',
  maxFrequencyPerScope: null,
  value: '',
  scope: '',
}

// TODO: type
export default function EnterPointEarned({
  pointSettings,
  playerPointsEarnedInRound,
}) {
  const [selectedPointEarned, setSelectedPointEarned] = useState(
    defaultSelectedPointEarnedState
  )
  const {
    id: pointSettingId,
    scope,
    maxFrequencyPerScope,
  } = selectedPointEarned
  const [pointEarnedFrequency, setPointEarnedFrequency] = useState(1)

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

  function handleSubmitPointEarned() {
    console.log('handleSubmitPointEarned')
    // TODO:
    /***
     * if PPE max frequency would be exceeded {
     *   show validation error and return
     * } else {
     *   if hole is selected {
     *     if PlayerHole exists {
     *       - get PlayerHole ID,
     *       - create PlayerPointEarned and attach PlayerHole to it
     *     } else {
     *       - create PlayerHole,
     *       - create PlayerPointEarned and attach PlayerHole to it
     *     }
     *   } else {
     *     create PlayerPointEarned
     *   }
     *
     *   if PlayerPointEarned was successfully created {
     *     - show confirmation message
     *     - clear inputs
     *   }
     * }
     */
    // TODO: move this to separate validation function?
    // TODO: Aside from type checking that maxFrequencyPerScope is not null when passing to max checked, does it matter if I check maxFrequencyPerScope or scope here?
    // if (scope !== no_scope_key) {
    if (maxFrequencyPerScope) {
      const ppeTotal = getPlayerPointEarnedQuantity(
        pointSettingId,
        playerPointsEarnedInRound,
        null,
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
        console.log('!!!!** quantity would be exceeded **!!!!')
        return
      }
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
    </>
  )
}
