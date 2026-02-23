import express from "express";
import multer from "multer";
import Note from "../models/Note.js";

const router = express.Router();

/* ================= MULTER CONFIG ================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

/* ================= CREATE NOTE ================= */
router.post("/", upload.single("file"), async (req, res) => {
  try {
    const { title, description, createdBy } = req.body;

    if (!title || !description || !createdBy) {
      return res.status(400).json({ message: "All fields required" });
    }

    const newNote = await Note.create({
      title,
      description,
      createdBy,
      fileName: req.file ? req.file.filename : null,
    });

    res.status(201).json(newNote);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= GET USER NOTES ================= */
router.get("/my/:email", async (req, res) => {
  try {
    const notes = await Note.find({
      createdBy: req.params.email,
    }).sort({ createdAt: -1 });

    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: "Fetch failed" });
  }
});

/* ================= GET SHARED NOTE PAGE ================= */
router.get("/shared/:id", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json(note);
  } catch (err) {
    res.status(500).json({ message: "Failed to load note" });
  }
});

/* ================= DELETE NOTE ================= */
router.delete("/:id", async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
});

export default router;