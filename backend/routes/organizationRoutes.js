const express = require('express');
const router = express.Router();
const Controller = require('../Controllers/OrganizationController.js');
const authenticateToken = require('../middleware/authMiddleware');

router.post('/create', authenticateToken, Controller.createOrganization);
router.post('/invite', authenticateToken, Controller.inviteUserToOrganization);
router.post('/invite-accept', Controller.acceptOrganizationInvite);


//Get all users in the organization
router.get('/users', authenticateToken, Controller.displayAllUsersInOrganization);

//Get organization name by id
router.get('/:id', authenticateToken, Controller.getOrganizationById);


module.exports = router;
