import React from 'react'
import { useEffect, useState } from 'react'
import { Link, useParams, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAnglesRight } from '@fortawesome/free-solid-svg-icons'
import { useQuery } from '@tanstack/react-query'

import {
  PlayerRoundPointsAndScoringSummary,
  PlayerRoundPointsEarnedTable,
  ScorecardTable,
} from '.'
import './index.css'
import {
  getPlayerHoleScores,
  getPlayerHole,
  updatePlayerHole,
  createOrFindPlayerHole,
} from '../../data'
import {
  getScoreTotal,
  getTotalHoleScores,
  mapScoresToState,
  selectAllInputText,
} from '../shared/utils'
import Modal from '../shared/components/Modal'
import BasicInput from '../shared/components/BasicInput'
import {
  useGetPlayerRoundPointsEarned,
  useGetPlayerRoundPointsEarnedTotal,
} from '../shared/hooks'
import usePlayerHoleScoreBeingEdited, {
  PlayerHoleScoreState,
} from '../shared/hooks/usePlayerHoleScoreBeingEdited'
import styles from './PlayerRoundPointsAndScoring.module.css'

// TODO: what was i using this for? If still needed, somehow combine with PlayerHole interface in types?
// interface PlayerHole {
//   id: string
//   playerId: string
//   roundId: string
//   hole: number
//   score?: number
// }

export default function PlayerRoundPointsAndScoring() {
  const params = useParams()
  // TODO: why can't i destructure params above without TS complaining?
  const leagueId = params.leagueId as string
  const roundId = params.roundId as string
  const {
    state: { playerName, playerId },
  } = useLocation()
  // TODO: remove once model is updated
  const holesInRound = 18

  const [roundPointsEarned] = useGetPlayerRoundPointsEarned(playerId, roundId)
  const [totalPoints] = useGetPlayerRoundPointsEarnedTotal(playerId, roundId)
  const [showEditScoreModal, setShowEditScoreModal] = useState(false)
  const [currentScore, setCurrentScore] = useState<number | ''>('')
  const [scoreBeingEdited, setScoreBeingEdited, defaultScoreBeingEditedState] =
    usePlayerHoleScoreBeingEdited()
  const { playerHoleId, hole, score } = scoreBeingEdited || {}

  const {
    data: roundHoleScoreData = [],
    isLoading: isHoleScoresLoading,
    isError: isHoleScoresError,
    refetch: refetchHoleScores,
  } = useQuery({
    queryKey: ['playerHoleScores', playerId, roundId],
    queryFn: () =>
      getPlayerHoleScores(playerId, roundId, true).then(
        (res) => res?.json?.() ?? []
      ),
    enabled: !!playerId && !!roundId,
  })

  const roundHoleScores = mapScoresToState(holesInRound, roundHoleScoreData)
  console.log('************ roundHoleScores', roundHoleScores)
  const frontNineScores = roundHoleScores.slice(0, 9)
  const frontNineTotal = getScoreTotal(frontNineScores)
  const backNineScores = roundHoleScores.slice(9)
  const backNineTotal = getScoreTotal(backNineScores)
  const totalScoresEntered = getTotalHoleScores(roundHoleScores)

  // useCallback needed to get ref because input is rendered in modal
  const inputRef = React.useCallback(
    (node: HTMLInputElement | null) => {
      if (showEditScoreModal && node) {
        node.focus()
      }
    },
    [showEditScoreModal]
  )

  function handleUpdateHoleScoreState(e) {
    const value = e.target.value
    setScoreBeingEdited({ ...scoreBeingEdited, score: value ? value : '' })
  }

  function handleOpenEditScoreModal({
    playerHoleId,
    hole,
    score,
  }: PlayerHoleScoreState) {
    setCurrentScore(score)
    setScoreBeingEdited({
      playerHoleId,
      hole,
      score: score ?? '',
    })
    setShowEditScoreModal(true)
  }

  // TODO: a better way to handle this where I don't need to check both round scores and round PPE to find playerHoleId? (e.g. maybe add playerHoleId to scorecard even for holes without score?)
  async function updateHoleScore(): Promise<void> {
    if (score === '') {
      handleCloseModal()
      return
    }

    let scoreUpdateSuccessful = false
    let _playerHoleId = playerHoleId
    if (currentScore === null) {
      /** A score doesn't exist for the selected hole so check PlayerHole table in case any PlayerPointEarned exist for that hole */
      const getPlayerHoleRes = await getPlayerHole({ playerId, roundId, hole })
      const getPlayerHoleResJson = await getPlayerHoleRes.json()
      if (getPlayerHoleRes.ok) {
        _playerHoleId = getPlayerHoleResJson.id
      }
    }

    let currentScoreWasUpdated = false
    if (_playerHoleId) {
      /** PlayerHole exists so add or update score to it */
      const res = await updatePlayerHole(_playerHoleId, {
        score: score ? +score : null,
      })
      if (res.ok) {
        scoreUpdateSuccessful = true
        if (currentScore !== score) {
          currentScoreWasUpdated = true
        }
      }
    } else {
      /** No PlayerHole exists for hole so create it and add score */
      const playerHoleRes = await createOrFindPlayerHole({
        playerId,
        roundId,
        hole,
        score: score ? +score : null,
      })
      if (playerHoleRes.ok) {
        scoreUpdateSuccessful = true
      }
    }

    if (scoreUpdateSuccessful) {
      await refetchHoleScores()
      handleCloseModal()
      toast.success(
        `Score successfully ${currentScoreWasUpdated ? 'updated' : 'added'}`
      )
    }
  }

  async function deleteHoleScore() {
    const res = await updatePlayerHole(playerHoleId, { score: null })
    if (res.ok) {
      await refetchHoleScores()
      handleCloseModal()
      toast.success('Score was successfully deleted')
    }
  }

  function handleCloseModal() {
    setShowEditScoreModal(false)
    setScoreBeingEdited(defaultScoreBeingEditedState)
  }

  function EditHoleScoreButtons(): JSX.Element {
    return (
      <>
        <button onClick={updateHoleScore}>Save</button>
        {playerHoleId && (
          <button onClick={deleteHoleScore} className="delete-button">
            Delete
          </button>
        )}
      </>
    )
  }

  return (
    <>
      {/* <h3 className="page-title">Player Round Points & Scorecard</h3> */}
      <h3 className="ta-center">{playerName}</h3>
      <div className="ta-center">
        <Link to={`/league/${leagueId}/round/${roundId}/scoring`}>
          Round Scoring Home <FontAwesomeIcon icon={faAnglesRight} />
        </Link>
      </div>

      <div className="centered-button">
        <Link
          to={`/league/${leagueId}/round/${roundId}/round-player-scoring`}
          state={{ playerId, playerName }}
        >
          <button>Enter Point Earned / Score</button>
        </Link>
      </div>

      <PlayerRoundPointsAndScoringSummary
        totalPoints={totalPoints}
        totalScoresEntered={totalScoresEntered}
        frontNineTotal={frontNineTotal}
        backNineTotal={backNineTotal}
      />

      <PlayerRoundPointsEarnedTable roundPointsEarned={roundPointsEarned} />

      <p className="non-input-label">Scorecard</p>
      <ScorecardTable
        numberOfHoles={holesInRound / 2}
        holeGroup="front-nine"
        holeGroupScoreTotal={frontNineTotal}
        holeScores={frontNineScores}
        handleOpenEditScoreModal={handleOpenEditScoreModal}
      />
      <ScorecardTable
        numberOfHoles={holesInRound / 2}
        holeGroup="back-nine"
        holeGroupScoreTotal={backNineTotal}
        holeScores={backNineScores}
        handleOpenEditScoreModal={handleOpenEditScoreModal}
      />

      {showEditScoreModal && (
        <Modal
          title={`Edit Hole ${scoreBeingEdited.hole} Score`}
          closeModal={handleCloseModal}
          renderButtons={() => <EditHoleScoreButtons />}
        >
          <h3 className={styles.playerName}>{playerName}</h3>

          <BasicInput
            min="0"
            type="number"
            label="Hole Score"
            name="score"
            value={scoreBeingEdited.score}
            onChange={handleUpdateHoleScoreState}
            onFocus={selectAllInputText}
            ref={inputRef}
          />
        </Modal>
      )}
    </>
  )
}
