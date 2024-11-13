const pool = require("../models/db");
const queries = require("../models/queries");

// get all tasks here for testing will most likey be deleted later on
async function getAllTasks(req, res) {
  try {
    const allTasks = await pool.query(queries.getAllTasks);
    res.json(allTasks.rows);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: err.message });
  }
}

// get task based on its id
async function getTask(req, res) {
  try {
    const { id } = req.params;
    const tasks = await pool.query(queries.getTask, [id]);

    if (tasks.rows.length === 0) {
      return res.status(404).json({ error: "No task found" });
    }

    res.json(tasks.rows[0]);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: err.message });
  }
}

// gets all tasks for the associated column
async function getAllTasksForColumn(req, res) {
  try {
    const { column_id } = req.params;
    const tasks = await pool.query(queries.getAllTasksForColumn, [column_id]);

    if (tasks.rows.length === 0) {
      return res.status(404).json({ error: "No tasks found for column" });
    }

    res.json(tasks.rows);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: err.message });
  }
}

// add a task
async function addTask(req, res) {
  try {
    const { column_id, title, description } = req.body;
    const result = await pool.query(queries.addTask, [
      column_id,
      title,
      description,
    ]);

    res.json(result.rows[0]);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: err.message });
  }
}

// delete a task
async function deleteTask(req, res) {
  try {
    const { id } = req.params;
    const deleteTask = await pool.query(queries.deleteTask, [id]);
    res.json(`Task ${id} was deleted`);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: err.message });
  }
}

// delete all tasks for a column_id
async function deleteAllTasksForColumn(req, res) {
  try {
    const { column_id } = req.params;
    const deleteTasks = await pool.query(queries.deleteAllTasksForColumn, [
      column_id,
    ]);
    res.json(`Columns associated with board_id ${board_id} have been deleted`);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: err.message });
  }
}

// update title of a task
async function updateTaskTitle(req, res) {
  try {
    const { id } = req.params;
    const { title } = req.body;
    const result = await pool.query(queries.updateTaskTitle, [title, id]);
    res.json(`Task title for id ${id} has been updated to ${title}`);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: err.message });
  }
}

// update description of a task
async function updateTaskDescription(req, res) {
  try {
    const { id } = req.params;
    const { description } = req.body;
    const result = await pool.query(queries.updateTaskDescription, [
      description,
      id,
    ]);
    res.json(
      `Task description for id ${id} has been updated to ${description}`
    );
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: err.message });
  }
}
module.exports = {
  getTask,
  getAllTasksForColumn,
  getAllTasks,
  addTask,
  deleteTask,
  deleteAllTasksForColumn,
  updateTaskDescription,
  updateTaskTitle,
};
// get all the tasks for a column
