import { ListObject } from '../../../types'

export default function updateObjectItemInList(
  id: string,
  list: Array<ListObject>,
  updatedObject: ListObject
) {
  console.log('updateObjectItemInList: ', { id, list, updatedObject })
  const updatedList = list.map((l) => {
    return l.id === id ? updatedObject : l
  })
  console.log('updatedList: ', updatedList)
  return updatedList
}
