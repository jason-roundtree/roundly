export function getPPEQuantityInHole(
  pointSettingId,
  hole,
  roundPointsEarned,
  pointEarnedBeingEdited
): number {
  const quantity = roundPointsEarned.filter((rpe) => {
    return (
      pointEarnedBeingEdited.pointEarnedId !== rpe.id &&
      rpe.pointSettingId === pointSettingId &&
      rpe.player_hole?.hole === hole
    )
  })
  console.log('getPPEQuantityInHole', quantity.length)
  return quantity.length
}

export function getPPEQuantityInRound(
  pointSettingId,
  roundPointsEarned,
  pointEarnedBeingEdited
): number {
  const quantity = roundPointsEarned.filter((rpe) => {
    return (
      pointEarnedBeingEdited.pointEarnedId !== rpe.id &&
      rpe.pointSettingId === pointSettingId
    )
  })
  console.log('getPPEQuantityInRound', quantity.length)
  return quantity.length
}
