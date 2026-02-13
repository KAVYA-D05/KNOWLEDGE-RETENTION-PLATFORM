import 'dotenv/config';
import express from "express";
import session from "express-session";
import passport from "passport";
import cors from "cors";
import mongoose from "mongoose";

import "./config/passport.js";
import googleAuthRoutes from "./routes/googleAuthRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import userRoutes from "./routes/userRoutes.js"; 
import quizRoutes from "./routes/quizRoutes.js";

const app = express();

/* ================== MIDDLEWARE ================== */
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "secretkey",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

/* ================== ROUTES ================== */
// This matches your frontend calls to http://localhost:5000/api/register
app.use("/auth", googleAuthRoutes);
app.use("/api", userRoutes); 
app.use("/api/notes", noteRoutes);
app.use("/api/quizzes", quizRoutes);

/* ================== DATABASE ================== */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
