
import { BrowserRouter, Routes, Route } from "react-router-dom";

// ==========================================
// PUBLIC PAGES
// ==========================================

import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Help from "./pages/Help";
import Discover from "./pages/Discover";

import Messages from "./components/Messages";

// ==========================================
// ATHLETE PAGES
// ==========================================

import AthleteDashboard from "./pages/Athlete-Pages/AthleteDashboard";
import AthleteProfile from "./pages/Athlete-Pages/AthleteProfile";
import AthleteProfileView from "./pages/Athlete-Pages/AthleteProfileView";
import Settings from "./pages/Athlete-Pages/Settings";
import AthleteDiscover from "./pages/Athlete-Pages/Discover";
import Opportunities from "./pages/Athlete-Pages/Opportunities";
import Showcase from "./pages/Athlete-Pages/Showcase";
import AthleteConnections from "./pages/Athlete-Pages/AthleteConnections";
import Challenges from "./pages/Athlete-Pages/Challenges";

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

// ==========================================
// ACADEMY PAGES
// ==========================================

import AcademyDashboard from "./pages/Academy-Pages/AcademyDashboard";
import AcademyProfile from "./pages/Academy-Pages/AcademyProfile";
import AcademyProfileEdit from "./pages/Academy-Pages/AcademyProfileEdit";
import AcademyAthletes from "./pages/Academy-Pages/AcademyAthletes";
import AcademyDiscover from "./pages/Academy-Pages/AcademyDiscover";
import AcademyRequest from "./pages/Academy-Pages/AcademyRequest";
import AcademySettings from "./pages/Academy-Pages/AcademySettings";

// ==========================================
// ACADEMY EVENT PAGES
// ==========================================

import CreateEvent from "./pages/Academy-Pages/CreateEvent";
import AcademyEvents from "./pages/Academy-Pages/AcademyEvents";

// ==========================================
// APP
// ==========================================

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

        <Route
          path="/discover"
          element={<Discover />}
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

        <Route
          path="/athlete/my-profile"
          element={<AthleteProfileView />}
        />

        <Route
          path="/coach/athletes/:athleteId"
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
          element={<AthleteDiscover />}
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

        <Route
          path="/athlete/messages"
          element={<Messages />}
        />

        <Route
          path="/athlete/challenges"
          element={<Challenges />}
        />

        {/* ==========================================
            COACH ROUTES
        ========================================== */}

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

        <Route
          path="/profile/coach/:coachId"
          element={<CoachProfileView />}
        />

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
          element={<div>Opportunities</div>}
        />

        <Route
          path="/coach/requests"
          element={<CoachRequests />}
        />

        <Route
          path="/coach/settings"
          element={<CoachSettings />}
        />

        <Route
          path="/coach/messages"
          element={<Messages />}
        />

        {/* ==========================================
            ACADEMY ROUTES
        ========================================== */}

        <Route
          path="/academy/dashboard"
          element={<AcademyDashboard />}
        />

        <Route
          path="/academy/create-profile"
          element={<AcademyProfileEdit />}
        />

        <Route
          path="/academy/my-profile"
          element={<AcademyProfile />}
        />

        <Route
          path="/academy/edit-profile"
          element={<AcademyProfileEdit />}
        />

        <Route
          path="/academy/athletes"
          element={<AcademyAthletes />}
        />

        <Route
          path="/academy/discover"
          element={<AcademyDiscover />}
        />

        <Route
          path="/academy/requests"
          element={<AcademyRequest />}
        />

        <Route
          path="/academy/messages"
          element={<Messages />}
        />

        <Route
          path="/academy/settings"
          element={<AcademySettings />}
        />

        <Route
          path="/profile/academy/:academyId"
          element={<AcademyProfile />}
        />

        {/* ==========================================
            ACADEMY EVENTS
        ========================================== */}

        {/* Event List */}
        <Route
          path="/academy/events"
          element={<AcademyEvents />}
        />

        {/* Create Event */}
        <Route
          path="/academy/events/create"
          element={<CreateEvent />}
        />

        {/* Edit Event */}
        <Route
          path="/academy/events/:id/edit"
          element={<AcademyEvents />}
        />

        {/* View Single Event */}
        <Route
          path="/academy/events/:id"
          element={<AcademyEvents />}
        />

      </Routes>
    </BrowserRouter>
  );
};

export default App;
