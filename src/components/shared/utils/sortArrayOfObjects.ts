import { sortCompareAscending, sortCompareDescending } from './sortCompares'

// type ArrOfObjects = {
//   [key: string ]: string | number
// }
// Record<string, string | number
// TODO: properly annotate with JSDoc or whatever
/** sort arr by propery, defaults to ascending */
export default function sortArrayOfObjects(
  arr,
  property: string,
  order: 'ASC' | 'DESC' = 'ASC'
): Array<any> {
  console.log('arr', arr)
  return arr?.toSorted((a, b) => {
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
