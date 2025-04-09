const controller = require("../Controllers/TaskController");
const router = require("express").Router();
// create new task
router.post("/", controller.addTask);

// update task by id
router.put("/id/:id", controller.updateTask);

// get all tasks
router.get("/", controller.getAllTasks);
// get task by id
router.get("/id/:id", controller.getTask);

// get all tasks for column
router.get("/column_id/:column_id", controller.getAllTasksForColumn);

// delete task by id
router.delete("/id/:id", controller.deleteTask);

// delete all tasks for column
router.delete("/column_id/:column_id", controller.deleteAllTasksForColumn);

// Batch update tasks
router.put("/batch", controller.updateMultipleTasks);

module.exports = router;
