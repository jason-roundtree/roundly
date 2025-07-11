import { useState, useEffect, useCallback } from 'react'
import { Link, useParams } from 'react-router-dom'

import styles from './RoundScoring.module.css'
import BasicInput from '../shared/components/BasicInput'
import Radio from '../shared/components/Radio'
import { simpleTextSearchMatch, sortArrayOfObjects } from '../shared/utils'
import { useGetAllPlayersRoundPointsEarnedTotals } from '../shared/hooks'
import { useRound } from '../shared/hooks/useRound'

type RoundScoringSortBy = 'a-z' | 'z-a' | 'high-low' | 'low-high'
export interface PlayersWithPointTotals {
  total_points: number
  id: string
  name: string
}

export default function RoundScoring() {
  const [playerSearchQuery, setPlayerSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<RoundScoringSortBy>('high-low')
  const [sortedPlayersWithPointTotals, setSortedPlayersWithPointTotals] =
    useState<Array<any>>([])
  const { leagueId, roundId } = useParams()
  const { data: round, isLoading, isError } = useRound(roundId)
  const players = round?.players || []

  const {
    data: playersWithPointTotals = [],
    isLoading: isTotalsLoading,
    isError: isTotalsError,
  } = useGetAllPlayersRoundPointsEarnedTotals(players, roundId)

  const sortPlayersByView = useCallback(() => {
    let sortedArray: Array<any> = []
    switch (sortBy) {
      case 'a-z':
        sortedArray = sortArrayOfObjects(playersWithPointTotals, 'name', 'ASC')
        break
      case 'z-a':
        sortedArray = sortArrayOfObjects(playersWithPointTotals, 'name', 'DESC')
        break
      case 'low-high':
        sortedArray = sortArrayOfObjects(
          playersWithPointTotals,
          'total_points',
          'ASC'
        )
        break
      case 'high-low':
        sortedArray = sortArrayOfObjects(
          playersWithPointTotals,
          'total_points',
          'DESC'
        )
        break
      default:
        console.log('DEFAULT!!!!')
    }
    setSortedPlayersWithPointTotals(sortedArray)
  }, [sortBy, playersWithPointTotals])

  useEffect(() => {
    sortPlayersByView()
  }, [sortBy, playersWithPointTotals, sortPlayersByView])

  function handleUpdateSortBy(e) {
    setSortBy(e.target.id)
  }

  if (isLoading || isTotalsLoading) return <div>Loading...</div>
  if (isError || isTotalsError) return <div>Error loading round data.</div>

  return (
    <>
      <h3 className="page-title">Round Scoring</h3>

      {players.length ? (
        <>
          <div className="centered-button">
            <Link
              to={`/league/${leagueId}/round/${roundId}/round-player-scoring`}
            >
              <button>Enter Point Earned / Score</button>
            </Link>
          </div>

          <BasicInput
            type="text"
            name="player-search"
            label="Search Players"
            onChange={(e) => setPlayerSearchQuery(e.target.value)}
            value={playerSearchQuery}
          />

          <form>
            <fieldset
              className={`${styles.sortingRadios} sort-round-player-scoring`}
            >
              <legend>Sort</legend>
              <Radio
                id="high-low"
                value="high-low"
                name="sort-round-player-scoring-radio-buttons"
                label="Total Points - high to low"
                onChange={handleUpdateSortBy}
                checked={sortBy === 'high-low'}
                // hidden
              />

              <Radio
                id="low-high"
                value="low-high"
                name="sort-round-player-scoring-radio-buttons"
                label="Total Points - low to high"
                onChange={handleUpdateSortBy}
                checked={sortBy === 'low-high'}
                // hidden
              />

              <Radio
                id="a-z"
                value="A-Z"
                name="sort-round-player-scoring-radio-buttons"
                label="Player - A to Z"
                onChange={handleUpdateSortBy}
                checked={sortBy === 'a-z'}
                // hidden
              />

              <Radio
                id="z-a"
                value="Z-A"
                name="sort-round-player-scoring-radio-buttons"
                label="Player - Z to A"
                onChange={handleUpdateSortBy}
                checked={sortBy === 'z-a'}
                // hidden
              />
            </fieldset>
          </form>

          <ul
            className={`${styles.playerScoringList} editable-list--player-scoring`}
          >
            {sortedPlayersWithPointTotals.map((player) => {
              const playerName = player.name
              const playerMatchesSearch = playerSearchQuery
                ? simpleTextSearchMatch(playerSearchQuery, playerName)
                : true

              return (
                <li
                  key={player.id}
                  className={`editable-list-item ${
                    !playerMatchesSearch ? 'hidden' : ''
                  }`}
                >
                  <span>{playerName}</span>
                  <span className="list-point-value">
                    {player.total_points}
                  </span>
                  <span className="list-edit-buttons">
                    <Link
                      // to={`/league/${leagueId}/round/${roundId}/player-scoring?playerId=${
                      //   player.id
                      // }&playerName=${encodeURIComponent(playerName)}`}
                      to={`/league/${leagueId}/round/${roundId}/player-scoring/${player.id}`}
                      state={{ playerId: player.id, playerName }}
                    >
                      <button>Edit</button>
                    </Link>
                  </span>
                </li>
              )
            })}
          </ul>
        </>
      ) : (
        <>
          <p className="centered-text">
            No players have been activated for this round
          </p>
          <div className="centered-button">
            <Link to={`/league/${leagueId}/round/${roundId}/players`}>
              <button className="centered-button">Activate Players</button>
            </Link>
          </div>
        </>
      )}
    </>
  )
}
