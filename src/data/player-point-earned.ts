// TODO: add hole score and rename things to PointScoringEarned?
interface PointEarned {
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

// export async function deletePlayerPointEarnedFromRound(
//   playerId,
//   roundId
// ): Promise<void> {
//   try {
//     const res = await fetch(`http://localhost:3001/api/player-round`, {
//       method: 'DELETE',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ playerId, roundId }),
//     })
//     console.log('delete player from round res: ', res.json())
//   } catch (err) {
//     console.log('delete player from round error: ', err)
//   }
// }
