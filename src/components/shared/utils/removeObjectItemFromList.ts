import { ListObject } from '../../../types'

export default function removeObjectItemFromList(
  id: string,
  list: Array<ListObject>
): Array<ListObject> {
  console.log('removeObjectItemFromList: ', { id, list })
  const filteredList = list.filter((l) => l.id !== id)
  return filteredList
}
