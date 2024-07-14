export default function validateAtLeastOneSimpleInput(
  inputState: Array<string | number | null>,
  setErrorFn: (boolean) => void
): boolean {
  let fieldsAreValid = false
  for (const i of inputState) {
    if (i) {
      fieldsAreValid = true
      setErrorFn(false)
    }
  }
  if (!fieldsAreValid) {
    setErrorFn(true)
    // setTimeout(() => setErrorFn(null), 3000)
  }
  return fieldsAreValid
}
