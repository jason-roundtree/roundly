import { useState, useEffect, useContext } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'

import BasicInput from '../shared/components/BasicInput'
import Select from '../shared/components/Select'
import { RoundContext } from '../Round/RoundDetailsContainer'
import { PointSetting, Player } from '../../types'
import { sortArrayOfObjects } from '../shared/utils'
import {
  createRoundPlayerPointEarned,
  createOrFindPlayerHole,
  updatePlayerHoleScore,
} from '../../data'

const defaultPlayerAndPointEarnedState = { id: '', name: '' }

// TODO: add checks for existing hole score and point earned frequency
export default function PlayerRoundEnterScoring() {
  const [searchParams] = useSearchParams()
  const { id: roundId, players, pointSettings } = useContext(RoundContext)
  const [player, setPlayer] = useState(defaultPlayerAndPointEarnedState)
  const [pointEarned, setPointEarned] = useState(
    defaultPlayerAndPointEarnedState
  )
  const [pointEarnedFrequency, setPointEarnedFrequency] = useState(1)
  const [hole, setHole] = useState('')
  const [holeScore, setHoleScore] = useState<number | null>(null)
  console.log('player', player)
  console.log('hole', hole)
  console.log('holeScore', holeScore)

  useEffect(() => {
    const initialPlayerName = searchParams.get('playerName') || players[0]?.name
    const initialPlayerId = searchParams.get('playerId') || players[0]?.id
    setPlayer({ id: initialPlayerId, name: initialPlayerName })
  }, [searchParams, players])

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

  async function handleFormSubmit(e): Promise<void> {
    e.preventDefault()
    const playerId = player.id
    let playerHoleId = null

    // TODO: add validation to check for hole number if hole score exists
    if (hole) {
      const holeData = {
        playerId: playerId,
        hole: +hole,
        roundId: roundId,
        score: holeScore ? +holeScore : null,
      }
      const playerHoleRes = await createOrFindPlayerHole(holeData)
      if (playerHoleRes.ok) {
        const [playerHole, created] = await playerHoleRes.json()
        console.log('playerHole', playerHole)
        console.log('created', created)
        playerHoleId = playerHole.id
        if (!created) {
          const updatePlayerHoleRes = await updatePlayerHoleScore(
            playerHoleId,
            holeScore
          )
          if (updatePlayerHoleRes.ok) {
            // TODO: do anything here?
          }
        }
      }
    }

    if (pointEarned) {
      const pointEarnedData = {
        playerId: playerId,
        pointSettingId: pointEarned.id,
        roundId: roundId,
        frequency: pointEarnedFrequency,
      }
      if (playerHoleId) {
        pointEarnedData['playerHoleId'] = playerHoleId
      }
      const pointEarnedRes = await createRoundPlayerPointEarned(pointEarnedData)
      console.log('pointEarnedRes: ', pointEarnedRes)
      if (pointEarnedRes.ok) {
        // TODO: do anything here?
      }
    }

    playerHoleId = null
    clearForm()
  }

  function clearForm(): void {
    setHole('')
    setHoleScore(null)
    setPointEarnedFrequency(1)
    setPointEarned(defaultPlayerAndPointEarnedState)
  }

  return (
    <form className="player-scoring-form">
      <h3 className="page-title">Add Player Point / Score</h3>

      <Select
        options={getSelectableOptions(sortArrayOfObjects(players, 'name'))}
        id="roundPlayerScoreSelect"
        label="Player"
        // name="roundPlayerAddScore"
        value={player.name}
        onChange={(e) => {
          const playerName = e.target.value
          const selectedPlayer = players.find(
            (player) => player.name === playerName
          ) as Player
          setPlayer({ id: selectedPlayer.id, name: playerName })
        }}
      />

      <Select
        options={[
          { id: 'noPointSelected', value: '' },
          ...getSelectableOptions(pointSettings),
        ]}
        id="point-type-select"
        label="Point Earned"
        // name="roundPlayerAddPointEarnedAndOrScore"
        value={pointEarned.name}
        onChange={(e) => {
          const pointName = e.target.value
          const pointSetting = pointSettings.find(
            (point) => point.name === pointName
          ) as PointSetting
          if (pointSetting) {
            setPointEarned({ id: pointSetting.id, name: pointName })
          } else {
            setPointEarned(defaultPlayerAndPointEarnedState)
          }
        }}
        // const index = e.target.selectedIndex;
        // const el = e.target.childNodes[index]
        // const option =  el.getAttribute('id');
      />

      <BasicInput
        type="number"
        min="1"
        name="point-earned-frequency"
        label="Point Earned Frequency"
        value={pointEarnedFrequency}
        onChange={(e) => {
          setPointEarnedFrequency(+e.target.value)
        }}
        disabled={!Boolean(pointEarned.id)}
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
        name="hole-score"
        label="Hole Score"
        value={holeScore ?? ''}
        onChange={(e) => {
          const inputValue = e.target.value
          if (inputValue === '0') {
            setHoleScore(null)
          } else {
            setHoleScore(+inputValue)
          }
        }}
      />

      <div className="form-action-buttons-container">
        <button onClick={handleFormSubmit}>Add</button>
        <button onClick={clearForm} type="button">
          Clear Form
        </button>
      </div>
    </form>
  )
}
