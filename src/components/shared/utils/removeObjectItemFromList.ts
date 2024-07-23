import { ListObject } from '../../../types'

export default function removeObjectItemFromList(
  id: string,
  list: Array<ListObject>
): Array<ListObject> {
  const filteredList = list.filter((l) => l.id !== id)
  return filteredList
}
