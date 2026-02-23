import mongoose from "mongoose";

const attemptSchema = new mongoose.Schema(
  {
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
    },

    topic: String,
    userEmail: String,

    score: Number,
    total: Number,

    attemptedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("QuizAttempt", attemptSchema);
