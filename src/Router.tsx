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
  AddPlayer,
  EditLeaguePlayer,
  // PlayersList
} from './components/Player'
import {
  PlayerRoundDetails,
  PlayerRounds,
  PlayerRoundPointsAndScoringSummary,
  PlayerRoundScorecard,
  PlayerHole,
  PlayerRoundPointsAndScoring,
  EditPointEarned,
  EnterPointOrScore,
} from './components/PlayerRound'
import {
  CreateRound,
  // Round,
  Rounds,
  RoundContainer,
  RoundHome,
  RoundScoring,
  EditRoundInfo,
} from './components/Round'
import { Signup, Login, Profile } from './components/User'
import {
  LeaguePointSettings,
  LeaguePointSetting,
  RoundPointSettings,
  RoundPointSetting,
  AddPointSetting,
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
        path="league/:leagueId/edit-player/:playerId"
        element={<EditLeaguePlayer />}
      />
      <Route
        path="league/:leagueId/point-settings"
        element={<LeaguePointSettings />}
      />
      <Route
        path="league/:leagueId/point-settings/:pointSetting"
        element={<LeaguePointSetting />}
      />
      <Route
        path="league/:leagueId/new-point"
        element={<AddPointSetting pointContext="league" />}
      />
      <Route path="league/:leagueId/new-player" element={<AddPlayer />} />
      <Route path="league/:leagueId/rounds" element={<Rounds />} />
      <Route path="league/:leagueId/create-round" element={<CreateRound />} />
      <Route path="league/:leagueId/standings" element={<LeagueStandings />} />

      <Route
        path="league/:leagueId/round/:roundId"
        element={<RoundContainer />}
      >
        <Route index element={<RoundHome />} />
        {/* <Route path="edit-round-info" element={<EditRoundInfo />} /> */}
        <Route path="scoring" element={<RoundScoring />} />
        <Route
          path="player-scoring/:player"
          element={<PlayerRoundPointsAndScoring />}
        />
        <Route
          path="player-scoring/:player/edit-point-earned"
          element={<EditPointEarned />}
        />
        <Route
          path="new-point"
          element={<AddPointSetting pointContext="round" />}
        />
        <Route path="round-player-scoring" element={<EnterPointOrScore />} />
        {/* <Route path="rounds/:id/:name/hole/:number" element={<PlayerHole />} /> */}
        {/* <Route path=":playerId/scorecard" element={<PlayerRoundScorecard />} /> */}
        <Route path="point-settings" element={<RoundPointSettings />} />
        {/* TODO: add component */}
        <Route
          path="point-settings/:pointSetting"
          element={<RoundPointSetting />}
        />
        <Route
          // path="league/:leagueId/round/:roundId/players"
          path="players"
          element={<RoundPlayers />}
        />
      </Route>
      <Route
        path="league/:leagueId/round/:roundId/edit-round-info"
        element={<EditRoundInfo />}
      />

      {/* <Route path="league/:id/members" element={<LeagueMembers />} /> */}
      {/* <Route path="league/:id/settings" element={<LeagueSettings />} /> */}
      {/* <Route path="league/:id/point-setting" element={<LeaguePointSetting />} /> */}
      {/* <Route path="league/:id/schedule" element={< />} /> */}
      {/* event history */}
      {/* <Route path="league/:id/history" element={< />} /> */}
    </Routes>
  )
}
