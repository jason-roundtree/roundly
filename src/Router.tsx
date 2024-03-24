import React from 'react'
import { Outlet, Routes, Route, Link } from 'react-router-dom'

import Home from './Home'
import {
  CreateLeague,
  LeagueHomeLayout,
  // InvitePlayer,
  // LeaguePointSetting,
  LeaguesList,
  LeagueMembers,
  LeagueStandings,
  LeagueHome,
} from './components/League'
import {
  PlayerSelect,
  LeaguePlayers,
  RoundPlayers,
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
  // Round,
  Rounds,
  RoundDetailsContainer,
  RoundDetails,
} from './components/Round'
import { Signup, Login, Profile } from './components/User'
import {
  LeaguePointSettings,
  RoundPointSettings,
} from './components/PointSettings'

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/* <Route path="about" element={} /> */}
      {/* <Route path="signup" element={<Signup />} /> */}
      {/* <Route path="login" element={<Login />} /> */}

      {/* user dashboard */}
      {/* <Route path=":user" element={< />} /> */}
      {/* user profile */}
      {/* <Route path="profile" element={<Profile />} /> */}

      <Route path="create-league" element={<CreateLeague />} />
      {/* <Route path="leagues" element={<LeaguesList />} /> */}

      {/* TODO: remove parent layout route if still unused */}
      {/* <Route element={<LeagueHomeLayout />}> */}
      <Route path="league/:leagueId" element={<LeagueHome />} />
      <Route path="league/:leagueId/players" element={<LeaguePlayers />} />
      <Route
        path="league/:leagueId/point-settings"
        element={<LeaguePointSettings />}
      />
      <Route path="league/:leagueId/rounds" element={<Rounds />} />
      <Route path="league/:leagueId/create-round" element={<CreateRound />} />
      <Route path="league/:leagueId/standings" element={<LeagueStandings />} />
      <Route
        path="league/:leagueId/rounds/:roundId"
        element={<RoundDetailsContainer />}
      >
        <Route index element={<RoundDetails />} />
        <Route path="point-settings" element={<RoundPointSettings />} />
        <Route
          // path="league/:leagueId/rounds/:roundId/players"
          path="players"
          element={<RoundPlayers />}
        />
      </Route>
      {/* </Route> */}

      {/* <Route path="league/:id/members" element={<LeagueMembers />} /> */}
      {/* <Route path="league/:id/settings" element={<LeagueSettings />} /> */}
      {/* <Route path="league/:id/point-setting" element={<LeaguePointSetting />} /> */}
      {/* <Route path="league/:id/schedule" element={< />} /> */}
      {/* event history */}
      {/* <Route path="league/:id/history" element={< />} /> */}

      {/* <Route path="rounds/:id" element={<RoundDetails />} /> */}
      {/* user rounds */}
      {/* <Route path="rounds/:name" element={<PlayerRounds />} /> */}

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
