import React from 'react'

type ErrorField = string | null

export type ErrorMsgCodes =
  | 'MISSNG_VALUE'
  | 'ONE_INPUT_REQUIRED'
  | 'HOLE_REQUIRED'
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
  }
}

export default function SimpleInputValidationError({
  errorField,
  errorMsgCode,
}: {
  errorField: ErrorField
  errorMsgCode: ErrorMsgCodes
}): JSX.Element | null {
  if (typeof errorField !== 'string') {
    return null
  }
  return (
    <p className="input-error">
      {generateErrorMessage(errorMsgCode, errorField)}
    </p>
  )
}
