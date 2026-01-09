// src/pages/UserDashboard.jsx
import { useEffect, useState } from "react";
import api from "../api";

export default function UserDashboard() {
  const [message, setMessage] = useState("");
  const [sentimentResult, setSentimentResult] = useState("");
  const [history, setHistory] = useState([]);

  // load history from backend when page opens
  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/my-feedback");
        setHistory(res.data || []);
      } catch (err) {
        console.error(err);
        alert("Failed to load your feedback history");
      }
    };
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/feedback", { message });
      const now = new Date().toISOString();

      setSentimentResult(`Sentiment: ${res.data.sentiment}`);

      // add new item on top of history
      setHistory((prev) => [
        {
          id: res.data.id,
          message,
          sentiment: res.data.sentiment,
          createdAt: now,
        },
        ...prev,
      ]);

      setMessage("");
    } catch (err) {
      console.error(err);
      alert("Failed to submit feedback");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>User Dashboard</h2>
        <p className="auth-subtitle">
          Submit your feedback and review your previous submissions.
        </p>

        {/* Submit feedback */}
        <form onSubmit={handleSubmit} className="auth-form">
          <label>Feedback message</label>
          <textarea
            className="feedback-textarea"
            placeholder="Describe your experience..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />

          <button type="submit" className="btn-primary btn-full">
            Submit feedback
          </button>
        </form>

        {sentimentResult && (
          <p
            style={{
              marginTop: "0.9rem",
              fontSize: "0.85rem",
              color: "#4b5563",
            }}
          >
            {sentimentResult}
          </p>
        )}

        {/* History */}
        <h3 style={{ marginTop: "1.6rem", fontSize: "1rem" }}>Your history</h3>
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Message</th>
                <th>Sentiment</th>
                <th>Created at</th>
              </tr>
            </thead>
            <tbody>
              {history.length === 0 && (
                <tr>
                  <td colSpan="3" style={{ textAlign: "center", padding: "1rem" }}>
                    No feedback yet.
                  </td>
                </tr>
              )}
              {history.map((item) => (
                <tr key={item.id}>
                  <td className="message-cell">{item.message}</td>
                  <td>
                    <span
                      className={`tag tag-${item.sentiment.toLowerCase()}`}
                    >
                      {item.sentiment}
                    </span>
                  </td>
                  <td>{new Date(item.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="admin-footnote">
          Data is loaded from the backend API.
        </p>
      </div>
    </div>
  );
}
