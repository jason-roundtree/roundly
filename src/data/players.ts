import { sortArrayOfObjects } from '../components/shared/utils'

export async function fetchLeaguePlayers(leagueId): Promise<any> {
  try {
    const res = await fetch(`http://localhost:3001/api/players/${leagueId}`)
    const players = await res.json()
    console.log('players pre sort: ', players)
    // TODO: move sort out or add it as a parameter
    const sortedPlayers = sortArrayOfObjects(players, 'name')
    console.log('players post sort: ', sortedPlayers)
    return sortedPlayers
  } catch (err) {
    console.log('fetch players error: ', err)
  }
}
