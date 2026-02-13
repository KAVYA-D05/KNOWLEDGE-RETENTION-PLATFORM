import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import "../css/Quiz.css";

function Quiz() {
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/quizzes")
      .then((res) => setQuizzes(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <Navbar />

      <div className="quiz-container">
        <div className="quiz-header">
          <h2>Explore Quizzes</h2>

          <button
            className="create-btn"
            onClick={() => navigate("/create-quiz")}
          >
            + Create New Quiz
          </button>
        </div>

        <div className="quiz-grid">
          {quizzes.length === 0 ? (
            <p className="no-quiz">No quizzes available yet.</p>
          ) : (
            quizzes.map((quiz) => (
              <div key={quiz._id} className="quiz-card">
                <h3>{quiz.topic}</h3>

                <p className="quiz-description">
                  {quiz.description || "No description provided"}
                </p>

                <div className="quiz-meta">
                  <span className={`difficulty ${quiz.difficulty}`}>
                    {quiz.difficulty}
                  </span>
                  <span>{quiz.timeLimit} mins</span>
                  <span>{quiz.questions.length} Questions</span>
                </div>

                <button
                  className="attempt-btn"
                  onClick={() =>
                    navigate(`/attempt-quiz/${quiz._id}`)
                  }
                >
                  Attempt Quiz
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Quiz;
