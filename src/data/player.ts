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

export async function deletePlayer(playerId) {
  try {
    const res = await fetch(`http://localhost:3001/api/player/${playerId}`, {
      method: 'DELETE',
    })
    console.log('delete player res: ', res.json())
  } catch (err) {
    console.log('delete player error: ', err)
  }
}
