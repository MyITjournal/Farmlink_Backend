import multer from "multer";
import fs from "fs";
import path from "path";

/**
 * fileUpload(folder, allowedMimeTypes)
 * returns multer instance
 */
const fileUpload = (folder = "uploads/", allowedTypes = []) => {
  // ensure folder exists
  if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });

  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, folder),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9-_]/g, "");
      const uniqueName = `${base}-${Date.now()}${ext}`;
      cb(null, uniqueName);
    },
  });

  const fileFilter = (req, file, cb) => {
    if (Array.isArray(allowedTypes) && allowedTypes.length > 0) {
      if (!allowedTypes.includes(file.mimetype)) {
        return cb(new Error("Invalid file type"), false);
      }
    }
    cb(null, true);
  };

  return multer({ storage, limits: { fileSize: 5 * 1024 * 1024 }, fileFilter });
};

export default fileUpload;
