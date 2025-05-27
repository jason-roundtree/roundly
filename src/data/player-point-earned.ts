export interface PointEarnedAPI {
  playerId: string
  pointSettingId: string
  roundId?: string
  playerHoleId?: string
  quantity: number
}

export async function createRoundPlayerPointEarned({
  playerId,
  pointSettingId,
  roundId,
  playerHoleId,
  quantity,
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
        quantity,
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

export async function checkPlayerPointEarnedOnHole({
  playerId,
  pointSettingId,
  roundId,
  hole,
}: {
  playerId: string
  pointSettingId: string
  roundId: string
  hole: string
}): Promise<any> {
  try {
    const queryParams = new URLSearchParams({
      playerId,
      pointSettingId,
      roundId,
      hole,
    }).toString()
    const res = await fetch(
      `http://localhost:3001/api/player-point-earned/hole-point-earned?${queryParams}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }
    )
    console.log('checkPlayerPointEarned res: ', res)
    if (res.status === 200) {
      return {
        status: res.status,
        data: await res.json(),
      }
    } else {
      return {
        status: res.status,
        message: 'Point not earned on hole',
      }
    }
  } catch (err) {
    console.log('checkPlayerPointEarned error: ', err)
  }
}

export async function checkPlayerPointEarnedInRound({
  playerId,
  pointSettingId,
  roundId,
}: {
  playerId: string
  pointSettingId: string
  roundId: string
}): Promise<any> {
  try {
    const queryParams = new URLSearchParams({
      playerId,
      pointSettingId,
      roundId,
    }).toString()
    const res = await fetch(
      `http://localhost:3001/api/player-point-earned/round-point-earned?${queryParams}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }
    )
    if (res.status === 200) {
      return {
        status: res.status,
        data: await res.json(),
      }
    } else {
      return {
        status: res.status,
        message: 'Point not earned in round',
      }
    }
  } catch (err) {
    console.log('checkPlayerPointEarned in round error: ', err)
  }
}
