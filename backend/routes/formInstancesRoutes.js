const express = require('express');
const router = express.Router();
const formInstanceController = require('../controllers/formInstanceController');

router.post('/instances', formInstanceController.createFormInstance);
router.get('/instances', formInstanceController.getAllFormInstances);
router.get('/instances/:id', formInstanceController.getFormInstanceById);
router.put('/instances/:id', formInstanceController.updateFormInstance);
router.delete('/instances/:id', formInstanceController.deleteFormInstance);

module.exports = router;
