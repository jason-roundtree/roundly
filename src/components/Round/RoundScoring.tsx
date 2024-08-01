import { useContext, useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'

import { RoundContext } from './RoundDetailsContainer'
import styles from './RoundScoring.module.css'
import BasicInput from '../shared/components/BasicInput'
import Radio from '../shared/components/Radio'
import { getRoundPlayerPointsEarnedTotal } from '../../data'
import { sortArrayOfObjects } from '../shared/utils'

type RoundScoringSortBy = 'a-z' | 'z-a' | 'high-low' | 'low-high'
interface PlayersWithPointTotals {
  total_points: number
  id: string
  name: string
}

export default function RoundScoring() {
  const [filterQuery, setFilterQuery] = useState('')
  const [sortBy, setSortBy] = useState<RoundScoringSortBy>('high-low')
  const [playersWithPointTotals, setPlayersWithPointTotals] = useState<
    Array<PlayersWithPointTotals>
  >([])
  const [sortedPlayersWithPointTotals, setSortedPlayersWithPointTotals] =
    useState<Array<any>>([])
  const { leagueId } = useParams()
  const {
    id: roundId,
    players,
    pointSettings,
    handleDeleteRound,
  } = useContext(RoundContext)
  console.log('playersWithPointTotals ++++', playersWithPointTotals)
  console.log('sortBy ====', sortBy)
  console.log(
    'sortedPlayersWithPointTotals -----',
    sortedPlayersWithPointTotals
  )

  useEffect(() => {
    generatePlayersWithPointTotals()
  }, [players])

  useEffect(() => {
    sortPlayersByView()
  }, [sortBy, playersWithPointTotals])

  async function generatePlayersWithPointTotals() {
    const playersWithPointTotals = await Promise.all(
      players.map(async (p) => {
        const res = await getRoundPlayerPointsEarnedTotal(p.id, roundId)
        if (res.status === 200) {
          const { total_points } = await res.json()
          console.log('totalPoints: ', total_points)
          return {
            ...p,
            total_points: total_points,
          }
        } else {
          return {
            ...p,
            total_points: 0,
          }
        }
      })
    )
    setPlayersWithPointTotals(playersWithPointTotals)
  }

  function handleInputChange({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>): void {
    setFilterQuery(value)
    handlePlayerFilter()
  }

  function handlePlayerFilter() {
    console.log('handlePlayerFilter')
  }

  function handleUpdateSorting(e) {
    console.log('handleUpdateSorting: ', e.target.id)
    setSortBy(e.target.id)
  }

  function sortPlayersByView() {
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
    console.log('sortedArray', sortedArray)
    setSortedPlayersWithPointTotals(sortedArray)
  }

  return (
    <>
      <h3 className="page-title">Round Scoring</h3>

      {players.length ? (
        <>
          <div className="centered-button">
            <Link
              to={`/league/${leagueId}/rounds/${roundId}/round-player-scoring`}
            >
              <button>Enter Point Earned / Score</button>
            </Link>
          </div>

          <BasicInput
            type="text"
            name="player-search"
            label="Filter Players"
            onChange={handleInputChange}
            value={filterQuery}
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
                label="Score - high to low"
                onChange={handleUpdateSorting}
                checked={sortBy === 'high-low'}
                // hidden
              />

              <Radio
                id="low-high"
                value="low-high"
                name="sort-round-player-scoring-radio-buttons"
                label="Score - low to high"
                onChange={handleUpdateSorting}
                checked={sortBy === 'low-high'}
                // hidden
              />

              <Radio
                id="a-z"
                value="A-Z"
                name="sort-round-player-scoring-radio-buttons"
                label="Player - A to Z"
                onChange={handleUpdateSorting}
                checked={sortBy === 'a-z'}
                // hidden
              />

              <Radio
                id="z-a"
                value="Z-A"
                name="sort-round-player-scoring-radio-buttons"
                label="Player - Z to A"
                onChange={handleUpdateSorting}
                checked={sortBy === 'z-a'}
                // hidden
              />
            </fieldset>
          </form>

          <ul
            className={`${styles.playerScoringList} editable-list--player-scoring`}
          >
            {sortedPlayersWithPointTotals.map((player) => {
              console.log('player render map', player)
              return (
                <li key={player.id}>
                  <span>{player.name}</span>
                  <span className="list-point-value">
                    {player.total_points}
                  </span>
                  <span className="list-edit-buttons">
                    <Link
                      to={`/league/${leagueId}/rounds/${roundId}/player-scoring?playerId=${
                        player.id
                      }&playerName=${encodeURIComponent(player.name)}`}
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
            <Link to={`/league/${leagueId}/rounds/${roundId}/players`}>
              <button className="centered-button">Activate Players</button>
            </Link>
          </div>
        </>
      )}
    </>
  )
}
