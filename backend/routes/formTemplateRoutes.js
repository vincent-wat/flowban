const express = require('express');
const router = express.Router();
const formsTemplateController = require('../Controllers/FormsTemplateController');
const multer = require('multer');
const path = require('path');
const fs = require("fs");

const uploadDir = "./uploads/templates/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const sanitizedFilename = file.originalname.replace(/\s+/g, "_");

    // Format: "file-originalFilename.ext"
    cb(null, `file-${sanitizedFilename}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"), false);
  }
};

// Multer upload middleware (for a **single** file named "file")
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
}).single("file");

router.post("/templates", upload, formsTemplateController.createAndUploadTemplate);
router.get('/templates', formsTemplateController.getAllFormTemplates);
router.get('/templates/:id', formsTemplateController.getFormTemplateById);
router.put('/templates/:id', formsTemplateController.updateFormTemplate);
router.delete('/templates/:id', formsTemplateController.deleteFormTemplate);
router.get('/templates/pdf/:id', formsTemplateController.getPdfById);

module.exports = router;
