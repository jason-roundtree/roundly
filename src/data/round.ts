export async function fetchRound(roundId): Promise<any> {
  try {
    const res = await fetch(`http://localhost:3001/api/round/${roundId}`)
    const round = await res.json()
    console.log('round: ', round)
    return round
  } catch (err) {
    console.log('fetch round error: ', err)
  }
}

export async function deleteRound(roundId): Promise<any> {
  try {
    const res = await fetch(`http://localhost:3001/api/round/${roundId}`, {
      method: 'DELETE',
    })
    console.log('delete round', res.json())
  } catch (err) {
    console.log('delete round error', err)
  }
}
