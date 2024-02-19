import { useEffect, useState, createContext } from 'react'
import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom'

import { Round, Player, PointSetting } from '../../types'
import { fetchRound, deleteRound } from '../../data'

//   TODO: if keeping these move to a separate file
const twEditInputs =
  'block border borderGray300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2'
const twListItems =
  'max-w-fit rounded-lg my-1 mx-4 p-2 list-item editable-list-item'

const RoundContextDefault = {
  id: '',
  name: '',
  location: '',
  date: '',
  players: [] as Player[],
  pointSettings: [] as PointSetting[],
  refreshRoundState: () => {},
  handleDeleteRound: () => {},
}

type RoundContextDefaultType = typeof RoundContextDefault

export const RoundContext = createContext(
  RoundContextDefault as RoundContextDefaultType
)

export default function RoundDetails(): JSX.Element {
  const [roundData, setRoundData] = useState(RoundContextDefault)
  const { id, name, location, date, players, pointSettings } = roundData

  const { roundId, leagueId } = useParams()
  const navigate = useNavigate()
  useEffect(() => {
    refreshRoundState()
  }, [])

  async function handleDeleteRound() {
    await deleteRound(roundId)
    navigate(`/league/${leagueId}/rounds`)
  }

  async function refreshRoundState() {
    const roundData = await fetchRound(roundId)
    // const { players, point_settings } = roundData
    // setPlayers(players)
    // setPointSettings(point_settings)
    setRoundData(roundData)
  }

  const dateFormatted = new Date(date).toLocaleDateString()
  return (
    <RoundContext.Provider
      value={{
        id,
        name,
        location,
        date: dateFormatted,
        players,
        pointSettings,
        refreshRoundState,
        handleDeleteRound,
      }}
    >
      <Link to={`/league/${leagueId}`}>League Home</Link>
      {/* TODO: add link bavk to round details */}
      <h2>Round</h2>
      <p>{name}</p>
      <p>{location && location}</p>
      <p>{dateFormatted}</p>
      <Outlet />
    </RoundContext.Provider>
  )
}
