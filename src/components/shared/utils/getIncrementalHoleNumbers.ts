export default function getIncrementalHoleNumbers(
  numberOfHoles: number,
  startNumber: number = 1
): Array<string> {
  return [
    ...Array.from(Array(numberOfHoles), (_, i) => (i + startNumber).toString()),
  ]
}
