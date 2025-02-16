const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure upload directories exist
const ensureDirectoryExists = (directory) => {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
};

// Multer storage configuration (separate for each upload type)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath;

    // Check which upload type is set before multer processes the file
    if (req.uploadType === "userForms") {
      uploadPath = path.join(__dirname, "../uploads/userForms");
    } else {
      uploadPath = path.join(__dirname, "../uploads/templates");
    }

    ensureDirectoryExists(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `form_${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

// File filter (only PDFs allowed)
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"), false);
  }
};

// ✅ Ensure `req.uploadType` is set before calling Multer
const uploadUserForms = (req, res, next) => {
  req.uploadType = "userForms"; // ✅ Set type before passing to Multer
  multer({ storage, fileFilter }).single("file")(req, res, next);
};

const uploadTemplates = (req, res, next) => {
  req.uploadType = "templates"; // ✅ Set type before passing to Multer
  multer({ storage, fileFilter }).single("file")(req, res, next);
};

module.exports = { uploadUserForms, uploadTemplates };
