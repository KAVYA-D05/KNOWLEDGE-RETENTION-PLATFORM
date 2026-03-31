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
      const res = await axios.get(`${API}/api/quizzes`);
      setQuizzes(res.data);
    } catch (err) {
      console.error("Failed to load quizzes");
    }
  };

  const handleShare = async (id) => {
    try {
      const res = await axios.put(`${API}/api/quizzes/share/${id}`);
      setShareData({
        link: res.data.shareLink,
        expiresAt: res.data.expiresAt ? new Date(res.data.expiresAt) : null,
        quizId: id,
      });
      setShareModal(true);
    } catch (err) {
      alert("Share failed");
    }
  };

  const handleRevoke = async () => {
    try {
      await axios.put(`${API}/api/quizzes/revoke/${shareData.quizId}`);
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
        {/* TOP BAR */}
        <header className="quiz-page-header">
          <div className="header-text">
            <h1>Quiz Library</h1>
            <p>Challenge your knowledge and track your progress.</p>
          </div>
          <button className="create-btn-premium" onClick={() => navigate("/create-quiz")}>
            <span>+</span> New Assessment
          </button>
        </header>

        {/* SEARCH BAR */}
        <div className="search-wrapper">
          <div className="search-icon"></div>
          <input
            type="text"
            className="modern-search"
            placeholder="🔍Search by topic, keyword, or difficulty..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* QUIZ GRID */}
        <div className="quiz-grid">
          {filteredQuizzes.length === 0 ? (
            <div className="empty-state">
              <p>No assessments found matching your search.</p>
            </div>
          ) : (
            filteredQuizzes.map((quiz) => (
              <div className="quiz-card-premium" key={quiz._id}>
                <div className="card-top">
                  <div className="difficulty-tag" data-level={quiz.difficulty?.toLowerCase()}>
                    {quiz.difficulty || "General"}
                  </div>
                  <h3>{quiz.topic}</h3>
                  <p className="description">{quiz.description || "Master this topic with our curated assessment questions."}</p>
                </div>

                <div className="card-footer">
                  <div className="meta-info">
                    <span>⏱ {quiz.timeLimit || 10}m</span>
                    <span>📝 {quiz.questions?.length || 0} Qs</span>
                  </div>
                  <div className="action-row">
                    <button className="btn-attempt" onClick={() => navigate(`/attempt-quiz/${quiz._id}`)}>
                      Start Quiz
                    </button>
                    <button className="btn-share-icon" title="Share Quiz" onClick={() => handleShare(quiz._id)}>
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
        <div className="share-overlay" onClick={() => setShareModal(false)}>
          <div className="share-modal-premium" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3>Share Assessment</h3>
              <button className="close-x" onClick={() => setShareModal(false)}>&times;</button>
            </div>
            
            <p className="modal-sub">Anyone with this link can attempt the quiz.</p>

            <div className="link-copy-area">
              <input type="text" value={shareData.link} readOnly />
              <button onClick={() => {
                navigator.clipboard.writeText(shareData.link);
                alert("Copied to clipboard!");
              }}>Copy</button>
            </div>

            {shareData.expiresAt && (
              <div className="expiry-notice">
                ⏳ Link valid until: <strong>{shareData.expiresAt.toLocaleString()}</strong>
              </div>
            )}

            <div className="social-row">
              <a href={`https://wa.me/?text=Check out this quiz: ${shareData.link}`} target="_blank" rel="noreferrer" className="s-btn wa">WhatsApp</a>
              <a href={`mailto:?subject=Quiz Invitation&body=${shareData.link}`} className="s-btn em">Email</a>
              <button className="s-btn rv" onClick={handleRevoke}>Revoke</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Quiz;