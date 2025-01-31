const express = require('express');
const router = express.Router();
const formInstanceController = require('../controllers/formInstanceController');

router.post('/Instances', formInstanceController.upload.single('modifiedPdf'), formInstanceController.createFormInstance);
router.get('/instances', formInstanceController.getAllFormInstances);
router.get('/instances/:id', formInstanceController.getFormInstanceById);
router.put('/instances/:id', formInstanceController.updateFormInstance);
router.delete('/instances/:id', formInstanceController.deleteFormInstance);
router.post("/instances/approve/:id", formInstanceController.approveFormInstance);
router.post("/instances/deny/:id", formInstanceController.denyFormInstance);

module.exports = router;
