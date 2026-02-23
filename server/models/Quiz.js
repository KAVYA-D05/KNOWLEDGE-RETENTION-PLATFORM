import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: String,
  options: [String],
  correctAnswer: Number,
});

const quizSchema = new mongoose.Schema(
  {
    topic: String,
    description: String,
    difficulty: String,
    timeLimit: {
      type: Number,
      default: 10,
    },
    createdBy: String,

    questions: [questionSchema],

    /* ===== VISIBILITY ===== */
    isPublic: {
      type: Boolean,
      default: false,
    },

    allowedEmails: {
      type: [String],
      default: [],
    },

    /* ===== SHARING ===== */
    shareToken: String,
    shareExpiresAt: Date,
  },
  { timestamps: true }
);


export default mongoose.model("Quiz", quizSchema);