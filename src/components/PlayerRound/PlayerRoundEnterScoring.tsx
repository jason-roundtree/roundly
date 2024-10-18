import { useState, useEffect, useContext } from 'react'
import { Link, useParams, useLocation, useSearchParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAnglesRight } from '@fortawesome/free-solid-svg-icons'

import BasicInput from '../shared/components/BasicInput'
import Select from '../shared/components/Select'
import { RoundContext } from '../Round/RoundDetailsContainer'
import { PointSetting, Player, PointScopes } from '../../types'
import {
  getPlayerPointEarnedQuantity,
  getIncrementalHoleNumbers,
  quantityInputScopeManager,
  sortArrayOfObjects,
} from '../shared/utils'
import {
  createRoundPlayerPointEarned,
  createOrFindPlayerHole,
  updatePlayerHole,
  getRoundPlayerPointsEarnedByPlayer,
} from '../../data'
import { validateAtLeastOneSimpleInput } from '../shared/utils'
import ValidationErrorMessage from '../shared/components/ValidationErrorMessage'
import styles from './PlayerRoundEnterScoring.module.css'
import PlayerRoundEnterPointOrScore from './EnterPointOrScore'

// TODO: at some point player data (and probably other round data from context) isn't getting passed in
// TODO: at some point player data (and probably other round data from context) isn't getting passed in
// TODO: at some point player data (and probably other round data from context) isn't getting passed in

// TODO: DRYify some of this with PlayerRoundScoring
// TODO: DRYify some of this with PlayerRoundScoring
// TODO: DRYify some of this with PlayerRoundScoring

const defaultSelectedPlayerState: {
  id: string
  name: string
} = { id: '', name: '' }

interface PointEarnedState {
  id: string
  name: string
  maxFrequencyPerScope: number | null
  value: string | number
  // TODO: look into (string & {}) and remove it if it doesn't provide a benefit
  scope: PointScopes | (string & {})
}

const defaultSelectedPointEarnedState: PointEarnedState = {
  id: '',
  name: '',
  maxFrequencyPerScope: null,
  value: '',
  scope: '',
}

export function selectableHoles(numberOfHoles = 18): Array<JSX.Element> {
  return ['', ...getIncrementalHoleNumbers(numberOfHoles)].map((o) => {
    return (
      <option value={o} key={o}>
        {o}
      </option>
    )
  })
}

export default function PlayerRoundEnterScoring() {
  const {
    id: roundId,
    players,
    pointSettings,
    leagueId,
  } = useContext(RoundContext)
  console.log('players from context', players)
  console.log('pointSettings from context', pointSettings)
  const location = useLocation()
  const playerFromLocation = location.state
  const [player, setPlayer] = useState(defaultSelectedPlayerState)
  const [selectedPointEarned, setSelectedPointEarned] = useState(
    defaultSelectedPointEarnedState
  )
  console.log('selectedPointEarned ><<><><', selectedPointEarned)
  const [pointEarnedFrequency, setPointEarnedFrequency] = useState(1)
  const [roundPointsEarned, setRoundPointsEarned] = useState<any[]>([])

  // TODO: re-implement in EnterPointOrScore
  const [hole, setHole] = useState('')
  const [holeScore, setHoleScore] = useState<number | null>(null)

  // TODO: re-implement in EnterPointOrScore
  const [showOneInputRequiredError, setShowOneInputRequiredError] =
    useState(false)
  const [showHoleRequiredError, setShowHoleRequiredError] = useState(false)
  const [showPointEarnedCreationSuccess, setShowPointEarnedCreationSuccess] =
    useState(false)
  const [showScoreCreationSuccess, setShowScoreCreationSuccess] =
    useState(false)
  const [showScoreUpdateSuccess, setShowScoreUpdateSuccess] = useState(false)

  const [frequencyIsActive, quantityInputLabel, maxFrequency] =
    quantityInputScopeManager(selectedPointEarned)
  console.log('maxFrequency <<<<< ', maxFrequency)
  useEffect(() => {
    const initialPlayerName = playerFromLocation?.playerName || players[0]?.name
    const initialPlayerId = playerFromLocation?.playerId || players[0]?.id
    console.log('initialPlayerId -00-0-', initialPlayerId)
    setPlayer({ id: initialPlayerId, name: initialPlayerName })
  }, [playerFromLocation, players])

  useEffect(() => {
    if (player.id) {
      getPlayerRoundPointsEarned()
    }
  }, [player])

  function getSelectableOptions(
    arr: Array<any>
  ): Array<{ value: string; id: string }> {
    return arr.map(({ name, id }) => ({
      value: name,
      id,
    }))
  }

  // TODO: DRYify with same function in PlayerRoundScoring
  async function getPlayerRoundPointsEarned() {
    const res = await getRoundPlayerPointsEarnedByPlayer(player.id, roundId)
    console.log('getRoundPlayerPointsEarned res: ', res)
    if (res.status === 200) {
      const roundPointsEarned = await res.json()
      console.log('roundPointsEarned----: ', roundPointsEarned)
      setRoundPointsEarned(roundPointsEarned)
    }
    // TODO: also send back array or message to confirm result is actually empty instead of relying on 204 status?
    else if (res.status === 204) {
      setRoundPointsEarned([])
    }
  }

  // function validateMaxFrequency(value: number) {
  // }

  function validateInputFrequencyAgainstPointSetting() {
    if (maxFrequency && pointEarnedFrequency > maxFrequency) {
      // TODO:
      // - show error message
      // - reset input to max?
    }
  }

  function handleUpdatePointEarned(e) {
    setShowOneInputRequiredError(false)
    const pointName = e.target.value
    const pointSetting = pointSettings.find(
      (point) => point.name === pointName
    ) as PointSetting
    if (pointSetting) {
      setSelectedPointEarned({
        id: pointSetting.id,
        name: pointName,
        maxFrequencyPerScope: pointSetting.maxFrequencyPerScope,
        value: pointSetting.value,
        scope: pointSetting.scope,
      })
    } else {
      setSelectedPointEarned(defaultSelectedPointEarnedState)
    }
  }

  function handleUpdateHole(e) {
    const holeValue = e.target.value
    if (holeValue !== '') {
      setShowHoleRequiredError(false)
    }
    setHole(e.target.value)
  }

  function handleUpdateHoleScoreState(e) {
    setShowOneInputRequiredError(false)
    const inputValue = e.target.value
    if (inputValue < 1) {
      // setHoleScore(null)
      return
    } else {
      setHoleScore(+inputValue)
    }
  }

  async function handleUpdateHoleScore(
    playerHoleId: string,
    messageCallback: (boolean) => void
  ): Promise<void> {
    const updatePlayerHoleRes = await updatePlayerHole(playerHoleId, {
      score: holeScore,
    })
    if (updatePlayerHoleRes.ok) {
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
        [selectedPointEarned.name, holeScore],
        setShowOneInputRequiredError
      )
    ) {
      return
    }

    // TODO: add validation to check for hole number if hole score exists (also same if point scope is hole?)
    if (holeScore && !hole) {
      setShowHoleRequiredError(true)
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

    if (selectedPointEarned.name) {
      const selectedPointEarnedData = {
        playerId: playerId,
        pointSettingId: selectedPointEarned.id,
        roundId: roundId,
        frequency: pointEarnedFrequency,
      }
      if (playerHoleId) {
        selectedPointEarnedData['playerHoleId'] = playerHoleId
      }
      const pointEarnedRes = await createRoundPlayerPointEarned(
        selectedPointEarnedData
      )
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
    setSelectedPointEarned(defaultSelectedPointEarnedState)
    setShowOneInputRequiredError(false)
    setShowHoleRequiredError(false)
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
        value={`${selectedPointEarned.name}`}
        onChange={handleUpdatePointEarned}
        // const index = e.target.selectedIndex;
        // const el = e.target.childNodes[index]
        // const option =  el.getAttribute('id');
      />

      <BasicInput
        type="number"
        min="1"
        max={frequencyIsActive && maxFrequency ? maxFrequency.toString() : null}
        name="point-earned-quantity"
        label={quantityInputLabel}
        value={pointEarnedFrequency}
        onChange={(e) => {
          const valueNum = +e.target.value
          setPointEarnedFrequency(valueNum > 0 ? valueNum : 1)
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
        min="1"
        name="hole-score"
        label="Hole Score"
        value={holeScore ? holeScore : ''}
        onChange={handleUpdateHoleScoreState}
      />

      <div className="form-action-buttons-container">
        <button onClick={handleFormSubmit}>Add</button>
        <button onClick={clearForm} type="button">
          Clear Form
        </button>
      </div>
      <ValidationErrorMessage
        showErrorMsg={showOneInputRequiredError}
        errorField="Point Earned, Hole Score"
        errorMsgCode="ONE_INPUT_REQUIRED"
      />
      <ValidationErrorMessage
        showErrorMsg={showHoleRequiredError}
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

      <div className={styles.roundScoringLink}>
        <Link to={`/league/${leagueId}/round/${roundId}/scoring`}>
          Round Scoring <FontAwesomeIcon icon={faAnglesRight} />
        </Link>
      </div>
    </form>
  )
}
