export default function toggleStringItemInList(
  id: string,
  list: string[],
  stateSettingFn
): void {
  if (!list.includes(id)) {
    stateSettingFn([...list, id])
  } else {
    stateSettingFn(list.filter((_id) => _id !== id))
  }
}
