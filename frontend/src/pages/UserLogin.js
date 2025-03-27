import React, { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import "../styles/UserAuth.css"; // Add custom styles

const UserLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/user/login", { username, password });
      localStorage.setItem("token", res.data.token);
      navigate("/user/dashboard");
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">User Login</h2>
        <form onSubmit={handleLogin} className="auth-form">
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="auth-button">
            Login
          </button>
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="auth-link"
          >
            New here? Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserLogin;