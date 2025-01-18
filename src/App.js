import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPopup from "./components/LoginPopup";
import Dashboard from "./components/Dashboard";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<LoginPopup setIsLoggedIn={setIsLoggedIn} />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard isLoggedIn={isLoggedIn} />}
        />
      </Routes>
    </Router>
  );
};

export default App;
