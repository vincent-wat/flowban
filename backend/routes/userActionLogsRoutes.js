const express = require('express');
const router = express.Router();
const userActionsAuditLogController = require('../Controllers/UserActionLogsController');

router.post('/', userActionsAuditLogController.createUserActionLog);
router.get('/formInstance/:form_instance_id', userActionsAuditLogController.getUserActionLogsByFormInstanceId);

module.exports = router;
