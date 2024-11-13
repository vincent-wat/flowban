const { Router } = require("express");
const controller = require("../Controllers/ColumnsController");
const router = Router();

// get routes
router.get("/", controller.getAllColumns);
router.get("/id/:id", controller.getColumn);
router.get("/board/:board_id", controller.getAllColumnsForBoard);
// post routes
router.post("/", controller.addColumn);
// put routes
router.put("/name/:id", controller.updateColumnName);

// delete routes
router.delete("/id/:id", controller.deleteColumn);
router.delete("/board/:board_id", controller.deleteAllColumnsForBoard);
module.exports = router;
