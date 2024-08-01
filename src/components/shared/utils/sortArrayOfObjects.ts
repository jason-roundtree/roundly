import { sortCompareAscending, sortCompareDescending } from './sortCompares'

// type ArrOfObjects = {
//   [key: string ]: string | number
// }
// Record<string, string | number
export default function sortArrayOfObjects(
  arr,
  property: string,
  order: 'ASC' | 'DESC' = 'ASC'
): Array<any> {
  // const arrCopy = JSON.parse(JSON.stringify(arr))
  return arr.toSorted((a, b) => {
    const aIsString = typeof a[property] === 'string'
    const bIsString = typeof b[property] === 'string'
    const itemA = aIsString ? a[property].toUpperCase() : a[property]
    const itemB = bIsString ? b[property].toUpperCase() : b[property]
    if (order === 'ASC') {
      return sortCompareAscending(itemA, itemB)
    }
    if (order === 'DESC') {
      return sortCompareDescending(itemA, itemB)
    }
  })
}
