// allow for routes to database 
// ex /api/users

const { Router } = require('express');
const controller = require('../Controller/userController');
const router = Router();

// the fucntions will be handled by the controller file 
router.get("/", controller.getUsers);
router.post("/", controller.postUsers);

module.exports = router;