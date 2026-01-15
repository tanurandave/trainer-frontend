import "../styles/LandingPage.css";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    trainers: 0,
    subjects: 0,
    sessions: 0,
    rating: 0,
  });

  // 🔹 Simulate API data (replace with real API later)
  useEffect(() => {
    setTimeout(() => {
      setStats({
        trainers: 248,
        subjects: 156,
        sessions: 1842,
        rating: 4.8,
      });
    }, 800);
  }, []);

  return (
    <div className="dashboard-container">
      {/* HEADER */}
      <div className="dashboard-header">
        <h2>Dashboard Overview</h2>
        <input
          type="text"
          placeholder="Search trainers, subjects..."
          className="dashboard-search"
        />
      </div>

      {/* STATS */}
      <div className="stats-grid">
        <StatCard title="Total Trainers" value={stats.trainers} />
        <StatCard title="Active Subjects" value={stats.subjects} />
        <StatCard title="Total Sessions" value={stats.sessions} />
        <StatCard title="Avg Rating" value={stats.rating} />
      </div>

      {/* MAIN GRID */}
      <div className="dashboard-grid">
        {/* QUICK ACTIONS */}
        <div className="card">
          <h3>Quick Actions</h3>
          <div className="action-grid">
            <button onClick={() => navigate("/add-trainer")}>➕ Add Trainer</button>
            <button onClick={() => navigate("/add-subject")}>📘 Add Subject</button>
            <button onClick={() => navigate("/assign-trainer")}>🔗 Assign Trainer</button>
            <button className="secondary">📄 Export Report</button>
          </div>
        </div>

        {/* RECENT ACTIVITY */}
        <div className="card">
          <h3>Recent Activity</h3>
          <ul className="activity-list">
            <li>✅ New trainer added</li>
            <li>📘 Subject updated</li>
            <li>🔗 Trainer assigned to subject</li>
            <li>⭐ Trainer received 5★ rating</li>
          </ul>
        </div>

        {/* TOP TRAINERS */}
        <div className="card full">
          <h3>Top Performing Trainers</h3>
          <table className="trainer-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Subject</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>John Williams</td>
                <td>Java</td>
                <td>⭐ 4.9</td>
              </tr>
              <tr>
                <td>Emily Clark</td>
                <td>React</td>
                <td>⭐ 4.8</td>
              </tr>
              <tr>
                <td>Michael Brown</td>
                <td>Python</td>
                <td>⭐ 4.7</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value }) => (
  <div className="stat-card">
    <p>{title}</p>
    <h2>{value}</h2>
  </div>
);

export default LandingPage;
