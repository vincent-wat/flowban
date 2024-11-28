const express = require('express');
const router = express.Router();
const formFieldValueController = require('../controllers/formFieldValueController');

router.post('/', formFieldValueController.createFormFieldValue);
router.get('/instance/:form_instance_id', formFieldValueController.getFormFieldValuesByInstanceId);
router.put('/:id', formFieldValueController.updateFormFieldValue);
router.delete('/:id', formFieldValueController.deleteFormFieldValue);

module.exports = router;
