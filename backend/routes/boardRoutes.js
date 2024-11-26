const { Router } = require('express');
const controller = require('../Controllers/BoardController');
const router = Router();


// the functions will be handled by the controller file 
router.get("/:id", controller.getUserBoards);

router.get('/', controller.getAllBoards);

router.put('/:id', controller.updateBoardName); 

router.delete('/:id', controller.deleteBoard); 

router.post("/", controller.addBoard);

//router.delete("/:id", controller.deleteUser);

module.exports = router;