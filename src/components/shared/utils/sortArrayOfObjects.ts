// type ArrOfObjects = {
//   [key: string ]: string | number
// }
// Record<string, string | number
export default function sortArrayOfObjects(
  arr,
  property: string,
  order = 'ASC'
): any[] {
  return arr.sort((a, b) => {
    const itemA = a[property].toUpperCase()
    const itemB = b[property].toUpperCase()
    if (order === 'ASC') {
      return sortCompareAscending(itemA, itemB)
    }
    if (order === 'DESC') {
      return sortCompareDescending(itemA, itemB)
    }
  })
}

function sortCompareAscending(itemA, itemB) {
  if (itemA < itemB) {
    return -1
  }
  if (itemA > itemB) {
    return 1
  }
  return 0
}

function sortCompareDescending(itemA, itemB) {
  if (itemB < itemA) {
    return -1
  }
  if (itemB > itemA) {
    return 1
  }
  return 0
}
