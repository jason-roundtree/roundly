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
