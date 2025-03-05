const express = require('express');
const router = express.Router();
const workflowStagesController = require('../Controllers/workflowStagesController');
router.post('/:',workflowStagesController.createWorkflowStage);
router.put('/:id', workflowStagesController.updateWorkflowStage);
router.get('/:id', workflowStagesController.getWorkflowStageById);
router.get('/template/:templateId', workflowStagesController.getStagesByTemplateId);
router.delete('/:id', workflowStagesController.deleteWorkflowStage);
module.exports = router;
