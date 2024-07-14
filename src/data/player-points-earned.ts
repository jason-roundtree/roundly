export async function getRoundPlayerPointsEarnedTotal(
  playerId: string,
  roundId: string
): Promise<any> {
  try {
    const res = await fetch(
      `http://localhost:3001/api/player-points-earned/player/${playerId}/round/${roundId}/total-points`
    )
    return res
  } catch (err) {
    console.log('get total RoundPlayerPointsEarned error: ', err)
  }
}

export async function getRoundPlayerPointsEarned(
  playerId: string,
  roundId: string
): Promise<any> {
  try {
    const res = await fetch(
      `http://localhost:3001/api/player-points-earned/player/${playerId}/round/${roundId}`
    )
    return res
  } catch (err) {
    console.log('get total RoundPlayerPointsEarned error: ', err)
  }
}

export async function getRoundPlayerPointsEarnedByPointSetting(
  playerId: string,
  roundId: string,
  pointSettinId: string
): Promise<any> {
  try {
    const res = await fetch(
      `http://localhost:3001/api/player-points-earned/player/${playerId}/round/${roundId}/point/${pointSettinId}`
    )
    return res
  } catch (err) {
    console.log(
      'get total getRoundPlayerPointsEarnedByPointSetting error: ',
      err
    )
  }
}

export async function getRoundPlayerPointsEarnedByHole(
  playerId: string,
  roundId: string,
  holeNumber: number
): Promise<any> {
  try {
    const res = await fetch(
      `http://localhost:3001/api/player-points-earned/player/${playerId}/round/${roundId}/hole/${holeNumber}`
    )
    return res
  } catch (err) {
    console.log('get total getRoundPlayerPointsEarnedByHole error: ', err)
  }
}
