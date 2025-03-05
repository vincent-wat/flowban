const express = require('express');
const router = express.Router();
const formsTemplateController = require('../Controllers/FormsTemplateController');
const { uploadTemplates } = require("../middleware/multerConfig");

router.post("/templates", uploadTemplates, formsTemplateController.createAndUploadTemplate);
router.get('/templates', formsTemplateController.getAllFormTemplates);
router.get('/templates/:id', formsTemplateController.getFormTemplateById);
router.put('/templates/:id', formsTemplateController.updateFormTemplate);
router.delete('/templates/:id', formsTemplateController.deleteFormTemplate);
router.get('/templates/pdf/:id', formsTemplateController.getPdfById);

module.exports = router;
