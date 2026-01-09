import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <section className="hero">
      <div className="hero-card">
        <h1>Smart Feedback Collection and Analysis System</h1>
        <p>
          Collect feedback, analyze sentiment, and visualize insights for better
          decision making.
        </p>

        <div className="hero-actions">
          {/* normal users can register and login */}
          <button
            className="btn-primary hero-btn"
            onClick={() => navigate("/register")}
          >
            Sign up as User
          </button>

          {/* admins are fixed, so just login */}
          <button
            className="btn-secondary hero-btn"
            onClick={() => navigate("/login?admin=1")}
          >
            Log in as Admin
          </button>
        </div>
      </div>
    </section>
  );
}
