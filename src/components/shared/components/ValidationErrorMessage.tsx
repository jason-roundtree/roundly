import React from 'react'

type ErrorField = string | undefined

export type ErrorMsgCodes =
  | 'MISSNG_VALUE'
  | 'ONE_INPUT_REQUIRED'
  | 'HOLE_REQUIRED'
  | 'MINIMUM_FREQUENCY_OF_ONE'
  | 'INVALID_EMAIL'
  | 'INVALID_PASSWORD'

function generateErrorMessage(
  errorMsgCode: ErrorMsgCodes,
  errorField: ErrorField
) {
  switch (errorMsgCode) {
    case 'MISSNG_VALUE':
      return `${errorField} is required`
    case 'ONE_INPUT_REQUIRED':
      return `At least one of the following inputs are required: ${errorField}`
    case 'HOLE_REQUIRED':
      return `Hole is required when ${errorField} is present`
    case 'MINIMUM_FREQUENCY_OF_ONE':
      return `Max Frequency Per Scope must be at least 1`
  }
}

export default function SimpleInputValidationError({
  showErrorMsg,
  errorMsgCode,
  errorField,
}: {
  showErrorMsg: boolean
  errorMsgCode: ErrorMsgCodes
  errorField?: ErrorField
}): JSX.Element | null {
  if (!showErrorMsg) {
    return null
  }
  return (
    <p className="input-error">
      {generateErrorMessage(errorMsgCode, errorField)}
    </p>
  )
}
