import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    createdBy: {
      type: String,
      required: true,
    },
    file: {
      type: String, // 🔥 Cloudinary URL
    },
  },
  { timestamps: true }
);

export default mongoose.model("Note", noteSchema);