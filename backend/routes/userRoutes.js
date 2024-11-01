// allow for routes to database 
// ex /api/users

const { Router } = require('express');
const controller = require('../Controllers/UserController');
const router = Router();

// the functions will be handled by the controller file 
router.get("/", controller.getUsers);

router.post("/", controller.postUsers);

router.delete("/:id", controller.deleteUser);

module.exports = router;