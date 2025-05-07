const { Router } = require("express");
const { Task } = require("../models");

// get all tasks here for testing will most likey be deleted later on
async function getAllTasks(req, res) {
  try {
    const tasks = await Task.findAll();
    res.json(tasks);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
}

// get task based on its id
async function getTask(req, res) {
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
}

// gets all tasks for the associated column
async function getAllTasksForColumn(req, res) {
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
}

// add a task
async function addTask(req, res) {
  try {
    const task = await Task.create({
      title: req.body.title,
      description: req.body.description,
      column_id: req.body.column_id,
      created_at: new Date(),
      updated_at: new Date(),
    });
    res.json(task);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ error: "Task not created" });
  }
}

// delete a task
async function deleteTask(req, res) {
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
    console.error("Error deleting task:", error);
  }
}

// delete all tasks for a column_id
async function deleteAllTasksForColumn(req, res) {
  try {
    const tasks = await Task.destroy({
      where: { column_id: req.params.column_id },
    });
    res.json({ message: "Tasks deleted" });
  } catch (error) {
    res.status(500).json({ error: "Tasks not deleted" });
  }
}

// update title of a task
async function updateTask(req, res) {
  try {
    const task = await Task.findByPk(req.params.id);
    if (task) {
      const updateData = {};
      if (req.body.title) updateData.title = req.body.title;
      if (req.body.description) updateData.description = req.body.description;
      if (req.body.column_id) updateData.column_id = req.body.column_id;
      updateData.updated_at = new Date();

      await task.update(updateData);
      res.json(task);
    } else {
      res.status(404).json({ error: "Task not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Task not updated" });
  }
}

async function updateMultipleTasks(req, res) {
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
}

module.exports = {
  getTask,
  getAllTasksForColumn,
  getAllTasks,
  addTask,
  deleteTask,
  deleteAllTasksForColumn,
  updateTask,
  updateMultipleTasks,
};
// get all the tasks for a column
