const express = require('express');
const router = express.Router();
const workflowBoardController = require('../controllers/workflowBoardController');


router.post('/', workflowBoardController.createWorkflowBoard);
router.get('/', workflowBoardController.getAllWorkflowBoards);
router.get('/:id', workflowBoardController.getWorkflowBoardById);
router.put('/:id', workflowBoardController.updateWorkflowBoard);
router.delete('/:id', workflowBoardController.deleteWorkflowBoard);

module.exports = router;
