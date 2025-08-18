import React, {useState} from "react";
import { ThemeProvider } from "./ThemeContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DoctorDashboard from "./pages/DoctorDashboard";
import CollectData from "./pages/CollectData";
import Header from "./components/Header";
import AI from "./pages/AI";
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen">
          <Header
            isLoggedIn={isLoggedIn}
            // onNavClick={handleNavClick}
            isLoading={isNavigating}
          />
          <Routes>
            {/* <Route path="/ai" element={<AI />} /> */}
            <Route path="/data/collect" element={<CollectData />} />
            <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
