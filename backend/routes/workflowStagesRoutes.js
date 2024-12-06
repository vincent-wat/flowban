const express = require('express');
const router = express.Router();
const workflowStagesController = require('../Controllers/workflowStagesController');

router.get('/:templateId', workflowStagesController.getStagesByTemplateId);

module.exports = router;
