export default function reduceScoresToTotal(arr): number {
  return arr.reduce((total, current) => {
    const { score } = current || {}
    return score ? score + total : total
  }, 0)
}
