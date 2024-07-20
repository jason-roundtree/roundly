export interface PointEarned {
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
}: PointEarned): Promise<any> {
  try {
    const res = await fetch('http://localhost:3001/api/player-point-earned', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        playerId: playerId,
        pointSettingId: pointSettingId,
        roundId: roundId,
        playerHoleId: playerHoleId,
        frequency: frequency,
      }),
    })
    console.log('createRoundPlayerPointEarned res', res)
    return res
  } catch (err) {
    console.log('createRoundPlayerPointEarned error: ', err)
  }
}

// export async function updatePlayerPointEarned(playerId, updatedPlayer) {
//   try {
//     const res = await fetch(`http://localhost:3001/api/player/${playerId}`, {
//       method: 'PUT',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(updatedPlayer),
//     })
//     // const resJson = await res.json()
//     // console.log('resJson', resJson)
//   } catch (err) {
//     console.log('update player error: ', err)
//   }
// }

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
