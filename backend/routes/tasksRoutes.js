const { Router } = require("express");
const controller = require("../Controllers/TaskController");
const router = Router();

// get routes
router.get("/", controller.getAllTasks);
router.get("/id/:id", controller.getTask);
router.get("/column_id/:column_id", controller.getAllTasksForColumn);

// post routes
router.post("/", controller.addTask);

// put routes
router.put("/title/:id", controller.updateTaskTitle);
router.put("/description/:id", controller.updateTaskDescription);

// delete routes
router.delete("/id/:id", controller.deleteTask);
router.delete("/column/:column_id", controller.deleteAllTasksForColumn);

module.exports = router;
