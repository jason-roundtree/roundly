import React from 'react'

type ErrorField = string | null

export type ErrorMsgCodes =
  | 'MISSNG_VALUE'
  | 'INVALID_EMAIL'
  | 'INVALID_PASSWORD'

function generateErrorMessage(
  errorMsgCode: ErrorMsgCodes,
  errorField: ErrorField
) {
  switch (errorMsgCode) {
    case 'MISSNG_VALUE':
      return `${errorField} cannot be empty`
    // case '':
    //   return `${errorField}`
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
