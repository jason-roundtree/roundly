export async function createLeaguePointSetting(
  leagueId: string,
  newPointSetting: Record<string, any>,
  roundId?: string
): Promise<any> {
  console.log('newPointSetting: ', newPointSetting)
  try {
    const res = await fetch(
      `http://localhost:3001/api/point-setting/${leagueId}?roundId=${roundId}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPointSetting),
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
    const res = await fetch(`http://localhost:3001/api/round-point-setting/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pointSettingId: pointSettingId,
        roundId: roundId,
      }),
    })
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
  console.log('roundPointSetting', roundPointSetting)
  try {
    const res = await fetch(`http://localhost:3001/api/round-point-setting`, {
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
