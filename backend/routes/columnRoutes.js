const controller = require("../Controllers/ColumnsController");
const router = require("express").Router();

// create new column
router.post("/", controller.addColumn);
// update column by id
router.put("/id/:id", controller.updateColumn);

// get all columns
router.get("/", controller.getAllColumns);

// get column by id
router.get("/id/:id", controller.getColumn);

// get all columns for board
router.get("/board/:board_id", controller.getAllColumnsForBoard);

// delete column by id
router.delete("/id/:id", controller.deleteColumn);

// delete all columns for board
router.delete("/board/:board_id", controller.deleteAllColumnsForBoard);

module.exports = router;
