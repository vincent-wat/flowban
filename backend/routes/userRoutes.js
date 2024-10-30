const express = require('express');
const { updateUser } = require('../Controllers/userController');

const router = express.Router();

router.put('/users/:id', updateUser);  // Calls the updateUser function from the controller

module.exports = router;
