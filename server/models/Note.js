import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    file: String,
    createdBy: String,

    visibility: {
      type: String,
      enum: ["private", "public", "restricted"],
      default: "private",
    },

    allowedUsers: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Note", noteSchema);
