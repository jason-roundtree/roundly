import { PointScopes } from '../../../types'
import { no_scope_key } from '../../PointSettings/PointScopeRadios'

function isMatchingPointSetting(rpePointSettingId, inputPointSettingId) {
  return rpePointSettingId === inputPointSettingId
}

function isNotPointEarnedBeingEdited(rpePointSettingId, inputPointSettingId) {
  return rpePointSettingId !== inputPointSettingId
}

function isMatchingHole(rpeHole, inputHole) {
  return rpeHole === inputHole
}

function getRoundPointsEarnedSansOneBeingEdited(
  roundPointsEarned,
  rpeBeingEditedId
) {
  return roundPointsEarned.filter((rpe) => {
    return isNotPointEarnedBeingEdited(rpe.id, rpeBeingEditedId)
  })
}

export function getPlayerPointEarnedQuantity(
  pointSettingId,
  roundPointsEarned,
  hole,
  // TODO: pass point edited id instead (and change whats's being passed to getRoundPointsEarnedSansOneBeingEdited)
  rpeBeingEditedId
): number {
  let totalQuantity = 0
  const filteredRoundPointsEarned = rpeBeingEditedId
    ? getRoundPointsEarnedSansOneBeingEdited(
        roundPointsEarned,
        rpeBeingEditedId
      )
    : roundPointsEarned

  for (const frpe of filteredRoundPointsEarned) {
    console.log('frpe.pointSettingId', frpe.pointSettingId)
    if (!isMatchingPointSetting(frpe.pointSettingId, pointSettingId)) {
      console.log('isMatchingPointSetting is false')
      continue
    }
    if (hole && !isMatchingHole(frpe.player_hole?.hole, hole)) {
      console.log('hole is true and isMatchingHole is false')
      continue
    }
    console.log(
      'all checks passed, total frequency for this this rppe is: ',
      frpe.frequency
    )
    totalQuantity += frpe.frequency
  }
  return totalQuantity
}

export function ppeQuantityExceedsMax(
  inputQuantity: number,
  totalQuantityEarnedInScope: number,
  pointSettingMaxPerScope: number
  // scope: Omit<PointScopes, typeof no_scope_key>
) {
  return inputQuantity + totalQuantityEarnedInScope > pointSettingMaxPerScope
}

// export function pointEarnedExceedsMaxPerScope(pointEarned, roundPointsEarned) {
//   const { id } = pointEarned
// }
