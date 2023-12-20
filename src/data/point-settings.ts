import { sortArrayOfObjects } from '../components/shared/utils'

export async function fetchLeaguePointSettings(leagueId): Promise<any> {
  try {
    const res = await fetch(
      `http://localhost:3001/api/point-settings/league/${leagueId}`
    )
    const pointSettings = await res.json()
    console.log('league point settings pre-sort: ', pointSettings)
    const sortedPointSettings = sortArrayOfObjects(pointSettings, 'name')
    console.log('league point settings post-sort: ', sortedPointSettings)
    return sortedPointSettings
  } catch (err) {
    console.log('fetch league point settings error: ', err)
  }
}

export async function fetchRoundPointSettings(roundId): Promise<any> {
  try {
    const res = await fetch(
      `http://localhost:3001/api/point-settings/round/${roundId}`
    )
    const pointSettings = await res.json()
    console.log('round point settings pre-sort: ', pointSettings)
    const sortedPointSettings = sortArrayOfObjects(pointSettings, 'name')
    console.log('round point settings post-sort: ', sortedPointSettings)
    return sortedPointSettings
  } catch (err) {
    console.log('fetch round point settings error: ', err)
  }
}
