// TODO: move LeaguePointSettings... components to PointSetting folder like PlayerList... components?
// TODO: move LeaguePointSettings... components to PointSetting folder like PlayerList... components?
// TODO: move LeaguePointSettings... components to PointSetting folder like PlayerList... components?
import { useEffect, useState, useRef } from 'react'
import { LeaguePointSettingsListEditable } from '../../components/League'
import { sortArrayOfObjects } from '../shared/utils'
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

export default function LeaguePointSettings() {
  const [pointSettings, setPointSettings] = useState<PointSetting[]>([])
  const [newPoint, setNewPoint] = useState(defaultNewPointState)
  // const [inputRef, setInputFocus] = useFocus()
  const inputRef = useRef<HTMLInputElement>(null)

  // const [showInputError, setShowInputError] = useState({
  //   name: false,
  //   maxFrequencyPerScope: false,
  // })

  useEffect(() => {
    refreshPointSettingsState()
  }, [])

  async function refreshPointSettingsState(): Promise<void> {
    const points = await fetchPointSettings()
    setPointSettings(points)
  }

  async function handleCreatePointSetting(e) {
    e.preventDefault()
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

  function handleInputChange({
    target: { name: tName, value: tValue },
  }: React.ChangeEvent<HTMLInputElement>): void {
    setNewPoint({ ...newPoint, [tName]: tValue })
  }

  // if (!newPoint[tName]) {
  //   setShowInputError({
  //     ...showInputError,
  //     [tName]: true,
  //   })
  // } else {
  //   setShowInputError({
  //     ...showInputError,
  //     [tName]: false,
  //   })
  // if (!newPoint.name) {
  //   setShowInputError(true)
  //   return
  // }
  // setPointSettings([...pointSettings, newPoint])

  function selectAllInputText(e): void {
    e.target.select()
  }

  //   TODO: if keeping these move to a separate file
  const twEditInputs =
    'block border borderGray300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2'
  const twListItems =
    'max-w-fit rounded-lg my-1 mx-4 p-2 list-item editable-list-item'

  return (
    <form>
      <div>League Point Settings</div>

      <BasicInput
        type="text"
        label="Point Name"
        name="name"
        onChange={handleInputChange}
        value={newPoint.name}
        twClasses={`${twEditInputs} w-72 max-w-screen-sm`}
        inputRef={inputRef}
        // showEmptyInputError={showInputError.name}
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

      <button
        data-input-item="pointName"
        data-input-list="pointsSettings"
        onClick={handleCreatePointSetting}
      >
        Add Point
      </button>

      <LeaguePointSettingsListEditable
        listName="pointsSettings"
        pointsSettings={pointSettings}
        twEditInputs={twEditInputs}
        twListItems={twListItems}
        refreshPointSettingsState={refreshPointSettingsState}
        selectAllInputText={selectAllInputText}
      />
    </form>
  )
}
