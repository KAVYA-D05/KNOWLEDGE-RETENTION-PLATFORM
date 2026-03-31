import express from "express";
import Quiz from "../models/Quiz.js";
import QuizAttempt from "../models/QuizAttempt.js";
import crypto from "crypto";

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
  try {
    const quizzes = await Quiz.find();
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch quizzes" });
  }
});

/* ================= GET QUIZ BY ID ================= */
router.get("/:id", async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch quiz" });
  }
});

/* ================= SUBMIT QUIZ ================= */
router.post("/submit/:id", async (req, res) => {
  try {
    const { answers, userEmail } = req.body;

    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    let score = 0;

    quiz.questions.forEach((q, index) => {
      if (q.correctAnswer === answers[index]) {
        score++;
      }
    });

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
  try {
    const attempts = await QuizAttempt.find({
      userEmail: req.params.email,
    }).sort({ attemptedAt: -1 });

    res.json(attempts);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch attempts" });
  }
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

/* ================= SHARE QUIZ ================= */
router.put("/share/:id", async (req, res) => {
  try {
    const token = crypto.randomBytes(16).toString("hex");

    const expiresAt = new Date(
      Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    );

    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // Create slug
    const slug = quiz.topic
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // ✅ IMPORTANT: ensure token is saved
    const updatedQuiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      {
        shareToken: token,
        shareExpiresAt: expiresAt,
        isPublic: true,
      },
      { new: true }
    );

    console.log("✅ Token saved:", updatedQuiz.shareToken);

    // ✅ Use production frontend URL
    const FRONTEND =
      process.env.FRONTEND_URL ||
      "https://knowledge-retention-platform.netlify.app";

    res.json({
      shareLink: `${FRONTEND}/shared-quiz/${slug}-${token}`,
      expiresAt,
    });

  } catch (err) {
    console.error("Share Error:", err);
    res.status(500).json({ message: "Share failed" });
  }
});

/* ================= REVOKE SHARE ================= */
router.put("/revoke/:id", async (req, res) => {
  try {
    await Quiz.findByIdAndUpdate(req.params.id, {
      shareToken: null,
      shareExpiresAt: null,
      isPublic: false,
    });

    res.json({ message: "Share link revoked" });
  } catch (err) {
    res.status(500).json({ message: "Revoke failed" });
  }
});

/* ================= GET SHARED QUIZ ================= */
router.get("/shared/:slugToken", async (req, res) => {
  try {
    const slugToken = req.params.slugToken;

    const token = slugToken.split("-").pop();

    console.log("🔍 Received token:", token);

    const quiz = await Quiz.findOne({ shareToken: token });

    console.log("📦 Found quiz:", quiz);

    if (!quiz) {
      return res.status(404).json({ message: "Invalid link" });
    }

    if (quiz.shareExpiresAt && quiz.shareExpiresAt < new Date()) {
      return res.status(400).json({ message: "Link expired" });
    }

    res.json(quiz);

  } catch (err) {
    console.error("Shared Quiz Error:", err);
    res.status(500).json({ message: "Failed to load shared quiz" });
  }
});

export default router;