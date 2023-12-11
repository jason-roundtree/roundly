import { PointSetting } from '../../types'
import { ListEditProps } from '../../types'
import { PointSettingsListItemEditable } from '.'

interface PointSettingsProps extends ListEditProps {
  pointSettings: PointSetting[]
  twEditInputs?: string
  twListItems?: string
  deletePointSetting: (id: string) => Promise<void>
  selectAllInputText?: (e: React.ChangeEvent<HTMLInputElement>) => void
  refreshPointSettingsState?: () => void
}

export default function LeaguePointSettingsList({
  pointSettings,
  deletePointSetting,
  twEditInputs,
  twListItems,
  refreshPointSettingsState,
  selectAllInputText,
}: PointSettingsProps): JSX.Element {
  return (
    <ul className="mb-3 mt-5">
      {pointSettings.map((pointSetting) => {
        return (
          <PointSettingsListItemEditable
            key={pointSetting.id}
            pointSetting={pointSetting}
            deletePointSetting={deletePointSetting}
            twEditInputs={twEditInputs}
            twListItems={twListItems}
            refreshPointSettingsState={refreshPointSettingsState}
            selectAllInputText={selectAllInputText}
          />
        )
      })}
    </ul>
  )
}
