import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import "../css/Quiz.css";
import API from "../utils/api";

// 🔥 GLOBAL FIX (VERY IMPORTANT)
axios.defaults.withCredentials = true;

function Quiz() {
  const [quizzes, setQuizzes] = useState([]);
  const [search, setSearch] = useState("");
  const [shareModal, setShareModal] = useState(false);
  const [shareData, setShareData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuizzes();
  }, []);

  // ✅ FETCH QUIZZES
  const fetchQuizzes = async () => {
    try {
      const res = await axios.get(`${API}/api/quizzes`);
      setQuizzes(res.data);
    } catch (err) {
      console.error("Failed to load quizzes", err);
    }
  };

  // ✅ SHARE QUIZ
  const handleShare = async (id) => {
    try {
      const res = await axios.put(
        `${API}/api/quizzes/share/${id}`,
        {},
        { withCredentials: true }
      );

      setShareData({
        link: res.data.shareLink,
        expiresAt: res.data.expiresAt
          ? new Date(res.data.expiresAt)
          : null,
        quizId: id,
      });

      setShareModal(true);
    } catch (err) {
      alert("Share failed");
    }
  };

  // ✅ REVOKE SHARE
  const handleRevoke = async () => {
    try {
      await axios.put(
        `${API}/api/quizzes/revoke/${shareData.quizId}`,
        {},
        { withCredentials: true }
      );

      alert("Link revoked successfully");
      setShareModal(false);
    } catch (err) {
      alert("Revoke failed");
    }
  };

  const filteredQuizzes = quizzes.filter((q) =>
    q.topic.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="quiz-container">
      <Navbar />

      <main className="quiz-content">
        {/* HEADER */}
        <header className="quiz-page-header">
          <div className="header-text">
            <h1>Quiz Library</h1>
            <p>Challenge your knowledge and track your progress.</p>
          </div>

          <button
            className="create-btn-premium"
            onClick={() => navigate("/create-quiz")}
          >
            <span>+</span> New Assessment
          </button>
        </header>

        {/* SEARCH */}
        <div className="search-wrapper">
          <input
            type="text"
            className="modern-search"
            placeholder="🔍 Search by topic..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* QUIZ GRID */}
        <div className="quiz-grid">
          {filteredQuizzes.length === 0 ? (
            <div className="empty-state">
              <p>No assessments found.</p>
            </div>
          ) : (
            filteredQuizzes.map((quiz) => (
              <div className="quiz-card-premium" key={quiz._id}>
                <div className="card-top">
                  <h3>{quiz.topic}</h3>
                  <p>{quiz.description}</p>
                </div>

                <div className="card-footer">
                  <div className="meta-info">
                    <span>⏱ {quiz.timeLimit || 10}m</span>
                    <span>📝 {quiz.questions?.length || 0} Qs</span>
                  </div>

                  <div className="action-row">
                    <button
                      className="btn-attempt"
                      onClick={() =>
                        navigate(`/attempt-quiz/${quiz._id}`)
                      }
                    >
                      Start Quiz
                    </button>

                    <button
                      className="btn-share-icon"
                      onClick={() => handleShare(quiz._id)}
                    >
                      🔗
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* SHARE MODAL */}
      {shareModal && shareData && (
        <div
          className="share-overlay"
          onClick={() => setShareModal(false)}
        >
          <div
            className="share-modal-premium"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Share Quiz</h3>

            <input type="text" value={shareData.link} readOnly />

            <button
              onClick={() => {
                navigator.clipboard.writeText(shareData.link);
                alert("Copied!");
              }}
            >
              Copy
            </button>

            {shareData.expiresAt && (
              <p>
                Expires: {shareData.expiresAt.toLocaleString()}
              </p>
            )}

            <button onClick={handleRevoke}>Revoke</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Quiz;