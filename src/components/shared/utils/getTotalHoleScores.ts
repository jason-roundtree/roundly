export default function getTotalHoleScores(holeScoreData): number {
  return holeScoreData.filter((i) => i.score).length
}
