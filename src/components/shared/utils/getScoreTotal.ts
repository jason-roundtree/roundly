export default function getScoreTotal(holeScoreData): number {
  return holeScoreData.reduce((total, current) => {
    const { score } = current || {}
    return score ? score + total : total
  }, 0)
}
