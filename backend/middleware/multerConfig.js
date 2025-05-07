const multer = require("multer");
const path = require("path");
const fs = require("fs");

const ensureDirectoryExists = (directory) => {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
};

ensureDirectoryExists(path.join(__dirname, "uploads/userForms"));
ensureDirectoryExists(path.join(__dirname, "uploads/templates"));


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath;

    if (req.uploadType === "userForms") {
      uploadPath = path.join(__dirname, "uploads/userForms");
    } else {
      uploadPath = path.join(__dirname, "uploads/templates");
    }

    ensureDirectoryExists(uploadPath); 
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `form_${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"), false);
  }
};

const uploadUserForms = (req, res, next) => {
  req.uploadType = "userForms";
  multer({ storage, fileFilter }).single("file")(req, res, next);
};

const uploadTemplates = (req, res, next) => {
  req.uploadType = "templates";
  multer({ storage, fileFilter }).single("file")(req, res, next);
};

module.exports = { uploadUserForms, uploadTemplates };
