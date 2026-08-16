import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import AthleteDashboard from "./pages/AthleteDashboard";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
       
        <Route path="/athlete/dashboard" element={<AthleteDashboard />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;