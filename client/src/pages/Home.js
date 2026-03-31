import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import "../css/Home.css";

function Home() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Learner";
  const email = localStorage.getItem("email");

  const [notesCount, setNotesCount] = useState(0);
  const [quizCount, setQuizCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // ✅ FIX ADDED HERE (IMPORTANT)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (email) {
      fetchStats();
    } else {
      setLoading(false);
    }
  }, [email]);

  const fetchStats = async () => {
    try {
      const [notesRes, quizRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/notes/my/${email}`),
        axios.get(`http://localhost:5000/api/quizzes/attempts/${email}`)
      ]);
      setNotesCount(notesRes.data.length);
      setQuizCount(quizRes.data.length);
    } catch (err) {
      console.error("Failed to fetch stats");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-container">
      <Navbar />

      <main className="home-content">
        {/* HERO SECTION */}
        <section className="hero-section">
          <div className="badge">Welcome back, {username} 👋</div>
          <h1>Master Your Mind with <span className="text-gradient">Active Learning</span></h1>
          <p className="hero-subtitle">
            Don't just read—retain. We combine <strong>Spaced Repetition</strong> and 
            <strong> Active Recall</strong> to help you turn fleeting information into 
            permanent expertise.
          </p>

          <div className="hero-buttons">
            <button className="btn-primary" onClick={() => navigate("/quiz")}>
              🚀 Start Quiz
            </button>
            <button className="btn-secondary" onClick={() => navigate("/notes")}>
              📝 Review Notes
            </button>
          </div>
        </section>

        {/* STATS SECTION */}
        <section className="stats-section">
          <div className="stat-card">
            <div className="stat-icon">📚</div>
            <h2>{loading ? "..." : notesCount}</h2>
            <p>Notes Mastered</p>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <h2>{loading ? "..." : quizCount}</h2>
            <p>Quizzes Attempted</p>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🔥</div>
            <h2>∞</h2>
            <p>Learning Potential</p>
          </div>
        </section>

        {/* KNOWLEDGE INSIGHT */}
        <section className="knowledge-section">
          <div className="knowledge-header">
            <h2>The Science of Mastery</h2>
            <div className="line-dec"></div>
          </div>
          <div className="knowledge-grid">
            <div className="knowledge-text">
              <p>
                Passive reading is the enemy of memory. Research shows that 
                <strong> 70% of new information is forgotten within 24 hours</strong> 
                unless it is actively retrieved.
              </p>
              <p>
                Our platform structures your study sessions to trigger memory 
                consolidation, ensuring that what you learn today stays with you 
                for years to come.
              </p>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section className="features-section">
          <div className="feature-box">
            <div className="feature-emoji">🧠</div>
            <h3>Active Recall</h3>
            <p>Stop re-reading. Force your brain to retrieve information, building stronger neural pathways.</p>
          </div>

          <div className="feature-box">
            <div className="feature-emoji">📈</div>
            <h3>Data-Driven Growth</h3>
            <p>Track your accuracy and identify conceptual gaps with detailed performance metrics.</p>
          </div>

          <div className="feature-box">
            <div className="feature-emoji">📂</div>
            <h3>Smart Architecture</h3>
            <p>Systematically organize complex topics into digestible modules for effortless review.</p>
          </div>
        </section>
      </main>

      <footer className="home-footer">
        <p>© 2026 Knowledge Retention Platform | Precision Learning for Modern Minds.</p>
      </footer>
    </div>
  );
}

export default Home;