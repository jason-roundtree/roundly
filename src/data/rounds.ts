import { sortArrayOfObjects } from '../components/shared/utils'

export async function fetchLeagueRounds(leagueId): Promise<any> {
  try {
    const res = await fetch(`http://localhost:3001/api/rounds/${leagueId}`)
    const rounds = await res.json()
    console.log('rounds pre sort: ', rounds)
    // TODO: move sort out or add it as a parameter
    const sortedRounds = sortArrayOfObjects(rounds, 'name')
    console.log('rounds post sort: ', sortedRounds)
    return sortedRounds
  } catch (err) {
    console.log('fetch rounds error: ', err)
  }
}
