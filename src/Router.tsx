import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'

import Home from './Home'
import {
  CreateLeague,
  // InvitePlayer,
  LeagueSettings,
  // LeaguePointSetting,
  LeaguesList,
  LeagueMembers,
  LeaguePlayers,
  LeagueStandings,
  LeagueHome,
} from './components/League'
import {
  PlayerSelect,
  // PlayersList
} from './components/Player'
import {
  PlayerRoundDetails,
  PlayerRoundPointsEarned,
  PlayerRounds,
  PlayerRoundSummary,
  PlayerRoundScorecard,
  PlayerHole,
} from './components/PlayerRound'
import {
  CreateRound,
  RoundsList,
  RoundPlayers,
  RoundSettings,
  RoundPointSettings,
  RoundSummary,
} from './components/Round'
import { Signup, Login, Profile } from './components/User'
import { PointSettings } from './components/PointSettings'

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/* <Route path="about" element={} /> */}
      <Route path="signup" element={<Signup />} />
      <Route path="login" element={<Login />} />

      {/* user dashboard */}
      {/* <Route path=":user" element={< />} /> */}
      {/* user profile */}
      <Route path="profile" element={<Profile />} />

      <Route path="create-league" element={<CreateLeague />} />
      <Route path="leagues" element={<LeaguesList />} />
      <Route path="league/:id" element={<LeagueHome />} />
      {/* user leagues */}
      <Route path="league/:id/players" element={<LeaguePlayers />} />
      <Route path="league/:id/members" element={<LeagueMembers />} />
      <Route path="league/:id/settings" element={<LeagueSettings />} />
      {/* <Route path="league/:id/point-setting" element={<LeaguePointSetting />} /> */}
      <Route
        path="league/:id/create-round/point-settings"
        element={<PointSettings />}
      />
      <Route path="league/:id/point-settings" element={<PointSettings />} />
      <Route path="league/:id/standings" element={<LeagueStandings />} />
      {/* <Route path="league/:id/schedule" element={< />} /> */}
      {/* event history */}
      {/* <Route path="league/:id/history" element={< />} /> */}

      <Route path="league/:id/create-round" element={<CreateRound />} />
      <Route path="league/:id/rounds" element={<RoundsList />} />
      <Route path="rounds/:id" element={<RoundSummary />} />
      {/* user rounds */}
      <Route path="rounds/:id/settings" element={<RoundSettings />} />
      <Route path="rounds/:id/point-setting" element={<RoundPointSettings />} />
      <Route path="rounds/:id/players" element={<RoundPlayers />} />
      <Route path="rounds/:name" element={<PlayerRounds />} />
      {/* TODO: should following 2 be shared component? */}
      <Route
        path="rounds/:id/:name/points"
        element={<PlayerRoundPointsEarned />}
      />
      <Route
        path="rounds/:id/:name/scorecard"
        element={<PlayerRoundScorecard />}
      />
      {/* TODO: are both details and summary needed? */}
      <Route
        path="rounds/:id/:name/round-details"
        element={<PlayerRoundDetails />}
      />
      <Route
        path="rounds/:id/:name/round-summary"
        element={<PlayerRoundSummary />}
      />
      <Route path="rounds/:id/:name/hole/:number" element={<PlayerHole />} />
    </Routes>
  )
}
