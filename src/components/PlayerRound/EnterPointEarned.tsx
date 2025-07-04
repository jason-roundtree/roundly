import { useState } from 'react'
import { toast } from 'react-toastify'

import Select from '../shared/components/Select'
import BasicInput from '../shared/components/BasicInput'
import {
  getSelectableOptions,
  // quantityInputScopeManager,
  selectAllInputText,
} from '../shared/utils'
import { PointScopes, PointSetting } from '../../types'
import { no_scope_key } from '../PointSettings/PointScopeRadios'
import {
  checkPlayerPointEarnedInRound,
  checkPlayerPointEarnedOnHole,
  createOrFindPlayerHole,
  createRoundPlayerPointEarned,
} from '../../data'

interface PointSettingEarnedState {
  id: string
  name: string
  value: string | number
  // TODO: look into (string & {}) and remove it if it doesn't provide a benefit
  scope: PointScopes | (string & {})
}

const defaultSelectedPointEarnedState: PointSettingEarnedState = {
  id: '',
  name: '',
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
  const [pointEarnedQuantity, setPointEarnedQuantity] = useState(1)
  const selectedPlayerId = selectedPlayer.id
  const { id: selectedPointSettingId, scope } = selectedPointEarned

  function handleUpdatePointEarnedState(e) {
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
        value: pointSetting.value,
        scope: pointSetting.scope,
        // maxFrequencyPerScope: pointSetting.maxFrequencyPerScope,
      })
    }
  }

  function clearState() {
    setSelectedPointEarned(defaultSelectedPointEarnedState)
    setPointEarnedQuantity(1)
  }

  async function handleSubmitPointEarned() {
    if (!selectedPointEarned.name) {
      toast.error('Please select the point earned')
      return
    }

    if (scope === 'hole') {
      console.log('scope hole', scope)
      if (!selectedHole) {
        toast.error('Please select a hole')
        return
      }
      // TODO: move to function
      const checkPlayerPointEarnedOnHoleRes =
        await checkPlayerPointEarnedOnHole({
          playerId: selectedPlayerId,
          pointSettingId: selectedPointEarned.id,
          roundId,
          hole: selectedHole,
        })
      if (checkPlayerPointEarnedOnHoleRes.status === 200) {
        toast.error(
          `Player has already earned ${selectedPointEarned.name} for hole ${selectedHole}`
        )
        return
      }
    }

    // TODO: move to function
    if (scope === 'round') {
      const checkPlayerPointEarnedInRoundRes =
        await checkPlayerPointEarnedInRound({
          playerId: selectedPlayerId,
          pointSettingId: selectedPointSettingId,
          roundId,
        })
      if (checkPlayerPointEarnedInRoundRes.status === 200) {
        toast.error(
          `Player has already earned ${selectedPointEarned.name} for this round`
        )
        return
      }
    }

    const pointEarnedData = {
      playerId: selectedPlayerId,
      pointSettingId: selectedPointSettingId,
      roundId: roundId,
      playerHoleId: undefined,
      quantity: pointEarnedQuantity,
    }
    if (selectedHole) {
      const holeData = {
        playerId: selectedPlayerId,
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
        name="point-earned-quantity"
        label="Quantity"
        value={pointEarnedQuantity}
        onChange={(e) => {
          const valueNum = +e.target.value
          setPointEarnedQuantity(valueNum > 0 ? valueNum : 1)
        }}
        onFocus={selectAllInputText}
        disabled={scope === 'hole'}
      />

      <button onClick={handleSubmitPointEarned}>Add Point Earned</button>
    </>
  )
}
