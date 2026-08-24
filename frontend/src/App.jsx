import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import AthleteDashboard from "./pages/Athlete-Pages/AthleteDashboard";
import AthleteProfile from "./pages/Athlete-Pages/AthleteProfile";
import AthleteProfileView from "./pages/Athlete-Pages/AthleteProfileView";
import Settings from "./pages/Athlete-Pages/Settings";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Help from "./pages/Help";
import Discover from "./pages/Athlete-Pages/Discover";
import Opportunities from "./pages/Athlete-Pages/Opportunities";
import Showcase from "./pages/Athlete-Pages/Showcase";
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/auth" element={<Auth />} />

        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/help" element={<Help />} />

        <Route path="/athlete/dashboard" element={<AthleteDashboard />} />
        <Route path="/athlete/profile" element={<AthleteProfile />} />
        <Route path="/athlete/my-profile" element={<AthleteProfileView />} />
        <Route path="/athlete/settings" element={<Settings />} />
        <Route path="/athlete/discover" element={<Discover />} />

        <Route path="/athlete/opportunities" element={<Opportunities />} />
        <Route
          path="/athlete/showcase"
          element={<Showcase />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;