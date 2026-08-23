import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import AthleteDashboard from "./pages/AthleteDashboard";
import AthleteProfile from "./pages/AthleteProfile";
import AthleteProfileView from "./pages/AthleteProfileView";
import Settings from "./pages/Settings";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />

        <Route path="/home" element={<Home />} />
        <Route path="/auth" element={<Auth />} />

        <Route path="/athlete/dashboard" element={<AthleteDashboard />} />
        <Route
          path="/athlete/profile" element={<AthleteProfile />}
        />
        <Route path="/athlete/my-profile" element={<AthleteProfileView />} />
       <Route path="/athlete/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;