const express = require('express');
const router = express.Router();
const Controller = require('../Controllers/OrganizationController.js');
const authenticateToken = require('../middleware/authMiddleware');

router.post('/create', authenticateToken, Controller.createOrganization);
router.post('/invite', authenticateToken, Controller.inviteUserToOrganization);
router.post('/invite-accept', authenticateToken, Controller.acceptOrganizationInvite);



module.exports = router;
