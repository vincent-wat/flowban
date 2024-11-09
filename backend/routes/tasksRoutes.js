const { Router } = require("express");
const controller = require("../Controllers/TaskController");
const router = Router();

// routes for http calls
router.get("/", controller.getAllTasks);
router.get("/id/:id", controller.getTask);

router.get("/column_id/:column_id", controller.getAllTasksForColumn);

module.exports = router;
