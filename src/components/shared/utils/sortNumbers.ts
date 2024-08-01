import { sortCompareAscending, sortCompareDescending } from './sortCompares'

export default function sortNumbers(
  arr: Array<number>,
  order = 'ASC'
): Array<number> | string {
  if (order === 'ASC') {
    return arr.sort(sortCompareAscending)
  }
  if (order === 'DESC') {
    return arr.sort(sortCompareDescending)
  }
  return 'Order not recognized'
}
