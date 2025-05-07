const Controller = require("../Controllers/userTasksController");
const router = require("express").Router();
const { routes } = require("../server");

router.post("/", Controller.createUserTask); // create a new entry in user_tasks
router.get("/", Controller.getAllEntries); // get all entries
router.get("/:user_id/:task_id", Controller.getUserTask); // get specific user task
router.delete("/:task_id", Controller.deleteUserTask); // delete specific user task
router.get("/tasks/all/:user_id", Controller.getUserTasksByUserId); // get all tasks for user
router.post("/notification", Controller.taskNotification); // send email notification for assigned task

module.exports = router;
