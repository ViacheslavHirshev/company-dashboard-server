import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: "uploads/avatars",
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);

    if (![".jpg", ".png", ".svg"].includes(extension))
      return cb(new Error("Unsupported file type"), file.originalname);

    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);

    cb(null, uniqueName + extension);
  },
});

export const uploadAvatar = multer({ storage });
