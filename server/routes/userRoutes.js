import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { sendOTPEmail } from "../utils/sendEmail.js";

const router = express.Router();

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

/* REGISTER ROUTE */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpiry: Date.now() + 5 * 60 * 1000, // 5 mins
      isVerified: false, 
    });

    await newUser.save();
    
    // Attempt to send email
    try {
        await sendOTPEmail(email, otp);
        res.status(201).json({ message: "Registration successful! OTP sent to email." });
    } catch (mailError) {
        console.error("Mail error:", mailError);
        res.status(201).json({ message: "User created, but failed to send OTP email." });
    }

  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/* VERIFY OTP ROUTE */
router.post("/verify-otp", async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });

        if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        res.json({ message: "Email verified successfully" });
    } catch (error) {
        res.status(500).json({ message: "Verification failed" });
    }
});

/* LOGIN ROUTE */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

   router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (!user.isVerified) {
      return res.status(401).json({ message: "Please verify email first" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json({
      message: "Login successful",
      user: { name: user.name, email: user.email }
    });

  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
});


    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    res.json({
      message: "Login successful",
      user: { name: user.name, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
});

export default router;