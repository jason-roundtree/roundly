// import { PointSetting } from '../../types'
// import { ListEditProps } from '../../types'
// import { LeaguePointSettingsListItem } from '.'

// interface PointSettingsProps extends ListEditProps {
//   pointSettings: PointSetting[]
//   twEditInputs?: string
//   twListItems?: string
//   deletePointSetting: (pointId: string, roundId?: string) => Promise<void>
//   selectAllInputText?: (e: React.ChangeEvent<HTMLInputElement>) => void
//   refreshState?: () => void
// }

// export default function PointSettingsListEditable({
//   pointSettings,
//   deletePointSetting,
//   twEditInputs,
//   twListItems,
//   refreshState,
//   selectAllInputText,
// }: PointSettingsProps): JSX.Element {
//   return (
//     <ul className="mb-3 mt-5">
//       {pointSettings.map((pointSetting) => {
//         return (
//           <LeaguePointSettingsListItem
//             key={pointSetting.id}
//             pointSetting={pointSetting}
//             deletePointSetting={deletePointSetting}
//             twEditInputs={twEditInputs}
//             twListItems={twListItems}
//             refreshState={refreshState}
//             selectAllInputText={selectAllInputText}
//           />
//         )
//       })}
//     </ul>
//   )
// }
