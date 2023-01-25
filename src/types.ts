export interface League {
  name: string
  startDate: Date
  endDate: Date
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

// TODO: simplify some of these property names like `playerName`, `pointType`, `pointValue` to not use the main object (e.g. `player`)in the names? If so then leagueState will need to be reworked/separated

export interface Player {
  // TODO: ids in types??
  id: string
  playerName: string
  //   user: User
  //   displayName: string
  //   rounds?: Round[]
}

export interface Round {
  name: string
  location?: string
  date: Date
  pointSettings: PointSetting[] | null
  players: Player[]
}

export interface PointSetting {
  // TODO: ids in types??
  id: string
  pointType: string
  pointValue: number
  // scope: 'hole' | 'round'
  // maxFrequencyPerScope: number | 'unlimited'
}

export interface PointEarned {
  pointSetting: PointSetting
  player: Player
  round: Round
  // holeEarned?: 1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18
  holeEarned?: number
}

export interface ListEditProps {
  listName: string
  updateListItem: (id: string, list: string, updatedItem: any) => void
  deleteItemFromList: (id: string, list: string) => void
}
