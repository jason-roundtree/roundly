export default function getTotalHoleScores(holeScoreData): number {
  return holeScoreData.filter((i) => {
    return i.score !== null && i.score >= 0
  }).length
}
