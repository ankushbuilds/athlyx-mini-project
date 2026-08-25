import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Auth from "./pages/Auth";

import About from "./pages/About";
import Contact from "./pages/Contact";
import Help from "./pages/Help";

// Athlete Pages
import AthleteDashboard from "./pages/Athlete-Pages/AthleteDashboard";
import AthleteProfile from "./pages/Athlete-Pages/AthleteProfile";
import AthleteProfileView from "./pages/Athlete-Pages/AthleteProfileView";
import Settings from "./pages/Athlete-Pages/Settings";
import Discover from "./pages/Athlete-Pages/Discover";
import Opportunities from "./pages/Athlete-Pages/Opportunities";
import Showcase from "./pages/Athlete-Pages/Showcase";
import AthleteConnections from "./pages/Athlete-Pages/AthleteConnections";

// Coach Pages
import CoachDashboard from "./pages/Coach-Pages/CoachDashboard";
import CoachSettings from "./pages/Coach-Pages/CoachSettings";
import CoachProfileView from "./pages/Coach-Pages/CoachProfileView";
import CoachProfile from "./pages/Coach-Pages/CoachProfile";
import CoachAthletes from "./pages/Coach-Pages/CoachAthletes";
import CoachDiscover from "./pages/Coach-Pages/CoachDiscover";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* ==================== PUBLIC ROUTES ==================== */}

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

        {/* ==================== ATHLETE ROUTES ==================== */}

        <Route
          path="/athlete/dashboard"
          element={<AthleteDashboard />}
        />

        <Route
          path="/athlete/profile"
          element={<AthleteProfile />}
        />

        <Route
          path="/athlete/my-profile"
          element={<AthleteProfileView />}
        />

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

        {/* ==================== COACH ROUTES ==================== */}

        <Route
          path="/coach/dashboard"
          element={<CoachDashboard />}
        />

        <Route
          path="/coach/profile"
          element={<CoachProfile />}
        />

        <Route
          path="/coach/my-profile"
          element={<CoachProfileView />}
        />

        {/* Coach connected athletes list */}
        <Route
          path="/coach/athletes"
          element={<CoachAthletes />}
        />

        {/* Individual athlete profile opened by coach */}
        <Route
          path="/coach/athletes/:athleteId"
          element={<AthleteProfileView />}
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
          element={
            <div>Athlete Requests</div>
          }
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