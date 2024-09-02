interface PlayerHole {
  playerId: string
  roundId: string
  hole: number | null
  score?: number | null
}

// TODO: somehow make this distinct so it's clear that it gets PlayerHole by hole and not playerHoleId
export async function getPlayerHole({ playerId, roundId, hole }): Promise<any> {
  try {
    const res = await fetch(
      `http://localhost:3001/api/player-hole/player/${playerId}/round/${roundId}/hole/${hole}`
    )
    console.log('getPlayerHole res', res)
    return res
  } catch (err) {
    console.log('getPlayerHole err', err)
  }
}

export async function createOrFindPlayerHole({
  playerId,
  roundId,
  hole,
  score,
}: PlayerHole): Promise<any> {
  try {
    const res = await fetch('http://localhost:3001/api/player-hole', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        playerId: playerId,
        roundId: roundId,
        hole: hole,
        score: score,
      }),
    })
    console.log('createOrFindPlayerHole res', res)
    return res
  } catch (err) {
    console.log('createOrFindPlayerHole error: ', err)
  }
}

// export async function updatePlayerHoleScore(playerHoleId, score): Promise<any> {
//   try {
//     const res = await fetch(
//       `http://localhost:3001/api/player-hole/${playerHoleId}`,
//       {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           score: score,
//         }),
//       }
//     )
//     console.log('updatePlayerHoleScore res', res)
//     return res
//   } catch (err) {
//     console.log('updatePlayerHoleScore error: ', err)
//   }
// }

export async function updatePlayerHole(
  playerHoleId,
  updatedPlayerHole
): Promise<any> {
  console.log('updatedPlayerHole ++++', updatedPlayerHole)
  try {
    const res = await fetch(
      `http://localhost:3001/api/player-hole/${playerHoleId}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPlayerHole),
      }
    )
    console.log('updatePlayerHole res', res)
    return res
  } catch (err) {
    console.log('updatePlayerHole error: ', err)
  }
}

export async function getPlayerHoleScores(
  playerId,
  roundId,
  scoreIsNotNull
): Promise<any> {
  try {
    const res = await fetch(
      `http://localhost:3001/api/player-hole/player/${playerId}/round/${roundId}?scoreIsNotNull=${scoreIsNotNull}`,
      { method: 'GET' }
    )
    console.log('getPlayerHoleScores res', res)
    return res
  } catch (err) {
    console.log('getPlayerHoleScores error: ', err)
  }
}
