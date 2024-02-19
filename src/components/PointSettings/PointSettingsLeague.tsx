import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { PointSettingsListEditable, AddPointSetting } from '.'
import { PointSetting } from '../../types'
import { fetchLeaguePointSettings, deletePointSetting } from '../../data'

export default function PointSettings(): JSX.Element {
  const [pointSettings, setPointSettings] = useState<PointSetting[]>([])

  const { leagueId } = useParams()

  useEffect(() => {
    refreshPointSettingsState()
  }, [])

  async function refreshPointSettingsState(): Promise<void> {
    const pointSettings = await fetchLeaguePointSettings(leagueId)
    setPointSettings(pointSettings)
  }

  async function handleDeletePointSetting(pointId) {
    await deletePointSetting(pointId)
    refreshPointSettingsState()
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
    <>
      <Link to={`/league/${leagueId}`}>League Home</Link>

      <h2>Point Settings</h2>

      <AddPointSetting
        refreshState={refreshPointSettingsState}
        pointContext="league"
      />

      {/* TODO: create reusable component to be shared here and PointSettingsRound */}
      <PointSettingsListEditable
        listName="pointsSettings"
        pointSettings={pointSettings}
        twEditInputs={twEditInputs}
        twListItems={twListItems}
        deletePointSetting={handleDeletePointSetting}
        refreshPointSettingsState={refreshPointSettingsState}
        selectAllInputText={selectAllInputText}
      />
    </>
  )
}
