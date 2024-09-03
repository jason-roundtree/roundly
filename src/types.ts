export interface BasicLeagueState {
  name: string
  startDate: string
  endDate: string

  // pointType: string
  // pointValue: number
  // pointsSettings: PointSetting[]
  // dateInputFocused: boolean
}

export interface League extends BasicLeagueState {
  // name: string
  // startDate: Date
  // endDate: Date
  status: 'active' | 'archived'
  owner: User | User[]
  players: Player[]
  pointSettings: PointSetting[]
  // (post-MVP) - prizes: Prize[]
}

export interface User {
  firstName: string
  lastName: string
  email: string
  leagues?: League[]
}

export interface Player {
  // TODO: ids in types??
  id: string
  name: string
  //   user: User
  //   displayName: string
  //   rounds?: Round[]
}

export interface Round {
  // TODO: ids in types??
  id: string
  name: string
  location?: string
  // TODO: change all dates to string?
  date: string
  pointSettings?: PointSetting[]
  players?: Player[]
}

export interface PointSetting {
  // TODO: ids in types??
  id: string
  name: string
  value: number
  scope: (typeof POINT_SCOPE_SETTINGS)[number]['key']
  // TODO: better to use null over string like 'unlimited'??
  // TODO: is this always 1 now (ie and therefore should be changed to typeof number only?)
  maxFrequencyPerScope: number | null
  isLeagueSetting?: boolean
}
export type PointScopes = PointSetting['scope']

export const POINT_SCOPE_DESCRIPTION =
  'Allows you to restrict where the point can be earned'

export const POINT_SCOPE_SETTINGS = [
  { key: 'no_scope', label: 'No scope' },
  { key: 'hole', label: 'Earned by hole' },
  { key: 'round', label: 'Earned by round' },
] as const

// export type PointScopeKeys = (typeof POINT_SCOPE_SETTINGS)[number]['key']
// export type PointScopeValues = (typeof POINT_SCOPE_SETTINGS)[number]['label']

// export function getPointScopeLabelFromKey(key: PointScopeKeys) {
//   for (const p of POINT_SCOPE_SETTINGS) {
//     if (p.key === key) {
//       return p.label
//     }
//   }
// }
// export function getPointScopeKeyFromValue(label: PointScopeValues) {
//   for (const p of POINT_SCOPE_SETTINGS) {
//     if (p.label === label) {
//       return p.key
//     }
//   }
// }

export interface PointEarned {
  // TODO: ids in types??
  id: string
  pointSetting: PointSetting
  player: Player
  round: Round
  // holeEarned?: 1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18
  holeEarned?: number
}

export interface ListEditProps {
  updateListItem?(id: string, updatedItem: ListObject, listName: string): void
  deleteItemFromList?(id: string, list: string): void
}

export interface ListObject {
  id: string
  [key: string]: any
}

export type NumberOrNull = number | null
