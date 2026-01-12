// src/pages/AdminDashboard.jsx
import { useState, useMemo, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import api from "../api";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function AdminDashboard() {
  const [feedback, setFeedback] = useState([]);
  const [stats, setStats] = useState({ Positive: 0, Negative: 0, Neutral: 0 });
  const [search, setSearch] = useState("");
  const [filterSentiment, setFilterSentiment] = useState("All");

  // load data from backend on mount
  useEffect(() => {
    const load = async () => {
      try {
        const [summaryRes, listRes] = await Promise.all([
          api.get("/admin/summary"),
          api.get("/admin/feedback"),
        ]);

        const summary = summaryRes.data || {};
        setStats({
          Positive: summary.Positive || 0,
          Negative: summary.Negative || 0,
          Neutral: summary.Neutral || 0,
        });

        setFeedback(listRes.data.items || []);
      } catch (err) {
        console.error(err);
        alert("Failed to load admin data");
      }
    };
    load();
  }, []);

  const filtered = useMemo(
    () =>
      feedback.filter((item) => {
        const msg = item.message?.toLowerCase() || "";
        const user = item.userName?.toLowerCase() || "";
        const q = search.toLowerCase();

        const matchText = msg.includes(q) || user.includes(q);
        const matchSentiment =
          filterSentiment === "All" || item.sentiment === filterSentiment;

        return matchText && matchSentiment;
      }),
    [feedback, search, filterSentiment]
  );

  const handleToggleImportant = async (id) => {
    try {
      const res = await api.patch(`/admin/feedback/${id}/important`);
      const important = res.data.important;
      setFeedback((prev) =>
        prev.map((f) => (f.id === id ? { ...f, important } : f))
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update importance");
    }
  };

  const handleDelete = async (id) => {
    const yes = window.confirm("Delete this feedback permanently?");
    if (!yes) return;
    try {
      await api.delete(`/admin/feedback/${id}`);
      setFeedback((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete feedback");
    }
  };

  // Pie chart data
  const pieData = {
    labels: ["Positive", "Negative", "Neutral"],
    datasets: [
      {
        data: [stats.Positive, stats.Negative, stats.Neutral],
        backgroundColor: ["#22c55e", "#ef4444", "#6b7280"],
        borderColor: ["#16a34a", "#dc2626", "#4b5563"],
        borderWidth: 1,
      },
    ],
  };

  const pieOptions = {
    plugins: {
      legend: {
        position: "bottom",
        labels: { boxWidth: 14 },
      },
    },
  };

  return (
    <div className="admin-page">
      <header className="admin-header">
        <h2>Admin Dashboard</h2>
        <p>View, analyze, and manage all feedback entries.</p>
      </header>

      {/* Top: stats + pie chart */}
      <div className="admin-top">
        <div className="admin-stats-row">
          <div className="admin-stat-pill positive">
            <span className="admin-stat-label">Positive</span>
            <span className="admin-stat-value">{stats.Positive}</span>
          </div>
          <div className="admin-stat-pill negative">
            <span className="admin-stat-label">Negative</span>
            <span className="admin-stat-value">{stats.Negative}</span>
          </div>
          <div className="admin-stat-pill neutral">
            <span className="admin-stat-label">Neutral</span>
            <span className="admin-stat-value">{stats.Neutral}</span>
          </div>
        </div>

        <div className="admin-chart-card">
          <h3 className="admin-chart-title">Sentiment breakdown</h3>
          <Pie data={pieData} options={pieOptions} />
        </div>
      </div>

      {/* Controls */}
      <div className="admin-toolbar">
        <input
          className="admin-search"
          placeholder="Search by user or message..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="admin-filter"
          value={filterSentiment}
          onChange={(e) => setFilterSentiment(e.target.value)}
        >
          <option value="All">All sentiments</option>
          <option value="Positive">Positive</option>
          <option value="Negative">Negative</option>
          <option value="Neutral">Neutral</option>
        </select>
      </div>

      {/* Table */}
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Message</th>
              <th>Sentiment</th>
              <th>Created at</th>
              <th>Important</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "1rem" }}>
                  No feedback found.
                </td>
              </tr>
            )}

            {filtered.map((item) => (
              <tr
                key={item.id}
                className={item.important ? "row-important" : ""}
              >
                <td>{item.userName || item.name || "Unknown"}</td>

                <td className="message-cell">{item.message}</td>
                <td>
                  <span
                    className={`tag tag-${item.sentiment.toLowerCase()}`}
                  >
                    {item.sentiment}
                  </span>
                </td>
                <td>{new Date(item.createdAt).toLocaleString()}</td>
                <td>
                  <button
                    type="button"
                    className={
                      item.important ? "btn-chip btn-chip-on" : "btn-chip"
                    }
                    onClick={() => handleToggleImportant(item.id)}
                  >
                    {item.important ? "Starred" : "Star"}
                  </button>
                </td>
                <td>
                  <button
                    type="button"
                    className="btn-icon danger"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="admin-footnote">
        Admin place
      </p>
    </div>
  );
}
