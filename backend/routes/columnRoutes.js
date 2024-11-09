const { Router } = require("express");
const controller = require("../Controllers/ColumnsController");
const router = Router();

// routes for http calls
router.get("/", controller.getAllColumns);
router.get("/id/:id", controller.getColumn);

router.get("/board_id/:board_id", controller.getAllColumnsForBoard);

module.exports = router;
