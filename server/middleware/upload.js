import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "notes",
    resource_type: "auto", // supports pdf, docx, images
  },
});

const upload = multer({ storage });

export default upload;