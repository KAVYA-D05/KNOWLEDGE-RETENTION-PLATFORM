import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import "../css/Dashboard.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from "recharts";

function Dashboard() {
  const email = localStorage.getItem("email");

  const [attempts, setAttempts] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchAttempts();
  }, []);

  const fetchAttempts = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/quizzes/attempts/${email}`
      );
      setAttempts(res.data);
    } catch (err) {
      console.log("Failed to fetch attempts");
    }
  };

  /* ================= DELETE ATTEMPT ================= */
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this attempt?");
    if (!confirmDelete) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/quizzes/attempt/${id}`
      );

      fetchAttempts(); // refresh data
    } catch (error) {
      console.log("Delete failed");
    }
  };

  /* ================= BAR CHART DATA ================= */
  const chartData = attempts.map((a) => ({
    topic: a.topic,
    score: a.score
  }));

  /* ================= AVERAGE CALCULATION ================= */
  const totalScore = attempts.reduce((sum, a) => sum + a.score, 0);
  const totalAttempts = attempts.length;

  const average =
    totalAttempts > 0 ? (totalScore / totalAttempts).toFixed(1) : 0;

  const pieData = [
    { name: "Average Score", value: Number(average) },
    { name: "Remaining", value: 5 - Number(average) }
  ];

  const COLORS = ["#7c3aed", "#e5e7eb"];

  return (
    <div className="dashboard-page">
      <Navbar />

      <div className="dashboard-container">
        <h2>Your Performance Analytics</h2>

        {/* ================= CHART SECTION ================= */}
        <div className="analytics-grid">

          {/* BAR CHART */}
          <div className="analytics-box">
            <h3>Attempt Performance</h3>

            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="topic" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="score" fill="#7c3aed" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* PIE CHART */}
          <div className="analytics-box">
            <h3>Overall Average</h3>

            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <h2 className="average-text">{average}/5</h2>
          </div>

        </div>

        {/* ================= SEARCH ================= */}
        <div className="dashboard-search">
          <input
            type="text"
            placeholder="Search attempts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* ================= TABLE ================= */}
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Topic</th>
              <th>Score</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {attempts
              .filter((a) =>
                a.topic.toLowerCase().includes(search.toLowerCase())
              )
              .map((a) => (
                <tr key={a._id}>
                  <td>{a.topic}</td>
                  <td>{a.score}</td>
                  <td>
                    {new Date(a.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <button
                      className="delete-attempt-btn"
                      onClick={() => handleDelete(a._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

      </div>
    </div>
  );
}

export default Dashboard;