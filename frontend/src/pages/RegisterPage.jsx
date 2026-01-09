// src/pages/RegisterPage.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/register", { name, email, password });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card login-card">
        <h2>Create account</h2>
        <p className="auth-subtitle">
          Sign up to start submitting your feedback.
        </p>

        {error && <p className="auth-error">{error}</p>}

        <form onSubmit={handleSubmit} className="auth-form auth-form-login">
          <label className="auth-label" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label className="auth-label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="auth-label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="btn-primary btn-full">
            Sign up
          </button>
        </form>

        <p className="auth-links auth-bottom-text">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}
