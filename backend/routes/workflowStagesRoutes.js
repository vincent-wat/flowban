const express = require('express');
const router = express.Router();
const workflowStagesController = require('../Controllers/workflowStagesController');
const authenticateToken = require('../middleware/authMiddleware');
router.post('/',authenticateToken,workflowStagesController.createWorkflowStage);
router.put("/reorder",authenticateToken, workflowStagesController.reorderWorkflowStages);
router.put('/:id',authenticateToken, workflowStagesController.updateWorkflowStage);
router.get('/:id',authenticateToken, workflowStagesController.getWorkflowStageById);
router.get('/template/:templateId',authenticateToken, workflowStagesController.getStagesByTemplateId);
router.delete('/:id', authenticateToken, workflowStagesController.deleteWorkflowStage);


module.exports = router;
