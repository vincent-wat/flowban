const controller = require("../Controllers/userBoardsController");
const router = require("express").Router();

router.post("/", controller.createUserBoard); // create a new entry in user_boards
router.get("/:user_id", controller.getUserBoardsByUserId); // get all entries for user
router.put("/:user_id/:board_id", controller.updatePermissions); // update permissions for user
router.get("/:user_id/:board_id", controller.getUserBoard); // get specific user board
router.delete("/:user_id/:board_id", controller.deleteUserBoard); // delete specific user board
router.get("/boards/all/:user_id", controller.getAllBoardsForUser); // get all boards for user
//test routes
router.get("/", controller.getAllEntries);
module.exports = router;
