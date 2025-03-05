const express = require('express');
const router = express.Router();
const formInstanceController = require('../Controllers/FormInstanceController');
const { uploadUserForms } = require("../middleware/multerConfig");

router.post("/instances", uploadUserForms, formInstanceController.createFormInstance);
router.get('/instances', formInstanceController.getAllFormInstances);
router.get('/instances/:id', formInstanceController.getFormInstanceById);
router.put('/instances/:id', formInstanceController.updateFormInstance);
router.delete('/instances/:id', formInstanceController.deleteFormInstance);
router.put("/instances/approve/:id", formInstanceController.approveFormInstance);
router.put("/instances/deny/:id", formInstanceController.denyFormInstance);

module.exports = router;
