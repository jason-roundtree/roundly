import React from 'react'

type ErrorField = string | null

export type ErrorMsgCodes = 'MISSNG_VALUE'

function generateErrorMessage(
  errorMsgCode: ErrorMsgCodes,
  errorField: ErrorField
) {
  switch (errorMsgCode) {
    case 'MISSNG_VALUE':
      return `Please add a value for ${errorField}`
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
    <p className="text-red-400 ml-2">
      {generateErrorMessage(errorMsgCode, errorField)}
    </p>
  )
}
