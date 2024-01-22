export async function updateRoundPointSetting(roundPointSettingId) {
  //   try {
  //   } catch (err) {
  //     console.log('update round point settings error: ', err)
  //   }
}

export async function deleteRoundPointSetting(roundPointSettingId) {
  try {
    const res = await fetch(
      `http://localhost:3001/api/round-point-setting/${roundPointSettingId}`,
      {
        method: 'DELETE',
      }
    )
    console.log('delete round point settings res: ', res.json())
  } catch (err) {
    console.log('delete round point settings error: ', err)
  }
}
