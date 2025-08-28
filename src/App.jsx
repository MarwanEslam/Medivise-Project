import React, {useState} from "react";
import { ThemeProvider } from "./ThemeContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DoctorDashboard from "./pages/DoctorDashboard";
import CollectData from "./pages/CollectData";
import Header from "./components/Header";
import AI from "./pages/x";
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen">
          <Header isLoggedIn={isLoggedIn} isLoading={isNavigating} />
          <div className="pt-16">
            <Routes>
              <Route path="/ai" element={<AI />} />
              <Route path="/data/collect" element={<CollectData />} />
              <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
            </Routes>
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
