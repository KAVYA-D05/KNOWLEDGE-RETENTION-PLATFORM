import express from "express";
import Quiz from "../models/Quiz.js";
import QuizAttempt from "../models/QuizAttempt.js";

const router = express.Router();

/* ================= CREATE QUIZ ================= */
router.post("/", async (req, res) => {
  try {
    const quiz = await Quiz.create(req.body);
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ message: "Quiz creation failed" });
  }
});

/* ================= GET ALL QUIZZES ================= */
router.get("/", async (req, res) => {
  const quizzes = await Quiz.find();
  res.json(quizzes);
});

/* ================= GET QUIZ BY ID ================= */
router.get("/:id", async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  res.json(quiz);
});

/* ================= SUBMIT QUIZ ================= */
router.post("/submit/:id", async (req, res) => {
  try {
    const { answers, userEmail } = req.body;

    const quiz = await Quiz.findById(req.params.id);

    let score = 0;

    quiz.questions.forEach((q, index) => {
      if (q.correctAnswer === answers[index]) {
        score++;
      }
    });

    // Store topic correctly
    await QuizAttempt.create({
      quizId: quiz._id,
      topic: quiz.topic,
      userEmail,
      score,
      total: quiz.questions.length,
    });

    res.json({
      score,
      total: quiz.questions.length,
    });

  } catch (err) {
    res.status(500).json({ message: "Submission failed" });
  }
});

/* ================= GET USER ATTEMPTS ================= */
router.get("/attempts/:email", async (req, res) => {
  const attempts = await QuizAttempt.find({
    userEmail: req.params.email,
  }).sort({ attemptedAt: -1 });

  res.json(attempts);
});
/* ================= DELETE ATTEMPT ================= */
router.delete("/attempt/:id", async (req, res) => {
  try {
    await QuizAttempt.findByIdAndDelete(req.params.id);
    res.json({ message: "Attempt deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});
export default router;
