import multer from "multer";

// Use memory storage so we can upload directly to MEGA (from buffer)
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // Accept only images (jpeg, png, webp, gif, bmp)
    if (/^image\/(jpeg|png|webp|gif|bmp)$/.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
  limits: {
    files: 20, // max number of files (optional)
  },
});

export default upload;
