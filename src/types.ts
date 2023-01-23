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

export interface Player {
  user: User
  displayName: string
  rounds?: Round[]
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
