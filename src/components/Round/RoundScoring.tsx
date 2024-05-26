import { useContext, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { RoundContext } from './RoundDetailsContainer'
import styles from './RoundScoring.module.css'
import BasicInput from '../shared/components/BasicInput'
import Radio from '../shared/components/Radio'

type RoundScoringSortBy = 'a-z' | 'z-a' | 'high-low' | 'low-high'

export default function RoundScoring() {
  const [filterQuery, setFilterQuery] = useState('')
  const [sortBy, setSortBy] = useState<RoundScoringSortBy>('a-z')

  const { leagueId } = useParams()
  const {
    id: roundId,
    players,
    pointSettings,
    handleDeleteRound,
  } = useContext(RoundContext)

  function handleInputChange({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>): void {
    setFilterQuery(value)
    handlePlayerFilter()
  }

  function handlePlayerFilter() {
    console.log('handlePlayerFilter')
  }

  function handleSorting(e) {
    console.log('handleSorting: ', e.target.id)
    setSortBy(e.target.id)
  }

  return (
    <>
      <h3 className="page-title">Round Scoring</h3>

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
            id="a-z"
            value="A-Z"
            name="sort-round-player-scoring-radio-buttons"
            label="Player - A to Z"
            onChange={handleSorting}
            checked={sortBy === 'a-z'}
            // hidden
          />

          <Radio
            id="z-a"
            value="Z-A"
            name="sort-round-player-scoring-radio-buttons"
            label="Player - Z to A"
            onChange={handleSorting}
            checked={sortBy === 'z-a'}
            // hidden
          />

          <Radio
            id="high-low"
            value="high-low"
            name="sort-round-player-scoring-radio-buttons"
            label="Score - high to low"
            onChange={handleSorting}
            checked={sortBy === 'high-low'}
            // hidden
          />

          <Radio
            id="low-high"
            value="low-high"
            name="sort-round-player-scoring-radio-buttons"
            label="Score - low to high"
            onChange={handleSorting}
            checked={sortBy === 'low-high'}
            // hidden
          />
        </fieldset>
      </form>

      <ul
        className={`${styles.playerScoringList} editable-list--player-scoring`}
      >
        {/* <ul className="editable-list--player-scoring"> */}
        {players.map((player) => {
          return (
            <li key={player.id}>
              <span>{player.name}</span>
              <span className="list-point-value">#ofpoints</span>
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
  )
}
