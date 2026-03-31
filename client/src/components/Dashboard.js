import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import "../css/Dashboard.css";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, PieChart, Pie, Cell, Label
} from "recharts";

function Dashboard() {
  const email = localStorage.getItem("email");
  const [attempts, setAttempts] = useState([]);
  const [search, setSearch] = useState("");

  // ✅ FIX ADDED HERE (IMPORTANT)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchAttempts();
  }, []);

  const fetchAttempts = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/quizzes/attempts/${email}`);
      setAttempts(res.data);
    } catch (err) {
      console.log("Failed to fetch");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this attempt record?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/quizzes/attempt/${id}`);
      fetchAttempts();
    } catch (error) {
      console.log("Delete failed");
    }
  };

  /* Analytics Calculations */
  const totalAttempts = attempts.length;
  const totalScore = attempts.reduce((sum, a) => sum + a.score, 0);
  const average = totalAttempts > 0 ? (totalScore / totalAttempts).toFixed(1) : 0;
  const highestScore = totalAttempts > 0 ? Math.max(...attempts.map(a => a.score)) : 0;

  const chartData = attempts.map((a) => ({
    topic: a.topic.length > 10 ? a.topic.substring(0, 10) + ".." : a.topic,
    score: a.score === 0 ? 0.1 : a.score,
    displayScore: a.score
  }));

  const pieData = [
    { name: "Score", value: Number(average) },
    { name: "Remaining", value: 5 - Number(average) }
  ];

  const COLORS = ["#7c3aed", "#f1f5f9"];

  return (
    <div className="dashboard-page">
      <Navbar />
      <div className="dashboard-container">
        <header className="dashboard-header">
          <div>
            <h1>Performance Analytics</h1>
            <p>Track your learning progress and quiz history</p>
          </div>
          <div className="search-wrapper">
            <input
              type="text"
              placeholder="🔍 Search by topic..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </header>

        <div className="stats-grid">
          <div className="stat-card">
            <span>Total Quizzes</span>
            <h3>{totalAttempts}</h3>
          </div>
          <div className="stat-card">
            <span>Average Score</span>
            <h3 className="blue-text">{average}/5</h3>
          </div>
          <div className="stat-card">
            <span>Highest Score</span>
            <h3 className="purple-text">{highestScore}/5</h3>
          </div>
        </div>

        <div className="analytics-main-grid">
          <div className="analytics-box">
            <div className="box-header">
              <h3>Score Consistency</h3>
              <span className="badge">Performance over time</span>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="topic" />
                <YAxis domain={[0, 5]} />
                <Tooltip formatter={(value, name, props) => [props.payload.displayScore, "Score"]} />
                <Bar dataKey="score" fill="#7c3aed" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="analytics-box donut-container">
            <h3>Overall Accuracy</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} innerRadius={70} outerRadius={90} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                  <Label
                    value={`${((average / 5) * 100).toFixed(0)}%`}
                    position="center"
                  />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="table-container">
          <h3>Recent Attempts</h3>
          <table className="modern-table">
            <thead>
              <tr>
                <th>Topic</th>
                <th>Result</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {attempts
                .filter(a => a.topic.toLowerCase().includes(search.toLowerCase()))
                .map(a => (
                  <tr key={a._id}>
                    <td>{a.topic}</td>
                    <td>{a.score}/5</td>
                    <td>{new Date(a.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button onClick={() => handleDelete(a._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;