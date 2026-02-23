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

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const notesRes = await axios.get(
        `http://localhost:5000/api/notes/my/${email}`
      );
      setNotesCount(notesRes.data.length);

      const quizRes = await axios.get(
        `http://localhost:5000/api/quizzes/attempts/${email}`
      );
      setQuizCount(quizRes.data.length);
    } catch (err) {
      console.log("Failed to fetch stats");
    }
  };

  return (
    <div className="home-container">
      <Navbar />

      <main className="home-content">

        {/* HERO SECTION */}
        <section className="hero-section">
          <h1>Welcome back, {username} 👋</h1>
          <p>
            Build powerful learning habits. Strengthen memory. Track growth.
            Transform knowledge into long-term mastery.
          </p>

          <div className="hero-buttons">
            <button onClick={() => navigate("/dashboard")}>
              📊 Dashboard
            </button>
            <button onClick={() => navigate("/quiz")}>
              🧠 Take Quiz
            </button>
            <button onClick={() => navigate("/notes")}>
              📝 My Notes
            </button>
          </div>
        </section>

        {/* STATS SECTION */}
        <section className="stats-section">
          <div className="stat-card">
            <h2>{notesCount}</h2>
            <p>Total Notes Created</p>
          </div>

          <div className="stat-card">
            <h2>{quizCount}</h2>
            <p>Quizzes Attempted</p>
          </div>

          <div className="stat-card">
            <h2>∞</h2>
            <p>Learning Potential</p>
          </div>
        </section>

        {/* WHY SECTION */}
        <section className="knowledge-section">
          <h2>Why Knowledge Retention Matters</h2>

          <p>
            Learning without retention is temporary. True mastery happens
            when information moves from short-term memory into long-term
            understanding.
          </p>

          <p>
            This platform is built on active recall and spaced repetition —
            two scientifically proven techniques that significantly enhance
            memory consolidation and conceptual clarity.
          </p>

          <p>
            Through structured notes, interactive quizzes, and performance
            analytics, you don’t just study — you build lasting knowledge.
          </p>
        </section>

        {/* FEATURES SECTION */}
        <section className="features-section">
          <div className="feature-box">
            <h3>🧠 Active Recall</h3>
            <p>
              Strengthen memory pathways by testing yourself regularly
              instead of passive reading.
            </p>
          </div>

          <div className="feature-box">
            <h3>📈 Performance Analytics</h3>
            <p>
              Visual insights help you identify strengths and areas needing
              improvement.
            </p>
          </div>

          <div className="feature-box">
            <h3>📂 Structured Notes</h3>
            <p>
              Organize your learning in a systematic way for easy revision
              and reference.
            </p>
          </div>
        </section>

      </main>

      <footer className="home-footer">
        <p>© 2026 Knowledge Retention Platform | Learn Smart. Retain Forever.</p>
      </footer>
    </div>
  );
}

export default Home;