export default function getArrayOfNumbersTotal(arr: Array<number>): number {
  return arr.reduce((total, current) => {
    return current ? total + current : total
  }, 0)
}
