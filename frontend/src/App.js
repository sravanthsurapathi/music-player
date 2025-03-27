import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AdminPage from "./pages/AdminPage";
import LibraryPage from "./pages/LibraryPage";
import UserLogin from "./pages/UserLogin";
import UserRegister from "./pages/UserRegister";
import UserPage from "./pages/UserPage";

const App = () => {
  return (
    <Router>
      <div className="app min-h-screen bg-gray-100 p-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/register" element={<UserRegister />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/user/dashboard" element={<UserPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
