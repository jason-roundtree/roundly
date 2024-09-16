export default function getSelectableOptions(
  arr: Array<any>
): Array<{ value: string; id: string }> {
  return arr.map(({ name, id }) => ({
    value: name,
    id,
  }))
}
