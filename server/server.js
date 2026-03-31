import 'dotenv/config';
import express from "express";
import session from "express-session";
import passport from "passport";
import cors from "cors";
import mongoose from "mongoose";
import path from "path"; // Keep this one at the top

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
  "https://knowledge-retention-platform.netlify.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('CORS error: This origin is not allowed.'), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));

/* ================== MIDDLEWARE ================== */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve the uploads folder publicly
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