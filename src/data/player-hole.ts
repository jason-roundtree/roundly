interface PlayerHole {
  playerId: string
  roundId: string
  hole: number
}
// TODO: add hole_score
export async function createPlayerHole({
  playerId,
  roundId,
  hole,
}: PlayerHole): Promise<any> {
  try {
    const res = await fetch('http://localhost:3001/api/player-hole', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        playerId: playerId,
        roundId: roundId,
        hole: hole,
      }),
    })
    console.log('createPlayerHole res', res)
    return res
  } catch (err) {
    console.log('createPlayerHole error: ', err)
  }
}
