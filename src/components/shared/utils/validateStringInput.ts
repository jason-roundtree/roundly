// TODO: change this to accept the conditional as the first argument instead of only checking truthy string?
export default function validateStringInput(
  inputState: string | null,
  setShowErrorFn: (boolean) => void
): boolean {
  console.log('inputState', inputState)
  console.log('setShowErrorFn', setShowErrorFn)
  let fieldIsValid = false
  if (!inputState) {
    setShowErrorFn(true)
    // setTimeout(() => setErrorFn(null), 3000)
  } else {
    setShowErrorFn(null)
    fieldIsValid = true
  }
  return fieldIsValid
}
