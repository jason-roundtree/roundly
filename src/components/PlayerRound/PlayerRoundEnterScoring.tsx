import { useState, useEffect, useContext } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'

import BasicInput from '../shared/components/BasicInput'
import Select from '../shared/components/Select'
import { RoundContext } from '../Round/RoundDetailsContainer'
import { PointSetting } from '../../types'
import { sortArrayOfObjects } from '../shared/utils'

export default function PlayerRoundEnterScoring() {
  const [player, setPlayer] = useState({ name: '', id: '' })
  const [hole, setHole] = useState('')
  const [holeScore, setHoleScore] = useState<number | null>(null)
  const [point, setPoint] = useState('')
  const [searchParams] = useSearchParams()
  const { id: roundId, players, pointSettings } = useContext(RoundContext)
  console.log('pointSettings', pointSettings)

  useEffect(() => {
    const initialPlayerName = searchParams.get('playerName') ?? ''
    const initialPlayerId = searchParams.get('playerId') ?? ''
    setPlayer({ id: initialPlayerId, name: initialPlayerName })
  }, [searchParams])

  function getSelectableOptions(
    arr: Array<any>
  ): Array<{ value: string; id: string }> {
    return arr.map(({ name, id }) => ({
      value: name,
      id,
    }))
  }

  function selectableHoles(): Array<JSX.Element> {
    /* TODO: make dynamic (and add hole field to round form) */
    return ['', ...Array.from(Array(18), (_, i) => i + 1)].map((o) => {
      return (
        <option value={o} key={o}>
          {o}
        </option>
      )
    })
  }

  function clearForm(): void {
    // setPlayer({ name: '', id: '' })
    setHole('')
    setHoleScore(null)
    setPoint('')
  }

  return (
    <>
      <h3 className="page-title">Player Scoring</h3>

      <Select
        options={getSelectableOptions(sortArrayOfObjects(players, 'name'))}
        id="roundPlayerScoreSelect"
        label="Player"
        // name="roundPlayerAddScore"
        onChange={(e) => setPlayer(e.target.value)}
        value={player.name}
      />

      <label htmlFor="hole-select">Hole</label>
      <select
        id="hole-select"
        value={hole}
        onChange={(e) => setHole(e.target.value)}
      >
        {selectableHoles()}
      </select>

      <Select
        options={[
          { id: 'noPointSelected', value: '' },
          ...getSelectableOptions(pointSettings),
        ]}
        id="roundPlayerPointSelect"
        label="Point Earned"
        // name="roundPlayerAddPointEarned"
        onChange={(e) => setPoint(e.target.value)}
        value={point}
      />

      <BasicInput
        type="number"
        min="0"
        name="playerScoringHoleScore"
        label="Hole Score"
        value={holeScore ? holeScore : ''}
        onChange={(e) => {
          const inputValue = e.target.value
          if (inputValue === '0') {
            setHoleScore(null)
          } else {
            setHoleScore(+inputValue)
          }
        }}
      />

      <button onClick={clearForm}>Clear Form</button>
      <br />
      <button>Add</button>
    </>
  )
}
