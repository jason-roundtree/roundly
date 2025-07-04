import { PointScopes } from '../types'

export async function createLeaguePointSetting(
  // TODO: update type
  newPointSetting: Record<string, any>,
  leagueId: string
): Promise<any> {
  console.log('new league PointSetting: ', newPointSetting)
  try {
    const res = await fetch(
      `http://localhost:3001/api/point-setting/create-league-point/`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newPointSetting,
          leagueId: leagueId,
          // TODO: hard bake this in to avoid having to add it from consumers?
          // isLeagueSetting: true,
        }),
      }
    )
    return res
  } catch (err) {
    console.log('create league point settings error: ', err)
  }
}

export async function updatePointSetting(
  pointSettingId,
  updatedPointSetting
): Promise<any> {
  try {
    const res = await fetch(
      `http://localhost:3001/api/point-setting/${pointSettingId}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPointSetting),
      }
    )
    console.log('update general point settings res: ', res)
    return res
  } catch (err) {
    console.log('update general point settings error: ', err)
  }
}

export async function deleteLeaguePointSetting(pointSettingId): Promise<any> {
  try {
    const res = await fetch(
      `http://localhost:3001/api/point-setting/${pointSettingId}`,
      {
        method: 'DELETE',
      }
    )
    return res
  } catch (err) {
    console.log('delete general point setting error: ', err)
  }
}

export async function createRoundPointSetting(
  pointSettingId,
  roundId
): Promise<any> {
  try {
    const res = await fetch(
      `http://localhost:3001/api/point-setting/create-round-point/`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pointSettingId: pointSettingId,
          roundId: roundId,
          // TODO: hard bake this in to avoid having to add it from consumers?
          // isLeagueSetting: false,
        }),
      }
    )
    return res
  } catch (err) {
    console.log('create round point settings error: ', err)
  }
}

export async function removeRoundPointSetting(
  pointSettingId,
  roundId
): Promise<any> {
  const roundPointSetting = { pointSettingId, roundId }
  try {
    // TODO: update "/round/" to be more descriptive eg. /delete-rount-point/ and maybe update deleteLeaguePointSetting and updateLeaguePointSetting to be more descriptive too
    const res = await fetch(`http://localhost:3001/api/point-setting/round/`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(roundPointSetting),
    })
    console.log('delete round point settings res: ', res)
    return res
  } catch (err) {
    console.log('delete round point settings error: ', err)
    return err
  }
}

export async function getPointSetting(pointSettingId): Promise<any> {
  try {
    const res = await fetch(
      `http://localhost:3001/api/point-setting/${pointSettingId}`
    )
    console.log('getPointSetting res: ', res)
    return res
  } catch (err) {
    console.log('getPointSetting err: ', err)
    return err
  }
}

// TODO: combine this with LeaguePointSettingExistsParams if they stay the same
interface RoundPointSettingExistsParams {
  name: string
  roundId: string
  value?: number
  scope?: PointScopes
}
export async function roundPointSettingExists({
  name,
  roundId,
  value,
  scope,
}: RoundPointSettingExistsParams): Promise<boolean> {
  try {
    const queryParams = new URLSearchParams({
      name,
      roundId,
      ...(value !== undefined ? { value: value.toString() } : {}),
      ...(scope !== undefined ? { scope } : {}),
    }).toString()
    const res = await fetch(
      `http://localhost:3001/api/point-setting/round-check?${queryParams}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }
    )
    if (res.status === 200) {
      const result = await res.json()
      console.log('roundPointSettingExists result: ', result)
      return result.exists === true
    }
    return false
  } catch (err) {
    console.log('roundPointSettingExists error: ', err)
    return false
  }
}

interface LeaguePointSettingExistsParams {
  name: string
  leagueId: string
  value?: number
  scope?: PointScopes
}
export async function leaguePointSettingExists({
  name,
  leagueId,
  value,
  scope,
}: LeaguePointSettingExistsParams): Promise<boolean> {
  try {
    const queryParams = new URLSearchParams({
      name,
      leagueId,
      ...(value !== undefined ? { value: value.toString() } : {}),
      ...(scope !== undefined ? { scope } : {}),
    }).toString()
    const res = await fetch(
      `http://localhost:3001/api/point-setting/league-check?${queryParams}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }
    )
    if (res.status === 200) {
      const result = await res.json()
      console.log('leaguePointSettingExists result: ', result)
      return result.exists === true
    }
    return false
  } catch (err) {
    console.log('leaguePointSettingExists error: ', err)
    return false
  }
}
