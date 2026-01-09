// src/pages/ForgotPasswordPage.jsx
import { useState } from "react";
import { Link } from "react-router-dom";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // later: call backend /api/forgot-password
    setMessage("If this email exists, a reset link will be sent.");
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>Forgot password</h2>
        <p className="auth-subtitle">
          Enter your email to receive password reset instructions.
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button type="submit" className="btn-primary btn-full">
            Send reset link
          </button>
        </form>

        {message && (
          <p style={{ marginTop: "1rem", fontSize: "0.85rem", color: "#4b5563" }}>
            {message}
          </p>
        )}

        <div className="auth-links">
          <Link to="/login">Back to login</Link>
        </div>
      </div>
    </div>
  );
}
