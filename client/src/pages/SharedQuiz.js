import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../css/SharedQuiz.css";
import API from "../utils/api";

function SharedQuiz() {
  const { slugToken } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const email = localStorage.getItem("email") || "guest_user@quizapp.com";

  const fetchQuiz = useCallback(async () => {
  try {
    // Ensure this exactly matches your backend: /api/quizzes/shared/:token
   const res = await axios.get(`${API}/api/quizzes/shared/${slugToken}`);
    setQuiz(res.data);
    setTimeLeft((res.data.timeLimit || 10) * 60);
  } catch (err) {
    console.error("Fetch error details:", err.response); // Check this in F12 console
    alert("This quiz link has expired or is invalid.");
  } finally {
    setLoading(false);
  }
}, [slugToken]);

  useEffect(() => {
    fetchQuiz();
  }, [fetchQuiz]);

  const handleSubmit = useCallback(async () => {
    if (result) return;
    try {
      const res = await axios.post(`${API}/api/quizzes/submit/${quiz._id}`, {
        answers,
        userEmail: email,
      });
      setResult(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "Submission failed");
    }
  }, [quiz, answers, email, result]);

  useEffect(() => {
    if (!quiz || result || timeLeft <= 0) {
      if (timeLeft === 0 && quiz && !result) handleSubmit();
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, quiz, result, handleSubmit]);

  const formatTime = () => {
    const min = Math.floor(timeLeft / 60);
    const sec = timeLeft % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  if (loading) return <div className="full-page-loader"><div className="spinner"></div><p>Loading Assessment...</p></div>;

  if (result) {
    return (
      <div className="shared-page-wrapper">
        <div className="result-card-modern">
          <div className="icon-badge">🎯</div>
          <h2>Quiz Completed!</h2>
          <p className="topic-sub">{quiz.topic}</p>
          <div className="final-score">
            <span className="obtained">{result.score}</span>
            <span className="divider">/</span>
            <span className="total">{result.total}</span>
          </div>
          <p className="congrats-msg">Great effort! You've successfully finished the assessment.</p>
          <button className="btn-primary-modern" onClick={() => window.location.href = '/'}>Finish</button>
        </div>
      </div>
    );
  }

  return (
    <div className="shared-page-wrapper">
      <div className="quiz-container-modern">
        <header className="shared-quiz-header">
          <div className="header-info">
            <h1>{quiz.topic}</h1>
            <p>{quiz.questions.length} Questions • {quiz.difficulty}</p>
          </div>
          <div className={`modern-timer ${timeLeft < 60 ? 'blink' : ''}`}>
             <span className="t-label">Ends in</span>
             <span className="t-time">{formatTime()}</span>
          </div>
        </header>

        <div className="question-stack">
          {quiz.questions.map((q, index) => (
            <div key={index} className="modern-q-card">
              <div className="q-num-pill">Question {index + 1}</div>
              <h3 className="q-text-shared">{q.question}</h3>
              <div className="options-grid-shared">
                {q.options.map((opt, i) => (
                  <label key={i} className={`opt-item ${answers[index] === i ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name={`q-${index}`}
                      checked={answers[index] === i}
                      onChange={() => {
                        const newAnswers = [...answers];
                        newAnswers[index] = i;
                        setAnswers(newAnswers);
                      }}
                    />
                    <span className="opt-indicator"></span>
                    <span className="opt-val">{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <footer className="shared-footer-action">
           <button className="submit-modern-btn" onClick={handleSubmit}>
              Submit My Answers
           </button>
        </footer>
      </div>
    </div>
  );
}

export default SharedQuiz;