const express = require('express');
const router = express.Router();
const formInstanceController = require('../Controllers/FormInstanceController');
const { uploadUserForms } = require("../middleware/multerConfig");
const authenticateToken = require('../middleware/authMiddleware');

router.post("/instances", uploadUserForms,authenticateToken, formInstanceController.createFormInstance);
router.get('/templates/:templateId/instances', formInstanceController.getAllFormInstancesofTemplate);
router.get('/instances/:id', formInstanceController.getFormInstanceById);
router.put('/instances/:id', formInstanceController.updateFormInstance);
router.delete('/instances/:id', formInstanceController.deleteFormInstance);
router.put("/instances/approve/:id", authenticateToken, formInstanceController.approveFormInstance);
router.put("/instances/deny/:id", formInstanceController.denyFormInstance);

module.exports = router;
