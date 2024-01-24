export async function updateRoundPointSetting(roundPointSettingId) {
  //   try {
  //   } catch (err) {
  //     console.log('update round point settings error: ', err)
  //   }
}

export async function deleteRoundPointSetting(pointSettingId, roundId) {
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
