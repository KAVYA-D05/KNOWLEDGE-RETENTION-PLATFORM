import { useEffect, useState, useCallback } from "react"; // Added useCallback
import axios from "axios";
import Navbar from "../components/Navbar";
import "../css/Dashboard.css";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, PieChart, Pie, Cell, Label
} from "recharts";
import API from "../utils/api";
function Dashboard() {
  const email = localStorage.getItem("email");
  const [attempts, setAttempts] = useState([]);
  const [search, setSearch] = useState("");
  
  // 1. Stabilize fetchAttempts with useCallback to fix ESLint/Netlify build error
  const fetchAttempts = useCallback(async () => {
    try {
      // Note: Ensure this URL matches your backend route exactly
      const res = await axios.get(`${API}/api/quizzes/attempts/${email}`);
      setAttempts(res.data);
    } catch (err) {
      console.error("Failed to fetch attempts", err);
    }
  }, [email]);

  // 2. useEffect now safely depends on the stabilized fetchAttempts
  useEffect(() => {
    fetchAttempts();
  }, [fetchAttempts]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this attempt record?")) return;
    try {
      await axios.delete(`${API}/api/quizzes/attempt/${id}`);
      fetchAttempts();
    } catch (error) {
      console.error("Delete failed", error);
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

        {/* STAT CARDS */}
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
          {/* BAR CHART BOX */}
          <div className="analytics-box">
            <div className="box-header">
              <h3>Score Consistency</h3>
              <span className="badge">Performance over time</span>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="topic" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} domain={[0, 5]} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                  formatter={(value, name, props) => [props.payload.displayScore, "Score"]}
                />
                <Bar dataKey="score" fill="url(#colorGradient)" radius={[6, 6, 0, 0]} barSize={40} />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={1}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* DONUT CHART BOX */}
          <div className="analytics-box donut-container">
            <h3>Overall Accuracy</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                  <Label 
                    value={`${((average/5)*100).toFixed(0)}%`} 
                    position="center" 
                    fill="#1e293b" 
                    style={{fontSize: '24px', fontWeight: 'bold'}}
                  />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <p className="donut-subtitle">Total Performance Mastery</p>
          </div>
        </div>

        {/* RECENT ACTIVITY TABLE */}
        <div className="table-container">
          <div className="box-header">
            <h3>Recent Attempts</h3>
          </div>
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
                    <td className="topic-cell">{a.topic}</td>
                    <td>
                      <span className={`score-badge ${a.score >= 3 ? 'pass' : 'fail'}`}>
                        {a.score} / 5
                      </span>
                    </td>
                    <td className="date-cell">{new Date(a.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button className="del-btn" onClick={() => handleDelete(a._id)}>Delete</button>
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