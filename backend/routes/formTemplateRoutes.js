const express = require('express');
const router = express.Router();
const formsTemplateController = require('../Controllers/FormsTemplateController');

router.post('/templates', formsTemplateController.createFormTemplate);
router.get('/templates', formsTemplateController.getAllFormTemplates);
router.get('/templates/:id', formsTemplateController.getFormTemplateById);
router.put('/templates/:id', formsTemplateController.updateFormTemplate);
router.delete('/templates/:id', formsTemplateController.deleteFormTemplate);

module.exports = router;
