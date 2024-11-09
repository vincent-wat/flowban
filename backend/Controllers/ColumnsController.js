const pool = require("../models/db");
const queries = require("../models/queries");

async function getAllColumns(req, res) {
  try {
    const allBoards = await pool.query(queries.getAllBoards);
    res.json(allBoards.rows);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: err.message });
  }
}

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

module.exports = {
  getAllColumns,
  getColumn,
  getAllColumnsForBoard,
};
