export async function createLeaguePointSetting(leagueId, newPointSetting) {
  try {
    const res = await fetch(
      `http://localhost:3001/api/point-setting/${leagueId}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPointSetting),
      }
    )
    return await res.json()
  } catch (err) {
    console.log('create league point settings error: ', err)
  }
}

export async function updatePointSetting(pointSettingId, updatedPointSetting) {
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
    console.log('delete general point setting res: ', res.json())
    return res
  } catch (err) {
    console.log('delete general point setting error: ', err)
  }
}

export async function createRoundPointSetting(pointSettingId, roundId) {
  try {
    const res = await fetch(`http://localhost:3001/api/round-point-setting/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pointSettingId: pointSettingId,
        roundId: roundId,
      }),
    })
    return await res.json()
  } catch (err) {
    console.log('create round point settings error: ', err)
  }
}

export async function removeRoundPointSetting(pointSettingId, roundId) {
  const roundPointSetting = { pointSettingId, roundId }
  console.log('roundPointSetting', roundPointSetting)
  try {
    const res = await fetch(`http://localhost:3001/api/round-point-setting`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(roundPointSetting),
    })
    console.log('delete round point settings res: ', res.json())
  } catch (err) {
    console.log('delete round point settings error: ', err)
  }
}
