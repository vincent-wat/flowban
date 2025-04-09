const contoller = require("../Controllers/ColumnsController");
const router = require("express").Router();

// create new column
router.post("/", contoller.addColumn);
// update column by id
router.put("/id/:id", contoller.updateColumn);

// get all columns
router.get("/", contoller.getAllColumns);

// get column by id
router.get("/id/:id", contoller.getColumn);

// get all columns for board
router.get("/board/:board_id", contoller.getAllColumnsForBoard);

// delete column by id
router.delete("/id/:id", contoller.deleteColumn);

// delete all columns for board
router.delete("/board/:board_id", contoller.deleteAllColumnsForBoard);

module.exports = router;
