import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function LandingPage() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    trainers: 0,
    subjects: 0,
    sessions: 0,
    rating: 0
  });

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // 🔹 Fetch dashboard stats (replace endpoints as needed)
  useEffect(() => {
    Promise.all([
      api.get("/trainer"),
      api.get("/subject")
    ]).then(([trainersRes, subjectsRes]) => {
      setStats({
        trainers: trainersRes.data.length,
        subjects: subjectsRes.data.length,
        sessions: 1842,
        rating: 4.8
      });
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-blue-700">
            Dashboard Overview
          </h1>
          <p className="text-gray-500 text-sm">
            Trainer & Subject Management System
          </p>
        </div>

        <input
          type="text"
          placeholder="Search trainers or subjects..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border rounded-lg px-4 py-2 w-72 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Trainers" value={stats.trainers+1} loading={loading} />
        <StatCard title="Active Subjects" value={stats.subjects} loading={loading} />
        <StatCard title="Total Sessions" value={stats.sessions} loading={loading} />
        <StatCard title="Avg Rating" value={stats.rating} loading={loading} />
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* QUICK ACTIONS */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-semibold text-lg mb-4 text-blue-600">
            Quick Actions
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <ActionButton label="Add Trainer" onClick={() => navigate("/add-trainer")} />
            <ActionButton label="Add Subject" onClick={() => navigate("/add-subject")} />
            <ActionButton label="Assign Trainer" onClick={() => navigate("/assign")} />
            <ActionButton label="Export Report" secondary />
          </div>
        </div>

        {/* RECENT ACTIVITY */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-semibold text-lg mb-4 text-blue-600">
            Recent Activity
          </h3>

          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">✅ New trainer added</li>
            <li className="flex items-center gap-2">📘 Subject updated</li>
            <li className="flex items-center gap-2">🔗 Trainer assigned</li>
            <li className="flex items-center gap-2">⭐ 5★ rating received</li>
          </ul>
        </div>

        {/* TOP TRAINERS */}
        <div className="bg-white rounded-xl shadow p-6 lg:col-span-3">
          <h3 className="font-semibold text-lg mb-4 text-blue-600">
            Top Performing Trainers
          </h3>

          <table className="w-full text-sm border">
            <thead className="bg-blue-50">
              <tr>
                <th className="p-3 text-left">Trainer</th>
                <th className="p-3 text-left">Subject</th>
                <th className="p-3 text-left">Rating</th>
              </tr>
            </thead>
            <tbody>
              {TOP_TRAINERS.filter(t =>
                t.name.toLowerCase().includes(search.toLowerCase())
              ).map((t, i) => (
                <tr key={i} className="border-t hover:bg-gray-50">
                  <td className="p-3">{t.name}</td>
                  <td className="p-3">{t.subject}</td>
                  <td className="p-3">⭐ {t.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

/* 🔹 COMPONENTS */

const StatCard = ({ title, value, loading }) => (
  <div className="bg-white rounded-xl shadow p-6">
    <p className="text-gray-500 text-sm">{title}</p>
    <h2 className="text-3xl font-bold text-blue-700 mt-2">
      {loading ? "…" : value}
    </h2>
  </div>
);

const ActionButton = ({ label, onClick, secondary }) => (
  <button
    onClick={onClick}
    className={`rounded-lg py-2 px-3 text-sm font-medium transition
      ${
        secondary
          ? "border text-gray-600 hover:bg-gray-100"
          : "bg-blue-600 text-white hover:bg-blue-700"
      }
    `}
  >
    {label}
  </button>
);

/* 🔹 STATIC DATA (Replace with API later) */
const TOP_TRAINERS = [
  { name: "John Williams", subject: "Java", rating: 4.9 },
  { name: "Emily Clark", subject: "React", rating: 4.8 },
  { name: "Michael Brown", subject: "Python", rating: 4.7 }
];

export default LandingPage;
