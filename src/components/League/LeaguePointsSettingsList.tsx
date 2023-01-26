import { PointSetting } from '../../types'
import { ListEditProps } from '../../types'
import { LeaguePointSettingsListItem } from './'

interface PointSettingsProps extends ListEditProps {
  pointsSettings: PointSetting[]
  twEditInputs: string
  twListItems: string
}

export default function LeaguePointsSettingsList({
  pointsSettings,
  updateListItem,
  deleteItemFromList,
  listName,
  twEditInputs,
  twListItems,
}: PointSettingsProps): JSX.Element {
  return (
    <ul className="mb-3">
      {pointsSettings.map((pointSetting) => {
        return (
          <LeaguePointSettingsListItem
            key={pointSetting.id}
            pointSetting={pointSetting}
            updateListItem={updateListItem}
            deleteItemFromList={deleteItemFromList}
            listName={listName}
            twEditInputs={twEditInputs}
            twListItems={twListItems}
          />
        )
      })}
    </ul>
  )
}
