export interface PointEarnedAPI {
  playerId: string
  pointSettingId: string
  roundId?: string
  playerHoleId?: string
  frequency: number
}

export async function createRoundPlayerPointEarned({
  playerId,
  pointSettingId,
  roundId,
  playerHoleId,
  frequency,
}: PointEarnedAPI): Promise<any> {
  try {
    const res = await fetch('http://localhost:3001/api/player-point-earned', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        playerId,
        pointSettingId,
        roundId,
        playerHoleId,
        frequency,
      }),
    })
    console.log('createRoundPlayerPointEarned res', res)
    return res
  } catch (err) {
    console.log('createRoundPlayerPointEarned error: ', err)
  }
}

// Currently only updates point quantity or hole association
export async function updatePlayerPointEarned(
  pointEarnedId,
  updatedPointEarned
): Promise<any> {
  try {
    const res = await fetch(
      `http://localhost:3001/api/player-point-earned/${pointEarnedId}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPointEarned),
      }
    )
    console.log('data updatePlayerPointEarned', res)
    return res
  } catch (err) {
    console.log('updatePlayerPointEarned error: ', err)
  }
}

export async function deletePlayerPointEarned(pointEarnedId): Promise<any> {
  try {
    const res = await fetch(
      `http://localhost:3001/api/player-point-earned/${pointEarnedId}`,
      {
        method: 'DELETE',
      }
    )
    const resJson = await res.json()
    console.log('deletePlayerPointEarned res: ', resJson)
    return res
  } catch (err) {
    console.log('deletePlayerPointEarned error: ', err)
  }
}
