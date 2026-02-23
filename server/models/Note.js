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
    fileName: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Note", noteSchema);
