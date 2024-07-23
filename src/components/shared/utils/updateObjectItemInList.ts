import { ListObject } from '../../../types'

export default function updateObjectItemInList(
  id: string,
  list: Array<ListObject>,
  updatedObject: ListObject
): Array<ListObject> {
  const updatedList = list.map((i) => {
    return i.id === id ? updatedObject : i
  })
  return updatedList
}
