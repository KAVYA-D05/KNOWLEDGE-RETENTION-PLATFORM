import { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import "../css/CreateQuiz.css";
import API from "../utils/api";
function CreateQuiz() {
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [timeLimit, setTimeLimit] = useState(10);
  const [visibility, setVisibility] = useState("private");
  const [allowedEmails, setAllowedEmails] = useState("");
  const [questions, setQuestions] = useState([
    { question: "", options: ["", "", "", ""], correctAnswer: 0 },
  ]);

  const creatorEmail = localStorage.getItem("email");

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
    setQuestions([...questions, { question: "", options: ["", "", "", ""], correctAnswer: 0 }]);
  };

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!topic || questions[0].question === "") {
      return alert("Please fill in the topic and at least one question.");
    }

    try {
      const emailArray = visibility === "specific" 
        ? allowedEmails.split(",").map((e) => e.trim()) 
        : [];

      await axios.post(`${API}/api/quizzes`, {
        topic,
        description,
        difficulty,
        timeLimit: Number(timeLimit),
        createdBy: creatorEmail,
        questions,
        isPublic: visibility === "public",
        allowedEmails: emailArray,
      });

      alert("Quiz Published Successfully! 🚀");
      window.location.reload(); // Refresh to clear state
    } catch (error) {
      alert("Error publishing quiz.");
    }
  };

  return (
    <div className="create-page-wrapper">
      <Navbar />
      
      <div className="creator-container">
        {/* LEFT COLUMN: SETTINGS */}
        <aside className="creator-sidebar">
          <div className="sticky-sidebar">
            <h3>Assessment Settings</h3>
            <p className="sidebar-hint">Configure how your quiz appears to others.</p>
            
            <label>Quiz Topic</label>
            <input type="text" placeholder="e.g. React Fundamentals" value={topic} onChange={(e) => setTopic(e.target.value)} />

            <label>Description</label>
            <textarea placeholder="Briefly describe the quiz..." value={description} onChange={(e) => setDescription(e.target.value)} />

            <div className="settings-row">
              <div className="input-group">
                <label>Difficulty</label>
                <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
              </div>
              <div className="input-group">
                <label>Duration (Min)</label>
                <input type="number" value={timeLimit} onChange={(e) => setTimeLimit(e.target.value)} />
              </div>
            </div>

            <div className="visibility-area">
              <label>Visibility</label>
              <div className="vis-toggle">
                <button className={visibility === "public" ? "active" : ""} onClick={() => setVisibility("public")}>Public</button>
                <button className={visibility === "private" ? "active" : ""} onClick={() => setVisibility("private")}>Private</button>
                <button className={visibility === "specific" ? "active" : ""} onClick={() => setVisibility("specific")}>Limited</button>
              </div>
              {visibility === "specific" && (
                <input 
                  type="text" 
                  className="email-tag-input" 
                  placeholder="user1@mail.com, user2@mail.com" 
                  value={allowedEmails} 
                  onChange={(e) => setAllowedEmails(e.target.value)} 
                />
              )}
            </div>

            <button className="publish-btn" onClick={handleSubmit}>Publish Assessment</button>
          </div>
        </aside>

        {/* RIGHT COLUMN: QUESTIONS */}
        <main className="question-editor">
          <div className="editor-header">
            <h2>Manage Questions</h2>
            <span className="q-count">{questions.length} Question{questions.length !== 1 ? 's' : ''}</span>
          </div>

          {questions.map((q, qIndex) => (
            <div key={qIndex} className="question-card">
              <div className="q-card-header">
                <span className="q-number">Question {qIndex + 1}</span>
                {questions.length > 1 && (
                  <button className="del-q-btn" onClick={() => removeQuestion(qIndex)}>Remove</button>
                )}
              </div>

              <input
                className="q-input"
                type="text"
                placeholder="Start typing your question here..."
                value={q.question}
                onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
              />

              <div className="options-grid">
                {q.options.map((option, oIndex) => (
                  <div key={oIndex} className={`opt-input-wrapper ${q.correctAnswer === oIndex ? "is-correct" : ""}`}>
                    <input
                      type="text"
                      placeholder={`Option ${oIndex + 1}`}
                      value={option}
                      onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                    />
                    <div 
                      className="correct-marker" 
                      onClick={() => handleCorrectAnswer(qIndex, oIndex)}
                      title="Set as correct answer"
                    >
                      {q.correctAnswer === oIndex ? "✔" : ""}
                    </div>
                  </div>
                ))}
              </div>
              
              <p className="hint-text">Click the checkmark icon to set the correct answer.</p>
            </div>
          ))}

          <button className="add-q-card-btn" onClick={addQuestion}>
            + Add Another Question
          </button>
        </main>
      </div>
    </div>
  );
}

export default CreateQuiz;