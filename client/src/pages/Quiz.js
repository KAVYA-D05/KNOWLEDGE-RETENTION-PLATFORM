import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import "../css/Quiz.css";

function Quiz() {
  const [quizzes, setQuizzes] = useState([]);
  const [search, setSearch] = useState("");

  const [shareModal, setShareModal] = useState(false);
  const [shareData, setShareData] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/quizzes");
      setQuizzes(res.data);
    } catch (err) {
      console.log("Failed to load quizzes");
    }
  };

  /* ================= SHARE FUNCTION ================= */
  const handleShare = async (id) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/quizzes/share/${id}`
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

  const handleRevoke = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/quizzes/revoke/${shareData.quizId}`
      );
      alert("Link revoked");
      setShareModal(false);
    } catch (err) {
      alert("Revoke failed");
    }
  };

  const filteredQuizzes = quizzes.filter((q) =>
    q.topic.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Navbar />

      <div className="quiz-page">
        {/* HEADER */}
        <div className="quiz-header">
          <h2>📘 Quiz Dashboard</h2>

          <button
            className="create-quiz-btn"
            onClick={() => navigate("/create-quiz")}
          >
            + Create Quiz
          </button>
        </div>

        {/* SEARCH */}
        <div className="quiz-search">
          <input
            type="text"
            placeholder="Search quizzes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* GRID */}
        <div className="quiz-grid">
          {filteredQuizzes.length === 0 ? (
            <p className="empty-text">No quizzes available</p>
          ) : (
            filteredQuizzes.map((quiz) => (
              <div className="quiz-card" key={quiz._id}>
                <div>
                  <h3>{quiz.topic}</h3>
                  <p>
                    {quiz.description || "No description provided."}
                  </p>

                  <div className="quiz-meta">
                    <span>⏱ {quiz.timeLimit || 10} mins</span>
                    <span>🎯 {quiz.difficulty || "Medium"}</span>
                  </div>
                </div>

                <div className="quiz-actions">
                  <button
                    className="attempt-btn"
                    onClick={() =>
                      navigate(`/attempt-quiz/${quiz._id}`)
                    }
                  >
                    Attempt Quiz
                  </button>

                  <button
                    className="share-btn"
                    onClick={() => handleShare(quiz._id)}
                  >
                    Share 🔗
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ================= SHARE MODAL ================= */}
      {shareModal && shareData && (
        <div className="share-overlay">
          <div className="share-modal">

            <div className="modal-header">
              <h3>Share Quiz</h3>
              <span
                className="close-btn"
                onClick={() => setShareModal(false)}
              >
                ✖
              </span>
            </div>

            <div className="share-link-box">
              <input
                type="text"
                value={shareData.link}
                readOnly
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(shareData.link);
                  alert("Link copied!");
                }}
              >
                📋 Copy
              </button>
            </div>

            {shareData.expiresAt && (
              <p className="expiry-text">
                ⏳ Expires on: {shareData.expiresAt.toLocaleString()}
              </p>
            )}

            <div className="share-buttons">

              <a
                href={`https://wa.me/?text=📘 Try this quiz:%0A${shareData.link}`}
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp-btn"
              >
                📲 WhatsApp
              </a>

              <a
                href={`mailto:?subject=Quiz Invitation&body=Try this quiz: ${shareData.link}`}
                className="email-btn"
              >
                📧 Email
              </a>

              <button
                className="revoke-btn"
                onClick={handleRevoke}
              >
                ❌ Revoke Link
              </button>

            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Quiz;