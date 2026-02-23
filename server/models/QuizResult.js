import mongoose from "mongoose";

const quizResultSchema = new mongoose.Schema(
  {
    topic: String,
    userEmail: String,
    score: Number,
    total: Number,
  },
  { timestamps: true }
);

export default mongoose.model("QuizResult", quizResultSchema);
