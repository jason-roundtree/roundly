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
import SimpleInputValidationError from '../shared/components/SimpleInputValidationError'
import { validateAtLeastOneSimpleInput } from '../shared/utils'

interface NameAndId {
  id: string
  name: string
}
type NumberOrNull = number | null
interface MaxFreqAndValue {
  maxFrequencyPerScope: NumberOrNull
  value: NumberOrNull
}
const defaultPlayerState: NameAndId = { id: '', name: '' }
const defaultPointEarnedState: MaxFreqAndValue & NameAndId = {
  id: '',
  name: '',
  maxFrequencyPerScope: 1,
  value: null,
}

// TODO: add checks for existing hole score and point earned frequency
export default function PlayerRoundEnterScoring() {
  const [searchParams] = useSearchParams()
  const { id: roundId, players, pointSettings } = useContext(RoundContext)
  const [player, setPlayer] = useState(defaultPlayerState)
  const [pointEarned, setPointEarned] = useState(defaultPointEarnedState)
  const [pointEarnedFrequency, setPointEarnedFrequency] = useState(1)
  const [hole, setHole] = useState('')
  const [holeScore, setHoleScore] = useState<number | null>(null)
  // TODO: cleaner way to handle input validation state?
  const [oneInputRequiredErrorField, setOneInputRequiredErrorField] = useState<
    string | null
  >(null)
  const [holeRequiredErrorField, setHoleRequiredErrorField] = useState<
    string | null
  >(null)
  // console.log('player', player)

  const peMaxFrequencyPerScope = pointEarned.maxFrequencyPerScope
  const frequencyIsActive =
    typeof peMaxFrequencyPerScope === 'number'
      ? peMaxFrequencyPerScope > 1
      : peMaxFrequencyPerScope === null

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

  function handleUpdatePointEarned(e) {
    setOneInputRequiredErrorField(null)
    const pointName = e.target.value
    const pointSetting = pointSettings.find(
      (point) => point.name === pointName
    ) as PointSetting
    if (pointSetting) {
      setPointEarned({
        id: pointSetting.id,
        name: pointName,
        maxFrequencyPerScope: pointSetting.maxFrequencyPerScope ?? 1,
        value: pointSetting.value,
      })
    } else {
      setPointEarned(defaultPointEarnedState)
    }
  }

  function handleUpdateHoleScore(e) {
    setOneInputRequiredErrorField(null)
    const inputValue = e.target.value
    if (inputValue === '0') {
      setHoleScore(null)
    } else {
      setHoleScore(+inputValue)
    }
  }

  function handleUpdateHole(e) {
    const holeValue = e.target.value
    if (holeValue !== '') {
      setHoleRequiredErrorField(null)
    }
    setHole(e.target.value)
  }

  async function handleFormSubmit(e): Promise<void> {
    e.preventDefault()
    const playerId = player.id
    let playerHoleId = null
    if (
      !validateAtLeastOneSimpleInput(
        [pointEarned.name, holeScore],
        'Point Earned, Hole Score',
        setOneInputRequiredErrorField
      )
    ) {
      return
    }

    // TODO: add validation to check for hole number if hole score exists (also same if point scope is hole?)
    if (holeScore && !hole) {
      setHoleRequiredErrorField('Hole Score')
      return
    }

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
    setPointEarned(defaultPointEarnedState)
    setOneInputRequiredErrorField(null)
    setHoleRequiredErrorField(null)
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
        value={`${pointEarned.name}`}
        onChange={handleUpdatePointEarned}
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
        disabled={!frequencyIsActive}
      />

      <label htmlFor="hole-select">Hole</label>
      <select id="hole-select" value={hole} onChange={handleUpdateHole}>
        {selectableHoles()}
      </select>

      <BasicInput
        type="number"
        min="0"
        name="hole-score"
        label="Hole Score"
        value={holeScore ?? ''}
        onChange={handleUpdateHoleScore}
      />

      <div className="form-action-buttons-container">
        <button onClick={handleFormSubmit}>Add</button>
        <button onClick={clearForm} type="button">
          Clear Form
        </button>
      </div>
      <SimpleInputValidationError
        errorField={oneInputRequiredErrorField}
        errorMsgCode="ONE_INPUT_REQUIRED"
      />
      <SimpleInputValidationError
        errorField={holeRequiredErrorField}
        errorMsgCode="HOLE_REQUIRED"
      />
    </form>
  )
}
