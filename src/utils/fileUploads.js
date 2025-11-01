import multer from "multer";
import fs from "fs";

const fileUpload = (folder = "uploads/") => {
  // Create folder if it doesn’t exist
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }
  const storage = multer.diskStorage({
    destination: folder,
    filename: (req, file, cb) => {
      const uniqueName = `${Date.now()}-${file.originalname}`;
      cb(null, uniqueName);
    },
  });

  return multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  });
};

export default fileUpload;

// USAGE FOR fileUpload
// fileUpload(folder)
// Use this to handle file uploads in your routes.
// It sets up Multer, creates the folder if it doesn’t exist, and returns a ready-to-use middleware.
// The folder argument is optional — defaults to "uploads/" if not provided.
// Example:
// const upload = fileUpload(); // saves files to "uploads/"
// router.post("/upload", upload.single("file"), handler);

// You can also specify a custom folder:
// const uploadDocs = fileUpload("uploads/documents/");
// router.post("/docs", uploadDocs.single("document"), handler);
