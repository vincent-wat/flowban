const { Router } = require('express');
const controller = require('../Controllers/BoardController');
const router = Router();


// the functions will be handled by the controller file 
router.get("/:id", controller.getUserBoards);

router.get('/', controller.getAllBoards);

//router.post("/", controller.postUsers);

//router.delete("/:id", controller.deleteUser);

module.exports = router;