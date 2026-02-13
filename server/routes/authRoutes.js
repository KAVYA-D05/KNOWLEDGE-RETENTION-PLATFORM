import express from "express";
import {
  registerUser,
  verifyOTP,
  loginUser
} from "../controllers/authController.js";

const router = express.Router();

/* ================= REGISTER ================= */
router.post("/register", registerUser);

/* ================= VERIFY OTP ================= */
router.post("/verify-otp", verifyOTP);

/* ================= LOGIN ================= */
router.post("/login", loginUser);

export default router;
