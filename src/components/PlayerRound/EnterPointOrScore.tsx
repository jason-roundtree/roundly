import { useState, useContext, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

import { RoundContext } from '../Round/RoundContainer'
import { EnterHoleScore, EnterPointEarned, EnterPointOrScoreRadios } from '.'
import styles from './EnterPointOrScore.module.css'
import PlayerSelectInput from '../Player/PlayerSelectInput'
import { useGetPlayerRoundPointsEarned } from '../shared/hooks'
import { HoleSelectInput } from '../Round'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAnglesRight } from '@fortawesome/free-solid-svg-icons'

const defaultSelectedPlayerState: {
  id: string
  name: string
} = { id: '', name: '' }

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
  console.log('playerFromLocation', playerFromLocation)
  const {
    id: roundId,
    players: playersFromContext,
    pointSettings,
    leagueId,
  } = useContext(RoundContext)
  console.log('roundId, leagueId from context', { roundId, leagueId })
  console.log('players from context', playersFromContext)
  console.log('pointSettings from context', pointSettings)

  const {
    data: roundPointsEarned = [],
    isLoading: isPlayerRoundPointsEarnedLoading,
    isError: isPlayerRoundPointsEarnedError,
    refetch: refetchPlayerRoundPointsEarned,
  } = useGetPlayerRoundPointsEarned(selectedPlayer.id, roundId)

  return (
    // TODO: make into form?
    <div>
      {/* className={styles.} */}
      <h3 className="decrease-bottom-margin page-title">
        Add Player Point / Score
      </h3>
      <div className="ta-center">
        <Link to={`/league/${leagueId}/round/${roundId}/scoring`}>
          Round Scoring Home <FontAwesomeIcon icon={faAnglesRight} />
        </Link>
      </div>

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

      <div id={styles.pointEarnedOrScoreForm}>
        {showEnterPointForm ? (
          <EnterPointEarned
            pointSettings={pointSettings}
            selectedPlayer={selectedPlayer}
            roundPointsEarned={roundPointsEarned}
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
      </div>
    </div>
  )
}
