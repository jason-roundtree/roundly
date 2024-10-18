export async function updatePlayer(playerId, updatedPlayer): Promise<any> {
  try {
    const res = await fetch(`http://localhost:3001/api/player/${playerId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedPlayer),
    })
    console.log('updatePlayer res', res)
    return res
  } catch (err) {
    console.log('update player error: ', err)
    return err
  }
}

// TODO: is deleting the player outright the same as removing from league?
export async function deletePlayerFromLeague(playerId): Promise<any> {
  try {
    const res = await fetch(`http://localhost:3001/api/player/${playerId}`, {
      method: 'DELETE',
    })
    console.log('delete player from league res: ', res)
    return res
  } catch (err) {
    console.log('delete player from league error: ', err)
    return err
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

export async function createRoundPlayer(playerId, roundId): Promise<any> {
  try {
    const res = await fetch('http://localhost:3001/api/player-round', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        playerId: playerId,
        roundId: roundId,
      }),
    })
    console.log('createRoundPlayer res', res)
    return res
  } catch (err) {
    console.log('createRoundPlayer error: ', err)
    return err
  }
}
