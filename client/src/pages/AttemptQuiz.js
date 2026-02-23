import { useEffect, useState } from "react";
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

  const email = localStorage.getItem("email");

  /* ================= FETCH QUIZ ================= */
  useEffect(() => {
    const fetchQuiz = async () => {
      const res = await axios.get(
        `http://localhost:5000/api/quizzes/${id}`
      );
      setQuiz(res.data);

      const storedTime = localStorage.getItem(`timer-${id}`);

      if (storedTime) {
        setTimeLeft(Number(storedTime));
      } else {
        const totalSeconds = res.data.timeLimit * 60;
        setTimeLeft(totalSeconds);
        localStorage.setItem(`timer-${id}`, totalSeconds);
      }
    };

    fetchQuiz();
  }, [id]);

  /* ================= PREVENT BACK NAVIGATION ================= */
  useEffect(() => {
    const handleBack = () => {
      window.history.pushState(null, null, window.location.href);
    };
    window.history.pushState(null, null, window.location.href);
    window.addEventListener("popstate", handleBack);

    return () => {
      window.removeEventListener("popstate", handleBack);
    };
  }, []);

  /* ================= COUNTDOWN ================= */
  useEffect(() => {
    if (!quiz || submitted) return;

    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        localStorage.setItem(`timer-${id}`, prev - 1);
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, quiz, submitted]);

  /* ================= FORMAT TIME ================= */
  const formatTime = () => {
    const min = Math.floor(timeLeft / 60);
    const sec = timeLeft % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  /* ================= ANSWERS ================= */
  const handleAnswerChange = (qIndex, optionIndex) => {
    const updated = [...answers];
    updated[qIndex] = optionIndex;
    setAnswers(updated);
  };

  const answeredCount = answers.filter(a => a !== undefined).length;

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (submitted) return;

    try {
      const res = await axios.post(
        `http://localhost:5000/api/quizzes/submit/${id}`,
        {
          answers,
          userEmail: email,
        }
      );

      setResult(res.data);
      setSubmitted(true);
      localStorage.removeItem(`timer-${id}`);

    } catch (err) {
      alert("Submission failed");
    }
  };

  if (!quiz) return <h2>Loading...</h2>;

  /* ================= RESULT PAGE ================= */
  if (submitted && result) {
    return (
      <>
        <Navbar />
        <div className="result-page">
          <h2>🎉 Quiz Completed</h2>
          <p><strong>Topic:</strong> {quiz.topic}</p>
          <h3>
            Score: {result.score} / {result.total}
          </h3>
          <button onClick={() => navigate("/quiz")}>
            Back to Dashboard
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="attempt-container">

        {/* TIMER + PROGRESS */}
        <div
          className={`timer-box ${
            timeLeft <= 30
              ? "danger"
              : timeLeft <= 60
              ? "warning"
              : ""
          }`}
        >
          ⏳ {formatTime()}
        </div>

        <div className="progress-box">
          📊 Answered: {answeredCount} / {quiz.questions.length}
        </div>

        <h2>{quiz.topic}</h2>

        {quiz.questions.map((q, qIndex) => (
          <div key={qIndex} className="question-card">
            <h4>
              {qIndex + 1}. {q.question}
            </h4>

            {q.options.map((option, oIndex) => (
              <div key={oIndex} className="option-item">
                <input
                  type="radio"
                  name={`question-${qIndex}`}
                  onChange={() =>
                    handleAnswerChange(qIndex, oIndex)
                  }
                />
                {option}
              </div>
            ))}
          </div>
        ))}

        <button className="submit-btn" onClick={handleSubmit}>
          Submit Quiz
        </button>
      </div>
    </>
  );
}

export default AttemptQuiz;