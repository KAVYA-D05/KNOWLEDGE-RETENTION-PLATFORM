import express from "express";
import Note from "../models/Note.js";

const router = express.Router();

/* ================= SHARE ROUTE ================= */
router.put("/share/:id", async (req, res) => {
  try {
    const { email } = req.body;

    const note = await Note.findById(req.params.id);

    if (!note) return res.status(404).json({ message: "Note not found" });

    if (note.visibility !== "restricted") {
      return res.status(400).json({
        message: "Only restricted notes can be shared",
      });
    }

    if (!note.allowedUsers.includes(email)) {
      note.allowedUsers.push(email);
      await note.save();
    }

    res.json({ message: "Access granted" });
  } catch {
    res.status(500).json({ message: "Error sharing note" });
  }
});

export default router;
