// export default function sortArrayOfObjects(list: [], property: string): any[] {
export default function sortArrayOfObjects(arr, property) {
  return arr.sort((a, b) => {
    const itemA = a[property].toUpperCase()
    const itemB = b[property].toUpperCase()
    if (itemA < itemB) {
      return -1
    }
    if (itemA > itemB) {
      return 1
    }
    return 0
  })
}
