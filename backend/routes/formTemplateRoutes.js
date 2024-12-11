const express = require('express');
const router = express.Router();
const formsTemplateController = require('../Controllers/FormsTemplateController');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: './uploads/templates/',
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });
router.post('/templates', upload.single('template'), formsTemplateController.createAndUploadTemplate);
router.get('/templates', formsTemplateController.getAllFormTemplates);
router.get('/templates/:id', formsTemplateController.getFormTemplateById);
router.put('/templates/:id', formsTemplateController.updateFormTemplate);
router.delete('/templates/:id', formsTemplateController.deleteFormTemplate);
router.get('/templates/pdf/:id', formsTemplateController.getPdfById);

module.exports = router;
