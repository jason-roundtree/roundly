import { useState, useEffect, useContext } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'

import BasicInput from '../shared/components/BasicInput'
import Select from '../shared/components/Select'
import { RoundContext } from '../Round/RoundDetailsContainer'
import { PointSetting, Player } from '../../types'
import { getIncrementalHoleNumbers, sortArrayOfObjects } from '../shared/utils'
import {
  createRoundPlayerPointEarned,
  createOrFindPlayerHole,
  updatePlayerHoleScore,
} from '../../data'
import { validateAtLeastOneSimpleInput } from '../shared/utils'
import ValidationErrorMessage from '../shared/components/ValidationErrorMessage'

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
  const [showOneInputRequiredErrorField, setShowOneInputRequiredErrorField] =
    useState(false)
  const [showHoleRequiredErrorField, setShowHoleRequiredErrorField] =
    useState(false)
  const [showPointEarnedCreationSuccess, setShowPointEarnedCreationSuccess] =
    useState(false)
  const [showScoreCreationSuccess, setShowScoreCreationSuccess] =
    useState(false)
  const [showScoreUpdateSuccess, setShowScoreUpdateSuccess] = useState(false)
  console.log('>>>>>>>>>holeScore', holeScore)

  const peMaxFrequencyPerScope = pointEarned.maxFrequencyPerScope
  const frequencyIsActive =
    typeof peMaxFrequencyPerScope === 'number'
      ? peMaxFrequencyPerScope > 1
      : peMaxFrequencyPerScope === null
  console.log('peMaxFrequencyPerScope', peMaxFrequencyPerScope)
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
    return ['', ...getIncrementalHoleNumbers(18)].map((o) => {
      return (
        <option value={o} key={o}>
          {o}
        </option>
      )
    })
  }

  // function validateMaxFrequency(value: number) {
  // }

  function validateInputFrequencyAgainstPointSetting() {
    if (
      peMaxFrequencyPerScope &&
      pointEarnedFrequency > peMaxFrequencyPerScope
    ) {
      // TODO:
      // - show error message
      // - reset input to max?
    }
  }

  function handleUpdatePointEarned(e) {
    setShowOneInputRequiredErrorField(false)
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

  function handleUpdateHoleScoreState(e) {
    setShowOneInputRequiredErrorField(false)
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
      setShowHoleRequiredErrorField(false)
    }
    setHole(e.target.value)
  }

  async function handleUpdateHoleScore(
    playerHoleId: string,
    messageCallback: (boolean) => void
  ): Promise<void> {
    const updatePlayerHoleScoreRes = await updatePlayerHoleScore(
      playerHoleId,
      holeScore
    )
    if (updatePlayerHoleScoreRes.ok) {
      messageCallback(true)
      setTimeout(() => messageCallback(false), 3000)
    }
  }

  async function handleFormSubmit(e): Promise<void> {
    e.preventDefault()
    const playerId = player.id
    let playerHoleId: string | null = null
    if (
      !validateAtLeastOneSimpleInput(
        [pointEarned.name, holeScore],
        setShowOneInputRequiredErrorField
      )
    ) {
      return
    }

    // TODO: add validation to check for hole number if hole score exists (also same if point scope is hole?)
    if (holeScore && !hole) {
      setShowHoleRequiredErrorField(true)
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
        playerHoleId = playerHole.id as string

        if (!created) {
          const { score: previousScore } = playerHole
          console.log('previousScore', previousScore)
          if (holeScore) {
            // updating score
            if (previousScore && previousScore !== holeScore) {
              // TODO: implement alert/modal to get user's confirmation

              console.warn('are you sure you want to update the score?????')
              const userResponse = window.confirm(
                'are you sure you want to update the score?????'
              )
              if (!userResponse) return
              handleUpdateHoleScore(playerHoleId, setShowScoreUpdateSuccess)
            }
            // first time score entry after player hole was initially created
            if (!previousScore) {
              handleUpdateHoleScore(playerHoleId, setShowScoreCreationSuccess)
            }
          }
        } else {
          if (holeScore) {
            // handleUpdateHoleScore(playerHoleId, setShowScoreCreationSuccess)
            setShowScoreCreationSuccess(true)
            setTimeout(() => setShowScoreCreationSuccess(false), 3000)
          }
        }
      }
    }

    if (pointEarned.name) {
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
        setShowPointEarnedCreationSuccess(true)
        setTimeout(() => setShowPointEarnedCreationSuccess(false), 3000)
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
    setShowOneInputRequiredErrorField(false)
    setShowHoleRequiredErrorField(false)
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
        max={
          frequencyIsActive && peMaxFrequencyPerScope
            ? peMaxFrequencyPerScope.toString()
            : null
        }
        name="point-earned-quantity"
        label="Quantity"
        value={pointEarnedFrequency}
        onChange={(e) => {
          const value = +e.target.value
          setPointEarnedFrequency(value)
        }}
        onBlur={validateInputFrequencyAgainstPointSetting}
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
        onChange={handleUpdateHoleScoreState}
      />

      <div className="form-action-buttons-container">
        <button onClick={handleFormSubmit}>Add</button>
        <button onClick={clearForm} type="button">
          Clear Form
        </button>
      </div>
      <ValidationErrorMessage
        showErrorMsg={showOneInputRequiredErrorField}
        errorField="Point Earned, Hole Score"
        errorMsgCode="ONE_INPUT_REQUIRED"
      />
      <ValidationErrorMessage
        showErrorMsg={showHoleRequiredErrorField}
        errorField="Hole Score"
        errorMsgCode="HOLE_REQUIRED"
      />
      {showPointEarnedCreationSuccess && (
        <p className="success-msg">Successfully added point earned</p>
      )}
      {showScoreCreationSuccess && (
        <p className="success-msg">Successfully added hole score</p>
      )}
      {showScoreUpdateSuccess && (
        <p className="success-msg">Successfully updated hole score</p>
      )}
    </form>
  )
}
