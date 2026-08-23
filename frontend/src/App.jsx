import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import AthleteDashboard from "./pages/AthleteDashboard";
import AthleteProfile from "./pages/AthleteProfile";
import AthleteProfileView from "./pages/AthleteProfileView";
import Settings from "./pages/Settings";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Help from "./pages/Help";

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
      </Routes>
    </BrowserRouter>
  );
};

export default App;