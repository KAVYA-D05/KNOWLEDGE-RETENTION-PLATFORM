import express from "express";
import User from "../models/User.js";

const router = express.Router();

/* ================= GET PROFILE ================= */
router.get("/profile/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);

  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
});

/* ================= UPDATE PROFILE ================= */
router.put("/profile/:email", async (req, res) => {
  try {
    const { name, phone } = req.body;

    const updatedUser = await User.findOneAndUpdate(
      { email: req.params.email },
      { name, phone },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });

  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: "Profile update failed" });
  }
});

export default router;
