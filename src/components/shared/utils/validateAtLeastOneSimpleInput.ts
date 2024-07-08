export default function validateAtLeastOneSimpleInput(
  inputState: Array<string | number | null>,
  inputLabel: string,
  setErrorFn: (label: string | null) => void
): boolean {
  let fieldsAreValid = false
  for (const i of inputState) {
    if (i) {
      fieldsAreValid = true
      setErrorFn(null)
    }
  }
  if (!fieldsAreValid) {
    setErrorFn(inputLabel)
    // setTimeout(() => setErrorFn(null), 3000)
  }
  console.log('fieldsAreValid', fieldsAreValid)
  return fieldsAreValid
}
