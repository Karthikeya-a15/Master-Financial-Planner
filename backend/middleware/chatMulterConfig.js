import multer from "multer";

// Store files in memory (Buffer)
const storage = multer.memoryStorage();

// Updated file filter to allow images & documents
export const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg", "image/png", "image/jpg", 
    "application/pdf", "application/msword", 
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, JPEG, PNG, PDF, and DOC/DOCX files are allowed!"), false);
  }
};

const chatUpload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Increased limit to 10MB
  fileFilter,
});

export default chatUpload;
