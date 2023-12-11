import { useEffect, useState, useRef } from 'react'
import { PointSettingsListEditable } from '../../components/PointSettings'
import SimpleInputValidationError, {
  ErrorMsgCodes,
} from '../shared/components/SimpleInputValidationError'

import { sortArrayOfObjects, validateSimpleInput } from '../shared/utils'
// import { useFocus } from '../shared/hooks/useFocus'
import { PointSetting } from '../../types'
import BasicInput from '../shared/components/BasicInput'

// import points from '../../point-settings-data.json'

const leagueId = window.location.pathname.split('/')[2]
console.log('leagueId', leagueId)

const defaultNewPointState = {
  name: '',
  value: 0,
  scope: 'hole',
  maxFrequencyPerScope: 1,
}

export async function fetchPointSettings() {
  try {
    const res = await fetch(
      `http://localhost:3001/api/point-settings/${leagueId}`
    )
    const pointSettings = await res.json()
    console.log('point settings pre-sort: ', pointSettings)
    const sortedPointSettings = sortArrayOfObjects(pointSettings, 'name')
    console.log('point settings post-sort: ', sortedPointSettings)
    return sortedPointSettings
  } catch (err) {
    console.log('fetch point settings error: ', err)
  }
}

export default function LeaguePointSettings(): JSX.Element {
  const [pointSettings, setPointSettings] = useState<PointSetting[]>([])
  const [newPoint, setNewPoint] = useState(defaultNewPointState)
  const [inputValidationError, setInputValidationError] = useState<
    string | null
  >(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    refreshPointSettingsState()
  }, [])

  async function refreshPointSettingsState(): Promise<void> {
    const pointSettings = await fetchPointSettings()
    setPointSettings(pointSettings)
  }

  async function handleCreatePointSetting() {
    if (
      !validateSimpleInput(newPoint.name, 'Point Name', setInputValidationError)
    ) {
      return
    } else {
      try {
        const response = await fetch(
          `http://localhost:3001/api/point-setting/${leagueId}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newPoint),
          }
        )
        const resJson = await response.json()
        console.log('resJson', resJson)
        const pointSettings = await fetchPointSettings()
        setPointSettings(pointSettings)
        setNewPoint(defaultNewPointState)
        inputRef.current && inputRef.current.focus()
      } catch (err) {
        console.log('create point setting error: ', err)
      }
    }
  }

  async function deletePointSetting(id: string): Promise<void> {
    try {
      const res = await fetch(`http://localhost:3001/api/point-setting/${id}`, {
        method: 'DELETE',
      })
      console.log('delete point setting res: ', res.json())
      refreshPointSettingsState()
    } catch (err) {
      console.log('delete point setting error: ', err)
    }
  }

  // TODO: move basic handleInputChange to shared hook
  function handleInputChange({
    target: { name: tName, value: tValue },
  }: React.ChangeEvent<HTMLInputElement>): void {
    setNewPoint({ ...newPoint, [tName]: tValue })
  }

  function selectAllInputText(e): void {
    e.target.select()
  }

  //   TODO: if keeping these move to a separate file
  const twEditInputs =
    'block border borderGray300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2'
  const twListItems =
    'max-w-fit rounded-lg my-1 mx-4 p-2 list-item editable-list-item'

  return (
    <div>
      <h1 className="text-3xl font-bold">League Point Settings</h1>

      <BasicInput
        type="text"
        label="Point Name"
        name="name"
        onChange={handleInputChange}
        value={newPoint.name}
        twClasses={`${twEditInputs} w-72 max-w-screen-sm`}
        inputRef={inputRef}
      />

      <BasicInput
        type="number"
        label="Point Value"
        name="value"
        value={newPoint.value}
        onChange={handleInputChange}
        twClasses={`${twEditInputs} w-24 max-w-screen-sm`}
        onFocus={selectAllInputText}
      />

      <button onClick={handleCreatePointSetting}>Add Point</button>
      <SimpleInputValidationError
        errorField={inputValidationError}
        errorMsgCode="MISSNG_VALUE"
      />

      <PointSettingsListEditable
        listName="pointsSettings"
        pointSettings={pointSettings}
        twEditInputs={twEditInputs}
        twListItems={twListItems}
        deletePointSetting={deletePointSetting}
        refreshPointSettingsState={refreshPointSettingsState}
        selectAllInputText={selectAllInputText}
      />
    </div>
  )
}
