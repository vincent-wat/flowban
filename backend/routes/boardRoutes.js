const controller = require("../Controllers/BoardController");
const router = require("express").Router();

// create new board
router.post("/", controller.addBoard);

// get all boards
router.get("/", controller.getAllBoards);

// get board by id
router.get("/:id", controller.getBoardbyID);

// update board by id
router.put("/:id", controller.updateBoard);

// delete board by id
router.delete("/:id", controller.deleteBoard);

module.exports = router;
