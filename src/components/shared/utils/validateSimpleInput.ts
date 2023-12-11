export default function validateSimpleInput(
  inputState: string | number,
  inputLabel: string,
  setErrorFn: (label: string | null) => void
): boolean {
  let fieldsAreValid = false
  if (!inputState) {
    setErrorFn(inputLabel)
  } else {
    setErrorFn(null)
    fieldsAreValid = true
  }
  return fieldsAreValid
}
