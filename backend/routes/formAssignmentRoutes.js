const express = require('express');
const router = express.Router();
const formAssignment  = require('../controllers/formAssignmentController');

const authenticate = require('../middleware/authMiddleware');

router.post('/', authenticate, formAssignment.assignUserToFormInstance);
router.get('/form/:formInstanceId', authenticate, formAssignment.getAssignmentsByFormInstance);
router.get('/my-assignments', authenticate, formAssignment.getAssignmentsByUser);
router.put('/:assignmentId', authenticate, formAssignment.updateAssignmentStatus);

module.exports = router;
