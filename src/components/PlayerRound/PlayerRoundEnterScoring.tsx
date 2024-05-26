import { useState, useEffect, useContext } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'

import BasicInput from '../shared/components/BasicInput'
import Select from '../shared/components/Select'
import { RoundContext } from '../Round/RoundDetailsContainer'

export default function PlayerRoundEnterScoring() {
  const [player, setPlayer] = useState({ name: '', id: '' })
  const [hole, setHole] = useState('')
  const [holeScore, setHoleScore] = useState(0)
  const [searchParams] = useSearchParams()
  const { id: roundId, players, pointSettings } = useContext(RoundContext)

  useEffect(() => {
    const initialPlayerName = searchParams.get('playerName') ?? ''
    const initialPlayerId = searchParams.get('playerId') ?? ''
    setPlayer({ id: initialPlayerId, name: initialPlayerName })
  }, [searchParams])

  const selectableRoundPlayers: Array<{ value: string; id: string }> =
    players.map(({ name, id }) => ({
      value: name,
      id,
    }))

  function selectableHoles(): Array<JSX.Element> {
    /* TODO: make dynamic (and add hole field to round form) */
    return ['-', ...Array.from(Array(18), (_, i) => i + 1)].map((o) => {
      return <option value={o}>{o}</option>
    })
  }
  return (
    <>
      {/* TODO: add player name */}
      <h3 className="page-title">Player Scoring</h3>

      <Select
        options={selectableRoundPlayers}
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

      <BasicInput
        type="number"
        min="0"
        name="playerScoringHoleScore"
        label="Hole Score"
        value={holeScore}
        onChange={(e) => setHoleScore(+e.target.value)}
      />

      <button>Clear Form</button>
      <br />
      <button>Add</button>
    </>
  )
}
