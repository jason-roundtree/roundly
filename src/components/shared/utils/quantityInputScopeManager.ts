import { PointScopes } from '../../../types'
import { no_scope_key } from '../../PointSettings/PointScopeRadios'

export default function quantityInputScopeManager(pointSetting: {
  maxFrequencyPerScope: number | null
  scope: PointScopes | (string & {})
  [key: string]: any
}): [boolean, string, number | null] {
  const scopeCast = pointSetting.scope as PointScopes
  const maxFrequency = pointSetting.maxFrequencyPerScope
  let frequencyIsActive = false
  let quantityInputLabel = 'Quantity'
  if (scopeCast === no_scope_key) {
    frequencyIsActive = true
    quantityInputLabel += ' (no max)'
  } else if (maxFrequency && maxFrequency > 1) {
    frequencyIsActive = true
    quantityInputLabel += ` (max of ${maxFrequency} per ${scopeCast})`
  }
  return [frequencyIsActive, quantityInputLabel, maxFrequency]
}
