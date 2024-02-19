export async function updatePlayer(playerId, updatedPlayer) {
  try {
    const res = await fetch(`http://localhost:3001/api/player/${playerId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedPlayer),
    })
    // const resJson = await res.json()
    // console.log('resJson', resJson)
  } catch (err) {
    console.log('update player error: ', err)
  }
}

// TODO: is deleting the player outright the same as removing from league?
export async function deletePlayerFromLeague(playerId) {
  try {
    const res = await fetch(`http://localhost:3001/api/player/${playerId}`, {
      method: 'DELETE',
    })
    console.log('delete player from league res: ', res.json())
  } catch (err) {
    console.log('delete player from league error: ', err)
  }
}

export async function deletePlayerFromRound(playerId, roundId): Promise<void> {
  try {
    const res = await fetch(`http://localhost:3001/api/player-round`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerId, roundId }),
    })
    console.log('delete player from round res: ', res.json())
  } catch (err) {
    console.log('delete player from round error: ', err)
  }
}

export async function createRoundPlayer(playerId, roundId): Promise<void> {
  try {
    const res = await fetch('http://localhost:3001/api/player-round', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        playerId: playerId,
        roundId: roundId,
      }),
    })
    // const res = await res.json()
    console.log('createRoundPlayer res', res)
  } catch (err) {
    console.log('createRoundPlayer error: ', err)
  }
}
