const express = require('express');
const router = express.Router();
const Controller = require('../Controllers/OrganizationController.js');

router.post('/create', Controller.createOrganization);
router.put('/add-user', Controller.addUserToOrganization);

module.exports = router;
