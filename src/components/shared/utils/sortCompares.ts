export function sortCompareAscending(itemA, itemB) {
  if (itemA < itemB) {
    return -1
  }
  if (itemA > itemB) {
    return 1
  }
  return 0
}

export function sortCompareDescending(itemA, itemB) {
  if (itemB < itemA) {
    return -1
  }
  if (itemB > itemA) {
    return 1
  }
  return 0
}
