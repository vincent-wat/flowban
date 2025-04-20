const express = require('express');
const router = express.Router();
const Controller = require('../Controllers/OrganizationController.js');

router.post('/create', Controller.createOrganization);
router.post('/invite', Controller.inviteUserToOrganization);
router.post('/invite-accept', Controller.acceptOrganizationInvite);



module.exports = router;
