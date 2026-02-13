import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import "../css/AttemptQuiz.css";

function AttemptQuiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("email");

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/quizzes/${id}`)
      .then((res) => {
        setQuiz(res.data);
        setAnswers(new Array(res.data.questions.length).fill(null));
        setTimeLeft(res.data.timeLimit * 60);
      });
  }, [id]);

  /* TIMER */
  useEffect(() => {
    if (timeLeft <= 0 && score === null && quiz) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleSelect = (qIndex, optionIndex) => {
    const updated = [...answers];
    updated[qIndex] = optionIndex;
    setAnswers(updated);
  };

  const handleSubmit = async () => {
    const res = await axios.post(
      `http://localhost:5000/api/quizzes/submit/${id}`,
      { answers, userEmail }
    );

    setScore(res.data.score);
  };

  if (!quiz) return <div>Loading...</div>;

  return (
    <div>
      <Navbar />

      <div className="attempt-container">
        <h2>{quiz.topic}</h2>

        <div className="timer">
          Time Left: {Math.floor(timeLeft / 60)}:
          {String(timeLeft % 60).padStart(2, "0")}
        </div>

        {quiz.questions.map((q, qIndex) => (
          <div key={qIndex} className="question-card">
            <h4>
              {qIndex + 1}. {q.question}
            </h4>

            {q.options.map((option, oIndex) => {
              const isCorrect = q.correctAnswer === oIndex;
              const isSelected = answers[qIndex] === oIndex;

              return (
                <div
                  key={oIndex}
                  className={`option 
                  ${score !== null && isCorrect ? "correct" : ""}
                  ${score !== null && isSelected && !isCorrect ? "wrong" : ""}
                `}
                >
                  <label>
                    <input
                      type="radio"
                      disabled={score !== null}
                      onChange={() =>
                        handleSelect(qIndex, oIndex)
                      }
                    />
                    {option}
                  </label>
                </div>
              );
            })}
          </div>
        ))}

        {score === null ? (
          <button className="submit-btn" onClick={handleSubmit}>
            Submit Quiz
          </button>
        ) : (
          <div className="result-box">
            <h3>
              Your Score: {score} / {quiz.questions.length}
            </h3>

            <div className="completed-badge">
              ✅ Quiz Completed
            </div>

            <button
              className="back-btn"
              onClick={() => navigate("/quiz")}
            >
              Back to Quiz Page
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AttemptQuiz;
