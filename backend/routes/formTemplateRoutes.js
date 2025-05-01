const express = require('express');
const router = express.Router();
const formsTemplateController = require('../Controllers/FormsTemplateController');
const { uploadTemplates } = require("../middleware/multerConfig");
const authenticateToken = require('../middleware/authMiddleware');

router.post("/templates", uploadTemplates,authenticateToken, formsTemplateController.createAndUploadTemplate);
router.get('/templates', authenticateToken,formsTemplateController.getTemplatesByOrganization);
router.get('/templates/:id', authenticateToken,formsTemplateController.getFormTemplateById);
router.put('/templates/:id', authenticateToken,formsTemplateController.updateFormTemplate);
router.delete('/templates/:id', authenticateToken,formsTemplateController.deleteFormTemplate);
router.get('/templates/pdf/:id', authenticateToken,formsTemplateController.getPdfById);

module.exports = router;
