export async function fetchBasicLeagueData(leagueId) {
  try {
    const res = await fetch(`http://localhost:3001/api/league/${leagueId}`)
    const leagueData = await res.json()
    console.log('get league data res: ', leagueData)
    return leagueData
  } catch (err) {
    console.log('get league data error: ', err)
  }
}
