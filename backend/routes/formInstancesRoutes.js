const express = require('express');
const router = express.Router();
const formInstanceController = require('../Controllers/FormInstanceController');
const { uploadUserForms } = require("../middleware/multerConfig");

router.post("/instances", uploadUserForms, formInstanceController.createFormInstance);
router.get('/templates/:templateId/instances', formInstanceController.getAllFormInstancesofTemplate);
router.get('/instances/:id', formInstanceController.getFormInstanceById);
router.put('/instances/:id', formInstanceController.updateFormInstance);
router.delete('/instances/:id', formInstanceController.deleteFormInstance);
router.put("/instances/approve/:id", formInstanceController.approveFormInstance);
router.put("/instances/deny/:id", formInstanceController.denyFormInstance);

module.exports = router;
