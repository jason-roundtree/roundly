import { Routes, Route, Link } from "react-router-dom";

import Home from "./Home";
import { CreateLeague, InvitePlayer, LeagueSettings, LeaguePointSetting, LeaguePointsSettings, LeaguesList, LeagueMembers, LeagueStandings, LeagueSummary } from './components/League';
import { PlayerProfile, PlayerSelect, PlayersList, PlayerSummary } from './components/Player'
import { CreateRound, RoundsList, RoundPlayers, RoundSettings, RoundPointsSettings, RoundSummary } from "./components/Round"
import { Signup, Login, Profile } from "./components/User";

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

            <Route path="league" element={<CreateLeague />} />
            <Route path="leagues" element={<LeaguesList />} />
            <Route path="league/:id" element={<LeagueSummary />} />
            {/* user leagues */}
            <Route path="league/:id/members" element={<LeagueMembers />} />
            <Route path="league/:id/settings" element={<LeagueSettings />} />
            {/* <Route path="league/:id/point" element={<LeaguePointSetting />} /> */}
            <Route path="league/:id/standings" element={<LeagueStandings />} />
            {/* <Route path="league/:id/schedule" element={< />} /> */}
            {/* event history */}
            {/* <Route path="league/:id/history" element={< />} /> */}

            <Route path="round" element={<CreateRound />} />
            <Route path="rounds" element={<RoundsList />} />
            <Route path="round/:id" element={<RoundSummary />} />
            {/* user rounds */}
            <Route path="round/:id/settings" element={<RoundSettings />} />
            <Route path="round/:id/player" element={<RoundPlayers />} />
            <Route path="round/:id/players" element={<RoundPlayers />} />

            <Route path="player/:id" element={<PlayerProfile />} />
            {/* <Route path="player/:id" element={<PlayerProfile />} />
                <Route path="player/:id" element={<PlayerProfile />} /> */}
        </Routes>
    )
}