// src/components/Navbar.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    localStorage.removeItem("token");
    if (onLogout) onLogout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/user/dashboard">🎧 Dashboard</Link>
        <Link to="/library">📚 My Library</Link>
      </div>
      <div className="navbar-right">
        <button onClick={handleLogoutClick}>🚪 Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
