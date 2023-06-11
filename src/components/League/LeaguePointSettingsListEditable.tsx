import { PointSetting } from '../../types'
import { ListEditProps } from '../../types'
import { LeaguePointSettingsListItemEditable } from '.'

interface PointSettingsProps extends ListEditProps {
  pointsSettings: PointSetting[]
  twEditInputs?: string
  twListItems?: string
  selectAllInputText?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function LeaguePointSettingsList({
  pointsSettings,
  updateListItem,
  deleteItemFromList,
  listName,
  twEditInputs,
  twListItems,
  selectAllInputText,
}: PointSettingsProps): JSX.Element {
  return (
    <ul className="mb-3">
      {pointsSettings.map((pointSetting) => {
        return (
          <LeaguePointSettingsListItemEditable
            key={pointSetting.id}
            pointSetting={pointSetting}
            updateListItem={updateListItem}
            deleteItemFromList={deleteItemFromList}
            listName={listName}
            twEditInputs={twEditInputs}
            twListItems={twListItems}
            selectAllInputText={selectAllInputText}
          />
        )
      })}
    </ul>
  )
}
