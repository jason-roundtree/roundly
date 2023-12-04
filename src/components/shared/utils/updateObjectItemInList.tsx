import { ListObject } from '../../../types'

export default function updateObjectItemInList(
  id: string,
  list: Array<ListObject>,
  updatedObject: ListObject
): Array<ListObject> {
  console.log('updateObjectItemInList: ', { id, list, updatedObject })
  const updatedList = list.map((i) => {
    return i.id === id ? updatedObject : i
  })
  console.log('updatedList: ', updatedList)
  return updatedList
}
