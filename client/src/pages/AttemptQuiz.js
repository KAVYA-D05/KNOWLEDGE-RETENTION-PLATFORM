import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../css/AttemptQuiz.css";

function AttemptQuiz() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  const email = localStorage.getItem("email");

  /* ================= FETCH QUIZ ================= */
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/quizzes/${id}`);
        setQuiz(res.data);
        
        const storedTime = localStorage.getItem(`timer-${id}`);
        if (storedTime && Number(storedTime) > 0) {
          setTimeLeft(Number(storedTime));
        } else {
          const totalSeconds = res.data.timeLimit * 60;
          setTimeLeft(totalSeconds);
          localStorage.setItem(`timer-${id}`, totalSeconds);
        }
      } catch (err) {
        console.error("Error fetching quiz");
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id]);

  /* ================= SUBMIT LOGIC ================= */
  const handleSubmit = useCallback(async () => {
    if (submitted) return;
    try {
      const res = await axios.post(`http://localhost:5000/api/quizzes/submit/${id}`, {
        answers,
        userEmail: email,
      });
      setResult(res.data);
      setSubmitted(true);
      localStorage.removeItem(`timer-${id}`);
    } catch (err) {
      alert("Submission failed. Please check your connection.");
    }
  }, [id, answers, email, submitted]);

  /* ================= COUNTDOWN ================= */
  useEffect(() => {
    if (!quiz || submitted || timeLeft <= 0) {
      if (timeLeft === 0 && quiz && !submitted) handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;
        localStorage.setItem(`timer-${id}`, newTime);
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, quiz, submitted, id, handleSubmit]);

  /* ================= FORMAT TIME ================= */
  const formatTime = () => {
    const min = Math.floor(timeLeft / 60);
    const sec = timeLeft % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  const handleAnswerChange = (qIndex, optionIndex) => {
    const updated = [...answers];
    updated[qIndex] = optionIndex;
    setAnswers(updated);
  };

  if (loading) return <div className="quiz-loader">Preparing your assessment...</div>;

  /* ================= RESULT VIEW ================= */
  if (submitted && result) {
    const percentage = Math.round((result.score / result.total) * 100);
    return (
      <div className="result-screen">
        <Navbar />
        <div className="result-card">
          <div className="confetti-icon">{percentage >= 50 ? "🎉" : "📚"}</div>
          <h2>Assessment Complete</h2>
          <p className="result-topic">{quiz.topic}</p>
          
          <div className="score-circle">
            <span className="score-num">{result.score}</span>
            <span className="score-total">/ {result.total}</span>
          </div>
          
          <p className="performance-text">
            {percentage >= 80 ? "Excellent Mastery!" : percentage >= 50 ? "Good Job! Keep practicing." : "Need to review this topic further."}
          </p>

          <button className="btn-finish" onClick={() => navigate("/quiz")}>
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  /* ================= ATTEMPT VIEW ================= */
  const progressPercent = (answers.filter(a => a !== undefined).length / quiz.questions.length) * 100;

  return (
    <div className="attempt-page">
      <Navbar />
      
      {/* STICKY HEADER */}
      <div className="quiz-sticky-header">
        <div className="header-inner">
          <div className="quiz-title-meta">
            <h1>{quiz.topic}</h1>
            <span>{quiz.questions.length} Questions</span>
          </div>
          
          <div className={`timer-display ${timeLeft < 60 ? 'urgent' : ''}`}>
            <span className="timer-label">Time Remaining</span>
            <span className="timer-val">{formatTime()}</span>
          </div>
        </div>
        <div className="progress-bar-container">
          <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
        </div>
      </div>

      <div className="questions-container">
        {quiz.questions.map((q, qIndex) => (
          <div key={qIndex} className="question-block">
            <div className="q-header">
              <span className="q-idx">Question {qIndex + 1}</span>
            </div>
            <h3 className="q-text">{q.question}</h3>

            <div className="options-list">
              {q.options.map((option, oIndex) => (
                <label 
                  key={oIndex} 
                  className={`option-label ${answers[qIndex] === oIndex ? 'selected' : ''}`}
                >
                  <input
                    type="radio"
                    name={`question-${qIndex}`}
                    checked={answers[qIndex] === oIndex}
                    onChange={() => handleAnswerChange(qIndex, oIndex)}
                  />
                  <span className="opt-letter">{String.fromCharCode(65 + oIndex)}</span>
                  <span className="opt-text">{option}</span>
                </label>
              ))}
            </div>
          </div>
        ))}

        <div className="attempt-footer">
          <p>Verify all answers before submitting. Action cannot be undone.</p>
          <button className="btn-submit-quiz" onClick={handleSubmit}>
            Finish & Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default AttemptQuiz;