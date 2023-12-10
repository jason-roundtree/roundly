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
  date: Date
  pointSettings: PointSetting[] | null
  players: Player[]
}

export interface PointSetting {
  // TODO: ids in types??
  id: string
  name: string
  value: number
  scope: 'hole' | 'round'
  // TODO: better to use null over string like 'unlimited'??
  maxFrequencyPerScope: number | null
}

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
  listName: string | undefined
  updateListItem?: (
    id: string,
    updatedItem: ListObject,
    listName: string
  ) => void
  deleteItemFromList?: (id: string, list: string) => void
}

export interface ListObject {
  id: string
  [key: string]: any
}
