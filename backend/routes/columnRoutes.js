const { Router } = require("express");
const controller = require("../Controllers/ColumnsController");
const router = Router();

// get routes
router.get("/", controller.getAllColumns);
router.get("/id/:id", controller.getColumn);
router.get("/board_id/:board_id", controller.getAllColumnsForBoard);
// post routes
router.post("/", controller.addColumn);
// put routes
router.put("/id/:id", controller.updateColumnName);

// delete routes
router.delete("/id/:id", controller.deleteColumn);
router.delete("/board_id/:board_id", controller.deleteAllColumnsForBoard);
module.exports = router;
