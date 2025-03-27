import React, { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import "../styles/UserAuth.css";

const UserRegister = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post("/user/register", { username, password });
      setMessage("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/user/dashboard"), 1500);
    } catch (err) {
      setMessage("Registration failed. Try a different username.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">User Registration</h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            className="auth-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="auth-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {message && (
            <p className={`auth-message ${message.includes("success") ? "success" : "error"}`}>
              {message}
            </p>
          )}
          <button type="submit" className="auth-button">
            Register
          </button>
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="auth-link"
          >
            Already have an account? Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserRegister;