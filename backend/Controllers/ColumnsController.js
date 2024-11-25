const pool = require("../models/db");
const queries = require("../models/queries");

// get all columns from database
async function getAllColumns(req, res) {
  try {
    const allBoards = await pool.query(queries.getAllColumns);
    res.json(allBoards.rows);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: err.message });
  }
}
// get an individual column
async function getColumn(req, res) {
  try {
    const { id } = req.params;
    const column = await pool.query(queries.getColumn, [id]);
    if (column.rows.length === 0) {
      return res.status(404).json({ error: "No column found" });
    }
    res.json(column.rows[0]);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: err.message });
  }
}

// get all columns based on Board ID
async function getAllColumnsForBoard(req, res) {
  try {
    const { board_id } = req.params;
    const columns = await pool.query(queries.getAllColumnsForBoard, [board_id]);
    if (columns.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "No columns found for board" + board_id });
    }

    res.json(columns.rows);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: err.message });
  }
}
// add a column
async function addColumn(req, res) {
  try {
    const { name, board_id } = req.body;
    const result = await pool.query(queries.addColumn, [name, board_id]);

    res.json(result.rows[0]);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: err.message });
  }
}

// delete a column from database
async function deleteColumn(req, res) {
  try {
    const { id } = req.params;
    const deleteColumn = await pool.query(queries.deleteColumn, [id]);
    res.json(`Column ${id} was deleted`);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: err.message });
  }
}
// delete all columns associated with the same board_id
async function deleteAllColumnsForBoard(req, res) {
  try {
    const { board_id } = req.params;
    const deleteColumns = await pool.query(queries.deleteAllColumnsForBoard, [
      board_id,
    ]);
    res.json(`Columns associated with board_id ${board_id} have been deleted`);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: err.message });
  }
}

// update name of column
async function updateColumnName(req, res) {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const result = await pool.query(queries.updateColumnName, [name, id]);
    res.json(`Column name for id ${id} has been updated to ${name}`);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: err.message });
  }
}

module.exports = {
  getAllColumns,
  getColumn,
  getAllColumnsForBoard,
  addColumn,
  deleteColumn,
  deleteAllColumnsForBoard,
  updateColumnName,
};
