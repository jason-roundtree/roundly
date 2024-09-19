import { useState, useContext, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

import { RoundContext } from '../Round/RoundDetailsContainer'
import { EnterHoleScore, EnterPointEarned, EnterPointOrScoreRadios } from '.'
import styles from './EnterPointOrScore.module.css'
import PlayerSelectInput from '../Player/PlayerSelectInput'
import { useGetPlayerPointsEarnedInRound } from '../shared/hooks'
import { HoleSelectInput } from '../Round'

const defaultSelectedPlayerState: {
  id: string
  name: string
} = { id: '', name: '' }

// TODO: re-implement validation similar to PlayerRoundEnterScoring
// TODO: re-implement types (mostly in child components)
// TODO: DRYify some of this with PlayerRoundScoring
export default function EnterPointOrScore() {
  const [showEnterPointForm, setShowEnterPointForm] = useState(true)
  const [selectedPlayer, setSelectedPlayer] = useState(
    defaultSelectedPlayerState
  )
  const [selectedHole, setSelectedHole] = useState('')

  const location = useLocation()
  const playerFromLocation = location.state
  const {
    id: roundId,
    players: playersFromContext,
    pointSettings,
    leagueId,
  } = useContext(RoundContext)
  console.log('players from context', playersFromContext)
  console.log('pointSettings from context', pointSettings)

  const playerPointsEarnedInRound = useGetPlayerPointsEarnedInRound(
    selectedPlayer.id,
    roundId
  )

  return (
    // TODO: make into form?
    <div className="">
      {/* className={styles.} */}
      <h3 className="page-title">Add Player Point / Score</h3>

      <PlayerSelectInput
        players={playersFromContext}
        playerFromRouter={playerFromLocation}
        selectedPlayer={selectedPlayer}
        setSelectedPlayer={setSelectedPlayer}
      />

      <HoleSelectInput
        selectedHole={selectedHole}
        setSelectedHole={setSelectedHole}
      />

      <EnterPointOrScoreRadios
        showEnterPointForm={showEnterPointForm}
        setShowEnterPointForm={setShowEnterPointForm}
      />

      {showEnterPointForm ? (
        <EnterPointEarned
          pointSettings={pointSettings}
          selectedPlayer={selectedPlayer}
          playerPointsEarnedInRound={playerPointsEarnedInRound}
          selectedHole={selectedHole}
          roundId={roundId}
        />
      ) : (
        <EnterHoleScore
          selectedHole={selectedHole}
          selectedPlayer={selectedPlayer}
          roundId={roundId}
        />
      )}

      <div>
        {/* <div className={styles.roundScoringLink}> */}
        <Link to={`/league/${leagueId}/rounds/${roundId}/scoring`}>
          Round Scoring
          {/* Round Scoring <FontAwesomeIcon icon={faAnglesRight} /> */}
        </Link>
      </div>
    </div>
  )
}
