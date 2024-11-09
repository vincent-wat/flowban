const pool = require("../models/db");
const queries = require("../models/queries");

// get all board here for testing will most likey be deleted later on
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

module.exports = {
  getTask,
  getAllTasksForColumn,
  getAllTasks,
};
// get all the tasks for a column
