import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../css/SharedQuiz.css";

function SharedQuiz() {
  const { slugToken } = useParams();

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [result, setResult] = useState(null);

  const email = localStorage.getItem("email") || "sharedUser@gmail.com";

  useEffect(() => {
    fetchQuiz();
  }, []);

  const fetchQuiz = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/quizzes/shared/${slugToken}`
      );

      setQuiz(res.data);

      const totalSeconds = (res.data.timeLimit || 10) * 60;
      setTimeLeft(totalSeconds);

    } catch (err) {
      alert("Invalid or expired link");
    }
  };

  /* ================= TIMER ================= */
  useEffect(() => {
    if (!quiz || result) return;

    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, quiz, result]);

  const formatTime = () => {
    const min = Math.floor(timeLeft / 60);
    const sec = timeLeft % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/quizzes/submit/${quiz._id}`,
        {
          answers,
          userEmail: email,
        }
      );

      setResult(res.data);

    } catch (err) {
      alert(err.response?.data?.message || "Submission failed");
    }
  };

  if (!quiz) return <h2 className="loading">Loading...</h2>;

  if (result) {
    return (
      <div className="result-container">
        <div className="result-card">
          <h2>🎉 Quiz Completed</h2>
          <h3>{quiz.topic}</h3>
          <p>
            Score: {result.score} / {result.total}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="shared-container">

      <div className="quiz-card-modern">

        <div className="quiz-header-modern">
          <h2>{quiz.topic}</h2>
          <div
            className={`timer ${
              timeLeft <= 30
                ? "danger"
                : timeLeft <= 60
                ? "warning"
                : ""
            }`}
          >
            ⏳ {formatTime()}
          </div>
        </div>

        {quiz.questions.map((q, index) => (
          <div key={index} className="question-block">
            <h4>{index + 1}. {q.question}</h4>

            {q.options.map((opt, i) => (
              <label key={i} className="option-modern">
                <input
                  type="radio"
                  name={`question-${index}`}
                  onChange={() => {
                    const newAnswers = [...answers];
                    newAnswers[index] = i;
                    setAnswers(newAnswers);
                  }}
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        ))}

        <button
          className="submit-modern"
          onClick={handleSubmit}
        >
          Submit Quiz
        </button>

      </div>
    </div>
  );
}

export default SharedQuiz;