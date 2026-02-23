import { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import "../css/CreateQuiz.css";

function CreateQuiz() {
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [timeLimit, setTimeLimit] = useState(10);

  /* ================= VISIBILITY ================= */
  const [visibility, setVisibility] = useState("private"); 
  const [allowedEmails, setAllowedEmails] = useState("");

  const [questions, setQuestions] = useState([
    {
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
    },
  ]);

  const email = localStorage.getItem("email");

  const handleQuestionChange = (index, value) => {
    const updated = [...questions];
    updated[index].question = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  const handleCorrectAnswer = (qIndex, value) => {
    const updated = [...questions];
    updated[qIndex].correctAnswer = parseInt(value);
    setQuestions(updated);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", options: ["", "", "", ""], correctAnswer: 0 },
    ]);
  };

  const removeQuestion = (index) => {
    const updated = questions.filter((_, i) => i !== index);
    setQuestions(updated);
  };

  const handleSubmit = async () => {
    try {
      const emailArray =
        visibility === "specific"
          ? allowedEmails.split(",").map((e) => e.trim())
          : [];

      await axios.post("http://localhost:5000/api/quizzes", {
        topic,
        description,
        difficulty,
        timeLimit: Number(timeLimit),
        createdBy: email,
        questions,
        isPublic: visibility === "public",
        allowedEmails: emailArray,
      });

      alert("Quiz Created Successfully 🎉");

      setTopic("");
      setDescription("");
      setDifficulty("Easy");
      setTimeLimit(10);
      setVisibility("private");
      setAllowedEmails("");
      setQuestions([
        { question: "", options: ["", "", "", ""], correctAnswer: 0 },
      ]);

    } catch (error) {
      console.error(error);
      alert("Quiz creation failed");
    }
  };

  return (
    <div>
      <Navbar />

      <div className="create-quiz-container">
        <h2>Create New Quiz</h2>

        <input
          type="text"
          placeholder="Quiz Topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />

        <textarea
          placeholder="Quiz Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        <input
          type="number"
          placeholder="Time Limit (minutes)"
          value={timeLimit}
          onChange={(e) => setTimeLimit(e.target.value)}
        />

        {/* ================= VISIBILITY ================= */}

        <div className="visibility-section">
          <h4>Quiz Visibility</h4>

          <div className="visibility-options">

            <div
              className={`visibility-card ${visibility === "public" ? "active" : ""}`}
              onClick={() => setVisibility("public")}
            >
              🌍 Public
              <p>Anyone with link can attempt</p>
            </div>

            <div
              className={`visibility-card ${visibility === "private" ? "active" : ""}`}
              onClick={() => setVisibility("private")}
            >
              🔒 Private
              <p>Only you can access</p>
            </div>

            <div
              className={`visibility-card ${visibility === "specific" ? "active" : ""}`}
              onClick={() => setVisibility("specific")}
            >
              👥 Specific Users
              <p>Allow selected email IDs</p>
            </div>

          </div>

          {visibility === "specific" && (
            <input
              type="text"
              placeholder="Enter emails (comma separated)"
              value={allowedEmails}
              onChange={(e) => setAllowedEmails(e.target.value)}
              className="email-input"
            />
          )}
        </div>

        <h3>Questions</h3>

        {questions.map((q, qIndex) => (
          <div key={qIndex} className="question-box">

            <input
              type="text"
              placeholder={`Question ${qIndex + 1}`}
              value={q.question}
              onChange={(e) =>
                handleQuestionChange(qIndex, e.target.value)
              }
            />

            {q.options.map((option, oIndex) => (
              <input
                key={oIndex}
                type="text"
                placeholder={`Option ${oIndex + 1}`}
                value={option}
                onChange={(e) =>
                  handleOptionChange(qIndex, oIndex, e.target.value)
                }
              />
            ))}

            <select
              value={q.correctAnswer}
              onChange={(e) =>
                handleCorrectAnswer(qIndex, e.target.value)
              }
            >
              <option value={0}>Correct: Option 1</option>
              <option value={1}>Correct: Option 2</option>
              <option value={2}>Correct: Option 3</option>
              <option value={3}>Correct: Option 4</option>
            </select>

            {questions.length > 1 && (
              <button
                className="remove-btn"
                onClick={() => removeQuestion(qIndex)}
              >
                Remove Question
              </button>
            )}
          </div>
        ))}

        <button className="add-btn" onClick={addQuestion}>
          Add Question
        </button>

        <button className="submit-btn" onClick={handleSubmit}>
          Create Quiz
        </button>

      </div>
    </div>
  );
}

export default CreateQuiz;