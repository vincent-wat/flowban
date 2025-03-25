const { Router } = require("express");
//const Task = require("../models/KanbanBoardDB/tasks");
const router = Router();

// // delete routes
// router.delete("/id/:id", controller.deleteTask);
// router.delete("/column/:column_id", controller.deleteAllTasksForColumn);

// create new task
router.post("/", async (req, res) => {
  try {
    const task = await Task.create({
      title: req.body.title,
      description: req.body.description,
      column_id: req.body.column_id,
    });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: "Task not created" });
  }
});

// update task by id
router.put("/id/:id", async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (task) {
      const updateData = {};
      if (req.body.title) updateData.title = req.body.title;
      if (req.body.description) updateData.description = req.body.description;
      if (req.body.column_id) updateData.column_id = req.body.column_id;

      await task.update(updateData);
      res.json(task);
    } else {
      res.status(404).json({ error: "Task not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Task not updated" });
  }
});

// get all tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.findAll();
    res.json(tasks);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
});

// get task by id
router.get("/id/:id", async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (task) {
      res.json(task);
    } else {
      res.status(404).json({ error: "Task not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
});

// get all tasks for column
router.get("/column_id/:column_id", async (req, res) => {
  try {
    const tasks = await Task.findAll({
      where: { column_id: req.params.column_id },
    });
    res.json(tasks);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
});

// delete task by id
router.delete("/id/:id", async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (task) {
      await task.destroy();
      res.json(task);
    } else {
      res.status(404).json({ error: "Task not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Task not deleted" });
  }
});

// delete all tasks for column
router.delete("/column_id/:column_id", async (req, res) => {
  try {
    const tasks = await Task.destroy({
      where: { column_id: req.params.column_id },
    });
    res.json({ message: "Tasks deleted" });
  } catch (error) {
    res.status(500).json({ error: "Tasks not deleted" });
  }
});

// Batch update tasks
router.put("/batch", async (req, res) => {
  const tasks = req.body.tasks;
  try {
    const updatePromises = tasks.map((task) => {
      const updateData = {};
      if (task.column_id) updateData.column_id = task.column_id;
      return Task.update(updateData, { where: { id: task.id } });
    });
    await Promise.all(updatePromises);
    res.json({ message: "Tasks updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error updating tasks" });
  }
});

module.exports = router;
