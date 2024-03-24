import { useEffect, useState } from 'react'
import { Link, Outlet, useParams, useMatch } from 'react-router-dom'

import { BasicLeagueState, Player, PointSetting, Round } from '../../types'
import { fetchBasicLeagueData } from '../../data'
import { defaultLeagueState } from '../League/CreateLeague'

export default function LeagueHomeLayout() {
  const [leagueData, setBasicLeagueData] =
    useState<BasicLeagueState>(defaultLeagueState)
  const { leagueId } = useParams()
  const isHomePage = useMatch('/league/:id')

  useEffect(() => {
    getBasicLeagueData()
  }, [])

  async function getBasicLeagueData() {
    const leagueData = await fetchBasicLeagueData(leagueId)
    setBasicLeagueData(leagueData)
  }

  function pageTitle() {
    if (isHomePage) {
      return <h1 className="">${leagueData.name} - League Home</h1>
    } else {
      return <Link to={`/league/${leagueId}`}>League Home</Link>
    }
  }

  return (
    <>
      {pageTitle()}
      <Outlet />
    </>
  )
}
