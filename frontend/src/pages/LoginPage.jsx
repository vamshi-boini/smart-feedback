// src/pages/LoginPage.jsx
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import api from "../api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const isAdminLogin =
    new URLSearchParams(location.search).get("admin") === "1";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/login", {
        email,
        password,
        isAdmin: isAdminLogin,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      if (res.data.role === "admin") navigate("/admin");
      else navigate("/user");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card login-card">
        <h2 className="brand-title">SmartFeedback</h2>

        {error && <p className="auth-error">{error}</p>}

        <form onSubmit={handleSubmit} className="auth-form auth-form-login">
          <label className="auth-label" htmlFor="email">
            Email address
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
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="btn-primary btn-full">
            Log in
          </button>
        </form>

        <button
          className="link-plain small"
          type="button"
          onClick={() => navigate("/forgot")}
        >
          Forgot password?
        </button>

        <div className="divider">
          <span>or</span>
        </div>

        <button className="btn-google" type="button">
          Log in with Google
        </button>

        <p className="auth-links auth-bottom-text">
          Don&apos;t have an account? <Link to="/register">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
