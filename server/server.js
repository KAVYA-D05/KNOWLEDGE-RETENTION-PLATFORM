import 'dotenv/config';
import express from "express";
import session from "express-session";
import passport from "passport";
import cors from "cors";
import mongoose from "mongoose";
import path from "path"; // Single import at the top

import "./config/passport.js";
import googleAuthRoutes from "./routes/googleAuthRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import profileRoutes from "./routes/profileRoutes.js"; 
import quizRoutes from "./routes/quizRoutes.js";

const app = express();

/* ================== CORS CONFIGURATION ================== */
const allowedOrigins = [
  "http://localhost:3000",
  "https://knowledge-retention-platform-2.onrender.com"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

/* ================== MIDDLEWARE ================== */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve the uploads folder publicly for your Note files
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "fallback_secret_for_dev",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", 
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    }
  })
);

app.use(passport.initialize());
app.use(passport.session());

/* ================== ROUTES ================== */
app.use("/auth", googleAuthRoutes);
app.use("/api", userRoutes);
app.use("/api", profileRoutes); 
app.use("/api/notes", noteRoutes);
app.use("/api/quizzes", quizRoutes);

/* ================== DATABASE ================== */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

/* ================== ROOT ROUTE ================== */
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Knowledge Retention Platform API is running!",
    status: "Healthy"
  });
});