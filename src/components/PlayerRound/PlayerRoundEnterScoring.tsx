import { useState, useEffect, useContext } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'

import BasicInput from '../shared/components/BasicInput'
import Select from '../shared/components/Select'
import { RoundContext } from '../Round/RoundDetailsContainer'
import { PointSetting, Player } from '../../types'
import { sortArrayOfObjects } from '../shared/utils'
import { createRoundPlayerPointEarned, createPlayerHole } from '../../data'

export default function PlayerRoundEnterScoring() {
  const [player, setPlayer] = useState({ name: '', id: '' })
  const [hole, setHole] = useState('')
  const [holeScore, setHoleScore] = useState<number | null>(null)
  const [point, setPoint] = useState({ name: '', id: '' })
  const [searchParams] = useSearchParams()
  const { id: roundId, players, pointSettings } = useContext(RoundContext)
  console.log('point', point)
  console.log('player', player)
  console.log('hole', hole)

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

  async function addPointEarned(): Promise<void> {
    const playerId = player.id
    const pointEarnedData = {
      playerId: playerId,
      pointSettingId: point.id,
      roundId: roundId,
    }
    if (hole) {
      const holeData = {
        playerId: playerId,
        hole: +hole,
        roundId: roundId,
      }
      const playerHoleRes = await createPlayerHole(holeData)
      if (playerHoleRes.ok) {
        const { id } = await playerHoleRes.json()
        pointEarnedData['playerHoleId'] = id
        const pointEarnedWithHoleRes = await createRoundPlayerPointEarned(
          pointEarnedData
        )
        console.log('pointEarnedWithHoleRes: ', pointEarnedWithHoleRes)
        if (pointEarnedWithHoleRes.ok) {
          clearForm()
        }
      }
    } else {
      const pointEarnedNoHoleRes = await createRoundPlayerPointEarned(
        pointEarnedData
      )
      console.log('pointEarnedNoHoleRes: ', pointEarnedNoHoleRes)
      if (pointEarnedNoHoleRes.ok) {
        clearForm()
      }
    }
  }

  function clearForm(): void {
    // setPlayer({ name: '', id: '' })
    setHole('')
    setHoleScore(null)
    setPoint({ name: '', id: '' })
  }

  return (
    // TODO: add <form>?
    <>
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
        value={point.name}
        onChange={(e) => {
          const pointName = e.target.value
          const pointSetting = pointSettings.find(
            (point) => point.name === pointName
          ) as PointSetting
          setPoint({ id: pointSetting.id, name: pointName })
        }}
        // const index = e.target.selectedIndex;
        // const el = e.target.childNodes[index]
        // const option =  el.getAttribute('id');
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
      {/* TODO: style side-by-side and different colors? */}
      <button onClick={addPointEarned}>Add</button>
      <br />
      <button onClick={clearForm}>Clear Form</button>
    </>
  )
}
