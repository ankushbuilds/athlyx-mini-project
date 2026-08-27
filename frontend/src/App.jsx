import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Auth from "./pages/Auth";

import About from "./pages/About";
import Contact from "./pages/Contact";
import Help from "./pages/Help";

// ==========================================
// ATHLETE PAGES
// ==========================================

import AthleteDashboard from "./pages/Athlete-Pages/AthleteDashboard";
import AthleteProfile from "./pages/Athlete-Pages/AthleteProfile";
import AthleteProfileView from "./pages/Athlete-Pages/AthleteProfileView";
import Settings from "./pages/Athlete-Pages/Settings";
import Discover from "./pages/Athlete-Pages/Discover";
import Opportunities from "./pages/Athlete-Pages/Opportunities";
import Showcase from "./pages/Athlete-Pages/Showcase";
import AthleteConnections from "./pages/Athlete-Pages/AthleteConnections";

// ==========================================
// COACH PAGES
// ==========================================

import CoachDashboard from "./pages/Coach-Pages/CoachDashboard";
import CoachSettings from "./pages/Coach-Pages/CoachSettings";
import CoachProfile from "./pages/Coach-Pages/CoachProfile";
import CoachProfileView from "./pages/Coach-Pages/CoachProfileView";
import CoachAthletes from "./pages/Coach-Pages/CoachAthletes";
import CoachDiscover from "./pages/Coach-Pages/CoachDiscover";
import CoachRequests from "./pages/Coach-Pages/CoachRequests";
const App = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* ==========================================
            PUBLIC ROUTES
        ========================================== */}

        <Route
          path="/"
          element={<Landing />}
        />

        <Route
          path="/home"
          element={<Home />}
        />

        <Route
          path="/auth"
          element={<Auth />}
        />

        <Route
          path="/about"
          element={<About />}
        />

        <Route
          path="/contact"
          element={<Contact />}
        />

        <Route
          path="/help"
          element={<Help />}
        />

        {/* ==========================================
            ATHLETE ROUTES
        ========================================== */}

        <Route
          path="/athlete/dashboard"
          element={<AthleteDashboard />}
        />

        <Route
          path="/athlete/profile"
          element={<AthleteProfile />}
        />

        {/* Athlete's own profile */}
        <Route
          path="/athlete/my-profile"
          element={<AthleteProfileView />}
        />

        {/* Coach viewing athlete profile */}
        <Route
          path="/coach/athletes/:athleteId"
          element={<AthleteProfileView />}
        />

        {/* General public athlete profile */}
        <Route
          path="/profile/athlete/:athleteId"
          element={<AthleteProfileView />}
        />

        <Route
          path="/athlete/settings"
          element={<Settings />}
        />

        <Route
          path="/athlete/discover"
          element={<Discover />}
        />

        <Route
          path="/athlete/opportunities"
          element={<Opportunities />}
        />

        <Route
          path="/athlete/showcase"
          element={<Showcase />}
        />

        <Route
          path="/athlete/connections"
          element={<AthleteConnections />}
        />

        {/* ==========================================
            COACH ROUTES
        ========================================== */}

        <Route
          path="/coach/dashboard"
          element={<CoachDashboard />}
        />

        {/* Coach edit profile */}
        <Route
          path="/coach/profile"
          element={<CoachProfile />}
        />

        {/* Coach's own profile */}
        <Route
          path="/coach/my-profile"
          element={<CoachProfileView />}
        />

        {/* ==========================================
            IMPORTANT

            Athlete viewing a coach profile
            ========================================== */}

        <Route
          path="/profile/coach/:coachId"
          element={<CoachProfileView />}
        />

        {/* Coach connected athletes */}
        <Route
          path="/coach/athletes"
          element={<CoachAthletes />}
        />

        <Route
          path="/coach/discover"
          element={<CoachDiscover />}
        />

        <Route
          path="/coach/opportunities"
          element={
            <div>Opportunities</div>
          }
        />

        <Route
          path="/coach/requests"
          element={<CoachRequests />}
        />

        <Route
          path="/coach/settings"
          element={<CoachSettings />}
        />

      </Routes>
    </BrowserRouter>
  );
};

export default App;